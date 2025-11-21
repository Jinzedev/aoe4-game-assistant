// 帝国时代4地图图片映射
export interface MapInfo {
  name: string;
  chineseName: string; // 新增：中文名称
  imageUrl: string | null; // 网络图片URL
  color: string; // 备用颜色
}


const SUPABASE_PREFIX =
  'https://mydjgffyqobzvndmltzm.supabase.co/storage/v1/object/public/aoe4/aoe4_maps/';

export const mapImages: Record<string, MapInfo> = {
  Carmel: {
    name: 'Carmel',
    chineseName: '卡梅尔',
    imageUrl: SUPABASE_PREFIX + 'Carmel_minimap_ageiv.webp',
    color: ''
  },
  Rugged: {
    name: 'Rugged',
    chineseName: '崎岖之地',
    imageUrl: SUPABASE_PREFIX + 'KoCaR_Rugged.webp',
    color: ''
  },
  Waterlanes: {
    name: 'Waterlanes',
    chineseName: '水道',
    imageUrl: SUPABASE_PREFIX + 'KoCaR_Waterlanes.webp',
    color: ''
  },
  'Enlightened Horizon': {
    name: 'Enlightened Horizon',
    chineseName: '启蒙眼界',
    imageUrl: SUPABASE_PREFIX + 'KoCaR_enlightened_horizon.webp',
    color: ''
  },
  Flankwoods: {
    name: 'Flankwoods',
    chineseName: '弗兰克伍兹森林',
    imageUrl: SUPABASE_PREFIX + 'KoCaR_flankwoods.webp',
    color: ''
  },
  Hedgemaze: {
    name: 'Hedgemaze',
    chineseName: '树篱迷宫',
    imageUrl: SUPABASE_PREFIX + 'KoCaR_hedgemaze.webp',
    color: ''
  },
  Highwoods: {
    name: 'Highwoods',
    chineseName: '茂密树林',
    imageUrl: SUPABASE_PREFIX + 'KoCaR_highwoods_KoCaR.webp',
    color: ''
  },
  'Shadow Lake': {
    name: 'Shadow Lake',
    chineseName: '影子湖',
    imageUrl: SUPABASE_PREFIX + 'KoCaR_shadow-lake.webp',
    color: ''
  },
  Wasteland: {
    name: 'Wasteland',
    chineseName: '荒地',
    imageUrl: SUPABASE_PREFIX + 'KoCaR_wasteland.webp',
    color: ''
  },
  Lakeside: {
    name: 'Lakeside',
    chineseName: '湖畔',
    imageUrl: SUPABASE_PREFIX + 'Lakeside_Update.webp',
    color: ''
  },
  Sunkenlands: {
    name: 'Sunkenlands',
    chineseName: '沉没之地',
    imageUrl: SUPABASE_PREFIX + 'Sunkenlands_minimap_ageiv.webp',
    color: ''
  },
  Acropolis: {
    name: 'Acropolis',
    chineseName: '卫城',
    imageUrl: SUPABASE_PREFIX + 'acropolis_icon.jpg',
    color: ''
  },
  'African Waters': {
    name: 'African Waters',
    chineseName: '非洲海域',
    imageUrl: SUPABASE_PREFIX + 'african_waters_icon.jpg',
    color: ''
  },
  Altai: {
    name: 'Altai',
    chineseName: '阿尔泰',
    imageUrl: SUPABASE_PREFIX + 'altai_icon.jpg',
    color: ''
  },
  'Ancient Spires': {
    name: 'Ancient Spires',
    chineseName: '古代尖山',
    imageUrl: SUPABASE_PREFIX + 'ancient_spires_icon.jpg',
    color: ''
  },
  Archipelago: {
    name: 'Archipelago',
    chineseName: '群岛',
    imageUrl: SUPABASE_PREFIX + 'archipelago_icon.jpg',
    color: ''
  },
  Atacama: {
    name: 'Atacama',
    chineseName: '阿塔卡马',
    imageUrl: SUPABASE_PREFIX + 'atacama_icon.jpg',
    color: ''
  },
  'Black Forest': {
    name: 'Black Forest',
    chineseName: '黑森林',
    imageUrl: SUPABASE_PREFIX + 'blackforest_icon.jpg',
    color: ''
  },
  'Boulder Bay': {
    name: 'Boulder Bay',
    chineseName: '巨石湾',
    imageUrl: SUPABASE_PREFIX + 'boulder_bay_icon.jpg',
    color: ''
  },
  Canal: {
    name: 'Canal',
    chineseName: '运河',
    imageUrl: SUPABASE_PREFIX + 'canal.jpg',
    color: ''
  },
  Canyon: {
    name: 'Canyon',
    chineseName: '大峡谷',
    imageUrl: SUPABASE_PREFIX + 'canyon_icon.jpg',
    color: ''
  },
  Channel: {
    name: 'Channel',
    chineseName: '海峡',
    imageUrl: SUPABASE_PREFIX + 'channel_icon.jpg',
    color: ''
  },
  Cliffsanity: {
    name: 'Cliffsanity',
    chineseName: '悬崖疯狂',
    imageUrl: SUPABASE_PREFIX + 'cliffsanity_icon.webp',
    color: ''
  },
  Cliffside: {
    name: 'Cliff Side',
    chineseName: '悬崖边',
    imageUrl: SUPABASE_PREFIX + 'cliffside_icon.jpg',
    color: ''
  },
  Confluence: {
    name: 'Confluence',
    chineseName: '汇流处',
    imageUrl: SUPABASE_PREFIX + 'confluence_icon.jpg',
    color: ''
  },
  Continental: {
    name: 'Continental',
    chineseName: '大陆',
    imageUrl: SUPABASE_PREFIX + 'continental_icon.jpg',
    color: ''
  },
  Craters: {
    name: 'Craters',
    chineseName: '陨石坑',
    imageUrl: SUPABASE_PREFIX + 'craters_icon.webp',
    color: ''
  },
  'Danube River': {
    name: 'Danube River',
    chineseName: '多瑙河',
    imageUrl: SUPABASE_PREFIX + 'danube_river_icon.jpg',
    color: ''
  },
  Dryriver: {
    name: 'Dry River',
    chineseName: '岩石河',
    imageUrl: SUPABASE_PREFIX + 'dry_river.jpg',
    color: ''
  },
  'Dry Arabia': {
    name: 'Dry Arabia',
    chineseName: '干燥阿拉伯',
    imageUrl: SUPABASE_PREFIX + 'dryarabia_icon.jpg',
    color: ''
  },
  Dungeon: {
    name: 'Dungeon',
    chineseName: '地牢',
    imageUrl: SUPABASE_PREFIX + 'dungeon_icon.webp',
    color: ''
  },
  Forestponds: {
    name: 'Forest Ponds',
    chineseName: '森林与池塘',
    imageUrl: SUPABASE_PREFIX + 'forest_ponds_icon.jpg',
    color: ''
  },
  Forts: {
    name: 'Forts',
    chineseName: '堡垒',
    imageUrl: SUPABASE_PREFIX + 'forts_icon.jpg',
    color: ''
  },
  'Four Lakes': {
    name: 'Four Lakes',
    chineseName: '四个湖',
    imageUrl: SUPABASE_PREFIX + 'four_lakes_icon.jpg',
    color: ''
  },
  'French Pass': {
    name: 'French Pass',
    chineseName: '法兰西隘口',
    imageUrl: SUPABASE_PREFIX + 'frenchpass_icon.jpg',
    color: ''
  },
  Glade: {
    name: 'Glade',
    chineseName: '林间空地',
    imageUrl: SUPABASE_PREFIX + 'glade.jpg',
    color: ''
  },
  'Golden Heights': {
    name: 'Golden Heights',
    chineseName: '黄金高地',
    imageUrl: SUPABASE_PREFIX + 'golden_heights_icon.jpg',
    color: ''
  },
  'Golden Pits': {
    name: 'Golden Pits',
    chineseName: '黄金之坑',
    imageUrl: SUPABASE_PREFIX + 'golden_pit_icon.jpg',
    color: ''
  },
  Gorge: {
    name: 'Gorge',
    chineseName: '峡谷',
    imageUrl: SUPABASE_PREFIX + 'gorge_icon.jpg',
    color: ''
  },
  'Haunted Gulch': {
    name: 'Haunted Gulch',
    chineseName: '阴森幽谷',
    imageUrl: SUPABASE_PREFIX + 'haunted_gulch_icon.jpg',
    color: ''
  },
  Haywire: {
    name: 'Haywire',
    chineseName: '失控',
    imageUrl: SUPABASE_PREFIX + 'haywire.jpg',
    color: ''
  },
  'Hidden Valley': {
    name: 'Hidden Valley',
    chineseName: '隐秘山谷',
    imageUrl: SUPABASE_PREFIX + 'hidden_valley_icon.jpg',
    color: ''
  },
  Hideout: {
    name: 'Hideout',
    chineseName: '藏身处',
    imageUrl: SUPABASE_PREFIX + 'hideout_icon.jpg',
    color: ''
  },
  Highland: {
    name: 'Highland',
    chineseName: '灌木丛',
    imageUrl: SUPABASE_PREFIX + 'highland_icon.jpg',
    color: ''
  },
  'High View': {
    name: 'Highview',
    chineseName: '高视野区',
    imageUrl: SUPABASE_PREFIX + 'highview_icon.jpg',
    color: ''
  },
  'Hill and Dale': {
    name: 'Hill and Dale',
    chineseName: '高山深谷',
    imageUrl: SUPABASE_PREFIX + 'hillanddale_icon.jpg',
    color: ''
  },
  Himeyama: {
    name: 'Himeyama',
    chineseName: '姬山',
    imageUrl: SUPABASE_PREFIX + 'himeyama_icon.jpg',
    color: ''
  },
  'King of the Hill': {
    name: 'King of the Hill',
    chineseName: '占山为王',
    imageUrl: SUPABASE_PREFIX + 'king_of_the_hill_icon.jpg',
    color: ''
  },
  Lipany: {
    name: 'Lipany',
    chineseName: '利帕尼',
    imageUrl: SUPABASE_PREFIX + 'lipany_icon.jpg',
    color: ''
  },
  Michi: {
    name: 'Michi',
    chineseName: '开道',
    imageUrl: SUPABASE_PREFIX + 'michi_icon.webp',
    color: ''
  },
  Migration: {
    name: 'Migration',
    chineseName: '迁移',
    imageUrl: SUPABASE_PREFIX + 'migration_icon.jpg',
    color: ''
  },
  'Mongolian Heights': {
    name: 'Mongolian Heights',
    chineseName: '蒙古高原',
    imageUrl: SUPABASE_PREFIX + 'mongolianheights_icon.jpg',
    color: ''
  },
  'Mountain Clearing': {
    name: 'Mountain Clearing',
    chineseName: '山中空地',
    imageUrl: SUPABASE_PREFIX + 'mountain_clearing_icon.jpg',
    color: ''
  },
  'Mountain Lakes': {
    name: 'Mountain Lakes',
    chineseName: '山间湖泊',
    imageUrl: SUPABASE_PREFIX + 'mountain_lakes_KoCaR.webp',
    color: ''
  },
  'Mountain Pass': {
    name: 'Mountain Pass',
    chineseName: '隘口',
    imageUrl: SUPABASE_PREFIX + 'mountainpass_icon.jpg',
    color: ''
  },
  Nagari: {
    name: 'Nagari',
    chineseName: '那格利',
    imageUrl: SUPABASE_PREFIX + 'nagari_icon.jpg',
    color: ''
  },
  Narrows: {
    name: 'Narrows',
    chineseName: '狭窄区域',
    imageUrl: SUPABASE_PREFIX + 'narrows_icon.jpg',
    color: ''
  },
  'Nomadic Ridges': {
    name: 'Nomadic Ridges',
    chineseName: '游牧山脊',
    imageUrl: SUPABASE_PREFIX + 'nomadic_ridges_icon.webp',
    color: ''
  },
  'Nomadic Tarns': {
    name: 'Nomadic Tarns',
    chineseName: '游牧湖群',
    imageUrl: SUPABASE_PREFIX + 'nomadic_tarns_icon.webp',
    color: ''
  },
  Oasis: {
    name: 'Oasis',
    chineseName: '绿洲',
    imageUrl: SUPABASE_PREFIX + 'oasis_icon.jpg',
    color: ''
  },
  'Ocean Gateway': {
    name: 'Ocean Gateway',
    chineseName: '海之门户',
    imageUrl: SUPABASE_PREFIX + 'ocean_gateway_icon.webp',
    color: ''
  },
  Peagee: {
    name: 'Peagee',
    chineseName: '佩艾吉',
    imageUrl: SUPABASE_PREFIX + 'peagee_icon.jpg',
    color: ''
  },
  Pit: {
    name: 'Pit',
    chineseName: '深坑',
    imageUrl: SUPABASE_PREFIX + 'pit_icon.jpg',
    color: ''
  },
  Plains: {
    name: 'Plains',
    chineseName: '平原',
    imageUrl: SUPABASE_PREFIX + 'plains_icon.jpg',
    color: ''
  },
  Ponds: {
    name: 'Ponds',
    chineseName: '湿地',
    imageUrl: SUPABASE_PREFIX + 'ponds_icon.jpg',
    color: ''
  },
  Prairie: {
    name: 'Prairie',
    chineseName: '草原',
    imageUrl: SUPABASE_PREFIX + 'prairie_icon.jpg',
    color: ''
  },
  'Baltic Sea': {
    name: 'Baltic Sea',
    chineseName: '波罗的海',
    imageUrl: SUPABASE_PREFIX + 'qinghai_lake_icon.jpg',
    color: ''
  },
  'Relic River': {
    name: 'Relic River',
    chineseName: '遗迹河',
    imageUrl: SUPABASE_PREFIX + 'relic-river_KoCaR.webp',
    color: ''
  },
  Rhinelands: {
    name: 'Rhinelands',
    chineseName: '莱茵兰',
    imageUrl: SUPABASE_PREFIX + 'rhinelands_icon.jpg',
    color: ''
  },
  'River Kingdom': {
    name: 'River Kingdom',
    chineseName: '河流王国',
    imageUrl: SUPABASE_PREFIX + 'river_kingdom_icon.jpg',
    color: ''
  },
  'Rolling Rivers': {
    name: 'Rolling Rivers',
    chineseName: '奔流',
    imageUrl: SUPABASE_PREFIX + 'rolling_rivers_icon.jpg',
    color: ''
  },
  'Savanna Woodlands': {
    name: 'Savanna Woodlands',
    chineseName: '沼泽地',
    imageUrl: SUPABASE_PREFIX + 'savanna_woodlands_icon.jpg',
    color: ''
  },
  Socotra: {
    name: 'Socotra',
    chineseName: '索科特拉岛',
    imageUrl: SUPABASE_PREFIX + 'socotra_icon.jpg',
    color: ''
  },
  'Turtle Ridge': {
    name: 'Turtle Ridge',
    chineseName: '海龟山脊',
    imageUrl: SUPABASE_PREFIX + 'turtle_ridge_icon.jpg',
    color: ''
  },
  'Volcanic Island': {
    name: 'Volcanic Island',
    chineseName: '火山岛',
    imageUrl: SUPABASE_PREFIX + 'volcanic_island_icon.jpg',
    color: ''
  },
  'Wadden Sea': {
    name: 'Wadden Sea',
    chineseName: '瓦登海',
    imageUrl: SUPABASE_PREFIX + 'wadden_sea_icon.jpg',
    color: ''
  },
  'Warring Islands': {
    name: 'Warring Islands',
    chineseName: '敌对岛屿',
    imageUrl: SUPABASE_PREFIX + 'warring_islands_icon.jpg',
    color: ''
  },
  Waterholes: {
    name: 'Waterholes',
    chineseName: '水洼',
    imageUrl: SUPABASE_PREFIX + 'waterholes_icon.jpg',
    color: ''
  }
};


// 清理地图名称（移除特殊字符和额外空格）
const normalizeMapName = (name: string): string => {
  // 添加空值检查
  if (!name || typeof name !== 'string') {
    return '';
  }
  
  return name
    .replace(/[_\-\s]+/g, ' ')    // 将下划线、连字符替换为空格
    .replace(/\s+/g, ' ')         // 合并多个空格
    .trim()
    .toLowerCase();
};

// 获取地图信息的辅助函数
export const getMapInfo = (mapName: string): MapInfo => {
  // 添加空值检查
  if (!mapName || typeof mapName !== 'string') {
    return {
      name: mapName || '未知地图',
      chineseName: '',
      imageUrl: null,
      color: '#6b7280'
    };
  }
  
  // 尝试精确匹配
  if (mapImages[mapName]) {
    return mapImages[mapName];
  }
  
  // 标准化名称进行匹配
  const normalizedInput = normalizeMapName(mapName);
  
  // 首先尝试精确匹配标准化后的名称
  for (const [key, value] of Object.entries(mapImages)) {
    if (normalizeMapName(key) === normalizedInput) {
      return value;
    }
  }

  // 然后尝试模糊匹配（包含关系）
  for (const [key, value] of Object.entries(mapImages)) {
    const normalizedKey = normalizeMapName(key);
    if (normalizedKey.includes(normalizedInput) || 
        normalizedInput.includes(normalizedKey)) {
      return value;
    }
  }
  
  // 如果找不到，调试日志
  if (__DEV__) {
    console.log(`⚠️ 未找到地图图片: "${mapName}" (标准化: "${normalizedInput}")`);
  }
  
  // 如果找不到，返回默认值
  return {
    name: mapName,
    chineseName: '',
    imageUrl: null,
    color: '#6b7280'
  };
};

// 检查地图图片是否存在
export const hasMapImage = (mapName: string): boolean => {
  const mapInfo = getMapInfo(mapName);
  return mapInfo.imageUrl !== null;
};

// 获取地图的中文名称
export const getChineseMapName = (mapName: string): string => {
  const mapInfo = getMapInfo(mapName);
  return mapInfo.chineseName || mapInfo.name || mapName;
}; 