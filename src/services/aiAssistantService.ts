import { CivicIssue, IssueCategory, IssueSeverity, SupportedLanguage } from '../types';
import { simulateAIDetection } from '../utils/aiSimulation';

export interface AssistantParsedIssue {
  category: IssueCategory;
  severity: IssueSeverity;
  summary: string;
  assistantResponse: string;
  normalizedDescription: string;
  originalText: string;
  suggestedTitle: string;
}

export interface AssistantMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  parsedIssue?: AssistantParsedIssue;
  actionRequired?: 'capture_photo' | 'select_location' | 'review_report';
}

/**
 * Civic Hero Multilingual Assistant Service
 *
 * Prototype Implementation: Rule-based natural language understanding in Marathi, Hindi, and English.
 * Clean Service Abstraction: Ready for future backend LLM / Gemini API integration.
 */
class CivicHeroAssistantService {
  /**
   * Process user's natural language input (voice transcription or typed text)
   * in Marathi, Hindi, or English.
   */
  public processCivicInput(
    rawText: string,
    preferredLanguage: SupportedLanguage = 'en'
  ): AssistantParsedIssue {
    const text = rawText.trim();
    const detection = simulateAIDetection(text);

    // Formulate localized assistant response
    let assistantResponse = '';
    const lang = preferredLanguage === 'mr' || detection.detectedLanguage === 'mr' ? 'mr' :
                 preferredLanguage === 'hi' || detection.detectedLanguage === 'hi' ? 'hi' : 'en';

    if (lang === 'mr') {
      const categoryNames: Record<IssueCategory, string> = {
        Pothole: 'रस्त्यावरील खड्डा',
        Garbage: 'कचरा व घनकचरा',
        'Water Leak': 'पाणी गळती',
        Streetlight: 'बंद पथदिवा',
        Drain: 'उघडी गटारे / नाला',
        'Road Damage': 'रस्त्याची दुरवस्था',
        Other: 'नागरी समस्या',
      };
      const catLabel = categoryNames[detection.category] || 'नागरी समस्या';
      assistantResponse = `समजले! हा "${catLabel}" शी संबंधित प्रश्न आहे (अंदाजित तीव्रता: ${
        detection.severity === 'Critical' ? 'अतितातडीची' : detection.severity === 'High' ? 'उच्च' : 'मध्यम'
      }). मी तुमच्यासाठी तक्रार तपशील तयार केला आहे. कृपया ठिकाण आणि फोटो निवडून तपासा.`;
    } else if (lang === 'hi') {
      const categoryNames: Record<IssueCategory, string> = {
        Pothole: 'सड़क का गड्ढा',
        Garbage: 'कचरा और गंदगी',
        'Water Leak': 'पानी का रिसाव',
        Streetlight: 'स्ट्रीटलाइट खराब',
        Drain: 'खुला नाला या सीवर',
        'Road Damage': 'सड़क की टूट-फूट',
        Other: 'नागरिक समस्या',
      };
      const catLabel = categoryNames[detection.category] || 'नागरिक समस्या';
      assistantResponse = `समझ गया! यह "${catLabel}" से संबंधित समस्या है (प्राथमिकता: ${
        detection.severity === 'Critical' ? 'अति आवश्यक' : detection.severity === 'High' ? 'उच्च' : 'सामान्य'
      })। मैंने आपके लिए शिकायत का मसौदा तैयार कर दिया है। कृपया स्थान और फोटो चुनकर सबमिट करें।`;
    } else {
      assistantResponse = `Got it! I've recognized this as a "${detection.category}" issue (Severity: ${detection.severity}). I have pre-filled the report details for you. Please attach a photo and confirm the location to submit.`;
    }

    return {
      category: detection.category,
      severity: detection.severity,
      summary: detection.summary,
      assistantResponse,
      normalizedDescription: detection.normalizedDescription || text,
      originalText: text,
      suggestedTitle: detection.suggestedTitle || `${detection.category} Report`,
    };
  }

  /**
   * Explain current complaint status truthfully from the actual CivicIssue record
   * in the citizen's selected language.
   */
  public explainComplaintStatus(
    issue: CivicIssue,
    language: SupportedLanguage = 'en'
  ): string {
    const lang = language === 'mr' ? 'mr' : language === 'hi' ? 'hi' : 'en';
    const workerName = issue.assignedWorkerName || (lang === 'mr' ? 'नियुक्त कर्मचारी' : lang === 'hi' ? 'नियुक्त कर्मचारी' : 'assigned field officer');
    const sla = issue.targetResolutionHours ? `${issue.targetResolutionHours} hours` : '24 hours';

    if (lang === 'mr') {
      switch (issue.status) {
        case 'Submitted':
          return `तुमची तक्रार (#${issue.ticketNumber}) यशस्वीरीत्या नोंदवली गेली आहे. महापालिका नियंत्रण कक्ष (PMC Triage) द्वारे प्राथमिक तपासणी सुरू असून लवकरच संबंधित वॉर्ड विभागाकडे वर्ग केली जाईल.`;
        case 'Acknowledged':
          return `तुमची तक्रार (#${issue.ticketNumber}) PMC प्रशासनाने स्वीकारली आहे. ${
            issue.assignedWorkerName ? `ही तक्रार फील्ड अधिकारी ${issue.assignedWorkerName} यांच्याकडे सोपवण्यात आली आहे.` : 'कार्य पथकाची नियुक्ती केली जात आहे.'
          } अपेक्षित निवारण वेळ: ${sla}.`;
        case 'In Progress':
          return `तुमच्या तक्रारीवर प्रत्यक्ष काम सुरू आहे! फील्ड अधिकारी ${workerName} घटनास्थळी कार्यरत आहेत. काम पूर्ण झाल्यावर खात्रीचा फोटो (After Photo) अपलोड केला जाईल.`;
        case 'Resolved':
          return `ही समस्या यशस्वीरीत्या सोडवण्यात आली आहे! फील्ड अधिकारी ${workerName} यांनी काम पूर्ण करून पुरावा फोटो अपलोड केला आहे. ${
            issue.resolutionRemarks ? `शेरा: "${issue.resolutionRemarks}"` : ''
          }`;
      }
    }

    if (lang === 'hi') {
      switch (issue.status) {
        case 'Submitted':
          return `आपकी शिकायत (#${issue.ticketNumber}) दर्ज कर ली गई है। नगर निगम नियंत्रण कक्ष द्वारा इसका सत्यापन किया जा रहा है और जल्द ही संबंधित विभाग को भेजा जाएगा।`;
        case 'Acknowledged':
          return `आपकी शिकायत (#${issue.ticketNumber}) को PMC प्रशासन ने स्वीकृत कर लिया है। ${
            issue.assignedWorkerName ? `यह कार्य फील्ड अधिकारी ${issue.assignedWorkerName} को सौंपा गया है।` : 'अधिकारी की नियुक्ति प्रक्रिया में है।'
          } लक्षित समय: ${sla}.`;
        case 'In Progress':
          return `आपकी शिकायत पर फील्ड में काम चल रहा है! फील्ड अधिकारी ${workerName} साइट पर मरम्मत कार्य कर रहे हैं।`;
        case 'Resolved':
          return `यह शिकायत सफलतापूर्वक हल हो चुकी है! फील्ड टीम ने समाधान का फोटो अपलोड कर दिया है। ${
            issue.resolutionRemarks ? `टिप्पणी: "${issue.resolutionRemarks}"` : ''
          }`;
      }
    }

    // English
    switch (issue.status) {
      case 'Submitted':
        return `Your complaint (#${issue.ticketNumber}) has been submitted and is in the PMC municipal intake queue for priority triage.`;
      case 'Acknowledged':
        return `Your complaint (#${issue.ticketNumber}) has been acknowledged by PMC administration. ${
          issue.assignedWorkerName ? `Assigned to field officer ${issue.assignedWorkerName}.` : 'A dispatch squad is being assigned.'
        } Target SLA: ${sla}.`;
      case 'In Progress':
        return `Work is currently in progress on site! Field officer ${workerName} is executing repairs. A photographic proof of resolution will be posted upon completion.`;
      case 'Resolved':
        return `This issue has been verified and resolved! Field officer ${workerName} submitted the completion photo proof. ${
          issue.resolutionRemarks ? `Worker notes: "${issue.resolutionRemarks}"` : ''
        }`;
    }
  }
}

export const aiAssistantService = new CivicHeroAssistantService();
