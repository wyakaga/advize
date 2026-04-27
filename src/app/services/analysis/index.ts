import { useMutation } from "@tanstack/react-query";
import { analyzeCampaigns } from "./rest";

export const useAnalyzeCampaignsMutation = () => {
  return useMutation({
    mutationFn: (campaignIds: string[]) => analyzeCampaigns(campaignIds),
  });
};
