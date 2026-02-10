
import React, { useState, useEffect, useRef, useCallback } from 'react';
import ChatMessage from './components/ChatMessage';
import { generateAIResponse } from './services/geminiService';
import { Message, Sender } from './types';

const ThinkingLoader = () => {
  const [dots, setDots] = useState('');
  const [phase, setPhase] = useState(0);
  const phases = ["데이터 분석 중", "맥락 파악 중", "최적의 답변 생성 중", "보안 정책 검토 중"];

  useEffect(() => {
    const dotInterval = setInterval(() => {
      setDots(prev => (prev.length < 3 ? prev + '.' : ''));
    }, 400);
    
    const phaseInterval = setInterval(() => {
      setPhase(prev => (prev + 1) % phases.length);
    }, 2000);

    return () => {
      clearInterval(dotInterval);
      clearInterval(phaseInterval);
    };
  }, []);

  return (
    <div className="flex items-center gap-3 mb-20 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="w-10 h-10 rounded-2xl bg-black flex items-center justify-center shadow-lg relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 to-transparent animate-pulse" />
        <div className="flex gap-1 z-10">
          <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce [animation-delay:-0.3s]" />
          <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce [animation-delay:-0.15s]" />
          <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" />
        </div>
      </div>
      <div className="px-5 py-3 bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col">
        <span className="text-[10px] font-black text-blue-600 tracking-[0.2em] uppercase mb-0.5">Deep Reasoning</span>
        <span className="text-[12px] font-bold text-gray-500 transition-all duration-500">
          {phases[phase]}{dots}
        </span>
      </div>
    </div>
  );
};

// 통합된 추천 질문 데이터
const INITIAL_RECOMMENDATIONS = [
  {
    title: "복지 포인트 사용 기한",
    desc: "2024년 포인트 소멸 시점 및 연장 가능 여부",
    question: "올해 사내 복지 포인트 사용 기한은 언제까지인가요?",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    type: "IMAGES_TEST"
  },
  {
    title: "신규 프로젝트 기안",
    desc: "ERP 시스템 프로젝트 등록 및 필수 항목 가이드",
    question: "신규 프로젝트 기안 작성 시 필수 항목을 알려주세요.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    type: "TEXT_ONLY_TEST"
  },
  {
    title: "사내 시설 예약 방법",
    desc: "필라테스 및 사내 카페테리아 이용 안내",
    question: "사내 필라테스 센터 예약 방법이 궁금합니다.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    type: "TEXT_ONLY_TEST"
  },
  {
    title: "소프트웨어 신청",
    desc: "업무용 툴 라이선스 구매 및 설치 프로세스",
    question: "업무용 소프트웨어 구매 신청 프로세스를 알려주세요.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
    type: "TEXT_ONLY_TEST"
  }
];

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showDefaultQuestions, setShowDefaultQuestions] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  const handleSendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isTyping) return;
    
    const userMsg: Message = { id: Date.now().toString(), sender: Sender.USER, content, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setShowDefaultQuestions(false);
    setIsTyping(true);

    try {
      // 젬마 서비스로 전달 시 키워드 매칭을 통해 IMAGES_TEST 등이 나오도록 유도
      const aiResult = await generateAIResponse(content, []);
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: Sender.AI,
        content: aiResult.answer,
        aiData: aiResult,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error: any) {
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: Sender.AI,
        content: `데이터 로드 실패: ${error.message}`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  }, [isTyping]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(inputValue);
    }
  };

  const handleLibraryQuestionClick = (question: string) => {
    setInputValue(question);
    setShowDefaultQuestions(false);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const resetSession = () => {
    setMessages([]);
    setInputValue('');
    setIsTyping(false);
    setShowDefaultQuestions(false);
  };

  return (
    <div className="flex flex-col h-screen bg-[#FDFDFD] overflow-hidden">
      <header className="h-20 border-b border-gray-100 flex items-center justify-between px-8 bg-white/70 backdrop-blur-xl z-50 sticky top-0">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-black to-gray-800 flex items-center justify-center shadow-xl">
            <span className="text-white font-black text-[14px]">PL</span>
          </div>
          <div>
            <h1 className="text-[16px] font-black text-gray-900 tracking-tight leading-none">Plannie AI Prototype</h1>
            <p className="text-[9px] text-blue-600 font-black tracking-widest mt-1.5 uppercase">Unified Question Guide</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={resetSession}
            className="px-5 py-2.5 text-[11px] font-black text-white bg-black rounded-xl hover:bg-gray-800 transition-all shadow-xl active:scale-95"
          >
            대화 초기화
          </button>
        </div>
      </header>

      <main ref={scrollRef} className="flex-1 overflow-y-auto custom-scrollbar bg-gray-50/20">
        <div className="max-w-4xl mx-auto w-full px-6 py-10 min-h-full flex flex-col">
          {messages.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center py-10">
              <div className="text-center mb-12 animate-in fade-in slide-in-from-top-4 duration-1000">
                <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-blue-200 mx-auto">
                  <span className="text-white text-2xl font-black">P</span>
                </div>
                <h2 className="text-3xl font-black text-gray-900 mb-2 tracking-tighter">안녕하세요! 무엇을 도와드릴까요?</h2>
                <p className="text-gray-400 text-[14px] font-bold">궁금한 내용을 입력하거나 아래 추천 질문을 선택해 보세요.</p>
              </div>
              
              <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
                 {INITIAL_RECOMMENDATIONS.map((item, idx) => (
                   <button 
                    key={idx}
                    onClick={() => handleSendMessage(item.question)}
                    className="p-6 bg-white border border-gray-100 rounded-3xl hover:shadow-2xl hover:border-blue-500 hover:-translate-y-1 transition-all text-left flex items-start gap-5 group shadow-sm"
                   >
                     <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all shrink-0">
                        {item.icon}
                     </div>
                     <div className="flex-1">
                        <h3 className="text-[15px] font-black text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">{item.title}</h3>
                        <p className="text-[12px] text-gray-400 font-bold leading-relaxed">{item.desc}</p>
                     </div>
                   </button>
                 ))}
                 
                 <button 
                  onClick={() => handleSendMessage("비공개 대외비 프로젝트 정보")}
                  className="md:col-span-2 p-4 bg-gray-50/50 border border-dashed border-gray-200 rounded-2xl text-[11px] font-bold text-gray-400 hover:bg-white hover:border-red-200 hover:text-red-400 transition-all text-center"
                 >
                   시스템: 정보 부재 시나리오(Edge Case) 테스트 실행하기
                 </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6 pb-20">
              {messages.map((msg) => (
                <ChatMessage key={msg.id} message={msg} onRecommendedClick={handleSendMessage} onReset={resetSession} />
              ))}
              {isTyping && <ThinkingLoader />}
            </div>
          )}
        </div>
      </main>

      <footer className="px-6 py-8 bg-white border-t border-gray-50 z-50">
        <div className="max-w-4xl mx-auto relative">
          {showDefaultQuestions && (
            <div className="absolute bottom-full mb-4 left-0 w-full max-w-md bg-white rounded-3xl border border-gray-100 shadow-2xl p-4 animate-in fade-in slide-in-from-bottom-4 duration-300 z-[60]">
              <div className="flex items-center gap-2 mb-3 px-2">
                <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                </svg>
                <span className="text-[11px] font-black text-gray-500 uppercase tracking-widest">Question Library</span>
              </div>
              <div className="flex flex-col gap-1">
                {INITIAL_RECOMMENDATIONS.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleLibraryQuestionClick(item.question)}
                    className="w-full text-left px-4 py-3 hover:bg-blue-50 rounded-2xl text-[13px] font-bold text-gray-700 transition-all flex items-center gap-3 border border-transparent hover:border-blue-100 group"
                  >
                    <div className="text-gray-300 group-hover:text-blue-500 scale-75 origin-left transition-transform">
                      {item.icon}
                    </div>
                    {item.title}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="relative flex items-center gap-3 bg-gray-50/50 border border-gray-200 rounded-2xl p-2.5 focus-within:border-blue-400 focus-within:bg-white transition-all shadow-lg shadow-gray-100/30">
            <button 
              onClick={() => setShowDefaultQuestions(!showDefaultQuestions)}
              title="추천 질문 라이브러리"
              className={`p-3 rounded-xl transition-all ${
                showDefaultQuestions ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a2 2 0 00-1.96 1.414l-.503 1.508a2 2 0 01-1.185 1.185l-1.508.503a2 2 0 00-1.414 1.96l.477 2.387a2 2 0 00.547 1.022l1.502 1.502a2 2 0 002.828 0l1.502-1.502a2 2 0 00.547-1.022l.477-2.387a2 2 0 00-1.414-1.96l-1.508-.503a2 2 0 01-1.185-1.185l-.503-1.508a2 2 0 00-1.96-1.414l-2.387.477a2 2 0 00-1.022.547l-1.502 1.502a2 2 0 000 2.828l1.502 1.502zM12 2l1.91 5.86h6.15l-4.97 3.61 1.9 5.85L12 13.71l-4.99 3.61 1.9-5.85-4.97-3.61h6.15L12 2z" />
               </svg>
            </button>
            <textarea
              ref={textareaRef}
              rows={1}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="무엇이든 물어보세요..."
              className="flex-1 max-h-[120px] min-h-[44px] resize-none outline-none text-[15px] py-3 bg-transparent text-gray-800 leading-6 font-bold placeholder:text-gray-300"
            />
            <button
              onClick={() => handleSendMessage(inputValue)}
              disabled={!inputValue.trim() || isTyping}
              className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                inputValue.trim() && !isTyping ? 'bg-blue-600 text-white shadow-blue-200 shadow-xl' : 'bg-gray-100 text-gray-300'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
