import { APP_CONFIG, VERSION_CONFIG } from '../constants/App';

interface GitHubRelease {
  tag_name: string;
  name: string;
  published_at: string;
  html_url: string;
  body: string;
  assets: Array<{
    name: string;
    browser_download_url: string;
    content_type: string;
    size: number;
  }>;
}

interface GiteeRelease {
  tag_name: string;
  name: string;
  created_at: string;
  html_url: string;
  body: string;
  assets: Array<{
    name: string;
    browser_download_url: string;
    content_type?: string;
    size: number;
  }>;
}

interface UpdateInfo {
  hasUpdate: boolean;
  currentVersion: string;
  latestVersion: string;
  downloadUrl?: string;
  releaseNotes?: string;
  source?: 'gitea' | 'github' | 'gitee';
}

class UpdateService {
  private static readonly GITHUB_REPO = APP_CONFIG.GITHUB_REPO || 'your-username/your-repo';
  private static readonly GITEE_REPO = APP_CONFIG.GITEE_REPO || 'your-username/your-repo';
  private static readonly CURRENT_VERSION = VERSION_CONFIG.CURRENT;

  /**
   * 从release assets中查找APK下载链接
   */
  private static findApkDownloadUrl(assets: Array<{name: string; browser_download_url: string}>): string | null {
    // 查找APK文件
    const apkAsset = assets.find(asset => 
      asset.name.toLowerCase().endsWith('.apk') ||
      asset.name.toLowerCase().includes('android') ||
      asset.name.toLowerCase().includes('.apk')
    );
    
    return apkAsset ? apkAsset.browser_download_url : null;
  }

  /**
   * 检查是否有新版本可用 - 优先使用Gitea（自己的服务器），然后Gitee，最后GitHub
   */
  static async checkForUpdate(): Promise<UpdateInfo> {
    // 优先尝试Gitea（自己的服务器，最稳定）
    if (APP_CONFIG.GITEA_URL) {
      try {
        console.log('正在从Gitea检查更新...');
        const giteaResult = await this.checkGiteaUpdate();
        if (giteaResult) {
          return { ...giteaResult, source: 'gitea' };
        }
      } catch (error) {
        console.warn('Gitea检查失败，尝试Gitee:', error);
      }
    }

    // 备选：尝试Gitee（对中国用户更友好）
    try {
      console.log('正在从Gitee检查更新...');
      const giteeResult = await this.checkGiteeUpdate();
      if (giteeResult) {
        return { ...giteeResult, source: 'gitee' };
      }
    } catch (error) {
      console.warn('Gitee检查失败，尝试GitHub:', error);
    }

    // 最后备选：尝试GitHub
    try {
      console.log('正在从GitHub检查更新...');
      const githubResult = await this.checkGitHubUpdate();
      return { ...githubResult, source: 'github' };
    } catch (error) {
      console.error('GitHub检查也失败:', error);
      throw new Error('无法检查更新，请检查网络连接或稍后重试');
    }
  }

  /**
   * 从Gitea检查更新
   */
  private static async checkGiteaUpdate(): Promise<UpdateInfo | null> {
    if (!APP_CONFIG.GITEA_URL) {
      return null;
    }

    try {
      // 创建一个Promise用于超时控制（React Native兼容）
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Request timeout')), 10000);
      });

      // Gitea使用类似GitHub的API格式
      const fetchPromise = fetch(
        `${APP_CONFIG.GITEA_URL}/api/v1/repos/${APP_CONFIG.GITEA_REPO}/releases/latest`,
        {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'AOE4-Game-Assistant'
          }
        }
      );

      // 使用Promise.race实现超时
      const response = await Promise.race([fetchPromise, timeoutPromise]);

      if (!response.ok) {
        // 404可能表示没有release，不是错误
        if (response.status === 404) {
          console.warn('Gitea仓库没有发布版本');
          return null;
        }
        throw new Error(`Gitea API请求失败: ${response.status}`);
      }

      const release: GitHubRelease = await response.json(); // Gitea API兼容GitHub格式
      const latestVersion = this.cleanVersion(release.tag_name);
      const currentVersion = this.cleanVersion(this.CURRENT_VERSION);

      const hasUpdate = this.compareVersions(currentVersion, latestVersion) < 0;

      // 优先使用直接的APK下载链接，如果没有则使用页面链接
      const directDownloadUrl = this.findApkDownloadUrl(release.assets);
      const downloadUrl = directDownloadUrl || release.html_url;

      return {
        hasUpdate,
        currentVersion: this.CURRENT_VERSION,
        latestVersion: release.tag_name,
        downloadUrl,
        releaseNotes: release.body,
      };
    } catch (error) {
      if (error instanceof Error) {
        console.warn('Gitea更新检查失败:', error.message);
      } else {
        console.warn('Gitea更新检查失败:', error);
      }
      return null;
    }
  }

  /**
   * 从Gitee检查更新
   */
  private static async checkGiteeUpdate(): Promise<UpdateInfo | null> {
    try {
      // 创建一个Promise用于超时控制（React Native兼容）
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Request timeout')), 10000);
      });

      // 添加请求头来改善兼容性
      const fetchPromise = fetch(
        `https://gitee.com/api/v5/repos/${this.GITEE_REPO}/releases/latest`,
        {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'AOE4-Game-Assistant'
          }
        }
      );

      // 使用Promise.race实现超时
      const response = await Promise.race([fetchPromise, timeoutPromise]);

      if (!response.ok) {
        // 403错误特殊处理
        if (response.status === 403) {
          console.warn('Gitee API访问被拒绝(403)，可能是权限限制或频率限制');
          return null;
        }
        throw new Error(`Gitee API请求失败: ${response.status}`);
      }

      const release: GiteeRelease = await response.json();
      const latestVersion = this.cleanVersion(release.tag_name);
      const currentVersion = this.cleanVersion(this.CURRENT_VERSION);

      const hasUpdate = this.compareVersions(currentVersion, latestVersion) < 0;

      // 优先使用直接的APK下载链接，如果没有则使用页面链接
      const directDownloadUrl = this.findApkDownloadUrl(release.assets);
      const downloadUrl = directDownloadUrl || release.html_url;

      return {
        hasUpdate,
        currentVersion: this.CURRENT_VERSION,
        latestVersion: release.tag_name,
        downloadUrl,
        releaseNotes: release.body,
      };
    } catch (error) {
      if (error instanceof Error) {
        console.warn('Gitee更新检查失败:', error.message);
      } else {
        console.warn('Gitee更新检查失败:', error);
      }
      return null;
    }
  }

  /**
   * 从GitHub检查更新
   */
  private static async checkGitHubUpdate(): Promise<UpdateInfo> {
    const response = await fetch(
      `https://api.github.com/repos/${this.GITHUB_REPO}/releases/latest`
    );

    if (!response.ok) {
      throw new Error(`GitHub API请求失败: ${response.status}`);
    }

    const release: GitHubRelease = await response.json();
    const latestVersion = this.cleanVersion(release.tag_name);
    const currentVersion = this.cleanVersion(this.CURRENT_VERSION);

    const hasUpdate = this.compareVersions(currentVersion, latestVersion) < 0;

    // 优先使用直接的APK下载链接，如果没有则使用页面链接
    const directDownloadUrl = this.findApkDownloadUrl(release.assets);
    const downloadUrl = directDownloadUrl || release.html_url;

    return {
      hasUpdate,
      currentVersion: this.CURRENT_VERSION,
      latestVersion: release.tag_name,
      downloadUrl,
      releaseNotes: release.body,
    };
  }

  /**
   * 获取直接的APK下载链接
   */
  static async getDirectDownloadUrls(): Promise<{
    gitea?: string;
    gitee?: string;
    github?: string;
    recommended: string;
  }> {
    const result: any = {
      recommended: '',
    };

    // 尝试获取Gitea直接下载链接
    if (APP_CONFIG.GITEA_URL) {
      try {
        const giteaInfo = await this.checkGiteaUpdate();
        if (giteaInfo?.downloadUrl) {
          result.gitea = giteaInfo.downloadUrl;
          result.recommended = giteaInfo.downloadUrl; // 优先推荐Gitea
        }
      } catch (error) {
        console.warn('获取Gitea下载链接失败:', error);
      }
    }

    // 尝试获取Gitee直接下载链接
    try {
      const giteeInfo = await this.checkGiteeUpdate();
      if (giteeInfo?.downloadUrl) {
        result.gitee = giteeInfo.downloadUrl;
        if (!result.recommended) {
          result.recommended = giteeInfo.downloadUrl; // 其次推荐Gitee
        }
      }
    } catch (error) {
      console.warn('获取Gitee下载链接失败:', error);
    }

    // 尝试获取GitHub直接下载链接
    try {
      const githubInfo = await this.checkGitHubUpdate();
      if (githubInfo?.downloadUrl) {
        result.github = githubInfo.downloadUrl;
        if (!result.recommended) {
          result.recommended = githubInfo.downloadUrl;
        }
      }
    } catch (error) {
      console.warn('获取GitHub下载链接失败:', error);
    }

    return result;
  }

  /**
   * 获取下载链接 - 保留原方法以兼容性
   */
  static async getDownloadUrls(): Promise<{
    gitea?: string;
    gitee?: string;
    github?: string;
    recommended: string;
  }> {
    return this.getDirectDownloadUrls();
  }

  /**
   * 测试网络连接速度
   */
  static async testNetworkSpeed(): Promise<{
    gitea?: number;
    gitee: number;
    github: number;
    recommended: 'gitea' | 'gitee' | 'github';
  }> {
    const testGitea = async (): Promise<number | undefined> => {
      if (!APP_CONFIG.GITEA_URL) {
        return undefined;
      }
      
      const start = Date.now();
      try {
        const timeoutPromise = new Promise<never>((_, reject) => {
          setTimeout(() => reject(new Error('Timeout')), 5000);
        });

        const fetchPromise = fetch(`${APP_CONFIG.GITEA_URL}/api/v1/repos/${APP_CONFIG.GITEA_REPO}`, {
          method: 'HEAD',
          headers: {
            'User-Agent': 'AOE4-Game-Assistant'
          }
        });

        await Promise.race([fetchPromise, timeoutPromise]);
        return Date.now() - start;
      } catch {
        return 9999; // 失败时返回很大的值
      }
    };

    const testGitee = async (): Promise<number> => {
      const start = Date.now();
      try {
        // React Native兼容的超时处理
        const timeoutPromise = new Promise<never>((_, reject) => {
          setTimeout(() => reject(new Error('Timeout')), 5000);
        });

        const fetchPromise = fetch(`https://gitee.com/api/v5/repos/${this.GITEE_REPO}`, {
          method: 'HEAD',
          headers: {
            'User-Agent': 'AOE4-Game-Assistant'
          }
        });

        const response = await Promise.race([fetchPromise, timeoutPromise]);
        
        // 即使是403错误，也说明能连接到服务器
        if (response.status === 403) {
          console.warn('Gitee连接正常，但API访问受限(403)');
          return Date.now() - start;
        }
        
        return Date.now() - start;
      } catch {
        return 9999; // 失败时返回很大的值
      }
    };

    const testGitHub = async (): Promise<number> => {
      const start = Date.now();
      try {
        await fetch(`https://api.github.com/repos/${this.GITHUB_REPO}`, {
          method: 'HEAD',
        });
        return Date.now() - start;
      } catch {
        return 9999;
      }
    };

    const [giteaTime, giteeTime, githubTime] = await Promise.all([
      testGitea(),
      testGitee(),
      testGitHub(),
    ]);

    // 确定推荐的源：Gitea > Gitee > GitHub（按速度和优先级）
    let recommended: 'gitea' | 'gitee' | 'github' = 'github';
    let bestTime = githubTime;

    if (giteeTime < bestTime) {
      recommended = 'gitee';
      bestTime = giteeTime;
    }

    if (giteaTime !== undefined && giteaTime < bestTime) {
      recommended = 'gitea';
    }

    const result: any = {
      gitee: giteeTime,
      github: githubTime,
      recommended,
    };

    if (giteaTime !== undefined) {
      result.gitea = giteaTime;
    }

    return result;
  }

  /**
   * 清理版本号，移除 v 前缀
   */
  private static cleanVersion(version: string): string {
    return version.replace(/^v/, '');
  }

  /**
   * 比较版本号
   * @param current 当前版本
   * @param latest 最新版本
   * @returns -1: current < latest, 0: equal, 1: current > latest
   */
  private static compareVersions(current: string, latest: string): number {
    const currentParts = current.split('.').map(Number);
    const latestParts = latest.split('.').map(Number);

    const maxLength = Math.max(currentParts.length, latestParts.length);

    for (let i = 0; i < maxLength; i++) {
      const currentPart = currentParts[i] || 0;
      const latestPart = latestParts[i] || 0;

      if (currentPart < latestPart) return -1;
      if (currentPart > latestPart) return 1;
    }

    return 0;
  }

  /**
   * 从 package.json 读取当前版本
   */
  static getCurrentVersion(): string {
    return this.CURRENT_VERSION;
  }
}

export default UpdateService; 