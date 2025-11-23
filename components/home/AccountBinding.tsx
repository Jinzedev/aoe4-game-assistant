import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome5 } from '@expo/vector-icons';
import { apiService } from '../../services/apiService';

export function AccountBinding() {
  const navigation = useNavigation();
  const { bindPlayer } = usePlayer(); // 从 Context 获取绑定方法

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    try {
      const results = await apiService.searchPlayers({ query: searchQuery });
      const players = results.players || [];
      setSearchResults(players);
      if (players.length === 0) {
        Alert.alert('提示', '未找到相关玩家');
      }
    } catch (error) {
      Alert.alert('错误', '搜索失败，请稍后重试');
    } finally {
      setIsSearching(false);
    }
  };

  const handleBind = async (player: any) => {
    try {
      await bindPlayer(player); // 调用 Context 的方法更新全局状态
      Alert.alert('成功', `已绑定玩家: ${player.name}`, [
        { text: '确定', onPress: () => navigation.goBack() } // 绑定成功后返回
      ]);
    } catch (error) {
      Alert.alert('错误', '绑定失败');
    }
  };

  return (
    <View className="flex-1 bg-slate-900 p-6 pt-12">
      {/* 顶部关闭按钮 */}
      <View className="flex-row justify-end mb-4">
        <TouchableOpacity onPress={() => navigation.goBack()} className="p-2">
           <FontAwesome5 name="times" size={20} color="white" />
        </TouchableOpacity>
      </View>
      
      <Text className="text-white text-2xl font-bold mb-6">绑定游戏账号</Text>

      {/* 搜索框 */}
      <View className="flex-row space-x-2 mb-6">
        <TextInput
          className="flex-1 bg-slate-800 text-white p-4 rounded-xl"
          placeholder="输入玩家名称..."
          placeholderTextColor="#94a3b8"
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
        />
        <TouchableOpacity
          className="bg-purple-600 justify-center px-6 rounded-xl"
          onPress={handleSearch}
          disabled={isSearching}
        >
          {isSearching ? (
            <ActivityIndicator color="white" />
          ) : (
            <FontAwesome5 name="search" size={18} color="white" />
          )}
        </TouchableOpacity>
      </View>

      {/* 搜索结果列表 */}
      <View>
        {searchResults.map((player) => (
          <TouchableOpacity
            key={player.profile_id}
            className="bg-slate-800 p-4 rounded-xl mb-3 flex-row justify-between items-center"
            onPress={() => handleBind(player)}
          >
            <View>
              <Text className="text-white font-bold text-lg">{player.name}</Text>
              <Text className="text-gray-400 text-sm">ID: {player.profile_id}</Text>
            </View>
            <Text className="text-purple-400 font-bold">绑定</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

function usePlayer(): { bindPlayer: any; } {
  throw new Error('Function not implemented.');
}
