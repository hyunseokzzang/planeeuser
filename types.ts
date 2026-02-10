
export enum Sender {
  USER = 'USER',
  AI = 'AI'
}

export interface Source {
  title: string;
  type: 'PDF' | 'URL' | 'DOC';
  id: string;
}

export interface AnalysisStep {
  label: string;
  status: 'complete' | 'loading' | 'pending';
}

export interface AIResponse {
  answer: string;
  summary?: string;
  sources: Source[];
  images?: string[];
  recommendedQuestions: string[];
  analysisSteps?: AnalysisStep[];
  noInformation?: boolean;
}

export interface Message {
  id: string;
  sender: Sender;
  content: string;
  aiData?: AIResponse;
  timestamp: Date;
}

export interface ChatSession {
  id: string;
  title: string;
  lastMessage: string;
  updatedAt: Date;
}
