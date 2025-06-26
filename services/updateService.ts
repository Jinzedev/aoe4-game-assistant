import { APP_CONFIG, VERSION_CONFIG } from '../constants/App';

interface GitHubRelease {
  tag_name: string;
  name: string;
  published_at: string;
  html_url: string;
  body: string;
}

interface GiteeRelease {
  tag_name: string;
  name: string;
  created_at: string;
  html_url: string;
  body: string;
}

interface UpdateInfo {
  hasUpdate: boolean;
  currentVersion: string;
  latestVersion: string;
  downloadUrl?: string;
  releaseNotes?: string;
  source?: 'github' | 'gitee';
}

class UpdateService {
  private static readonly GITHUB_REPO = APP_CONFIG.GITHUB_REPO || 'your-username/your-repo';
  private static readonly GITEE_REPO = APP_CONFIG.GITEE_REPO || 'your-username/your-repo';
  private static readonly CURRENT_VERSION = VERSION_CONFIG.CURRENT;

  /**
   * 检查是否有新版本可用 - 优先使用Gitee，GitHub作为备选
   */
  static async checkForUpdate(): Promise<UpdateInfo> {
    // 优先尝试Gitee（对中国用户更友好）
    try {
      console.log('正在从Gitee检查更新...');
      const giteeResult = await this.checkGiteeUpdate();
      if (giteeResult) {
        return { ...giteeResult, source: 'gitee' };
      }
    } catch (error) {
      console.warn('Gitee检查失败，尝试GitHub:', error);
    }

    // 备选：尝试GitHub
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
   * 从Gitee检查更新
   */
  private static async checkGiteeUpdate(): Promise<UpdateInfo | null> {
    try {
      const response = await fetch(
        `https://gitee.com/api/v5/repos/${this.GITEE_REPO}/releases/latest`
      );

      if (!response.ok) {
        throw new Error(`Gitee API请求失败: ${response.status}`);
      }

      const release: GiteeRelease = await response.json();
      const latestVersion = this.cleanVersion(release.tag_name);
      const currentVersion = this.cleanVersion(this.CURRENT_VERSION);

      const hasUpdate = this.compareVersions(currentVersion, latestVersion) < 0;

      return {
        hasUpdate,
        currentVersion: this.CURRENT_VERSION,
        latestVersion: release.tag_name,
        downloadUrl: release.html_url,
        releaseNotes: release.body,
      };
    } catch (error) {
      console.warn('Gitee更新检查失败:', error);
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

    return {
      hasUpdate,
      currentVersion: this.CURRENT_VERSION,
      latestVersion: release.tag_name,
      downloadUrl: release.html_url,
      releaseNotes: release.body,
    };
  }

  /**
   * 获取下载链接 - 根据用户网络环境智能选择
   */
  static async getDownloadUrls(): Promise<{
    gitee?: string;
    github?: string;
    recommended: string;
  }> {
    const result: any = {
      recommended: '',
    };

    // 尝试获取Gitee下载链接
    try {
      const giteeInfo = await this.checkGiteeUpdate();
      if (giteeInfo?.downloadUrl) {
        result.gitee = giteeInfo.downloadUrl;
        result.recommended = giteeInfo.downloadUrl; // 优先推荐Gitee
      }
    } catch (error) {
      console.warn('获取Gitee下载链接失败:', error);
    }

    // 尝试获取GitHub下载链接
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
   * 测试网络连接速度
   */
  static async testNetworkSpeed(): Promise<{
    gitee: number;
    github: number;
    recommended: 'gitee' | 'github';
  }> {
    const testGitee = async (): Promise<number> => {
      const start = Date.now();
      try {
        await fetch(`https://gitee.com/api/v5/repos/${this.GITEE_REPO}`, {
          method: 'HEAD',
        });
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

    const [giteeTime, githubTime] = await Promise.all([
      testGitee(),
      testGitHub(),
    ]);

    return {
      gitee: giteeTime,
      github: githubTime,
      recommended: giteeTime <= githubTime ? 'gitee' : 'github',
    };
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