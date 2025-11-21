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
import UpdateService from '../services/updateService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { APP_CONFIG } from '../constants/App';

interface NetworkSpeed {
  gitea?: number;
  gitee: number;
  github: number;
  recommended: 'gitea' | 'gitee' | 'github';
}

interface DownloadUrls {
  gitea?: string;
  gitee?: string;
  github?: string;
  recommended: string;
}

export function SettingsScreen() {
  const [checkingUpdate, setCheckingUpdate] = useState(false);
  const [testingNetwork, setTestingNetwork] = useState(false);
  const [networkSpeed, setNetworkSpeed] = useState<NetworkSpeed | null>(null);
  const [downloadUrls, setDownloadUrls] = useState<DownloadUrls | null>(null);

  const checkForUpdate = async () => {
    setCheckingUpdate(true);
    try {
      const updateInfo = await UpdateService.checkForUpdate();
      
      if (updateInfo.hasUpdate) {
        const sourceMap = {
          'gitea': 'Gitea(私有服务器)',
          'gitee': 'Gitee(码云)',
          'github': 'GitHub'
        };
        Alert.alert(
          '发现新版本 🎉',
          `当前版本：${updateInfo.currentVersion}\n最新版本：${updateInfo.latestVersion}\n来源：${sourceMap[updateInfo.source as keyof typeof sourceMap]}\n\n${updateInfo.releaseNotes || '查看更多详情请访问发布页面'}`,
          [
            { text: '取消', style: 'cancel' },
            { 
              text: '查看多平台下载', 
              onPress: () => getDownloadOptions(),
            },
            {
              text: '立即下载',
              onPress: () => updateInfo.downloadUrl && Linking.openURL(updateInfo.downloadUrl),
            },
          ]
        );
      } else {
        const sourceMap = {
          'gitea': 'Gitea(私有服务器)',
          'gitee': 'Gitee(码云)',
          'github': 'GitHub'
        };
        Alert.alert(
          '已是最新版本 ✨',
          `当前版本：${updateInfo.currentVersion}\n检查来源：${sourceMap[updateInfo.source as keyof typeof sourceMap]}`,
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
      setCheckingUpdate(false);
    }
  };

  const getDownloadOptions = async () => {
    try {
      const urls = await UpdateService.getDownloadUrls();
      setDownloadUrls(urls);
      
      const options = [];
      if (urls.gitea) {
        options.push({
          text: '🏠 Gitea下载 (私有服务器)',
          onPress: () => Linking.openURL(urls.gitea!),
        });
      }
      if (urls.gitee) {
        options.push({
          text: '🚀 Gitee下载 (国内推荐)',
          onPress: () => Linking.openURL(urls.gitee!),
        });
      }
      if (urls.github) {
        options.push({
          text: '🐙 GitHub下载',
          onPress: () => Linking.openURL(urls.github!),
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
      
      const giteaStatus = speed.gitea !== undefined ? (speed.gitea < 9999 ? `${speed.gitea}ms` : '连接失败') : '未配置';
      const giteeStatus = speed.gitee < 9999 ? `${speed.gitee}ms` : '连接失败';
      const githubStatus = speed.github < 9999 ? `${speed.github}ms` : '连接失败';
      
      const recommendationMap = {
        'gitea': 'Gitea(私有服务器)',
        'gitee': 'Gitee(码云)',
        'github': 'GitHub'
      };
      const recommendation = recommendationMap[speed.recommended];
      
      const message = giteaStatus !== '未配置' 
        ? `Gitea连接速度: ${giteaStatus}\nGitee连接速度: ${giteeStatus}\nGitHub连接速度: ${githubStatus}\n\n推荐使用: ${recommendation}`
        : `Gitee连接速度: ${giteeStatus}\nGitHub连接速度: ${githubStatus}\n\n推荐使用: ${recommendation}`;
        
      Alert.alert(
        '网络测试结果',
        message,
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

  const openGitea = () => {
    if (APP_CONFIG.GITEA_URL) {
      const giteaUrl = `${APP_CONFIG.GITEA_URL}/${APP_CONFIG.GITEA_REPO}`;
      Linking.openURL(giteaUrl);
    } else {
      Alert.alert('提示', 'Gitea服务器未配置');
    }
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
          <View>
            <Text className="text-2xl font-bold text-white">设置</Text>
            <Text className="text-white/60">个性化你的体验</Text>
          </View>
        </View>

        {/* 内容 */}
        <ScrollView className="px-6 flex-1" showsVerticalScrollIndicator={false}>
          {/* 应用更新 */}
          <View className="mb-6">
            <Text className="text-white font-semibold text-lg mb-3 px-2">应用更新</Text>
            
            <SettingItem
              icon="download"
              title="检查更新"
              subtitle={`当前版本 ${APP_CONFIG.VERSION}`}
              hasLoading={true}
              isLoading={checkingUpdate}
              onPress={checkForUpdate}
            />

            <SettingItem
              icon="tachometer-alt"
              title="网络测试"
              subtitle={
                networkSpeed 
                  ? `推荐: ${
                      networkSpeed.recommended === 'gitea' ? 'Gitea(私有服务器)' : 
                      networkSpeed.recommended === 'gitee' ? 'Gitee(码云)' : 'GitHub'
                    }${networkSpeed.gitea !== undefined ? `\nGitea: ${networkSpeed.gitea < 9999 ? networkSpeed.gitea + 'ms' : '连接失败'}` : ''}${
                      networkSpeed.gitee < 9999 ? `\nGitee: ${networkSpeed.gitee}ms` : '\nGitee: 连接失败'
                    }${
                      networkSpeed.github < 9999 ? `\nGitHub: ${networkSpeed.github}ms` : '\nGitHub: 连接失败'
                    }`
                  : '测试到各服务器的连接速度'
              }
              hasLoading={true}
              isLoading={testingNetwork}
              onPress={testNetworkSpeed}
            />
          </View>

          {/* 项目链接 */}
          <View className="mb-6">
            <Text className="text-white font-semibold text-lg mb-3 px-2">项目链接</Text>
            
            {APP_CONFIG.GITEA_URL && (
              <SettingItem
                icon="server"
                title="🏠 Gitea仓库"
                subtitle="私有服务器，最新更新首发"
                onPress={openGitea}
              />
            )}

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

 