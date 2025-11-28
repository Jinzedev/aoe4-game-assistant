import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import { LucideIcon } from 'lucide-react-native';

interface FilterPillProps {
  label: string;
  value: string;
  Icon?: LucideIcon;
  color?: string;
  // 必须传入一个函数来处理选择逻辑，而不是直接在这里定义 state 变化
  onSelect: (value: string) => void;
  isSelected: boolean; // 用于控制样式
}

export function FilterPill({ label, value, Icon, color, onSelect, isSelected }: FilterPillProps) {
  const activeBg = 'bg-purple-600';
  const inactiveBg = 'bg-slate-100';
  const activeText = 'text-white';
  const inactiveText = 'text-slate-500';
  const iconColor = isSelected ? '#fff' : (color || '#64748b');

  return (
    <TouchableOpacity
      onPress={() => onSelect(value)} // 触发外部传入的事件
      className={`px-4 py-2 rounded-full mr-2 flex-row items-center shadow-sm ${isSelected ? activeBg : inactiveBg}`}
    >
      {Icon && (
        <Icon size={12} color={iconColor} style={{ marginRight: 6 }} />
      )}
      <Text className={`text-xs font-bold ${isSelected ? activeText : inactiveText}`}>{label}</Text>
    </TouchableOpacity>
  );
}