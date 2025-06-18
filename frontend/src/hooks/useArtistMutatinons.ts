import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiService } from "../services/api";
import type {
  ArtistDetail,
  ArtistNationality,
  ArtistLanguage,
  ArtistReligion,
} from "../types/artistBasicInfo";
import { QUERY_KEYS } from "./useArtistQueries";

// 更新藝人明細資料（包含國籍、語言、宗教）
export function useUpdateArtistDetail() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      detail: Omit<ArtistDetail, "id" | "createdAt" | "updatedAt">;
      nationalities: ArtistNationality[];
      languages: ArtistLanguage[];
      religions: ArtistReligion[];
    }) => {
      const dataToSave = {
        ...data.detail,
        nationalities: data.nationalities,
        languages: data.languages,
        religions: data.religions,
      };
      return apiService.artistDetail.createOrUpdate(dataToSave);
    },
    onSuccess: (data, variables) => {
      // 更新藝人基本資料快取
      if (data.success && data.data) {
        queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.artistBasicInfo(variables.detail.artistId),
        });
      }
    },
  });
}

// 刪除國籍
export function useDeleteArtistNationality() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: apiService.artistNationality.delete,
    onSuccess: () => {
      // 刪除成功後，讓所有藝人基本資料查詢失效以重新載入
      queryClient.invalidateQueries({
        queryKey: ["artistBasicInfo"],
      });
    },
  });
}
