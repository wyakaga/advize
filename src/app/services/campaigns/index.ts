import {
  useMutation,
  useQuery,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";

import { createCampaign, deleteCampaign, getCampaigns } from "./rest";
import { ICreateCampaignPayload } from "@/app/interfaces/campaigns.interface";

export const useGetCampaignsQuery = (
  page: number = 1,
  pageSize: number = 10,
  search: string = "",
  platform: string = "",
) => {
  return useQuery({
    queryKey: ["campaigns", page, pageSize, search, platform],
    queryFn: () => getCampaigns(page, pageSize, search, platform),
    placeholderData: keepPreviousData,
  });
};

export const useDeleteCampaignMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteCampaign(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["campaigns"] });
    },
  });
};

export const useCreateCampaignMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ICreateCampaignPayload | ICreateCampaignPayload[]) => createCampaign(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["campaigns"] });
    },
  });
};
