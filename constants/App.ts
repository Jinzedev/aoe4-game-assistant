// 应用配置常量
export const APP_CONFIG = {
  VERSION: '1.0.0', // 与 app.json 和 package.json 保持同步
  GITHUB_REPO: 'your-username/your-repo-name', // 替换为你的GitHub仓库
  GITEE_REPO: 'your-username/your-repo-name', // 替换为你的Gitee仓库
  APP_NAME: 'AOE4游戏助手',
  QQ_GROUP: '741644137',
} as const;

// 版本相关常量
export const VERSION_CONFIG = {
  CURRENT: APP_CONFIG.VERSION,
  CHECK_URL: `https://api.github.com/repos/${APP_CONFIG.GITHUB_REPO}/releases/latest`,
} as const; 