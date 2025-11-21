import React, { useState } from 'react';
import { View, Image } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

interface PlayerAvatarProps { 
    uri: string; 
    size?: number 
}

// 安全的头像组件
export function PlayerAvatar({ uri, size = 64 }: { uri: string; size?: number }) {
    const [imageError, setImageError] = useState(false);
  
    if (imageError || !uri) {
      return (
        <View 
          className="bg-gray-400 rounded-2xl border-2 border-white/20 flex items-center justify-center"
          style={{ width: size, height: size, borderRadius: size / 4 }}
        >
          <FontAwesome5 name="user" size={size / 2.5} color="#ffffff" />
        </View>
      );
    }
  
    return (
      <Image 
        source={{ uri }}
        className="rounded-2xl border-2 border-white/20"
        style={{ width: size, height: size, borderRadius: size / 4 }}
        onError={() => setImageError(true)}
        defaultSource={require('../assets/aoe4.png')}
      />
    );
  }