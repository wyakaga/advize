import { IGetCampaigns } from "@/app/interfaces/campaigns.interface";
import instance from "../axios";

export const getCampaigns = async (page: number = 1, pageSize: number = 10): Promise<IGetCampaigns> => {
  const params: Record<string, unknown> = {};

  if (page) params.page = page
  if (pageSize) params.pageSize = pageSize

  const { data } = await instance.get("/campaigns", { params })
  return data
}

export const deleteCampaign = async (id: string): Promise<void> => {
  await instance.delete(`/campaigns?id=${id}`)
}