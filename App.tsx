
import React, { useState, useEffect, useRef, useCallback } from 'react';
import ChatMessage from './components/ChatMessage';
import UserFlowModal from './components/UserFlowModal';
import { generateAIResponse } from './services/geminiService';
import { Message, Sender } from './types';

const ReasoningProgress = () => {
  const [currentStep, setCurrentStep] = useState(0);
  
  const steps = [
    { label: "사내 복지 DB 접속", duration: 1800 },
    { label: "2024년도 정책 데이터 파싱", duration: 2200 },
    { label: "사용자별 권한 필터링", duration: 1500 },
    { label: "시각적 그리드 구성", duration: 1200 }
  ];

  useEffect(() => {
    let stepTimer: number;

    const runStep = (index: number) => {
      if (index >= steps.length) return;
      setCurrentStep(index);
      stepTimer = window.setTimeout(() => runStep(index + 1), steps[index].duration);
    };

    runStep(0);

    return () => {
      clearTimeout(stepTimer);
    };
  }, []);

  return (
    <div className="flex flex-col w-full mb-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      {/* AI 프로필 헤더 */}
      <div className="flex items-center gap-2 mb-2 ml-1">
        <div className="w-5 h-5 rounded-md bg-black flex items-center justify-center shadow-md">
          <span className="text-[8px] text-white font-black">PL</span>
        </div>
        <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.15em] animate-pulse">
          Deep Reasoning...
        </span>
      </div>

      {/* 가로형 스텝 바 컨테이너 */}
      <div className="max-w-[90%] md:max-w-[85%] relative bg-white border border-gray-100 shadow-sm rounded-xl p-5 overflow-hidden">
        
        {/* 상단 지식 스캔 라인 */}
        <div className="absolute top-0 left-0 w-full h-[1.5px] bg-gray-50">
          <div className="h-full bg-blue-500 w-1/4 animate-[scan_1.5s_linear_infinite]" />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          {steps.map((step, idx) => {
            const isDone = idx < currentStep;
            const isProcessing = idx === currentStep;
            
            return (
              <React.Fragment key={idx}>
                <div className={`flex items-center gap-2 shrink-0 transition-all duration-300 ${!isDone && !isProcessing ? 'opacity-40' : 'opacity-100'}`}>
                  {/* 상태 아이콘: 완료 시 초록색 체크, 진행/대기 시 회색 체크 */}
                  <div className={`
                    w-4 h-4 rounded-md flex items-center justify-center text-[9px] font-black transition-all duration-500
                    ${isDone 
                      ? 'bg-green-500 text-white shadow-sm scale-110' 
                      : 'bg-gray-100 text-gray-400'}
                    ${isProcessing ? 'ring-2 ring-blue-100 animate-pulse' : ''}
                  `}>
                    ✓
                  </div>
                  
                  {/* 라벨 */}
                  <span className={`text-[11px] font-bold tracking-tight whitespace-nowrap transition-colors duration-300 ${
                    isDone ? 'text-gray-500' : isProcessing ? 'text-blue-600' : 'text-gray-300'
                  }`}>
                    {step.label}
                  </span>
                </div>
                
                {/* 연결 라인 */}
                {idx < steps.length - 1 && (
                  <div className={`w-3 h-px shrink-0 transition-colors duration-500 ${isDone ? 'bg-green-200' : 'bg-gray-100'}`} />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* 하단 상태 요약 */}
        <div className="mt-4 flex items-center justify-between">
           <div className="flex items-center gap-2">
              <div className="w-1 h-1 bg-blue-400 rounded-full animate-ping" />
              <span className="text-[9px] text-gray-300 font-black uppercase tracking-widest">Knowledge verifying...</span>
           </div>
           <span className="text-[10px] text-blue-500 font-black">{Math.min(Math.round((currentStep / steps.length) * 100) + 5, 100)}%</span>
        </div>
      </div>
    </div>
  );
};

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
  }
];

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showDefaultQuestions, setShowDefaultQuestions] = useState(false);
  const [isFlowModalOpen, setIsFlowModalOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  const handleSendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isTyping) return;
    
    if (!isInitialized) setIsInitialized(true);
    
    const userMsg: Message = { id: Date.now().toString(), sender: Sender.USER, content, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setShowDefaultQuestions(false);
    setIsTyping(true);

    try {
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
  }, [isTyping, isInitialized]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(inputValue);
    }
  };

  const handleLibraryQuestionClick = (question: string) => {
    handleSendMessage(question);
    setShowDefaultQuestions(false);
  };

  const resetSession = () => {
    setIsInitialized(false);
    setMessages([]);
    setInputValue('');
    setIsTyping(false);
    setShowDefaultQuestions(false);
  };

  return (
    <div className="flex flex-col h-screen bg-[#FDFDFD] overflow-hidden">
      <header className="h-20 border-b border-gray-100 flex items-center justify-between px-8 bg-white/70 backdrop-blur-xl z-50 sticky top-0">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-black to-gray-800 flex items-center justify-center shadow-xl">
            <span className="text-white font-black text-[14px]">PL</span>
          </div>
          <div>
            <h1 className="text-[16px] font-black text-gray-900 tracking-tight leading-none">Plannie AI Prototype</h1>
            <p className="text-[9px] text-blue-600 font-black tracking-widest mt-1.5 uppercase">Unified Question Guide</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsFlowModalOpen(true)}
            className="px-4 py-2.5 text-[11px] font-black text-gray-500 bg-gray-50 border border-gray-100 rounded-lg hover:bg-gray-100 transition-all active:scale-95 flex items-center gap-2"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 20l-5.447-2.724A2 2 0 013 15.488V5.512a2 2 0 011.553-1.944L9 2l5.447 2.724A2 2 0 0115 6.512v9.976a2 2 0 01-1.553 1.944L9 20z" />
            </svg>
            User Flow
          </button>
          <button 
            onClick={resetSession}
            className="px-5 py-2.5 text-[11px] font-black text-white bg-black rounded-lg hover:bg-gray-800 transition-all shadow-xl active:scale-95"
          >
            대화 초기화
          </button>
        </div>
      </header>

      <main ref={scrollRef} className="flex-1 overflow-y-auto custom-scrollbar bg-gray-50/20">
        <div className="max-w-4xl mx-auto w-full px-6 py-10 min-h-full flex flex-col relative">
          {!isInitialized ? (
            <div className="flex-1 flex flex-col items-center justify-center py-10">
              <div className="text-center mb-12">
                <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mb-6 shadow-xl shadow-blue-200 mx-auto">
                  <span className="text-white text-2xl font-black">P</span>
                </div>
                <h2 className="text-3xl font-black text-gray-900 mb-2 tracking-tighter">안녕하세요! 무엇을 도와드릴까요?</h2>
                <p className="text-gray-400 text-[14px] font-bold">궁금한 내용을 입력하거나 아래 추천 질문을 선택해 보세요.</p>
              </div>
              
              <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
                 {INITIAL_RECOMMENDATIONS.map((item, idx) => (
                   <button 
                    key={idx}
                    onClick={() => handleSendMessage(item.question)}
                    className="p-6 bg-white border border-gray-100 rounded-xl hover:shadow-2xl hover:border-blue-500 transition-all text-left flex items-start gap-5 group shadow-sm"
                   >
                     <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all shrink-0">
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
                  className="md:col-span-2 p-4 bg-gray-50/50 border border-dashed border-gray-200 rounded-lg text-[11px] font-bold text-gray-400 hover:bg-white hover:border-red-200 hover:text-red-400 transition-all text-center"
                 >
                   시스템: 정보 부재 시나리오(Edge Case) 테스트 실행하기
                 </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6 pb-12">
              {messages.map((msg) => (
                <ChatMessage key={msg.id} message={msg} onRecommendedClick={handleSendMessage} onReset={resetSession} />
              ))}
              {isTyping && <ReasoningProgress />}
            </div>
          )}
        </div>
      </main>

      <footer className="px-6 py-8 bg-white border-t border-gray-50 z-50">
        <div className="max-w-4xl mx-auto relative">
          {showDefaultQuestions && (
            <div className="absolute bottom-full mb-4 left-0 w-full max-w-md bg-white rounded-xl border border-gray-100 shadow-2xl p-4 z-[60]">
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
                    className="w-full text-left px-4 py-3 hover:bg-blue-50 rounded-lg text-[13px] font-bold text-gray-700 transition-all flex items-center gap-3 border border-transparent hover:border-blue-100 group"
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

          <div className="relative flex items-center gap-3 bg-gray-50/50 border border-gray-200 rounded-xl p-2.5 focus-within:border-blue-400 focus-within:bg-white transition-all shadow-lg shadow-gray-100/30">
            <button 
              onClick={() => setShowDefaultQuestions(!showDefaultQuestions)}
              title="추천 질문 라이브러리"
              className={`p-3 rounded-lg transition-all ${
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
              className={`w-12 h-12 rounded-lg flex items-center justify-center transition-all ${
                inputValue.trim() && !isTyping ? 'bg-blue-600 text-white shadow-blue-200 shadow-xl' : 'bg-gray-100 text-gray-300'
              }`}
            >
              {isTyping ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </footer>

      <UserFlowModal isOpen={isFlowModalOpen} onClose={() => setIsFlowModalOpen(false)} />
    </div>
  );
};

export default App;
