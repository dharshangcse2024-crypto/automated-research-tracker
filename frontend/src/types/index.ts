export interface ResearchTopic {
  id: string;
  title: string;
  keywords: string[];
  frequency: 'daily' | 'weekly' | 'realtime';
  status: 'active' | 'paused';
}

export interface ResearchUpdate {
  id: string;
  topicId: string;
  title: string;
  summary: string;
  sourceUrl: string;
  timestamp: string;
}
