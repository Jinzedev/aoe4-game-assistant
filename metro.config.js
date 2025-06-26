const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

// 添加对ICO文件的支持
config.resolver.assetExts.push('ico');

module.exports = withNativeWind(config, { input: './global.css' });
