import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiService } from "../services/api";
import type {
  PatientDetail,
  PatientNationality,
} from "../types/patientBasicInfo";

// Query Keys
export const QUERY_KEYS = {
  patientBasicInfo: (mrn: string) => ["patientBasicInfo", mrn],
  codeOptions: (category: string) => ["codeOptions", category],
} as const;

// 查詢病人基本資料
export function usePatientBasicInfo(mrn: string | null) {
  return useQuery({
    queryKey: QUERY_KEYS.patientBasicInfo(mrn || ""),
    queryFn: () => apiService.patientBasicInfo.getByMrn(mrn!),
    enabled: !!mrn,
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

// 更新病人明細資料（包含國籍）
export function useUpdatePatientDetail() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      detail: Omit<PatientDetail, "id" | "createdAt" | "updatedAt">;
      nationalities: PatientNationality[];
    }) => {
      const dataToSave = {
        ...data.detail,
        nationalities: data.nationalities,
      };
      return apiService.patientDetail.createOrUpdate(dataToSave);
    },
    onSuccess: (data, variables) => {
      // 更新病人基本資料快取
      if (data.success && data.data) {
        queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.patientBasicInfo(variables.detail.mrn),
        });
      }
    },
  });
}

// 刪除國籍
export function useDeleteNationality() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: apiService.patientNationality.delete,
    onSuccess: () => {
      // 刪除成功後，讓所有病人基本資料查詢失效以重新載入
      queryClient.invalidateQueries({
        queryKey: ["patientBasicInfo"],
      });
    },
  });
}
