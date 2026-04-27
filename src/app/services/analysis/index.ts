import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { analyzeCampaigns, deleteAnalysis, getAnalyses, getAnalysis } from "./rest";

export const useAnalyzeCampaignsMutation = () => {
  return useMutation({
    mutationFn: (campaignIds: string[]) => analyzeCampaigns(campaignIds),
  });
};

export const useGetAnalysesQuery = (page: number = 1, pageSize: number = 10, search: string = "") => {
  return useQuery({
    queryKey: ["analyses", page, pageSize, search],
    queryFn: () => getAnalyses(page, pageSize, search),
    placeholderData: keepPreviousData
  });
};

export const useGetAnalysisQuery = (id: string) => {
  return useQuery({
    queryKey: ["analysis", id],
    queryFn: () => getAnalysis(id),
    enabled: !!id,
  });
};

export const useDeleteAnalysisMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteAnalysis(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["analyses"] });
    },
  });
};
