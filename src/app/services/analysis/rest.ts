import instance from "../axios";

export const analyzeCampaigns = async (campaignIds: string[]): Promise<{ analysisId: string }> => {
  const { data } = await instance.post("/analyze", { campaignIds });
  return data;
};
