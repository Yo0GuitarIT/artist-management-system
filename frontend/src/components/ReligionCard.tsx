import { useArtistManagement } from "../context";
import type { ArtistReligion } from "../types/artistBasicInfo";

export default function ReligionCard() {
  const {
    artistBasicInfo,
    editingReligions,
    setEditingReligions,
    codeOptions,
  } = useArtistManagement();

  if (!artistBasicInfo) {
    return null; // 如果沒有藝人資料就不顯示
  }

  // 新增宗教 (不立即存檔)
  const handleAddReligion = () => {
    if (codeOptions.religion.length === 0) return;

    const firstOption = codeOptions.religion[0];
    const newReligion: ArtistReligion = {
      id: Date.now(), // 使用時間戳作為臨時 ID
      artistId: artistBasicInfo.artistId,
      religionCode: firstOption.code,
      isPrimary: editingReligions.length === 0, // 如果是第一個，設為主要
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setEditingReligions([...editingReligions, newReligion]);
  };

  // 更新宗教代碼 (不立即存檔)
  const handleReligionCodeChange = (id: number, religionCode: string) => {
    const updatedReligions = editingReligions.map((religion) =>
      religion.id === id
        ? {
            ...religion,
            religionCode,
            updatedAt: new Date().toISOString(),
          }
        : religion
    );
    setEditingReligions(updatedReligions);
  };

  // 切換主要宗教 (不立即存檔)
  const handleTogglePrimary = (id: number, isPrimary: boolean) => {
    const updatedReligions = editingReligions.map((religion) => ({
      ...religion,
      isPrimary: religion.id === id ? isPrimary : false, // 確保只有一個主要宗教
      updatedAt: new Date().toISOString(),
    }));
    setEditingReligions(updatedReligions);
  };

  // 刪除宗教 (不立即存檔，僅從本地狀態移除)
  const handleDeleteReligion = (id: number) => {
    if (!confirm("確定要刪除這筆宗教資料嗎？")) return;

    const updatedReligions = editingReligions.filter(
      (religion) => religion.id !== id
    );
    setEditingReligions(updatedReligions);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          宗教
        </h2>
        <button
          onClick={handleAddReligion}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors duration-200"
        >
          新增
        </button>
      </div>

      <div className="space-y-3">
        {/* 表頭 */}
        <div className="grid grid-cols-12 gap-3 text-sm font-medium text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-600 pb-2">
          <div className="col-span-1">刪除</div>
          <div className="col-span-2">主要</div>
          <div className="col-span-9">宗教</div>
        </div>

        {/* 宗教資料列表 */}
        {editingReligions.map((religion) => (
          <div
            key={religion.id}
            className="grid grid-cols-12 gap-3 items-center"
          >
            {/* 刪除按鈕 */}
            <div className="col-span-1">
              <button
                onClick={() => handleDeleteReligion(religion.id)}
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

            {/* 主要宗教 radio */}
            <div className="col-span-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="primaryReligion"
                  checked={religion.isPrimary}
                  onChange={(e) =>
                    handleTogglePrimary(religion.id, e.target.checked)
                  }
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <span className="ml-2 text-sm text-gray-900 dark:text-white">
                  主要
                </span>
              </label>
            </div>

            {/* 宗教下拉選單 */}
            <div className="col-span-9">
              <select
                value={religion.religionCode}
                onChange={(e) =>
                  handleReligionCodeChange(religion.id, e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm"
              >
                {codeOptions.religion.map((option) => (
                  <option key={option.code} value={option.code}>
                    {option.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ))}

        {editingReligions.length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            尚無宗教資料，請點擊「新增」按鈕
          </div>
        )}
      </div>
    </div>
  );
}
