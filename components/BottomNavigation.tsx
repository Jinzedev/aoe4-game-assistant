import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Home, BarChart2, Search, Settings } from 'lucide-react-native';

interface BottomNavigationProps {
  activeTab: string;
  onTabPress: (tab: string) => void;
}

export function BottomNavigation({ activeTab, onTabPress }: BottomNavigationProps) {
  const tabs = [
    { key: 'home', name: '主页', Icon: Home },
    { key: 'stats', name: '统计', Icon: BarChart2 },
    { key: 'search', name: '搜索', Icon: Search },
    { key: 'settings', name: '设置', Icon: Settings },
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
            <tab.Icon
              size={24}
              color={activeTab === tab.key ? '#7c3aed' : '#9ca3af'}
              strokeWidth={activeTab === tab.key ? 2.5 : 2}
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