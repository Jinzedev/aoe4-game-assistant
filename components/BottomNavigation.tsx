import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

interface BottomNavigationProps {
  activeTab: string;
  onTabPress: (tab: string) => void;
}

export function BottomNavigation({ activeTab, onTabPress }: BottomNavigationProps) {
  const tabs = [
    { key: 'home', name: '主页', icon: 'home' },
    { key: 'stats', name: '统计', icon: 'chart-bar' },
    { key: 'search', name: '搜索', icon: 'search' },
    { key: 'settings', name: '设置', icon: 'cog' },
  ];

  return (
    <View className="bg-white/95 border-t border-white/20 px-6 py-4">
      <View className="flex-row justify-around">
        {tabs.map((tab) => (
          <TouchableOpacity 
            key={tab.key}
            onPress={() => onTabPress(tab.key)}
            className="flex-1 items-center py-2"
            activeOpacity={0.7}
          >
            <FontAwesome5 
              name={tab.icon as any} 
              size={20} // 稍微调大一点点，视觉效果更好
              color={activeTab === tab.key ? '#7c3aed' : '#9ca3af'} 
              solid // 👈 关键修改：添加这个属性！
            />
            <Text 
              className={`text-xs mt-1 ${activeTab === tab.key ? 'text-purple-600 font-medium' : 'text-gray-400'}`}
            >
              {tab.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}