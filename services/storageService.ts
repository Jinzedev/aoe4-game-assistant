import AsyncStorage from '@react-native-async-storage/async-storage';
import { SearchResult } from '../types';

const STORAGE_KEYS = {
  BOUND_PLAYER_ID: 'bound_player_id', // 只保存玩家ID
  APP_SETTINGS: 'app_settings',
  SEARCH_HISTORY: 'search_history'
};

export class StorageService {
  // 保存绑定的玩家ID（而不是完整数据）
  static async saveBoundPlayer(playerData: SearchResult): Promise<void> {
    try {
      // 只保存玩家ID
      await AsyncStorage.setItem(STORAGE_KEYS.BOUND_PLAYER_ID, playerData.profile_id.toString());
      console.log('✅ 玩家ID已保存到本地存储:', playerData.profile_id);
    } catch (error) {
      console.error('❌ 保存玩家ID失败:', error);
      throw error;
    }
  }

  // 获取绑定的玩家ID
  static async getBoundPlayerId(): Promise<number | null> {
    try {
      const playerIdString = await AsyncStorage.getItem(STORAGE_KEYS.BOUND_PLAYER_ID);
      if (playerIdString) {
        const playerId = parseInt(playerIdString, 10);
        console.log('✅ 从本地存储读取玩家ID:', playerId);
        return playerId;
      }
      console.log('📝 本地存储中没有玩家ID');
      return null;
    } catch (error) {
      console.error('❌ 读取玩家ID失败:', error);
      return null;
    }
  }

  // 删除绑定的玩家ID
  static async removeBoundPlayer(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.BOUND_PLAYER_ID);
      console.log('✅ 玩家ID已从本地存储删除');
    } catch (error) {
      console.error('❌ 删除玩家ID失败:', error);
      throw error;
    }
  }

  // 检查是否有绑定的玩家ID
  static async hasBoundPlayer(): Promise<boolean> {
    try {
      const playerIdString = await AsyncStorage.getItem(STORAGE_KEYS.BOUND_PLAYER_ID);
      return playerIdString !== null;
    } catch (error) {
      console.error('❌ 检查玩家ID失败:', error);
      return false;
    }
  }

  // 清除所有存储数据（用于重置应用）
  static async clearAll(): Promise<void> {
    try {
      await AsyncStorage.clear();
      console.log('✅ 所有本地数据已清除');
    } catch (error) {
      console.error('❌ 清除数据失败:', error);
      throw error;
    }
  }

  // 搜索历史相关方法
  static async getSearchHistory(): Promise<SearchResult[]> {
    try {
      const jsonData = await AsyncStorage.getItem(STORAGE_KEYS.SEARCH_HISTORY);
      if (jsonData) {
        const history = JSON.parse(jsonData) as SearchResult[];
        return history;
      }
      return [];
    } catch (error) {
      console.error('❌ 读取搜索历史失败:', error);
      return [];
    }
  }

  static async addToSearchHistory(player: SearchResult): Promise<void> {
    try {
      const currentHistory = await this.getSearchHistory();
      // 移除重复项
      const filteredHistory = currentHistory.filter(p => p.profile_id !== player.profile_id);
      // 添加到开头，限制最多10条
      const newHistory = [player, ...filteredHistory].slice(0, 10);
      
      const jsonData = JSON.stringify(newHistory);
      await AsyncStorage.setItem(STORAGE_KEYS.SEARCH_HISTORY, jsonData);
    } catch (error) {
      console.error('❌ 添加搜索历史失败:', error);
      throw error;
    }
  }

  static async clearSearchHistory(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.SEARCH_HISTORY);
    } catch (error) {
      console.error('❌ 清除搜索历史失败:', error);
      throw error;
    }
  }

  // 获取存储大小信息（调试用）
  static async getStorageInfo(): Promise<void> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      console.log('📊 存储的数据键:', keys);
      
      for (const key of keys) {
        const value = await AsyncStorage.getItem(key);
        const size = value ? new Blob([value]).size : 0;
        console.log(`📁 ${key}: ${size} bytes`);
      }
    } catch (error) {
      console.error('❌ 获取存储信息失败:', error);
    }
  }
}

// 默认导出
export default StorageService; 