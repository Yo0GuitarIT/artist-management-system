import { useArtistManagement } from "../context";
import { useDeleteArtistLanguage } from "../hooks/useArtistMutatinons";
import type { ArtistLanguage } from "../types/artistBasicInfo";

export default function LanguageCard() {
  const {
    artistBasicInfo,
    editingLanguages,
    setEditingLanguages,
    codeOptions,
  } = useArtistManagement();

  const deleteLanguageMutation = useDeleteArtistLanguage();

  if (!artistBasicInfo) {
    return null; // 如果沒有藝人資料就不顯示
  }

  // 新增語言 (不立即存檔)
  const handleAddLanguage = () => {
    if (codeOptions.language.length === 0) return;

    const firstOption = codeOptions.language[0];
    const newLanguage: ArtistLanguage = {
      id: Date.now(), // 使用時間戳作為臨時 ID
      artistId: artistBasicInfo.artistId,
      languageCode: firstOption.code,
      isPrimary: editingLanguages.length === 0, // 如果是第一個，設為主要
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setEditingLanguages([...editingLanguages, newLanguage]);
  };

  // 更新語言代碼 (不立即存檔)
  const handleLanguageCodeChange = (id: number, languageCode: string) => {
    const updatedLanguages = editingLanguages.map((language) =>
      language.id === id
        ? {
            ...language,
            languageCode,
            updatedAt: new Date().toISOString(),
          }
        : language
    );
    setEditingLanguages(updatedLanguages);
  };

  // 切換主要語言 (不立即存檔)
  const handleTogglePrimary = (id: number, isPrimary: boolean) => {
    const updatedLanguages = editingLanguages.map((language) => ({
      ...language,
      isPrimary: language.id === id ? isPrimary : false, // 確保只有一個主要語言
      updatedAt: new Date().toISOString(),
    }));
    setEditingLanguages(updatedLanguages);
  };

  // 刪除語言 (立即執行 API)
  const handleDeleteLanguage = async (id: number) => {
    if (!confirm("確定要刪除這筆語言資料嗎？")) return;

    // 如果是新增的語言（臨時 ID），直接從列表中移除
    if (id > 1000000000) {
      // 時間戳 ID
      const updatedLanguages = editingLanguages.filter(
        (language) => language.id !== id
      );
      setEditingLanguages(updatedLanguages);
      return;
    }

    // 如果是已存在的語言，呼叫 API 刪除
    try {
      await deleteLanguageMutation.mutateAsync(id);

      // 刪除成功後，從本地狀態中移除該語言
      const updatedLanguages = editingLanguages.filter(
        (language) => language.id !== id
      );
      setEditingLanguages(updatedLanguages);
    } catch (error) {
      console.error("刪除語言失敗:", error);
      alert("刪除語言失敗");
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          語言
        </h2>
        <button
          onClick={handleAddLanguage}
          disabled={deleteLanguageMutation.isPending}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-medium rounded-lg transition-colors duration-200"
        >
          新增
        </button>
      </div>

      <div className="space-y-3">
        {/* 表頭 */}
        <div className="grid grid-cols-12 gap-3 text-sm font-medium text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-600 pb-2">
          <div className="col-span-1">刪除</div>
          <div className="col-span-2">主要</div>
          <div className="col-span-9">語言</div>
        </div>

        {/* 語言資料列表 */}
        {editingLanguages.map((language) => (
          <div
            key={language.id}
            className="grid grid-cols-12 gap-3 items-center"
          >
            {/* 刪除按鈕 */}
            <div className="col-span-1">
              <button
                onClick={() => handleDeleteLanguage(language.id)}
                disabled={deleteLanguageMutation.isPending}
                className="p-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 disabled:opacity-50"
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

            {/* 主要語言 radio */}
            <div className="col-span-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="primaryLanguage"
                  checked={language.isPrimary}
                  onChange={(e) =>
                    handleTogglePrimary(language.id, e.target.checked)
                  }
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <span className="ml-2 text-sm text-gray-900 dark:text-white">
                  主要
                </span>
              </label>
            </div>

            {/* 語言下拉選單 */}
            <div className="col-span-9">
              <select
                value={language.languageCode}
                onChange={(e) =>
                  handleLanguageCodeChange(language.id, e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm"
              >
                {codeOptions.language.map((option) => (
                  <option key={option.code} value={option.code}>
                    {option.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ))}

        {editingLanguages.length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            尚無語言資料，請點擊「新增」按鈕
          </div>
        )}
      </div>
    </div>
  );
}
