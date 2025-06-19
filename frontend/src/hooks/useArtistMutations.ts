import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiService } from "../services/api";
import type {
  ArtistDetail,
  ArtistNationality,
  ArtistLanguage,
  ArtistReligion,
  ArtistIdDocument,
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
      idDocuments: ArtistIdDocument[];
    }) => {
      const dataToSave = {
        ...data.detail,
        nationalities: data.nationalities,
        languages: data.languages,
        religions: data.religions,
        idDocuments: data.idDocuments,
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

// 刪除語言
export function useDeleteArtistLanguage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: apiService.artistLanguage.delete,
    onSuccess: () => {
      // 刪除成功後，讓所有藝人基本資料查詢失效以重新載入
      queryClient.invalidateQueries({
        queryKey: ["artistBasicInfo"],
      });
    },
  });
}

// 刪除宗教
export function useDeleteArtistReligion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: apiService.artistReligion.delete,
    onSuccess: () => {
      // 刪除成功後，讓所有藝人基本資料查詢失效以重新載入
      queryClient.invalidateQueries({
        queryKey: ["artistBasicInfo"],
      });
    },
  });
}

// 刪除身份證件
export function useDeleteArtistIdDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: apiService.artistIdDocument.delete,
    onSuccess: () => {
      // 刪除成功後，讓所有藝人基本資料查詢失效以重新載入
      queryClient.invalidateQueries({
        queryKey: ["artistBasicInfo"],
      });
    },
  });
}
