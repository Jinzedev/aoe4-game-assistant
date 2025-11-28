import { Alert, Linking } from 'react-native';
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

/**
 * 检查更新
 */
export async function checkExpoUpdate() {
  try {
    const response = await fetch(GITHUB_API_URL);

    if (response.ok) {
      const data = await response.json();
      const latestVersion = data.tag_name;
      const currentVersion = Application.nativeApplicationVersion || '1.0.4';

      if (latestVersion && isNewerVersion(latestVersion, currentVersion)) {
        Alert.alert(
          '发现新版本',
          `检测到新版本 ${latestVersion}，请下载安装。\n当前版本: ${currentVersion}`,
          [
            { text: '暂不更新', style: 'cancel' },
            {
              text: '去下载',
              onPress: () => {
                const url = data.html_url || `https://github.com/${GITHUB_REPO}/releases`;
                Linking.openURL(url);
              }
            }
          ]
        );
      } else {
        Alert.alert('已是最新', `当前版本: ${currentVersion}\n已是最新版本。`);
      }
    } else if (response.status === 404) {
      // 404 表示没有 Release，视为最新版
      const currentVersion = Application.nativeApplicationVersion || '1.0.0';
      Alert.alert('已是最新', `当前版本: ${currentVersion}\n暂无新版本发布。`);
    } else {
      throw new Error(`GitHub API returned ${response.status}`);
    }
  } catch (e: any) {
    Alert.alert('检查失败', `无法连接到更新服务器。\n错误信息: ${e?.message}`);
    console.log('GitHub update check failed:', e);
  }
}
