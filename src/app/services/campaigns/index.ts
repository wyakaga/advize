import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { deleteCampaign, getCampaigns } from "./rest";

export const useGetCampaignsQuery = (page: number = 1, pageSize: number = 10) => {
  return useQuery({
    queryKey: ["campaigns", page, pageSize],
    queryFn: () => getCampaigns(page, pageSize),
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
