// 应用配置常量
export const APP_CONFIG = {
  VERSION: '1.0.2', // 与 app.json 和 package.json 保持同步
  GITHUB_REPO: 'Jinzedev/aoe4-game-assistant', // GitHub仓库
  GITEE_REPO: 'Jinze_JZ/aoe4-game-assistant', // Gitee仓库
  GITEA_URL: 'http://115.190.16.69:3000', // 您的Gitea服务器地址 - 简化部署
  GITEA_REPO: 'Jinzedev/aoe4-game-assistant', // Gitea仓库名（用户名/仓库名）
  APP_NAME: 'AOE4游戏助手',
  QQ_GROUP: '741644137',
} as const;

// 版本相关常量
export const VERSION_CONFIG = {
  CURRENT: APP_CONFIG.VERSION,
  CHECK_URL: `https://api.github.com/repos/${APP_CONFIG.GITHUB_REPO}/releases/latest`,
} as const; 