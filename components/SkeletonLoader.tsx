import { View } from "react-native";
// 🦴 骨架屏组件
export function SkeletonLoader() {
    return (
      <View className="animate-pulse">
        <View className="flex-row items-center space-x-4 mb-6">
          <View className="w-16 h-16 bg-white/10 rounded-2xl" />
          <View className="flex-1">
            <View className="h-5 bg-white/10 rounded-lg mb-2 w-32" />
            <View className="h-4 bg-white/10 rounded-lg w-24" />
          </View>
        </View>
        <View className="flex-row space-x-2">
          <View className="flex-1 bg-white/10 rounded-2xl p-4 h-24" />
          <View className="flex-1 bg-white/10 rounded-2xl p-4 h-24" />
          <View className="flex-1 bg-white/10 rounded-2xl p-4 h-24" />
        </View>
      </View>
    );
  }