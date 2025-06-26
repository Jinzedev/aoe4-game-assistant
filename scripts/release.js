#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 颜色输出
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
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

function updateVersion(newVersion) {
  log('📝 更新版本号...', 'blue');
  
  // 更新 package.json
  const packagePath = path.join(__dirname, '../package.json');
  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  packageJson.version = newVersion;
  fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2) + '\n');
  
  // 更新 app.json
  const appPath = path.join(__dirname, '../app.json');
  const appJson = JSON.parse(fs.readFileSync(appPath, 'utf8'));
  appJson.expo.version = newVersion;
  fs.writeFileSync(appPath, JSON.stringify(appJson, null, 2) + '\n');
  
  // 更新 constants/App.ts
  const appConstantsPath = path.join(__dirname, '../constants/App.ts');
  let appConstants = fs.readFileSync(appConstantsPath, 'utf8');
  appConstants = appConstants.replace(
    /VERSION: '[^']*'/,
    `VERSION: '${newVersion}'`
  );
  fs.writeFileSync(appConstantsPath, appConstants);
  
  log(`✅ 版本号已更新为: ${newVersion}`, 'green');
}

function commitAndPush(version, releaseNotes) {
  log('📤 提交并推送代码...', 'blue');
  
  try {
    execSync('git add .', { stdio: 'inherit' });
    execSync(`git commit -m "🎉 发布版本 v${version}\n\n${releaseNotes}"`, { stdio: 'inherit' });
    execSync('git push origin main', { stdio: 'inherit' });
    execSync('git push gitee main', { stdio: 'inherit' });
    log('✅ 代码推送成功', 'green');
  } catch (error) {
    log('❌ 推送失败:', 'red');
    console.error(error.message);
    process.exit(1);
  }
}

function createGitTag(version) {
  log('🏷️  创建Git标签...', 'blue');
  
  try {
    execSync(`git tag v${version}`, { stdio: 'inherit' });
    execSync(`git push origin v${version}`, { stdio: 'inherit' });
    execSync(`git push gitee v${version}`, { stdio: 'inherit' });
    log(`✅ 标签 v${version} 创建成功`, 'green');
  } catch (error) {
    log('❌ 标签创建失败:', 'red');
    console.error(error.message);
  }
}

function main() {
  log('🚀 AOE4游戏助手 - 版本发布工具', 'cyan');
  log('================================', 'cyan');
  
  // 获取命令行参数
  const args = process.argv.slice(2);
  
  if (args.length < 2) {
    log('使用方法: node release.js <版本号> "<更新说明>"', 'yellow');
    log('例如: node release.js 1.1.0 "新增网络测试功能，优化UI设计"', 'yellow');
    process.exit(1);
  }
  
  const newVersion = args[0];
  const releaseNotes = args[1];
  
  // 验证版本号格式
  if (!/^\d+\.\d+\.\d+$/.test(newVersion)) {
    log('❌ 版本号格式错误，应为 x.y.z 格式', 'red');
    process.exit(1);
  }
  
  log(`📦 准备发布版本: v${newVersion}`, 'magenta');
  log(`📝 更新说明: ${releaseNotes}`, 'magenta');
  log('');
  
  try {
    // 1. 更新版本号
    updateVersion(newVersion);
    
    // 2. 提交并推送
    commitAndPush(newVersion, releaseNotes);
    
    // 3. 创建标签
    createGitTag(newVersion);
    
    log('', 'green');
    log('🎉 版本发布完成！', 'green');
    log('', 'green');
    log('接下来请手动操作:', 'yellow');
    log('1. 访问 GitHub 创建 Release: https://github.com/Jinzedev/aoe4-game-assistant/releases', 'yellow');
    log('2. 访问 Gitee 创建 Release: https://gitee.com/Jinze_JZ/aoe4-game-assistant/releases', 'yellow');
    log('3. 上传构建的APK文件（如果有）', 'yellow');
    
  } catch (error) {
    log('❌ 发布失败:', 'red');
    console.error(error);
    process.exit(1);
  }
}

main(); 