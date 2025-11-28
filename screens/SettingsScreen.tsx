import { View, Text, TouchableOpacity, Linking, Alert, Platform } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { PaintRoller, Hash, MessageCircle } from 'lucide-react-native';
import { BlurView } from 'expo-blur';
import { APP_CONFIG } from '../constants/App';
import { checkExpoUpdate } from '../utils/expoUpdate';

export function SettingsScreen() {
  // 支持网页复制与原生提示
  const handleCopy = (text: string) => {
    if (Platform.OS === 'web' && navigator?.clipboard) {
      navigator.clipboard.writeText(text);
      Alert.alert('已复制', '群号已复制到剪贴板，请打开QQ搜索加入。');
    } else {
      Alert.alert('请手动复制', `群号：${text}\n请手动长按群号并复制。`);
    }
  };

  const handleJoinQQ = () => {
    const qqUrl = `mqqopensdkapi://bizAgent/qm/qr?url=http://qm.qq.com/cgi-bin/qm/qr?from=app&p=android&jump_from=webapi&k=${APP_CONFIG.QQ_GROUP}`;

    Linking.openURL(qqUrl).catch(() => {
      Alert.alert('无法直接跳转', `未检测到QQ或跳转失败。\n群号：${APP_CONFIG.QQ_GROUP}`, [
        { text: '取消', style: 'cancel' },
        {
          text: '复制群号',
          onPress: () => handleCopy(APP_CONFIG.QQ_GROUP),
        },
      ]);
    });
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: '#0f172a' }} edges={['top', 'bottom']}>
        <View className="flex-1 bg-slate-900">
          <LinearGradient colors={['#0f172a', '#3b0764', '#0f172a']} className="flex-1">
            <View className="px-6 pb-8 pt-14">
              <Text className="text-3xl font-extrabold tracking-wider text-white">设置</Text>
            </View>

            <View className="-mt-20 flex-1 justify-center px-6">
              <View
                className="rounded-3xl px-2 py-2 shadow-2xl shadow-purple-500/40"
                style={{
                  shadowColor: '#c084fc',
                  shadowOffset: { width: 0, height: 12 },
                  shadowOpacity: 0.36,
                  shadowRadius: 28,
                }}>
                <BlurView intensity={28} tint="dark" style={{ borderRadius: 24 }}>
                  <LinearGradient
                    colors={['#342452f0', '#191227e8']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    className="overflow-hidden rounded-3xl border border-white/10">
                    {/* 上半部分 */}
                    <View className="items-center p-8">
                      <View className="mb-8 h-24 w-24 items-center justify-center rounded-full bg-purple-700/30 ring-8 ring-purple-600/30">
                        <PaintRoller size={40} color="#c084fc" />
                      </View>
                      <Text className="mb-2 text-2xl font-extrabold tracking-wide text-white">
                        功能施工中
                      </Text>
                      <Text className="mb-4 text-center text-base leading-6 text-gray-400">
                        此区域正在等待建议！{'\n'}如需反馈 BUG 或催更，请加入内测群。
                      </Text>
                    </View>

                    {/* 虚线撕票区 */}
                    <View className="mb-4 flex-row items-center justify-between overflow-hidden px-2">
                      <View className="h-6 w-6 rounded-full bg-[#191227]" />
                      <View
                        className="mx-2 h-0.5 flex-1"
                        style={{
                          borderStyle: 'dashed',
                          borderColor: '#a855f7',
                          borderWidth: 1,
                          opacity: 0.7,
                        }}
                      />
                      <View className="h-6 w-6 rounded-full bg-[#191227]" />
                    </View>

                    {/* 行动区 */}
                    <View className="rounded-b-3xl bg-slate-900/70 p-6">
                      <View className="mb-6 flex-row items-center justify-between rounded-xl border border-purple-500/20 bg-black/40 p-4">
                        {/* 群号数字支持点击复制 */}
                        <TouchableOpacity
                          onPress={() => handleCopy(APP_CONFIG.QQ_GROUP)}
                          activeOpacity={0.7}>
                          <Text className="mb-1 text-xs uppercase tracking-widest text-purple-300">
                            官方群号
                          </Text>
                          <Text
                            className="text-3xl font-extrabold text-purple-300"
                            style={{ letterSpacing: 2 }}>
                            {APP_CONFIG.QQ_GROUP}
                          </Text>
                          <Text className="mt-1 text-xs text-gray-400">点击数字复制</Text>
                        </TouchableOpacity>
                        <View className="h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10">
                          <Hash size={18} color="#c084fc" />
                        </View>
                      </View>

                      <TouchableOpacity
                        onPress={handleJoinQQ}
                        activeOpacity={0.9}
                        style={{
                          shadowColor: '#a855f7',
                          shadowOpacity: 0.16,
                          shadowOffset: { width: 0, height: 12 },
                          shadowRadius: 14,
                          transform: [{ scale: 1 }],
                        }}>
                        <LinearGradient
                          colors={['#a855f7', '#7c3aed']}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 0 }}
                          className="flex-row items-center justify-center rounded-xl py-4">
                          <MessageCircle size={22} color="white" />
                          <Text className="ml-3 text-lg font-bold text-white">立即加入</Text>
                        </LinearGradient>
                      </TouchableOpacity>
                    </View>
                  </LinearGradient>
                </BlurView>
              </View>
            </View>
          </LinearGradient>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
