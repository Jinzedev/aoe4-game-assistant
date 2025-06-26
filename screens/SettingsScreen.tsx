import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ScrollView,
  Switch,
  Linking,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome5 } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import UpdateService from '../services/updateService';
import { APP_CONFIG } from '../constants/App';

interface NetworkSpeed {
  gitee: number;
  github: number;
  recommended: 'gitee' | 'github';
}

interface DownloadUrls {
  gitee?: string;
  github?: string;
  recommended: string;
}

export function SettingsScreen() {
  const [isCheckingUpdate, setIsCheckingUpdate] = useState(false);
  const [autoCheckEnabled, setAutoCheckEnabled] = useState(false);
  const [testingNetwork, setTestingNetwork] = useState(false);
  const [networkSpeed, setNetworkSpeed] = useState<NetworkSpeed | null>(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const autoCheck = await AsyncStorage.getItem('autoUpdateEnabled');
    setAutoCheckEnabled(autoCheck === 'true');
  };

  const saveAutoCheckSetting = async (value: boolean) => {
    await AsyncStorage.setItem('autoUpdateEnabled', value.toString());
    setAutoCheckEnabled(value);
  };

  const checkForUpdate = async () => {
    setIsCheckingUpdate(true);
    try {
      const updateInfo = await UpdateService.checkForUpdate();
      
      if (updateInfo.hasUpdate) {
        Alert.alert(
          '发现新版本 🎉',
          `当前版本: ${updateInfo.currentVersion}\n最新版本: ${updateInfo.latestVersion}\n\n${updateInfo.releaseNotes || ''}`,
          [
            { text: '暂不更新', style: 'cancel' },
            {
              text: '下载更新',
              onPress: () => getDownloadOptions()
            }
          ]
        );
      } else {
        Alert.alert(
          '已是最新版本 ✅',
          `当前版本: ${updateInfo.currentVersion}\n没有可用的更新`,
          [{ text: '确定' }]
        );
      }
    } catch (error) {
      Alert.alert(
        '检查更新失败',
        error instanceof Error ? error.message : '未知错误',
        [{ text: '确定' }]
      );
    } finally {
      setIsCheckingUpdate(false);
    }
  };

  const getDownloadOptions = async () => {
    try {
      const urls = await UpdateService.getDownloadUrls();
      
      const options = [];
      if (urls.gitee) {
        const isGiteeAPK = urls.gitee.endsWith('.apk');
        options.push({
          text: `🌟 Gitee(码云)${isGiteeAPK ? ' - 推荐' : ''}`,
          onPress: () => {
            if (isGiteeAPK) {
              // APK直链，在浏览器中下载，文件名会自动设置
              console.log('打开Gitee下载链接:', urls.gitee);
              Linking.openURL(urls.gitee!).catch(error => {
                console.error('打开Gitee链接失败:', error);
                Alert.alert('打开失败', '无法打开Gitee链接');
              });
            } else {
              // Release页面，直接跳转
              console.log('打开Gitee下载链接:', urls.gitee);
              Linking.openURL(urls.gitee!).catch(error => {
                console.error('打开Gitee链接失败:', error);
                Alert.alert('打开失败', '无法打开Gitee链接');
              });
            }
          },
        });
      }
      if (urls.github) {
        const isGitHubAPK = urls.github.endsWith('.apk');
        options.push({
          text: `🐙 GitHub${isGitHubAPK ? '' : '(Release页面)'}`,
          onPress: () => {
            if (isGitHubAPK) {
              // APK直链，在浏览器中下载
              console.log('打开GitHub下载链接:', urls.github);
              Linking.openURL(urls.github!).catch(error => {
                console.error('打开GitHub链接失败:', error);
                Alert.alert('打开失败', '无法打开GitHub链接');
              });
            } else {
              // Release页面，直接跳转
              console.log('打开GitHub下载链接:', urls.github);
              Linking.openURL(urls.github!).catch(error => {
                console.error('打开GitHub链接失败:', error);
                Alert.alert('打开失败', '无法打开GitHub链接');
              });
            }
          },
        });
      }
      options.push({ text: '取消', style: 'cancel' as const });

      Alert.alert(
        '选择下载源',
        '请选择最适合您网络环境的下载源：',
        options
      );
    } catch (error) {
      Alert.alert('获取下载链接失败', '请稍后重试');
    }
  };

  const testNetworkSpeed = async () => {
    setTestingNetwork(true);
    try {
      const speed = await UpdateService.testNetworkSpeed();
      setNetworkSpeed(speed);
      
      const giteeStatus = speed.gitee < 9999 ? `${speed.gitee}ms` : '连接失败';
      const githubStatus = speed.github < 9999 ? `${speed.github}ms` : '连接失败';
      const recommendation = speed.recommended === 'gitee' ? 'Gitee(码云)' : 'GitHub';
      
      Alert.alert(
        '网络测试结果',
        `Gitee连接速度: ${giteeStatus}\nGitHub连接速度: ${githubStatus}\n\n推荐使用: ${recommendation}`,
        [{ text: '确定' }]
      );
    } catch (error) {
      Alert.alert('网络测试失败', '请检查网络连接');
    } finally {
      setTestingNetwork(false);
    }
  };

  const openQQGroup = () => {
    const qqUrl = `mqqopensdkapi://bizAgent/qm/qr?url=http://qm.qq.com/cgi-bin/qm/qr?from=app&p=android&jump_from=webapi&k=${APP_CONFIG.QQ_GROUP}`;
    Linking.openURL(qqUrl).catch(() => {
      Alert.alert(
        'QQ群',
        `群号：${APP_CONFIG.QQ_GROUP}\n\n请手动添加或复制群号到QQ中搜索`,
        [{ text: '确定' }]
      );
    });
  };

  const openGitHub = () => {
    const githubUrl = `https://github.com/${APP_CONFIG.GITHUB_REPO}`;
    Linking.openURL(githubUrl);
  };

  const openGitee = () => {
    const giteeUrl = `https://gitee.com/${APP_CONFIG.GITEE_REPO}`;
    Linking.openURL(giteeUrl);
  };

  const SettingItem = ({ 
    icon, 
    title, 
    subtitle, 
    hasSwitch = false,
    switchValue = false,
    onSwitchChange,
    hasLoading = false,
    isLoading = false,
    hasArrow = true,
    onPress
  }: {
    icon: string;
    title: string;
    subtitle?: string;
    hasSwitch?: boolean;
    switchValue?: boolean;
    onSwitchChange?: (value: boolean) => void;
    hasLoading?: boolean;
    isLoading?: boolean;
    hasArrow?: boolean;
    onPress?: () => void;
  }) => (
    <TouchableOpacity 
      className="bg-white/95 rounded-2xl p-4 mb-3 flex-row items-center justify-between"
      onPress={onPress}
      activeOpacity={0.7}
      disabled={!onPress || isLoading}
    >
      <View className="flex-row items-center flex-1">
        <View className="bg-purple-100 rounded-xl p-3 mr-4">
          <FontAwesome5 name={icon as any} size={16} color="#7c3aed" />
        </View>
        <View className="flex-1">
          <Text className="text-gray-800 font-semibold text-base">{title}</Text>
          {subtitle && (
            <Text className="text-gray-500 text-sm mt-1">{subtitle}</Text>
          )}
        </View>
      </View>
      <View className="flex-row items-center">
        {hasSwitch && onSwitchChange ? (
          <Switch
            value={switchValue}
            onValueChange={onSwitchChange}
            trackColor={{ false: '#767577', true: '#7c3aed' }}
            thumbColor={switchValue ? '#fff' : '#f4f3f4'}
          />
        ) : hasLoading && isLoading ? (
          <ActivityIndicator size="small" color="#7c3aed" />
        ) : hasArrow && onPress ? (
          <FontAwesome5 name="chevron-right" size={12} color="#9ca3af" />
        ) : null}
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-slate-900">
      <LinearGradient
        colors={['#0f172a', '#581c87', '#0f172a']}
        className="flex-1"
      >
        {/* 头部 */}
        <View className="px-6 pb-4 pt-10">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-2xl font-bold text-white">设置</Text>
              <Text className="text-white/60">个性化你的体验</Text>
            </View>
            <View className="bg-white/10 rounded-2xl p-3">
              <FontAwesome5 name="cog" size={18} color="white" />
            </View>
          </View>
        </View>

        {/* 内容 */}
        <ScrollView className="px-6 flex-1" showsVerticalScrollIndicator={false}>
          {/* 应用更新 */}
          <View className="mb-6">
            <Text className="text-white font-semibold text-lg mb-3 px-2">应用更新</Text>
            
            <SettingItem
              icon="toggle-on"
              title="自动检查更新"
              subtitle="启动时自动检查新版本"
              hasSwitch={true}
              switchValue={autoCheckEnabled}
              onSwitchChange={saveAutoCheckSetting}
              hasArrow={false}
            />

            <SettingItem
              icon="download"
              title="检查更新"
              subtitle={`当前版本 ${APP_CONFIG.VERSION}`}
              hasLoading={true}
              isLoading={isCheckingUpdate}
              onPress={checkForUpdate}
            />

            <SettingItem
              icon="tachometer-alt"
              title="网络测试"
              subtitle={
                `测试到Gitee和GitHub的连接速度${
                  networkSpeed ? `\n推荐: ${networkSpeed.recommended === 'gitee' ? 'Gitee' : 'GitHub'}` : ''
                }`
              }
              hasLoading={true}
              isLoading={testingNetwork}
              onPress={testNetworkSpeed}
            />
          </View>

          {/* 项目链接 */}
          <View className="mb-6">
            <Text className="text-white font-semibold text-lg mb-3 px-2">项目链接</Text>
            
            <SettingItem
              icon="rocket"
              title="🚀 Gitee仓库"
              subtitle="适合中国大陆用户访问"
              onPress={openGitee}
            />

            <SettingItem
              icon="github"
              title="🐙 GitHub仓库"
              subtitle="国际主流代码托管平台"
              onPress={openGitHub}
            />
          </View>

          {/* 联系我们 */}
          <View className="mb-6">
            <Text className="text-white font-semibold text-lg mb-3 px-2">联系我们</Text>
            
            <SettingItem
              icon="comments"
              title="QQ交流群"
              subtitle={`群号：${APP_CONFIG.QQ_GROUP}`}
              onPress={openQQGroup}
            />

            <SettingItem
              icon="heart"
              title="感谢支持"
              subtitle="感谢你使用我们的应用 ❤️"
              hasArrow={false}
            />
          </View>

          {/* 底部空间 */}
          <View className="h-20" />
        </ScrollView>
      </LinearGradient>
    </View>
  );
}

 