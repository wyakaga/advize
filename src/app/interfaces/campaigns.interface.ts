export interface IGetCampaigns {
  data:       IGetCampaignsDatum[];
  pagination: IGetCampaignsPagination;
  totals:     IGetCampaignsTotals;
}

export interface IGetCampaignsDatum {
  id:          string;
  name:        string;
  platform:    string;
  impressions: number;
  clicks:      number;
  conversions: number;
  cost:        number;
  startDate:   Date;
  endDate:     Date;
  createdAt:   Date;
}

export interface IGetCampaignsPagination {
  total:      number;
  page:       number;
  pageSize:   number;
  totalPages: number;
}

export interface IGetCampaignsTotals {
  impressions: number;
  clicks:      number;
  conversions: number;
  cost:        number;
}

export interface ICreateCampaignPayload {
  name: string;
  platform: string;
  impressions: number;
  clicks: number;
  conversions: number;
  cost: number;
  startDate: string;
  endDate: string;
}
