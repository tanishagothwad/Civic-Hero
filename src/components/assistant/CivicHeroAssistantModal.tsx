import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { aiAssistantService, AssistantParsedIssue } from '../../services/aiAssistantService';
import { VoiceInputButton } from '../common/VoiceInputButton';
import { createRipple } from '../common/MaterialRipple';
import {
  Sparkles,
  X,
  Send,
  ArrowRight,
  AlertCircle,
  FileText
} from 'lucide-react';

interface CivicHeroAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPopulateReport: (data: {
    category: AssistantParsedIssue['category'];
    severity: AssistantParsedIssue['severity'];
    description: string;
    title: string;
    originalLanguage: string;
    originalText: string;
    normalizedDescription: string;
  }) => void;
}

export const CivicHeroAssistantModal: React.FC<CivicHeroAssistantModalProps> = ({
  isOpen,
  onClose,
  onPopulateReport,
}) => {
  const { language, issues } = useApp();
  const [inputText, setInputText] = useState<string>('');
  const [messages, setMessages] = useState<Array<{
    id: string;
    sender: 'user' | 'assistant';
    text: string;
    parsedIssue?: AssistantParsedIssue;
  }>>([
    {
      id: 'welcome',
      sender: 'assistant',
      text:
        language === 'mr'
          ? 'नमस्कार! मी नागरीक हिरो सहाय्यक (Civic Hero Assistant). तुम्ही मराठी, हिंदी किंवा इंग्रजीत तुमची नागरी समस्या बोलून अथवा लिहून सांगू शकता.'
          : language === 'hi'
          ? 'नमस्ते! मैं सिविक हीरो सहायक (Civic Hero Assistant) हूँ। आप मराठी, हिन्दी या अंग्रेजी में बोलकर अथवा लिखकर अपनी समस्या बता सकते हैं।'
          : 'Hello! I am your Civic Hero Assistant. You can speak or type your civic issue in Marathi, Hindi, or English, and I will help you file a structured report.',
    },
  ]);

  if (!isOpen) return null;

  const samplePrompts = [
    {
      lang: 'mr',
      label: '🇮🇳 मराठी: कचरा तक्रार',
      text: 'इथे दोन दिवसांपासून कचरा उचललेला नाही.',
    },
    {
      lang: 'hi',
      label: '🇮🇳 हिन्दी: गड्ढे की समस्या',
      text: 'इस सड़क पर बहुत बड़ा गड्ढा है और लोगों को परेशानी हो रही है।',
    },
    {
      lang: 'en',
      label: '🇬🇧 English: Water Leak',
      text: 'There is a major water pipeline leak flooding the road near the junction.',
    },
    {
      lang: 'mr',
      label: '🇮🇳 तक्रारीची स्थिती',
      text: 'माझ्या तक्रारीचे काय झाले?',
    },
  ];

  const handleSend = (textToSend?: string) => {
    const query = (textToSend || inputText).trim();
    if (!query) return;

    const userMsgId = 'msg-' + Date.now();
    const newMessages = [
      ...messages,
      { id: userMsgId, sender: 'user' as const, text: query },
    ];
    setMessages(newMessages);
    setInputText('');

    // Check if user is asking for complaint status
    const isStatusQuery =
      query.includes('स्थिती') ||
      query.includes('काय झाले') ||
      query.includes('शिकायत') ||
      query.includes('status') ||
      query.includes('track');

    if (isStatusQuery && issues.length > 0) {
      // Pick user's latest complaint or first active complaint
      const targetIssue = issues[0];
      const explanation = aiAssistantService.explainComplaintStatus(targetIssue, language);
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: 'resp-' + Date.now(),
            sender: 'assistant',
            text: explanation,
          },
        ]);
      }, 350);
      return;
    }

    // Process civic issue description
    const parsed = aiAssistantService.processCivicInput(query, language);
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: 'resp-' + Date.now(),
          sender: 'assistant',
          text: parsed.assistantResponse,
          parsedIssue: parsed,
        },
      ]);
    }, 400);
  };

  const handleApplyToReport = (parsed: AssistantParsedIssue) => {
    onPopulateReport({
      category: parsed.category,
      severity: parsed.severity,
      description: `${parsed.originalText}\n\n[AI Normalized for PMC]: ${parsed.normalizedDescription}`,
      title: parsed.suggestedTitle,
      originalLanguage: language,
      originalText: parsed.originalText,
      normalizedDescription: parsed.normalizedDescription,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-elevation-8 w-full max-w-xl flex flex-col h-[600px] max-h-[90vh] overflow-hidden border border-[#DADCE0]">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#4285F4] to-[#1A73E8] text-white px-5 py-4 flex items-center justify-between shrink-0 shadow-xs">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center border border-white/30 text-white shadow-xs">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-sm sm:text-base font-bold text-white tracking-wide">
                  {language === 'mr' ? 'नागरीक हिरो सहाय्यक' : language === 'hi' ? 'सिविक हीरो सहायक' : 'Civic Hero Assistant'}
                </h3>
                <span className="bg-white/20 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-white/30 text-white">
                  AI Demo
                </span>
              </div>
              <p className="text-[11px] text-white/90">
                {language === 'mr' ? 'मराठी / हिन्दी / English बहुभाषिक सहाय्यक' : language === 'hi' ? 'मराठी / हिन्दी / English बहुभाषी सहायक' : 'Multilingual Civic Reporting Assistant'}
              </p>
            </div>
          </div>
          <button
            onClick={(e) => {
              createRipple(e);
              onClose();
            }}
            className="text-white/80 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors ripple-surface"
            aria-label="Close Assistant"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Prototype Honest Indicator */}
        <div className="bg-[#FEF7E0] border-b border-[#FEEFC3] px-4 py-2 flex items-center justify-between text-[11px] text-[#78350F] shrink-0">
          <div className="flex items-center space-x-1.5">
            <AlertCircle className="w-3.5 h-3.5 text-[#B06000] shrink-0" />
            <span>Prototype: Uses rule-based multilingual parsing for PMC demonstration.</span>
          </div>
          <span className="font-semibold text-[10px] uppercase tracking-wider text-[#B06000]">PMC Beta</span>
        </div>

        {/* Message Stream */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-[#F8F9FA]">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed shadow-xs ${
                  m.sender === 'user'
                    ? 'bg-[#4285F4] text-white rounded-br-xs'
                    : 'bg-white text-[#202124] border border-[#DADCE0] rounded-bl-xs'
                }`}
              >
                <p className="whitespace-pre-line">{m.text}</p>

                {/* Structured Issue Card if Assistant parsed a report */}
                {m.parsedIssue && (
                  <div className="mt-3 p-3 bg-[#F1F3F4] rounded-xl border border-[#DADCE0] text-left text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#202124] flex items-center gap-1">
                        <FileText className="w-3.5 h-3.5 text-[#1A73E8]" />
                        {m.parsedIssue.suggestedTitle}
                      </span>
                      <span className="bg-[#E8F0FE] text-[#1A73E8] px-2 py-0.5 rounded text-[10px] font-bold">
                        {m.parsedIssue.category}
                      </span>
                    </div>

                    <p className="text-[11px] text-[#5F6368]">
                      <strong className="text-[#202124]">Normalized:</strong> {m.parsedIssue.normalizedDescription}
                    </p>

                    <div className="pt-2 border-t border-[#DADCE0] flex items-center justify-between">
                      <span className="text-[10px] font-medium text-[#78350F] bg-[#FEF7E0] px-2 py-0.5 rounded">
                        Priority: {m.parsedIssue.severity}
                      </span>
                      <button
                        onClick={() => handleApplyToReport(m.parsedIssue!)}
                        className="bg-[#34A853] hover:bg-[#2D9247] text-white px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1 shadow-xs transition-colors"
                      >
                        <span>{language === 'mr' ? 'तक्रार तयार करा' : language === 'hi' ? 'रिपोर्ट तैयार करें' : 'Create Report'}</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Quick Sample Prompts Carousel */}
        <div className="p-2.5 bg-white border-t border-[#DADCE0] shrink-0">
          <div className="text-[10px] font-bold text-[#5F6368] uppercase tracking-wider mb-1.5 px-1 flex items-center justify-between">
            <span>Try sample inputs / नमुने वापरून पहा:</span>
            <span className="text-[#1A73E8]">1-Tap Demo</span>
          </div>
          <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
            {samplePrompts.map((s, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(s.text)}
                className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-[#F1F3F4] hover:bg-[#E8F0FE] text-[#202124] hover:text-[#1A73E8] border border-[#DADCE0] hover:border-[#4285F4] whitespace-nowrap transition-colors shrink-0"
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-white border-t border-[#DADCE0] shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center space-x-2"
          >
            {/* Voice Input Button */}
            <div className="shrink-0">
              <VoiceInputButton
                onTranscript={(spoken) => {
                  setInputText(spoken);
                  handleSend(spoken);
                }}
              />
            </div>

            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={
                language === 'mr'
                  ? 'मराठीत समस्या सांगा (उदा. रस्त्यावर कचरा पडला आहे...)'
                  : language === 'hi'
                  ? 'समस्या बताएं (उदा. सड़क पर गड्ढा है...)'
                  : 'Speak or type civic issue in Marathi, Hindi, or English...'
              }
              className="flex-1 bg-[#F1F3F4] border border-[#DADCE0] focus:border-[#4285F4] focus:bg-white rounded-full px-4 py-2.5 text-xs sm:text-sm text-[#202124] placeholder-slate-400 focus:outline-none transition-all"
            />

            <button
              type="submit"
              disabled={!inputText.trim()}
              className="w-9 h-9 rounded-full bg-[#4285F4] hover:bg-[#1A73E8] disabled:opacity-40 disabled:hover:bg-[#4285F4] text-white flex items-center justify-center shrink-0 shadow-xs transition-colors"
              aria-label="Send Message"
            >
              <Send className="w-4 h-4 ml-0.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
