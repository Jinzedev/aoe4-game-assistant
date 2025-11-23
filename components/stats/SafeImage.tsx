import React, { useState } from 'react';
import { View, Image, ImageSourcePropType } from 'react-native';

interface SafeImageProps {
  source: ImageSourcePropType;
  style?: any;
  className?: string;
  resizeMode?: 'cover' | 'contain' | 'stretch' | 'center' | 'repeat';
  fallback?: React.ReactNode;
}

export function SafeImage({ source, style, className, resizeMode, fallback }: SafeImageProps) {
  const [imageError, setImageError] = useState(false);

  if (imageError) {
    return <>{fallback || <View style={style} className={className} />}</>;
  }

  return (
    <Image
      source={source}
      style={style}
      className={className}
      resizeMode={resizeMode}
      onError={() => {
        console.log('图片加载失败');
        setImageError(true);
      }}
    />
  );
}