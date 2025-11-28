import { Alert, Linking, Platform } from 'react-native';
import * as Updates from 'expo-updates';
import * as Application from 'expo-application';

const GITHUB_REPO = 'Jinzedev/aoe4-game-assistant';
const GITHUB_API_URL = `https://api.github.com/repos/${GITHUB_REPO}/releases/latest`;

/**
 * 比较版本号
 * @param v1 远程版本
 * @param v2 本地版本
 * @returns true if v1 > v2
 */
function isNewerVersion(v1: string, v2: string) {
  const s1 = v1.replace(/^v/, '').split('.').map(Number);
  const s2 = v2.split('.').map(Number);

  for (let i = 0; i < Math.max(s1.length, s2.length); i++) {
    const n1 = s1[i] || 0;
    const n2 = s2[i] || 0;
    if (n1 > n2) return true;
    if (n1 < n2) return false;
  }
  return false;
}

export async function checkExpoUpdate() {
  try {
    // 1. 检查 GitHub Release (整包更新)
    // 注意：GitHub API 有速率限制，生产环境建议加缓存或代理
    const response = await fetch(GITHUB_API_URL);
    if (response.ok) {
      const data = await response.json();
      const latestVersion = data.tag_name; // e.g., "v1.0.5"
      const currentVersion = Application.nativeApplicationVersion || '1.0.0';

      if (latestVersion && isNewerVersion(latestVersion, currentVersion)) {
        Alert.alert(
          '发现新版本 (APK)',
          `检测到新版本 ${latestVersion}，包含新功能或重要修复。\n当前版本: ${currentVersion}`,
          [
            { text: '暂不更新', style: 'cancel' },
            {
              text: '去下载',
              onPress: () => {
                // 优先跳转到 Releases 页面
                const url = data.html_url || `https://github.com/${GITHUB_REPO}/releases`;
                Linking.openURL(url);
              }
            }
          ]
        );
        return; // 如果有整包更新，通常建议优先更新整包，不再检查热更新
      }
    }
  } catch (e) {
    console.log('GitHub update check failed:', e);
    // GitHub 检查失败不阻断 EAS 更新检查
  }

  // 2. 检查 EAS Update (热更新)
  try {
    const update = await Updates.checkForUpdateAsync();
    if (update.isAvailable) {
      Alert.alert(
        '发现新补丁',
        '有新的应用补丁可用（无需重新下载安装包），是否应用？',
        [
          { text: '取消', style: 'cancel' },
          {
            text: '立即更新',
            onPress: async () => {
              try {
                await Updates.fetchUpdateAsync();
                Alert.alert('更新完成', '补丁已下载，即将重启应用生效。', [
                  { text: '重启', onPress: () => Updates.reloadAsync() }
                ]);
              } catch (err) {
                Alert.alert('更新失败', '下载补丁时发生错误');
                console.log(err);
              }
            }
          }
        ]
      );
    } else {
      Alert.alert('已是最新', `当前版本: ${Application.nativeApplicationVersion}\n已是最新版本。`);
    }
  } catch (e: any) {
    Alert.alert('检查失败', '无法连接到更新服务器，请检查网络。');
    console.log(e);
  }
}
