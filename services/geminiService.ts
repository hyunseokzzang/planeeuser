
import { AIResponse } from "../types";

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const MOCK_RESPONSES: Record<string, AIResponse> = {
  "IMAGES_TEST": {
    answer: "### 2024년 사내 복지 포인트 상세 운영 및 사용 가이드\n\n올해 복지 포인트는 임직원 여러분의 피드백을 반영하여 작년 대비 **15% 인상된 총 200만 포인트**가 전원 지급되었습니다. 이번 포인트는 단순 소비를 넘어 임직원의 삶의 질 향상을 목적으로 설계되었습니다. 상세 카테고리와 사용 가이드는 다음과 같습니다.\n\n**1. 자기계발 및 직무 역량 강화 (Self-Development)**\n업무와 관련된 온/오프라인 학원 수강료, 전문 도서 구매, 공인 자격증 응시료를 전액 지원합니다. 특히 올해부터는 해외 온라인 강의 플랫폼(Coursera, Udemy 등) 결제 내역도 증빙 시 포인트 차감이 가능하도록 확대되었습니다.\n\n**2. 건강관리 및 의료 지원 (Health Care)**\n지정 헬스장 및 필라테스 센터 등록뿐만 아니라, 사내 부속 의원 외 외부 병원에서의 정밀 검진 추가 항목 결제 시에도 사용 가능합니다. 웨어러블 기기(스마트워치 등) 구매는 '건강 증진' 카테고리로 분류되어 연 1회에 한해 최대 50만 포인트까지 차감 지원됩니다.\n\n**3. 여가 및 가족 친화 활동 (Life & Leisure)**\n국내외 숙박 시설(호텔, 리조트) 예약 및 항공권 결제가 가능하며, 문화 공연 및 전시회 관람권 구매도 포함됩니다. 가족 동반 시 발생하는 부대 비용에 대해서도 포인트 사용이 허용됩니다.\n\n**[중요 유의사항]**\n포인트 사용 기한은 **2024년 12월 31일 23:59**까지입니다. 기한 내 미사용된 잔여 포인트는 이월되지 않고 자동 소멸되오니 반드시 기간 내 사용하시기 바랍니다. 영수증 증빙이 필요한 항목은 결제 후 14일 이내에 사내 ERP 시스템 '복지관리' 메뉴에 업로드해야 승인이 완료됩니다.",
    summary: "2024년 복지 포인트는 총 200만P이며, 자기계발/건강/여가 카테고리에서 12월말까지 사용 가능합니다. 증빙은 14일 이내 완료 필수입니다.",
    sources: [
      { id: "1", title: "2024 복지운영안_최종본.pdf", type: "PDF" },
      { id: "2", title: "포인트 몰 파트너사 리스트.url", type: "URL" },
      { id: "3", title: "영수증 증빙 매뉴얼.doc", type: "DOC" }
    ],
    images: [
      "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1573497491208-6b1acb260507?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&q=80&w=800"
    ],
    recommendedQuestions: ["포인트 잔액 실시간 조회", "해외 강의 결제 증빙 방법", "내년 포인트 인상 계획"],
    analysisSteps: [
      { label: "사내 복지 DB 접속", status: "complete" },
      { label: "2024년도 정책 데이터 파싱", status: "complete" },
      { label: "사용자별 권한 필터링", status: "complete" },
      { label: "시각적 그리드 구성", status: "complete" }
    ]
  },
  "TEXT_ONLY_TEST": {
    answer: "### 신규 프로젝트 기안 작성 프로세스 안내\n\n모든 신규 프로젝트는 사내 통합 관리 시스템(ERP)을 통해 공식 기안되어야 하며, 다음의 필수 포함 항목을 반드시 준수하여 작성해 주시기 바랍니다.\n\n1. **프로젝트 목적 및 기대효과:** 구체적인 비즈니스 임팩트와 정량적 목표 수치를 명시해야 합니다.\n2. **상세 소요 예산:** 인건비, 인프라 비용, 외부 용역비 등 항목별 산출 근거를 첨부하십시오.\n3. **리스크 분석 및 대응:** 보안 검토 필체 및 법무적 검토가 필요한 사항을 사전에 체크해야 합니다.\n\n결재 라인은 기본적으로 '팀장 -> 본부장 -> CSO' 순이며, 승인 기간은 평균 영업일 기준 3~5일이 소요됩니다.",
    summary: "신규 프로젝트는 ERP를 통해 3단계 결재 라인을 거치며, 목적/예산/리스크 항목 작성이 필수입니다.",
    sources: [
      { id: "4", title: "표준 기안서 양식_v2.doc", type: "DOC" },
      { id: "5", title: "결재 가이드라인_2024.url", type: "URL" }
    ],
    images: [],
    recommendedQuestions: ["예산 편성 상세 기준", "보안 검토 요청 프로세스", "결재 반려 시 재승인 절차"],
    analysisSteps: [
      { label: "운영 매뉴얼 검색", status: "complete" },
      { label: "최신 결재 경로 확인", status: "complete" }
    ]
  },
  "NO_INFO_TEST": {
    answer: "### 검색 결과가 존재하지 않습니다\n\n입력하신 **'비공개 대외비 프로젝트 X'**에 대한 정보를 전사 데이터베이스에서 찾을 수 없습니다. \n\n**[발생 가능한 원인]**\n*   정보가 아직 공식 데이터베이스에 등재되지 않았습니다.\n*   사용자의 현재 직급이나 부서 권한으로는 접근이 제한된 정보일 수 있습니다.\n*   검색 키워드가 너무 구체적이거나 오타가 포함되어 있을 가능성이 있습니다.\n\n정확한 확인이 필요한 경우 아래의 공식 채널을 이용해 주시기 바랍니다.",
    summary: "요청하신 키워드에 대한 사내 문서를 찾을 수 없습니다. 검색어를 변경하거나 문의 채널을 이용해 주세요.",
    sources: [],
    images: [],
    recommendedQuestions: ["다른 유사 키워드로 검색", "인재개발팀에 직접 문의", "보안 등급 확인 방법"],
    analysisSteps: [
      { label: "전사 지식 베이스 검색", status: "complete" },
      { label: "액세스 권한 필터링", status: "complete" },
      { label: "최종 결과 부재 확인", status: "complete" }
    ],
    noInformation: true
  }
};

export const generateAIResponse = async (
  prompt: string, 
  history: any[]
): Promise<AIResponse> => {
  // 실제 AI 응답을 시뮬레이션하기 위한 지연
  await wait(1800);

  const cleanPrompt = prompt.trim();

  // 1. 특정 키워드에 따른 응답 분기 (복구된 부분)
  if (cleanPrompt.includes("복지 포인트") || cleanPrompt.includes("이미지 3개")) {
    return MOCK_RESPONSES.IMAGES_TEST;
  }
  
  if (cleanPrompt.includes("정보 없음") || cleanPrompt.includes("비공개 대외비")) {
    return MOCK_RESPONSES.NO_INFO_TEST;
  }

  // 2. 기본값: 텍스트 위주 응답
  return MOCK_RESPONSES.TEXT_ONLY_TEST;
};
