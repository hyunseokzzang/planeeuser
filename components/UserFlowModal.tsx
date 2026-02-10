
import React from 'react';

interface UserFlowModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const UserFlowModal: React.FC<UserFlowModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const steps = [
    { title: "1. Entry", desc: "추천 질문 카드 혹은 자유 입력으로 대화 시작" },
    { title: "2. Reasoning", desc: "실시간 데이터 분석 애니메이션으로 '생각 중' 단계 가시화" },
    { title: "3. Response", desc: "Typing 효과와 함께 구조화된 답변 노출" },
    { title: "4. Verification", desc: "출처(Sources) 제공을 통한 정보 신뢰성 확보" },
    { title: "5. Follow-up", desc: "요약 및 추천 질문으로 대화 맥락 확장" }
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-8 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-gray-900 tracking-tighter">User Flow 설계도</h2>
            <p className="text-gray-400 text-sm font-bold mt-1">Plannie AI가 제공하는 신뢰 기반 대화 흐름</p>
          </div>
          <button onClick={onClose} className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="p-8 bg-gray-50/30">
          <div className="space-y-6">
            {steps.map((step, idx) => (
              <div key={idx} className="flex items-start gap-6 relative group">
                {idx < steps.length - 1 && (
                  <div className="absolute left-[20px] top-[40px] w-0.5 h-[calc(100%-20px)] bg-blue-100" />
                )}
                <div className="w-10 h-10 rounded-lg bg-white border border-blue-100 flex items-center justify-center shrink-0 shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-all">
                  <span className="text-sm font-black">{idx + 1}</span>
                </div>
                <div className="pt-1">
                  <h3 className="text-[15px] font-black text-gray-900 mb-1">{step.title}</h3>
                  <p className="text-[13px] text-gray-500 font-medium leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-8 bg-blue-600 text-center">
          <p className="text-white/80 text-xs font-black uppercase tracking-[0.2em] mb-4">Core Value</p>
          <div className="flex justify-center gap-10">
            <div className="text-white">
              <p className="text-lg font-black leading-none">TRUST</p>
              <p className="text-[10px] opacity-60 mt-1 uppercase">근거 기반 답변</p>
            </div>
            <div className="text-white">
              <p className="text-lg font-black leading-none">CLARITY</p>
              <p className="text-[10px] opacity-60 mt-1 uppercase">구조화된 요약</p>
            </div>
            <div className="text-white">
              <p className="text-lg font-black leading-none">SEAMLESS</p>
              <p className="text-[10px] opacity-60 mt-1 uppercase">끊김없는 대화</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserFlowModal;
