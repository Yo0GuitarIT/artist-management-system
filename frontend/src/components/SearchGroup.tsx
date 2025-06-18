import { useState } from "react";
import { useArtistManagement } from "../context";

export default function SearchGroup() {
  const {
    handleSearch,
    handleSave,
    handleCancel,
    isQueryLoading,
    isSaving,
    error,
    editingDetail,
  } = useArtistManagement();

  const [searchArtistId, setSearchArtistId] = useState<string>("");
  const [localError, setLocalError] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!searchArtistId.trim()) {
      setLocalError("請輸入藝人編號");
      return;
    }

    setLocalError("");
    handleSearch(searchArtistId.trim());
  };

  const displayError = error || localError;
  const showSaveButtons = !!editingDetail;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
        藝人經紀管理系統
      </h1>

      <form onSubmit={handleSubmit} className="mb-4">
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <label
              htmlFor="artistId"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              藝人編號
            </label>
            <input
              type="text"
              id="artistId"
              value={searchArtistId}
              onChange={(e) => setSearchArtistId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="請輸入藝人編號"
              disabled={isQueryLoading}
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={isQueryLoading}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isQueryLoading ? "查詢中..." : "查詢"}
            </button>
            {showSaveButtons && (
              <>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={isSaving}
                  className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? "儲存中..." : "存檔"}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={isSaving}
                  className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  取消
                </button>
              </>
            )}
          </div>
        </div>
      </form>

      {displayError && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
          <div className="text-red-800">{displayError}</div>
        </div>
      )}
    </div>
  );
}
