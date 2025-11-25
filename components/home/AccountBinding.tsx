import  { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert, Image, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { apiService } from '../../services/apiService';
import { usePlayer } from '../../context/PlayerContext'; // 请根据你的项目实际路径调整

export function AccountBinding() {
  const navigation = useNavigation();
  const { bindPlayer } = usePlayer();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showResults, setShowResults] = useState(false);

  // 搜索玩家
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      Alert.alert('提示', '请输入玩家名称');
      return;
    }
    setIsSearching(true);
    try {
      const res = await apiService.searchPlayers({ query: searchQuery.trim(), page: 1 });
      const players = res.players || [];
      setSearchResults(players);
      setShowResults(true);
      if (players.length === 0) {
        Alert.alert('提示', `未找到玩家 "${searchQuery.trim()}"`);
      }
    } catch (error) {
      Alert.alert('错误', '搜索失败，请稍后重试');
    } finally {
      setIsSearching(false);
    }
  };

  // 绑定玩家
  const handleBind = async (player: any) => {
    try {
      await bindPlayer(player);
      Alert.alert('成功', `已绑定玩家: ${player.name}`, [
        { text: '确定', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      Alert.alert('错误', '绑定失败');
    }
  };

  // 返回到主界面
  const handleBack = () => {
    setShowResults(false);
    setSearchResults([]);
  };

  return (
    <LinearGradient colors={['#0f172a', '#581c87', '#0f172a']} style={{ flex: 1 }}>
      {/* 顶部返回/关闭按钮 */}
      <View style={{ paddingTop: 42, paddingHorizontal: 22 }}>
        <TouchableOpacity
          onPress={showResults ? handleBack : () => navigation.goBack()}
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: 'rgba(255,255,255,0.08)',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <FontAwesome5 name={showResults ? "arrow-left" : "times"} size={20} color="white" />
        </TouchableOpacity>
      </View>

      <View style={{ flex: 1, justifyContent: 'center', paddingHorizontal: 22 }}>
        <View style={{
          backgroundColor: 'rgba(255,255,255,0.07)',
          borderRadius: 20,
          borderWidth: 1,
          borderColor: 'rgba(255,255,255,0.16)',
          padding: 20,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.16,
          shadowRadius: 12,
        }}>
          {/* 搜索输入区 */}
          {!showResults && (
            <>
              <View style={{ alignItems: 'center', marginBottom: 18 }}>
                <View style={{
                  width: 60, height: 60, borderRadius: 30,
                  backgroundColor: 'rgba(168,85,247,0.14)',
                  alignItems: 'center', justifyContent: 'center', marginBottom: 6,
                }}>
                  <FontAwesome5 name="user-plus" size={32} color="#a855f7" />
                </View>
                <Text style={{ fontSize: 22, fontWeight: 'bold', color: '#fff', marginBottom: 3 }}>绑定游戏账户</Text>
                <Text style={{
                  color: 'rgba(255,255,255,0.7)',
                  textAlign: 'center',
                  lineHeight: 24,
                }}>
                  请输入你的帝国时代4游戏名称进行绑定{'\n'}绑定后可查看详细数据和战绩
                </Text>
              </View>
              {/* 搜索输入框 */}
              <View style={{ flexDirection: 'row', marginBottom: 18 }}>
                <TextInput
                  style={{
                    flex: 1,
                    backgroundColor: 'rgba(30,27,75,0.8)',
                    color: '#fff',
                    paddingHorizontal: 14,
                    paddingVertical: 12,
                    borderRadius: 14,
                    fontSize: 16,
                    marginRight: 8,
                  }}
                  placeholder="输入玩家名称..."
                  placeholderTextColor="#94a3b8"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  onSubmitEditing={handleSearch}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <TouchableOpacity
                  onPress={handleSearch}
                  disabled={isSearching}
                  style={{
                    backgroundColor: '#7c3aed',
                    borderRadius: 14,
                    width: 48,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {isSearching ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <FontAwesome5 name="search" size={20} color="#fff" />
                  )}
                </TouchableOpacity>
              </View>
            </>
          )}

          {/* 搜索结果区 */}
          {showResults && (
            <ScrollView style={{ maxHeight: 340 }}>
              {searchResults.map(player => (
                <TouchableOpacity
                  key={player.profile_id}
                  style={{
                    backgroundColor: '#1e1b4b',
                    padding: 14,
                    borderRadius: 14,
                    marginBottom: 10,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                  onPress={() => handleBind(player)}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    {player.avatars && player.avatars.small ? (
                      <Image source={{ uri: player.avatars.small }} style={{ width: 36, height: 36, borderRadius: 18, marginRight: 10 }} />
                    ) : (
                      <FontAwesome5 name="user-circle" size={32} color="#8884d9" style={{ marginRight: 8 }} />
                    )}
                    <View>
                      <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 17 }}>{player.name}</Text>
                      <Text style={{ color: '#aaa', fontSize: 12, marginTop: 2 }}>ID: {player.profile_id}</Text>
                    </View>
                  </View>
                  <Text style={{ color: '#a855f7', fontWeight: 'bold', fontSize: 16 }}>绑定</Text>
                </TouchableOpacity>
              ))}
              {searchResults.length === 0 &&
                <Text style={{ color: '#fff', textAlign: 'center', marginTop: 32, fontSize: 16 }}>没有搜索到相关玩家</Text>
              }
            </ScrollView>
          )}

          {/* 提示信息 */}
          {!showResults &&
            <View style={{
              backgroundColor: 'rgba(59,130,246,0.10)',
              borderRadius: 10,
              padding: 10,
              marginTop: 12,
              borderWidth: 1,
              borderColor: 'rgba(96,165,250,0.20)',
              flexDirection: 'row',
              alignItems: 'center',
            }}>
              <FontAwesome5 name="info-circle" size={16} color="#60a5fa" />
              <Text style={{
                color: '#60a5fa',
                marginLeft: 8,
                fontSize: 14,
              }}>
                系统将从 AoE4World 获取你的游戏数据，请输入准确的名称。
              </Text>
            </View>
          }
        </View>
      </View>
    </LinearGradient>
  );
}
