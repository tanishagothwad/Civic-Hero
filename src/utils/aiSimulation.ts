import { IssueCategory, IssueSeverity, CivicIssue } from '../types';

export interface AIDetectionResult {
  category: IssueCategory;
  severity: IssueSeverity;
  confidence: number;
  tags: string[];
  summary: string;
  detectedLanguage?: 'mr' | 'hi' | 'en';
  normalizedDescription?: string;
  suggestedTitle?: string;
}

// Detect language of text
export function detectLanguage(text: string): 'mr' | 'hi' | 'en' {
  // Marathi specific characters/words
  const marathiMarkers = ['आहे', 'नाही', 'झाला', 'झाली', 'पडला', 'रस्त्यावर', 'कचरा', 'खड्डा', 'पाणी', 'गटार', 'दिवे', 'इथे', 'खूप', 'माझ्या', 'परिसरात', 'सोसायटीजवळ'];
  const hasMarathiMarker = marathiMarkers.some((w) => text.includes(w));
  if (hasMarathiMarker) return 'mr';

  // Devanagari script check
  const devanagariRegex = /[\u0900-\u097F]/;
  if (devanagariRegex.test(text)) {
    // If it has Hindi markers
    const hindiMarkers = ['है', 'नहीं', 'गड्ढा', 'कूड़ा', 'सड़क', 'पानी', 'हो', 'रहा', 'रही', 'बहुत', 'इस', 'परेशानी'];
    if (hindiMarkers.some((w) => text.includes(w))) return 'hi';
    return 'mr'; // default devanagari in Pune context to Marathi
  }

  return 'en';
}

export function simulateAIDetection(
  textDescription: string,
  imageHint?: string
): AIDetectionResult {
  const raw = textDescription || '';
  const lang = detectLanguage(raw);
  const combined = (raw + ' ' + (imageHint || '')).toLowerCase();

  // Pothole keywords across EN / MR / HI
  const isPothole =
    combined.includes('pothole') ||
    combined.includes('crater') ||
    combined.includes('tar') ||
    combined.includes('bump') ||
    combined.includes('road hole') ||
    combined.includes('खड्डा') ||
    combined.includes('खड्डे') ||
    combined.includes('गड्ढा') ||
    combined.includes('गड्ढे') ||
    combined.includes('रस्ता उखडला') ||
    combined.includes('डांबर');

  // Garbage keywords across EN / MR / HI
  const isGarbage =
    combined.includes('garbage') ||
    combined.includes('waste') ||
    combined.includes('trash') ||
    combined.includes('smell') ||
    combined.includes('dump') ||
    combined.includes('plastic') ||
    combined.includes('कचरा') ||
    combined.includes('कचऱ्या') ||
    combined.includes('घाण') ||
    combined.includes('दुर्गंधी') ||
    combined.includes('कूड़ा') ||
    combined.includes('गंदगी') ||
    combined.includes('बदबू');

  // Water Leak keywords across EN / MR / HI
  const isWater =
    combined.includes('water') ||
    combined.includes('leak') ||
    combined.includes('pipe') ||
    combined.includes('burst') ||
    combined.includes('flood') ||
    combined.includes('gushing') ||
    combined.includes('पाणी') ||
    combined.includes('पाण्याची गळती') ||
    combined.includes('पाईप') ||
    combined.includes('जलवाहिनी') ||
    combined.includes('पानी') ||
    combined.includes('लीकेज') ||
    combined.includes('रिसाव');

  // Streetlight keywords across EN / MR / HI
  const isStreetlight =
    combined.includes('light') ||
    combined.includes('lamp') ||
    combined.includes('dark') ||
    combined.includes('electric') ||
    combined.includes('pole') ||
    combined.includes('bulb') ||
    combined.includes('पथदिवा') ||
    combined.includes('पथदिवे') ||
    combined.includes('दिवा') ||
    combined.includes('अंधार') ||
    combined.includes('विजेचा') ||
    combined.includes('बत्ती') ||
    combined.includes('अंधेरा') ||
    combined.includes('खंभा');

  // Drain keywords across EN / MR / HI
  const isDrain =
    combined.includes('drain') ||
    combined.includes('sewage') ||
    combined.includes('gutter') ||
    combined.includes('slab') ||
    combined.includes('manhole') ||
    combined.includes('गटर') ||
    combined.includes('गटार') ||
    combined.includes('नाला') ||
    combined.includes('मॅनहोल') ||
    combined.includes('सांडपाणी') ||
    combined.includes('नाली') ||
    combined.includes('सीवर') ||
    combined.includes('ढक्कन');

  // Road Damage keywords across EN / MR / HI
  const isRoadDamage =
    combined.includes('road') ||
    combined.includes('crack') ||
    combined.includes('footpath') ||
    combined.includes('pavement') ||
    combined.includes('bridge') ||
    combined.includes('रस्ता खराब') ||
    combined.includes('पदपथ') ||
    combined.includes('फुटपाथ') ||
    combined.includes('सड़क टूटी') ||
    combined.includes('सड़क खराब');

  // Severity indicators
  const isHighSeverity =
    combined.includes('accident') ||
    combined.includes('deep') ||
    combined.includes('huge') ||
    combined.includes('overflow') ||
    combined.includes('danger') ||
    combined.includes('अपघात') ||
    combined.includes('धोकादायक') ||
    combined.includes('खूप जास्त') ||
    combined.includes('गंभीर') ||
    combined.includes('दुर्घटना') ||
    combined.includes('खतरनाक') ||
    combined.includes('जानलेवा') ||
    combined.includes('बड़ा');

  const isCriticalSeverity =
    combined.includes('emergency') ||
    combined.includes('burst') ||
    combined.includes('collapsed') ||
    combined.includes('hospital') ||
    combined.includes('school') ||
    combined.includes('फुटला') ||
    combined.includes('कोसळला') ||
    combined.includes('तातडीने') ||
    combined.includes('आपातकालीन');

  if (isPothole) {
    const sev: IssueSeverity = isCriticalSeverity ? 'Critical' : isHighSeverity ? 'High' : 'Medium';
    return {
      category: 'Pothole',
      severity: sev,
      confidence: 0.94,
      tags: ['PMC Road Division', 'Asphalt Patching', 'Hazard Identified'],
      summary:
        lang === 'mr'
          ? 'AI ने रस्त्यावरील खड्डा ओळखला असून त्वरित डांबरी पॅचवर्कची शिफारस केली आहे.'
          : lang === 'hi'
          ? 'AI ने सड़क पर गड्ढे की पहचान की है और त्वरित मरम्मत की सिफारिश की है।'
          : 'AI identified severe road surface depression requiring prompt asphalt patching.',
      detectedLanguage: lang,
      normalizedDescription: 'Road pothole causing traffic and two-wheeler hazard. Requires asphalt patching.',
      suggestedTitle:
        lang === 'mr'
          ? 'रस्त्यावरील धोकादायक खड्डा'
          : lang === 'hi'
          ? 'सड़क पर खतरनाक गड्ढा'
          : 'Dangerous Road Pothole',
    };
  }

  if (isGarbage) {
    const sev: IssueSeverity = isHighSeverity ? 'High' : 'Medium';
    return {
      category: 'Garbage',
      severity: sev,
      confidence: 0.96,
      tags: ['Solid Waste Mgmt', 'Sanitation Risk', 'PMC Sanitation'],
      summary:
        lang === 'mr'
          ? 'AI ने घनकचरा साचल्याचे ओळखले असून त्वरित स्वच्छता व औषध फवारणी आवश्यक आहे.'
          : lang === 'hi'
          ? 'AI ने कचरे के ढेर की पहचान की है, स्वच्छता और कीटाणुशोधन आवश्यक है।'
          : 'AI detected solid waste accumulation requiring mechanized clearance & disinfection.',
      detectedLanguage: lang,
      normalizedDescription: 'Uncollected solid waste and garbage accumulating on public street/area. Needs sanitation pickup.',
      suggestedTitle:
        lang === 'mr'
          ? 'परिसरात कचऱ्याचा ढीग'
          : lang === 'hi'
          ? 'इलाके में कचरे का ढेर'
          : 'Public Garbage Pile-Up',
    };
  }

  if (isWater) {
    return {
      category: 'Water Leak',
      severity: 'Critical',
      confidence: 0.98,
      tags: ['PMC Water Supply', 'Pipeline Leakage', 'Water Loss'],
      summary:
        lang === 'mr'
          ? 'AI ने पाण्याची पाईपलाईन फुटल्याचे तातडीचे संकट नोंदवले आहे. पाणी पुरवठा विभागाकडे वर्ग.'
          : lang === 'hi'
          ? 'AI ने पाइपलाइन से पानी के रिसाव को अति-आवश्यक चिन्हित किया है।'
          : 'AI flagged critical pressurized water distribution pipe fracture causing public resource loss.',
      detectedLanguage: lang,
      normalizedDescription: 'Water pipeline leak/rupture causing clean water wastage and street flooding.',
      suggestedTitle:
        lang === 'mr'
          ? 'पिण्याच्या पाण्याची पाईपलाईन गळती'
          : lang === 'hi'
          ? 'पीने के पानी की पाइपलाइन में रिसाव'
          : 'Pressurized Water Pipeline Rupture',
    };
  }

  if (isStreetlight) {
    return {
      category: 'Streetlight',
      severity: isHighSeverity ? 'High' : 'Medium',
      confidence: 0.92,
      tags: ['PMC Electrical Dept', 'Street Illumination', 'Public Safety'],
      summary:
        lang === 'mr'
          ? 'AI ने बंद पथदिवा ओळखला असून रात्रीच्या सुरक्षिततेसाठी दुरुस्ती आवश्यक आहे.'
          : lang === 'hi'
          ? 'AI ने बंद स्ट्रीटलाइट की पहचान की है, अंधेरे से सुरक्षा खतरा है।'
          : 'AI identified luminaire failure or power fault affecting pedestrian safety at night.',
      detectedLanguage: lang,
      normalizedDescription: 'Non-functional streetlight causing night darkness and safety risks.',
      suggestedTitle:
        lang === 'mr'
          ? 'बंद पथदिवा व अंधार'
          : lang === 'hi'
          ? 'बंद स्ट्रीटलाइट और अंधेरा'
          : 'Non-functional Streetlight',
    };
  }

  if (isDrain) {
    return {
      category: 'Drain',
      severity: 'Critical',
      confidence: 0.95,
      tags: ['PMC Drainage Dept', 'Missing Cover / Hazard', 'Fall Risk'],
      summary:
        lang === 'mr'
          ? 'AI ने उघडे गटार किंवा तुटलेले झाकण ओळखले असून तात्काळ बॅरिकेडिंग आवश्यक आहे.'
          : lang === 'hi'
          ? 'AI ने खुला नाला या टूटा ढक्कन चिन्हित किया है, तत्काल बैरिकेडिंग आवश्यक है।'
          : 'AI detected exposed storm conduit or broken concrete slab requiring safety barricades & replacement.',
      detectedLanguage: lang,
      normalizedDescription: 'Broken or missing storm water drain slab/manhole cover creating high fall hazard.',
      suggestedTitle:
        lang === 'mr'
          ? 'उघडे गटार / तुटलेले झाकण'
          : lang === 'hi'
          ? 'खुला नाला / टूटा हुआ ढक्कन'
          : 'Collapsed Drain Slab / Open Manhole',
    };
  }

  if (isRoadDamage) {
    return {
      category: 'Road Damage',
      severity: isHighSeverity ? 'High' : 'Medium',
      confidence: 0.89,
      tags: ['PMC Infrastructure', 'Footpath / Curb Damage', 'Urban Works'],
      summary:
        lang === 'mr'
          ? 'AI ने रस्त्याची अथवा पदपथाची दुरवस्था ओळखली आहे.'
          : lang === 'hi'
          ? 'AI ने सड़क अथवा फुटपाथ की टूट-फूट की पहचान की है।'
          : 'AI detected structural erosion on road edge or pedestrian walkway.',
      detectedLanguage: lang,
      normalizedDescription: 'Damaged road surface or cracked pedestrian footpath requiring civil repair.',
      suggestedTitle:
        lang === 'mr'
          ? 'रस्ता किंवा पदपथाची दुरवस्था'
          : lang === 'hi'
          ? 'टूटी हुई सड़क या फुटपाथ'
          : 'Damaged Road & Footpath Surface',
    };
  }

  // Default fallback
  return {
    category: 'Other',
    severity: 'Medium',
    confidence: 0.82,
    tags: ['Civic Maintenance', 'Auto Classified', 'PMC Urban Triage'],
    summary:
      lang === 'mr'
        ? 'AI ने समस्येचे विश्लेषण केले असून आवश्यक माहिती गोळा केली आहे.'
        : lang === 'hi'
        ? 'AI ने समस्या का विश्लेषण कर प्राथमिक विवरण तैयार किया है।'
        : 'AI analyzed visual & textual features and estimated priority classification.',
    detectedLanguage: lang,
    normalizedDescription: raw || 'Civic infrastructure maintenance issue reported by citizen.',
    suggestedTitle: raw.slice(0, 40) || 'Civic Grievance Report',
  };
}

// Distance calculation between 2 geo-coordinates in meters (Haversine formula)
export function getDistanceInMeters(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3; // Earth radius in metres
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c);
}

// Check for duplicates nearby (within 150m) with same category
export function findNearbyDuplicate(
  category: IssueCategory,
  lat: number,
  lng: number,
  existingIssues: CivicIssue[]
): { duplicate: CivicIssue; distanceMeters: number } | null {
  for (const issue of existingIssues) {
    if (issue.status === 'Resolved') continue;
    if (issue.category === category) {
      const distance = getDistanceInMeters(lat, lng, issue.location.lat, issue.location.lng);
      if (distance <= 250) {
        return { duplicate: issue, distanceMeters: distance };
      }
    }
  }
  return null;
}
