import AsyncStorage from '@react-native-async-storage/async-storage';
import { SearchResult } from '../types';

const STORAGE_KEYS = {
  BOUND_PLAYER: 'bound_player_data',
  APP_SETTINGS: 'app_settings'
};

export class StorageService {
  // 保存绑定的玩家数据
  static async saveBoundPlayer(playerData: SearchResult): Promise<void> {
    try {
      const jsonData = JSON.stringify(playerData);
      await AsyncStorage.setItem(STORAGE_KEYS.BOUND_PLAYER, jsonData);
      console.log('✅ 玩家数据已保存到本地存储');
    } catch (error) {
      console.error('❌ 保存玩家数据失败:', error);
      throw error;
    }
  }

  // 获取绑定的玩家数据
  static async getBoundPlayer(): Promise<SearchResult | null> {
    try {
      const jsonData = await AsyncStorage.getItem(STORAGE_KEYS.BOUND_PLAYER);
      if (jsonData) {
        const playerData = JSON.parse(jsonData) as SearchResult;
        console.log('✅ 从本地存储读取玩家数据:', playerData.name);
        return playerData;
      }
      console.log('📝 本地存储中没有玩家数据');
      return null;
    } catch (error) {
      console.error('❌ 读取玩家数据失败:', error);
      return null;
    }
  }

  // 删除绑定的玩家数据
  static async removeBoundPlayer(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.BOUND_PLAYER);
      console.log('✅ 玩家数据已从本地存储删除');
    } catch (error) {
      console.error('❌ 删除玩家数据失败:', error);
      throw error;
    }
  }

  // 检查是否有绑定的玩家
  static async hasBoundPlayer(): Promise<boolean> {
    try {
      const jsonData = await AsyncStorage.getItem(STORAGE_KEYS.BOUND_PLAYER);
      return jsonData !== null;
    } catch (error) {
      console.error('❌ 检查玩家数据失败:', error);
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