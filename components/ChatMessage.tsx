
import React, { useState, useEffect, useRef } from 'react';
import { Message, Sender, AnalysisStep } from '../types';
import SourceCard from './SourceCard';

interface ChatMessageProps {
  message: Message;
  onRecommendedClick: (question: string) => void;
  onReset: () => void;
}

const COLLAPSED_HEIGHT = "180px";

const ImageWithSkeleton: React.FC<{ src: string; alt: string; className?: string }> = ({ src, alt, className = "" }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className={`relative rounded-xl overflow-hidden border border-gray-100 bg-gray-50 ${className}`}>
      {!isLoaded && (
        <div className="absolute inset-0 bg-gray-100 animate-pulse flex items-center justify-center">
          <svg className="w-6 h-6 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      )}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={() => setIsLoaded(true)}
        className={`w-full h-full object-cover transition-all duration-700 hover:scale-105 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
      />
    </div>
  );
};

const AnalysisStepper: React.FC<{ steps: AnalysisStep[] }> = ({ steps }) => (
  <div className="flex items-center gap-2 mb-3 overflow-x-auto pb-1 no-scrollbar animate-in fade-in slide-in-from-top-1 duration-300">
    {steps.map((step, idx) => (
      <React.Fragment key={idx}>
        <div className="flex items-center gap-1.5 shrink-0">
          <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[7px] font-bold ${
            step.status === 'complete' ? 'bg-green-500 text-white' : 'bg-blue-100 text-blue-600 animate-pulse'
          }`}>
            {step.status === 'complete' ? '✓' : idx + 1}
          </div>
          <span className={`text-[9px] font-bold tracking-tight whitespace-nowrap ${
            step.status === 'complete' ? 'text-gray-400' : 'text-blue-600'
          }`}>
            {step.label}
          </span>
        </div>
        {idx < steps.length - 1 && <div className="w-3 h-px bg-gray-100 shrink-0" />}
      </React.Fragment>
    ))}
  </div>
);

const ImageGrid: React.FC<{ images: string[] }> = ({ images }) => {
  if (!images || images.length === 0) return null;
  
  if (images.length >= 3) {
    return (
      <div className="grid grid-cols-3 grid-rows-2 gap-2 mt-3 aspect-[16/10] w-full">
        <ImageWithSkeleton src={images[0]} alt="Ref 1" className="col-span-2 row-span-2 h-full" />
        <ImageWithSkeleton src={images[1]} alt="Ref 2" className="col-span-1 row-span-1 h-full" />
        <ImageWithSkeleton src={images[2]} alt="Ref 3" className="col-span-1 row-span-1 h-full" />
      </div>
    );
  }

  return (
    <div className={`grid gap-2 mt-3 ${images.length > 1 ? 'grid-cols-2' : 'grid-cols-1'} w-full`}>
      {images.map((img, idx) => (
        <ImageWithSkeleton key={idx} src={img} alt={`Ref ${idx}`} className="aspect-video" />
      ))}
    </div>
  );
};

const renderFormattedText = (text: string) => {
  return text.split('\n').map((line, i) => {
    if (line.startsWith('### ')) {
      return <h3 key={i} className="text-[14px] font-bold text-gray-900 mt-2 mb-1 first:mt-0">{line.replace('### ', '')}</h3>;
    }
    const parts = line.split(/(\*\*.*?\*\*)/g);
    const content = parts.map((part, j) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={j} className="font-bold text-blue-700 bg-blue-50/50 px-0.5 rounded">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
    return <p key={i} className={`${line.trim() === '' ? 'h-1' : 'mb-0.5'}`}>{content}</p>;
  });
};

const ChatMessage: React.FC<ChatMessageProps> = ({ message, onRecommendedClick, onReset }) => {
  const isAI = message.sender === Sender.AI;
  const aiData = message.aiData;
  const [visibleCharsCount, setVisibleCharsCount] = useState(isAI ? 0 : message.content.length);
  const [isTypingFinished, setIsTypingFinished] = useState(!isAI);
  const [isExpanded, setIsExpanded] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (isAI && !isTypingFinished) {
      const typeNextChar = () => {
        setVisibleCharsCount(prev => {
          if (prev < message.content.length) {
            timerRef.current = window.setTimeout(typeNextChar, 2);
            return prev + 1;
          } else {
            setIsTypingFinished(true);
            return prev;
          }
        });
      };
      typeNextChar();
    }
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [isAI, isTypingFinished, message.content]);

  const isLongText = message.content.length > 400;
  const shouldShowStepper = isAI && !!aiData?.analysisSteps && !isTypingFinished && !aiData?.noInformation;

  return (
    <div className={`flex w-full mb-3 ${isAI ? 'justify-start' : 'justify-end'}`}>
      <div className={`max-w-[90%] md:max-w-[85%] ${isAI ? 'w-full' : 'w-fit'}`}>
        
        {isAI && (
          <div className="flex items-center gap-2 mb-1.5 ml-1">
            <div className="w-4 h-4 rounded bg-black flex items-center justify-center shadow-sm">
              <span className="text-[7px] text-white font-black">PL</span>
            </div>
            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
              {aiData?.noInformation ? 'System Alert' : 'Analysis Result'}
            </span>
          </div>
        )}

        <div className={`
          relative rounded-3xl text-[13px] leading-relaxed transition-all duration-300 overflow-hidden
          ${isAI 
            ? aiData?.noInformation 
              ? 'bg-gray-50 border-dashed border-2 border-gray-200 text-gray-500 shadow-none p-5' 
              : 'bg-white border border-gray-100 shadow-sm text-gray-800' 
            : 'bg-blue-600 text-white rounded-tr-none shadow-md px-4 py-3'
          }
        `}>
          <div className={`${isAI && !aiData?.noInformation ? 'p-5 pb-5' : ''}`}>
            {shouldShowStepper && aiData?.analysisSteps && <AnalysisStepper steps={aiData.analysisSteps} />}

            <div 
              className="relative overflow-hidden" 
              style={{ height: (isAI && isLongText && !isExpanded && isTypingFinished) ? COLLAPSED_HEIGHT : 'auto' }}
            >
              <div className="whitespace-pre-wrap break-words">
                {isAI 
                  ? (isTypingFinished 
                      ? renderFormattedText(message.content) 
                      : message.content.slice(0, visibleCharsCount))
                  : message.content
                }
              </div>

              {isAI && isLongText && !isExpanded && isTypingFinished && (
                <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent pointer-events-none" />
              )}
            </div>

            {isAI && isTypingFinished && isLongText && (
              <button 
                onClick={() => setIsExpanded(!isExpanded)}
                className="mt-4 flex items-center gap-1.5 text-[10px] font-black text-blue-600 hover:text-blue-800 transition-colors uppercase tracking-tight w-fit px-3 py-1.5 bg-blue-50 rounded-xl relative z-10 hover:bg-blue-100 active:scale-95"
              >
                {isExpanded ? (
                  <><span>간략히 보기</span><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 15l7-7 7 7" /></svg></>
                ) : (
                  <><span>자세히 보기</span><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" /></svg></>
                )}
              </button>
            )}

            {isAI && isTypingFinished && aiData?.noInformation && (
              <div className="mt-4 flex flex-col gap-2">
                <button className="w-full py-3 bg-blue-600 text-white font-black rounded-xl text-[12px] shadow-lg shadow-blue-100 active:scale-95 transition-all flex items-center justify-center gap-2">
                  인재개발팀 1:1 문의 채널 연결
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                </button>
                <button onClick={onReset} className="w-full py-3 bg-white border border-gray-200 text-gray-600 font-black rounded-xl text-[12px] active:scale-95 transition-all hover:bg-gray-50">
                  검색어 초기화 및 다시 입력
                </button>
              </div>
            )}

            {isAI && isTypingFinished && aiData?.summary && !aiData.noInformation && (
              <div className="mt-5 p-4 bg-blue-50/40 rounded-2xl border border-blue-100/30">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-1 h-3 bg-blue-400 rounded-full" />
                  <span className="text-[8px] font-black text-blue-600 uppercase tracking-tighter">Summary</span>
                </div>
                <p className="text-[11px] text-blue-900 font-bold leading-relaxed">{aiData.summary}</p>
              </div>
            )}

            {isAI && isTypingFinished && aiData?.images && <ImageGrid images={aiData.images} />}
          </div>

          {isAI && isTypingFinished && !aiData?.noInformation && aiData?.sources && aiData.sources.length > 0 && (
            <div className="bg-[#F8FAFC] border-t border-gray-100 px-5 py-5 shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)] animate-in fade-in slide-in-from-bottom-1 duration-500 delay-300">
              <div className="flex items-center gap-2 mb-3">
                <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414A1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.15em]">Verification Sources</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {aiData.sources.map((s) => <SourceCard key={s.id} source={s} />)}
              </div>
            </div>
          )}
        </div>

        {isAI && isTypingFinished && aiData?.recommendedQuestions && aiData.recommendedQuestions.length > 0 && (
          <div className="mt-4 ml-1 animate-in fade-in slide-in-from-top-1 duration-500 delay-500">
            <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Follow-ups</p>
            <div className="flex flex-wrap gap-1.5">
              {aiData.recommendedQuestions.map((q, i) => (
                <button
                  key={i}
                  onClick={() => onRecommendedClick(q)}
                  className="px-4 py-2 bg-white border border-gray-100 rounded-full text-[10px] text-gray-600 font-bold hover:border-blue-500 hover:text-blue-600 transition-all shadow-sm active:scale-95 hover:shadow-md"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
