export interface IAnalysisListItem {
  id: string;
  campaignIds: string[];
  summary: string;
  createdAt: string;
}

export interface IGetAnalyses {
  data: IAnalysisListItem[];
  pagination: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}

export interface IAnalysisData {
  id: string;
  summary: string;
  suggestions: {
    summary: string;
    underperforming_campaigns: string[];
    optimization_suggestions: string[];
    prioritized_actions: string[];
  };
  createdAt: string;
  campaigns: Array<{ id: string; name: string; platform: string }>;
}
