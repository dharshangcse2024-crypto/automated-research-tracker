export interface Topic {
  id: string;
  name: string;
  description: string;
  category: string;
  keywords: string[];
  sources: string[];
  is_active: boolean;
  created_at: string;
  updated_at?: string;
  last_scanned_at?: string;
}

export interface Article {
  id: string;
  topic_id: string;
  title: string;
  authors: string[];
  abstract?: string;
  url: string;
  source: string;
  external_id?: string;
  doi?: string;
  published_date: string;
  category?: string;
  relevance_score?: number;
  relevance_label?: string;
  summary?: string;
  created_at: string;
}
