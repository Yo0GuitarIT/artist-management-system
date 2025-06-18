import { useQuery } from "@tanstack/react-query";
import { apiService } from "../services/api";

// Query Keys
export const QUERY_KEYS = {
  artistBasicInfo: (artistId: string) => ["artistBasicInfo", artistId],
  codeOptions: (category: string) => ["codeOptions", category],
} as const;

// 查詢藝人基本資料
export function useArtistBasicInfo(artistId: string | null) {
  return useQuery({
    queryKey: QUERY_KEYS.artistBasicInfo(artistId || ""),
    queryFn: () => apiService.artistBasicInfo.getByArtistId(artistId!),
    enabled: !!artistId,
    staleTime: 5 * 60 * 1000, // 5 分鐘
  });
}

// 查詢代號選項
export function useCodeOptions(category: string) {
  return useQuery({
    queryKey: QUERY_KEYS.codeOptions(category),
    queryFn: () => apiService.codeOptions.getByCategory(category),
    staleTime: 30 * 60 * 1000, // 30 分鐘，代號選項變化較少
  });
}
