import { IAnalysisData, IGetAnalyses } from "@/app/interfaces/analysis.interface";
import instance from "../axios";

export const analyzeCampaigns = async (campaignIds: string[]): Promise<{ analysisId: string }> => {
  const { data } = await instance.post("/analyze", { campaignIds });
  return data;
};

export const getAnalyses = async (page: number = 1, pageSize: number = 10, search: string = ""): Promise<IGetAnalyses> => {
  const params: Record<string, unknown> = { page, pageSize };
  if (search) params.search = search;

  const { data } = await instance.get("/analysis", { params });
  return data;
};

export const getAnalysis = async (id: string): Promise<IAnalysisData> => {
  const { data } = await instance.get(`/analysis/${id}`);
  return data;
};

export const deleteAnalysis = async (id: string): Promise<void> => {
  await instance.delete(`/analysis/${id}`);
};
