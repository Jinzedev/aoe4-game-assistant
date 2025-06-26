#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// 颜色输出
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkExpoLogin() {
  try {
    execSync('eas whoami', { stdio: 'pipe' });
    return true;
  } catch {
    return false;
  }
}

function checkAndroidEnvironment() {
  try {
    const androidHome = process.env.ANDROID_HOME || process.env.ANDROID_SDK_ROOT;
    if (!androidHome) return false;
    
    const adbPath = path.join(androidHome, 'platform-tools', 'adb.exe');
    return fs.existsSync(adbPath);
  } catch {
    return false;
  }
}

function buildWithEAS() {
  log('🚀 使用EAS Build构建APK...', 'blue');
  
  if (!checkExpoLogin()) {
    log('❌ 未登录Expo账户，请先运行: eas login', 'red');
    return false;
  }
  
  try {
    log('📦 开始云端构建...', 'blue');
    execSync('eas build --platform android --profile preview', { stdio: 'inherit' });
    log('✅ APK构建完成！', 'green');
    return true;
  } catch (error) {
    log('❌ EAS构建失败', 'red');
    console.error(error.message);
    return false;
  }
}

function buildLocally() {
  log('🔧 本地构建APK...', 'blue');
  
  if (!checkAndroidEnvironment()) {
    log('❌ Android环境未配置，请安装Android Studio并设置ANDROID_HOME', 'red');
    return false;
  }
  
  try {
    log('📱 生成原生代码...', 'blue');
    execSync('expo prebuild --platform android', { stdio: 'inherit' });
    
    log('📦 构建Release APK...', 'blue');
    execSync('expo run:android --variant release', { stdio: 'inherit' });
    
    log('✅ 本地APK构建完成！', 'green');
    return true;
  } catch (error) {
    log('❌ 本地构建失败', 'red');
    console.error(error.message);
    return false;
  }
}

function showBuildOptions() {
  log('📱 AOE4游戏助手 - APK构建工具', 'cyan');
  log('================================', 'cyan');
  log('');
  
  const isExpoLoggedIn = checkExpoLogin();
  const hasAndroidEnv = checkAndroidEnvironment();
  
  log('📊 环境检查:', 'yellow');
  log(`   Expo登录状态: ${isExpoLoggedIn ? '✅ 已登录' : '❌ 未登录'}`, isExpoLoggedIn ? 'green' : 'red');
  log(`   Android环境: ${hasAndroidEnv ? '✅ 已配置' : '❌ 未配置'}`, hasAndroidEnv ? 'green' : 'red');
  log('');
  
  log('🛠️  可用构建选项:', 'yellow');
  
  if (isExpoLoggedIn) {
    log('   1. EAS Build (推荐) - 云端构建，快速稳定', 'green');
  } else {
    log('   1. EAS Build - 需要先登录Expo账户', 'yellow');
    log('      运行命令: eas login', 'blue');
  }
  
  if (hasAndroidEnv) {
    log('   2. 本地构建 - 使用本地Android环境', 'green');
  } else {
    log('   2. 本地构建 - 需要配置Android开发环境', 'yellow');
    log('      安装Android Studio并设置ANDROID_HOME环境变量', 'blue');
  }
  
  log('');
  log('💡 推荐使用EAS Build，更简单快捷！', 'cyan');
}

function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    showBuildOptions();
    return;
  }
  
  const buildType = args[0];
  
  switch (buildType) {
    case 'eas':
    case 'cloud':
      buildWithEAS();
      break;
    case 'local':
      buildLocally();
      break;
    case 'check':
      showBuildOptions();
      break;
    default:
      log('❌ 未知的构建类型', 'red');
      log('使用方法:', 'yellow');
      log('  node build.js eas    # EAS云端构建', 'blue');
      log('  node build.js local  # 本地构建', 'blue');
      log('  node build.js check  # 检查构建环境', 'blue');
  }
}

main(); 