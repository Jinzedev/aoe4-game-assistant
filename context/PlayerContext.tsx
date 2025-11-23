// src/context/PlayerContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { SearchResult } from '../types';
import StorageService from '../services/storageService';
import { apiService } from '../services/apiService';
import { transformPlayerData } from '../utils/dataAdapter'; 
interface PlayerContextType {
  boundPlayer: SearchResult | undefined;
  isLoading: boolean;
  refreshPlayer: () => Promise<void>;
  bindPlayer: (player: SearchResult) => Promise<void>;
  unbindPlayer: () => Promise<void>;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const [boundPlayer, setBoundPlayer] = useState<SearchResult | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  // 初始化加载
  useEffect(() => {
    const init = async () => {
      try {
        const id = await StorageService.getBoundPlayerId();
        if (id) {
          const raw = await apiService.getPlayer(id);
          setBoundPlayer(transformPlayerData(raw));
        }
      } catch (e) {
        console.error('加载玩家失败', e);
      } finally {
        setIsLoading(false);
      }
    };
    init();
  }, []);

  const refreshPlayer = async () => {
    if (!boundPlayer) return;
    const raw = await apiService.getPlayer(boundPlayer.profile_id);
    setBoundPlayer(transformPlayerData(raw));
  };

  const bindPlayer = async (player: SearchResult) => {
    await StorageService.saveBoundPlayer(player);
    setBoundPlayer(player);
  };

  const unbindPlayer = async () => {
    await StorageService.removeBoundPlayer();
    setBoundPlayer(undefined);
  };

  return (
    <PlayerContext.Provider value={{ boundPlayer, isLoading, refreshPlayer, bindPlayer, unbindPlayer }}>
      {children}
    </PlayerContext.Provider>
  );
}

// 自定义 Hook，方便组件调用
export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (!context) throw new Error('usePlayer must be used within a PlayerProvider');
  return context;
};