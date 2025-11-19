export interface Suggestion {
  title: string;
  description: string;
  severity: 'critical' | 'warning' | 'info';
  category: 'speed' | 'keywords' | 'content' | 'mobile' | 'links';
}

export interface SeoMetrics {
  performance: number;
  seo: number;
  mobile: number;
  links: number;
}

export interface SeoReport {
  url: string;
  timestamp: string;
  planType: 'free' | 'pro'; // Added to distinguish report quality
  overallScore: number;
  metrics: SeoMetrics;
  summary: string;
  suggestions: Suggestion[];
  technicalDetails: {
    loadTimeEstimate: string;
    mobileFriendly: boolean;
    sslSecure: boolean;
    internalLinksCount: number;
    externalLinksCount: number;
  };
}

export enum AppState {
  IDLE = 'IDLE',
  ANALYZING = 'ANALYZING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
  LOCKED = 'LOCKED', // Payment required
}

export interface UsageData {
  count: number;
  history: string[];
}