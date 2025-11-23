import { GameSummaryPlayer } from '../types';

// 关键词映射：通过图标路径识别单位类型
const WORKER_KEYWORDS = {
  villager: ['villager', 'peasant', 'official'],
  trader: ['trade_cart', 'trader', 'merchant', 'caravan'],
  fish: ['fishing_boat', 'fishing_ship']
};

export function calculateMaxWorkers(player: GameSummaryPlayer) {
  // 1. 安全获取 buildOrder，避免 TS 报错
  const buildOrder = player.buildOrder;

  if (!buildOrder || !Array.isArray(buildOrder)) {
    return { maxVillagers: 0, maxTraders: 0, maxFishing: 0 };
  }

  // 2. 定义通用的峰值计算函数
  const calculatePeak = (keywords: string[]) => {
    const events: { time: number; change: number }[] = [];

    buildOrder.forEach((item: any) => {
      // 只处理单位类型
      if (item.type !== 'Unit') return;

      const iconPath = item.icon?.toLowerCase() || '';
      const isMatch = keywords.some(k => iconPath.includes(k));

      if (isMatch) {
        // === 兼容性处理核心 ===
        // 优先读取 finished，如果为空则尝试读取 unknown['14'] (常见于商人/渔船)
        let createdTimestamps: number[] = [];
        
        if (item.finished && Array.isArray(item.finished) && item.finished.length > 0) {
          createdTimestamps = item.finished;
        } else if (item.unknown && item.unknown['14'] && Array.isArray(item.unknown['14'])) {
          createdTimestamps = item.unknown['14'];
        }

        // 记录出生事件 (+1)
        createdTimestamps.forEach((t: number) => events.push({ time: t, change: 1 }));

        // 记录死亡事件 (-1)
        if (item.destroyed && Array.isArray(item.destroyed)) {
          item.destroyed.forEach((t: number) => events.push({ time: t, change: -1 }));
        }
      }
    });

    // 3. 按时间排序
    events.sort((a, b) => a.time - b.time);

    // 4. 遍历计算历史最大值
    let current = 0;
    let max = 0;
    
    events.forEach(e => {
      current += e.change;
      if (current > max) max = current;
    });

    return max;
  };

  return {
    maxVillagers: calculatePeak(WORKER_KEYWORDS.villager),
    maxTraders: calculatePeak(WORKER_KEYWORDS.trader),
    maxFishing: calculatePeak(WORKER_KEYWORDS.fish),
  };
}