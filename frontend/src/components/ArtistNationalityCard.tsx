import { useState, useEffect } from "react";
import type { ArtistNationality, CodeOption } from "../types/artistBasicInfo";
import { apiService } from "../services/api";
import { useDeleteArtistNationality } from "../hooks/useArtistMutatinons";

interface ArtistNationalityCardProps {
  artistId: string;
  nationalities: ArtistNationality[]; // 從父組件傳入的國籍資料
  onNationalitiesChange: (nationalities: ArtistNationality[]) => void; // 更新國籍資料的回調
  onNationalityDelete?: (id: number) => void; // 刪除國籍的回調（立即執行）
}

export default function ArtistNationalityCard({
  artistId,
  nationalities,
  onNationalitiesChange,
  onNationalityDelete,
}: ArtistNationalityCardProps) {
  const [nationalityOptions, setNationalityOptions] = useState<CodeOption[]>(
    []
  );
  const [error, setError] = useState<string>("");

  // React Query mutation for deleting nationality
  const deleteNationalityMutation = useDeleteArtistNationality();
  const loading = deleteNationalityMutation.isPending;

  // 載入國籍選項
  useEffect(() => {
    const loadNationalityOptions = async () => {
      try {
        const response = await apiService.codeOptions.getByCategory(
          "nationality"
        );
        if (response.success && response.data) {
          setNationalityOptions(response.data);
        }
      } catch (error) {
        console.error("載入國籍選項失敗:", error);
      }
    };

    loadNationalityOptions();
  }, []);

  // 新增國籍 (不立即存檔)
  const handleAddNationality = () => {
    if (nationalityOptions.length === 0) return;

    const firstOption = nationalityOptions[0];
    const newNationality: ArtistNationality = {
      id: Date.now(), // 使用時間戳作為臨時 ID
      artistId: artistId,
      nationalityCode: firstOption.code,
      isPrimary: nationalities.length === 0, // 如果是第一個，設為主要
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onNationalitiesChange([...nationalities, newNationality]);
  };

  // 更新國籍代碼 (不立即存檔)
  const handleNationalityCodeChange = (id: number, nationalityCode: string) => {
    const updatedNationalities = nationalities.map((nationality) =>
      nationality.id === id
        ? {
            ...nationality,
            nationalityCode,
            updatedAt: new Date().toISOString(),
          }
        : nationality
    );
    onNationalitiesChange(updatedNationalities);
  };

  // 切換主要國籍 (不立即存檔)
  const handleTogglePrimary = (id: number, isPrimary: boolean) => {
    const updatedNationalities = nationalities.map((nationality) => ({
      ...nationality,
      isPrimary: nationality.id === id ? isPrimary : false, // 確保只有一個主要國籍
      updatedAt: new Date().toISOString(),
    }));
    onNationalitiesChange(updatedNationalities);
  };

  // 刪除國籍 (立即執行 API)
  const handleDeleteNationality = async (id: number) => {
    if (!confirm("確定要刪除這筆國籍資料嗎？")) return;

    // 如果是新增的國籍（臨時 ID），直接從列表中移除
    if (id > 1000000000) {
      // 時間戳 ID
      const updatedNationalities = nationalities.filter(
        (nationality) => nationality.id !== id
      );
      onNationalitiesChange(updatedNationalities);
      return;
    }

    // 如果是已存在的國籍，使用 React Query mutation 刪除
    deleteNationalityMutation.mutate(id, {
      onSuccess: (response) => {
        if (response.success) {
          // 調用父組件的回調，讓父組件處理狀態更新
          onNationalityDelete?.(id);
        } else {
          setError(response.message || "刪除國籍失敗");
        }
      },
      onError: (error) => {
        console.error("刪除國籍失敗:", error);
        setError("刪除國籍失敗");
      },
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          國籍
        </h2>
        <button
          onClick={handleAddNationality}
          disabled={loading || !artistId}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-medium rounded-lg transition-colors duration-200"
        >
          新增
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-700 dark:text-red-400 text-sm">{error}</p>
        </div>
      )}

      {loading && (
        <div className="text-center py-4">
          <p className="text-gray-500 dark:text-gray-400">載入中...</p>
        </div>
      )}

      <div className="space-y-3">
        {/* 表頭 */}
        <div className="grid grid-cols-12 gap-3 text-sm font-medium text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-600 pb-2">
          <div className="col-span-1">刪除</div>
          <div className="col-span-2">主要</div>
          <div className="col-span-9">國籍</div>
        </div>

        {/* 國籍資料列表 */}
        {nationalities.map((nationality) => (
          <div
            key={nationality.id}
            className="grid grid-cols-12 gap-3 items-center"
          >
            {/* 刪除按鈕 */}
            <div className="col-span-1">
              <button
                onClick={() => handleDeleteNationality(nationality.id)}
                className="p-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                title="刪除"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </div>

            {/* 主要國籍 checkbox */}
            <div className="col-span-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="primaryNationality"
                  checked={nationality.isPrimary}
                  onChange={(e) =>
                    handleTogglePrimary(nationality.id, e.target.checked)
                  }
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <span className="ml-2 text-sm text-gray-900 dark:text-white">
                  主要
                </span>
              </label>
            </div>

            {/* 國籍下拉選單 */}
            <div className="col-span-9">
              <select
                value={nationality.nationalityCode}
                onChange={(e) =>
                  handleNationalityCodeChange(nationality.id, e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm"
              >
                {nationalityOptions.map((option) => (
                  <option key={option.code} value={option.code}>
                    {option.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ))}

        {nationalities.length === 0 && !loading && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            尚無國籍資料，請點擊「新增」按鈕
          </div>
        )}
      </div>
    </div>
  );
}
