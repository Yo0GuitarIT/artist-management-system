import { useContext } from "react";
import { ArtistManagementContext } from "./ArtistManagementContext";
import type { ArtistManagementContextType } from "./ArtistManagementContext";

// Hook 來使用 Context
export function useArtistManagement(): ArtistManagementContextType {
  const context = useContext(ArtistManagementContext);
  if (context === undefined) {
    throw new Error(
      "useArtistManagement must be used within an ArtistManagementProvider"
    );
  }
  return context;
}
