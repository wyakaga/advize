import { ICreateCampaignPayload, IGetCampaigns } from "@/app/interfaces/campaigns.interface";
import instance from "../axios";

export const getCampaigns = async (
  page: number = 1,
  pageSize: number = 10,
  search: string = "",
  platform: string = "",
): Promise<IGetCampaigns> => {
  const params: Record<string, unknown> = {};

  if (page) params.page = page;
  if (pageSize) params.pageSize = pageSize;
  if (search) params.search = search;
  if (platform) params.platform = platform;

  const { data } = await instance.get("/campaigns", { params });
  return data;
};

export const deleteCampaign = async (id: string): Promise<void> => {
  await instance.delete(`/campaigns?id=${id}`)
}

export const createCampaign = async (payload: ICreateCampaignPayload | ICreateCampaignPayload[]): Promise<void> => {
  await instance.post("/campaigns", payload)
}