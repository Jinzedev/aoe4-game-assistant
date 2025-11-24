// utils/expoUpdate.ts
import { Alert } from 'react-native';
import * as Updates from 'expo-updates';

export async function checkExpoUpdate() {
  try {
    const update = await Updates.checkForUpdateAsync();
    if (update.isAvailable) {
      await Updates.fetchUpdateAsync();
      Alert.alert('有新版本', '下载完成，即将重启应用！', [
        { text: '马上重启', onPress: () => Updates.reloadAsync() }
      ]);
    } else {
      Alert.alert('已是最新版', '当前已是最新版本，无需更新。');
    }
  } catch (e) {
    Alert.alert('检查失败', '检查或下载时发生错误');
  }
}
