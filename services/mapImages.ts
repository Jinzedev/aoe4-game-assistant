// 帝国时代4地图图片映射
export interface MapInfo {
  name: string;
  chineseName: string; // 新增：中文名称
  imageUrl: string | null; // 网络图片URL
  color: string; // 备用颜色
}

// 地图名称到图片的映射，使用AoE4World官方图片
export const mapImages: Record<string, MapInfo> = {
  // 使用官方AoE4World图片
  'Ancient Spires': {
    name: 'Ancient Spires',
    chineseName: '远古尖塔',
    imageUrl: 'https://static.aoe4world.com/assets/maps/ancient_spires-f6d4ed2baecb3e883eed7abbb0bc2d0cd9b0ade0b06052886455f9d903064c45.png',
    color: '#6b7280'
  },
  'Baltic': {
    name: 'Baltic',
    chineseName: '波罗的海',
    imageUrl: 'https://static.aoe4world.com/assets/maps/baltic-8d5630ac2768fa0c0db75d7b6b4bb27c998aadaaef4920612e971b9a2ad0b6d4.png',
    color: '#10b981'
  },
  'Canal': {
    name: 'Canal',
    chineseName: '运河',
    imageUrl: 'https://static.aoe4world.com/assets/maps/canal-11ab0ebadc68ee8903829b57d072ecb42032ab5fde67fcc05e976ab1cbf5a42d.png',
    color: '#00bcd4'
  },
  'Carmel': {
    name: 'Carmel',
    chineseName: '卡梅尔',
    imageUrl: 'https://static.aoe4world.com/assets/maps/carmel-78bdc24e1ccb991db6e122afb6f021ab2ffcfc57e6721aaf65533988dfc79213.png',
    color: '#8bc34a'
  },
  'Cliffside': {
    name: 'Cliffside',
    chineseName: '悬崖边',
    imageUrl: 'https://static.aoe4world.com/assets/maps/cliffside-02b81ebe7ca8aae7124a42ecdae93f236d62b7cae3f751ca0e4c5437d3b70afe.png',
    color: '#6b7280'
  },
  'Danube River': {
    name: 'Danube River',
    chineseName: '多瑙河',
    imageUrl: 'https://static.aoe4world.com/assets/maps/danube_river-fb83fa5ec52e63c87867619e4e010bc4f32717ba99234fbc327a86e4e4d6af9d.png',
    color: '#2563eb'
  },
  'Dry Arabia': {
    name: 'Dry Arabia',
    chineseName: '干燥阿拉伯',
    imageUrl: 'https://static.aoe4world.com/assets/maps/dry_arabia-a38664e3a1140c77c184c56ce6ccc91b83ab9bf9e69f463621bf4acc6e663240.png',
    color: '#dc2626'
  },
  'Enlightened Horizon': {
    name: 'Enlightened Horizon',
    chineseName: '启明地平线',
    imageUrl: 'https://static.aoe4world.com/assets/maps/enlightened_horizon-34781d4de7032a57264b8688301c843f23ecc579603ddc33f516750a25f7654a.png',
    color: '#ff9800'
  },
  'Forest Ponds': {
    name: 'Forest Ponds',
    chineseName: '森林池塘',
    imageUrl: 'https://static.aoe4world.com/assets/maps/forest_ponds-251f78780b3deee83db9becc49ba6a63a8927486ed7c36e0e5ad9685899e5aff.png',
    color: '#2e7d32'
  },
  'Forts': {
    name: 'Forts',
    chineseName: '要塞',
    imageUrl: 'https://static.aoe4world.com/assets/maps/forts-46770b9ab10c2ebb50eafa0678cb53bc9aa169719c325334a3d8de883a48846b.png',
    color: '#795548'
  },
  'Four Lakes': {
    name: 'Four Lakes',
    chineseName: '四个湖',
    imageUrl: 'https://static.aoe4world.com/assets/maps/four_lakes-eb90c0b139243782a53f6ce4fb4227d1f6827e9e00672d11a1879a58fa2737aa.png',
    color: '#0891b2'
  },
  'Glade': {
    name: 'Glade',
    chineseName: '林地',
    imageUrl: 'https://static.aoe4world.com/assets/maps/glade-158cc025ccea142d30020d94e38ef780d99a0f5c307e35439d2a1bc607798075.png',
    color: '#4caf50'
  },
  'Golden Pit': {
    name: 'Golden Pit',
    chineseName: '黄金之坑',
    imageUrl: 'https://static.aoe4world.com/assets/maps/golden_pit-58ea140f24ea6a779ba831592617f59e317b4b3f5e495ecaa2667fc12fd8e7e0.png',
    color: '#ffc107'
  },
  'Gorge': {
    name: 'Gorge',
    chineseName: '峡谷',
    imageUrl: 'https://static.aoe4world.com/assets/maps/gorge-2957c507ddfc9f5dd65204119a742da12c2e29bb6b462537f88dcc624d1a423d.png',
    color: '#92400e'
  },
  'Hidden Valley': {
    name: 'Hidden Valley',
    chineseName: '隐藏谷',
    imageUrl: 'https://static.aoe4world.com/assets/maps/hidden_valley-805beca1bb4e706ca9de9d75f07a8ca031866511f576a5decf70227ba9f6bf29.png',
    color: '#689f38'
  },
  'Hideout': {
    name: 'Hideout',
    chineseName: '藏身处',
    imageUrl: 'https://static.aoe4world.com/assets/maps/hideout-844a7defa35996b750bc7ddd26d0ba0bc3185bc407bfb0f07b3d391982c96471.png',
    color: '#5d4037'
  },
  'High View': {
    name: 'High View',
    chineseName: '高地眺望',
    imageUrl: 'https://static.aoe4world.com/assets/maps/high_view-554e3c206c2ab5de03eff825bae1782c995f43c3d49045c445c37167755dc756.png',
    color: '#374151'
  },
  'Hill and Dale': {
    name: 'Hill and Dale',
    chineseName: '丘陵山谷',
    imageUrl: 'https://static.aoe4world.com/assets/maps/hill_and_dale-786767834511f75ca224324806ade2552c4667e89e57a2153c02fd44684ddee.png',
    color: '#059669'
  },
  'Himeyama': {
    name: 'Himeyama',
    chineseName: '姬山',
    imageUrl: 'https://static.aoe4world.com/assets/maps/himeyama-1365508247f2287fd8dfded1748c36d9a6e2905b9d06171f2f88b9997b1dbc83.png',
    color: '#8b5a3c'
  },
  'King of the Hill': {
    name: 'King of the Hill',
    chineseName: '山丘之王',
    imageUrl: 'https://static.aoe4world.com/assets/maps/king_of_the_hill-17717abfb688a8e8ea05bb4a0799dced0c13a3cfc864fa28fb6bf2d010e77180.png',
    color: '#b45309'
  },
  'Lakeside': {
    name: 'Lakeside',
    chineseName: '湖边',
    imageUrl: 'https://static.aoe4world.com/assets/maps/lakeside-49c8b4267fab0c335d28aeff1d73a868587945d252f02f5ebead9c2fd92c2dbf.png',
    color: '#4a90e2'
  },
  'Land MegaRandom': {
    name: 'Land MegaRandom',
    chineseName: '陆地超级随机',
    imageUrl: 'https://static.aoe4world.com/assets/maps/land_megarandom-1d7b3df69ecd238ae215b6031d92f68659908b4e3f87bdfd85cdd77832c3e5ea.png',
    color: '#795548'
  },
  'Lipany': {
    name: 'Lipany',
    chineseName: '利帕尼',
    imageUrl: 'https://static.aoe4world.com/assets/maps/lipany-d1e494f8fd09007b948dee6ce146402ab57a382ca9c52265f140d668c3ea6b5e.png',
    color: '#7c2d12'
  },
  'Marshland': {
    name: 'Marshland',
    chineseName: '沼泽地',
    imageUrl: 'https://static.aoe4world.com/assets/maps/marshland-0c8daa2bd2ee7458cfa18ebaccee932dfe5f5fc69e7c6ab17b6ebf6d7e913b1f.png',
    color: '#4caf50'
  },
  'Migration': {
    name: 'Migration',
    chineseName: '迁徙',
    imageUrl: 'https://static.aoe4world.com/assets/maps/migration-858695ce51bfcf37e5ca182490587542a139cc2ddfe4d898bc86116039b5109a.png',
    color: '#8bc34a'
  },
  'MegaRandom': {
    name: 'MegaRandom',
    chineseName: '超级随机',
    imageUrl: 'https://static.aoe4world.com/assets/maps/megarandom-164c04761154526a883de15a40c78a6200d89fe178da24ea2a948f8ef3712383.png',
    color: '#9c27b0'
  },
  'Mongolian Heights': {
    name: 'Mongolian Heights',
    chineseName: '蒙古高地',
    imageUrl: 'https://static.aoe4world.com/assets/maps/mongolian_heights-d2e6345c97a7d30d9bcb6349e599833ae70b1b16ea3029c10c986ecda996dc50.png',
    color: '#a16207'
  },
  'Mountain Pass': {
    name: 'Mountain Pass',
    chineseName: '山隘',
    imageUrl: 'https://static.aoe4world.com/assets/maps/mountain_pass-0b69b081bdb9f8df2c302d3ac3b8847a27f49e75631e2d677fa2f3b730d6ef04.png',
    color: '#78716c'
  },
  'Nagari': {
    name: 'Nagari',
    chineseName: '纳加里',
    imageUrl: 'https://static.aoe4world.com/assets/maps/nagari-a89f44d0283a3e6ca61443994d0fbf025c41e362b0c21297bc889efe9bc91889.png',
    color: '#dc2626'
  },
  'Prairie': {
    name: 'Prairie',
    chineseName: '大草原',
    imageUrl: 'https://static.aoe4world.com/assets/maps/prairie-4019a464af9a1ef8ae866ff607cedfa683889afaf2542bf16dd48c3a9295dcb5.png',
    color: '#689f38'
  },
  'Relic River': {
    name: 'Relic River',
    chineseName: '圣物之河',
    imageUrl: 'https://static.aoe4world.com/assets/maps/relic_river-691237e37dc0ab45b9462b29f6661b4540c899baa4601bac41f692cfec889a10.png',
    color: '#795548'
  },
  'Rocky River': {
    name: 'Rocky River',
    chineseName: '岩石河',
    imageUrl: 'https://static.aoe4world.com/assets/maps/rocky_river-b89f84bf6594d401f8c3b3aa2ca4e84bbdd2204047ea84d8d0ee4a46348d6cf2.png',
    color: '#607d8b'
  },
  'Rugged': {
    name: 'Rugged',
    chineseName: '崎岖',
    imageUrl: 'https://static.aoe4world.com/assets/maps/rugged-b1393575c8bcae737ef08569e2b68897d4626bccc07143bbf113cee7dacc59ab.png',
    color: '#8d6e63'
  },
  'Socotra': {
    name: 'Socotra',
    chineseName: '索科特拉',
    imageUrl: 'https://static.aoe4world.com/assets/maps/socotra-6cd38407b889d5f6b03b3504635e858abfb249ef659df1b8d71c8f88e5ff6fb2.png',
    color: '#ff7043'
  },
  'Sunkenlands': {
    name: 'Sunkenlands',
    chineseName: '沉没之地',
    imageUrl: 'https://static.aoe4world.com/assets/maps/sunkenlands-2cb6fccb7a7532991354b7f4145494efdd581671409ec5203239146b6a71e5ba.png',
    color: '#607d8b'
  },
  'Waterholes': {
    name: 'Waterholes',
    chineseName: '水坑',
    imageUrl: 'https://static.aoe4world.com/assets/maps/waterholes-963431442e462e2f4607e3b7c902f8057b31fdc857e4ce60d992b881be46d2e9.png',
    color: '#0ea5e9'
  },
  'Water Lanes': {
    name: 'Water Lanes',
    chineseName: '水道',
    imageUrl: 'https://static.aoe4world.com/assets/maps/waterlanes-278d516946d4496c7b09739a9e3e63360beb87903a5c97c81e197d1cff77d163.png',
    color: '#1976d2'
  },
  'Waterlanes': {
    name: 'Waterlanes',
    chineseName: '水道',
    imageUrl: 'https://static.aoe4world.com/assets/maps/waterlanes-278d516946d4496c7b09739a9e3e63360beb87903a5c97c81e197d1cff77d163.png',
    color: '#1976d2'
  },
  'Water lanes': {
    name: 'Water lanes',
    chineseName: '水道',
    imageUrl: 'https://static.aoe4world.com/assets/maps/waterlanes-278d516946d4496c7b09739a9e3e63360beb87903a5c97c81e197d1cff77d163.png',
    color: '#1976d2'
  },
  // 添加一些常见但可能缺失的地图
  'Arabia': {
    name: 'Arabia',
    chineseName: '阿拉伯',
    imageUrl: null,
    color: '#f59e0b'
  },
  'Black Forest': {
    name: 'Black Forest',
    chineseName: '黑森林',
    imageUrl: null,
    color: '#065f46'
  },
  'Boulder Bay': {
    name: 'Boulder Bay',
    chineseName: '巨石湾',
    imageUrl: 'https://static.aoe4world.com/assets/maps/boulder_bay-11f453b895a76e632a4507e57653e46ca1e6505801b413e3c3f71c20ef6b91f1.png',
    color: '#607d8b'
  },
  'Continental': {
    name: 'Continental',
    chineseName: '大陆',
    imageUrl: 'https://static.aoe4world.com/assets/maps/continental-7454fffd4e627b4db810724073160f1bdd927c0e560c629e31a3274065c46dda.png',
    color: '#8d6e63'
  },
  'Atacama': {
    name: 'Atacama',
    chineseName: '阿塔卡马',
    imageUrl: null,
    color: '#f57c00'
  },
  'Highwoods': {
    name: 'Highwoods',
    chineseName: '高地森林',
    imageUrl: null,
    color: '#2e7d32'
  },
  'Flankwoods': {
    name: 'Flankwoods',
    chineseName: '侧翼森林',
    imageUrl: null,
    color: '#4caf50'
  },
  'Confluence': {
    name: 'Confluence',
    chineseName: '汇流',
    imageUrl: null,
    color: '#42a5f5'
  },
  'French Pass': {
    name: 'French Pass',
    chineseName: '法兰西隘口',
    imageUrl: null,
    color: '#7c3aed'
  },
  'Warring Islands': {
    name: 'Warring Islands',
    chineseName: '战争群岛',
    imageUrl: 'https://static.aoe4world.com/assets/maps/warring_islands-4f4e6f79e416317cce05b106056cc551e6cadce4aece5c5c5ebb24da5bc0b346.png',
    color: '#1976d2'
  },
  'Archipelago': {
    name: 'Archipelago',
    chineseName: '群岛',
    imageUrl: null,
    color: '#3b82f6'
  },
  'Islands': {
    name: 'Islands',
    chineseName: '岛屿',
    imageUrl: null,
    color: '#42a5f5'
  },
  'Wetlands': {
    name: 'Wetlands',
    chineseName: '湿地',
    imageUrl: 'https://static.aoe4world.com/assets/maps/wetlands-d2ccdd59c13238cf9f17fef6b8825bed78cf22cdc8fe8d8d78f985b7b1a1548f.png',
    color: '#4caf50'
  },
  'Wasteland': {
    name: 'Wasteland',
    chineseName: '荒地',
    imageUrl: 'https://static.aoe4world.com/assets/maps/wasteland-35843249b21260d26ae682b58248ee902d5b19e9d1cb5975567b6d0a533dbb4d.png',
    color: '#8d6e63'
  },
  'Volcanic Island': {
    name: 'Volcanic Island',
    chineseName: '火山岛',
    imageUrl: 'https://static.aoe4world.com/assets/maps/volcanic_island-240c6f45fbc22192893176eb672fb88d40ab84ea6ce70ada8ede587add015fe5.png',
    color: '#ff5722'
  },
  'The Pit': {
    name: 'The Pit',
    chineseName: '深坑',
    imageUrl: 'https://static.aoe4world.com/assets/maps/the_pit-767d4fae13574b943729abec3860147a381f60ced9faca5e018e7878be9ff629.png',
    color: '#5d4037'
  },
  // 根据官方截图添加更多地图
  'Forest and Dale': {
    name: 'Forest and Dale',
    chineseName: '森林与池塘',
    imageUrl: null,
    color: '#2e7d32'
  },
  'Golden Heights': {
    name: 'Golden Heights',
    chineseName: '黄金高地',
    imageUrl: null,
    color: '#ffc107'
  },
  'Oasis': {
    name: 'Oasis',
    chineseName: '绿洲',
    imageUrl: null,
    color: '#4caf50'
  },
  'Grasslands': {
    name: 'Grasslands',
    chineseName: '草原',
    imageUrl: null,
    color: '#8bc34a'
  },
  'Steppes': {
    name: 'Steppes',
    chineseName: '荒野外',
    imageUrl: null,
    color: '#689f38'
  },
  'Mountain Clearing': {
    name: 'Mountain Clearing',
    chineseName: '山中空地',
    imageUrl: null,
    color: '#607d8b'
  },
  'Escarpment': {
    name: 'Escarpment',
    chineseName: '峭壁',
    imageUrl: null,
    color: '#795548'
  },
  'Pass': {
    name: 'Pass',
    chineseName: '隘口',
    imageUrl: null,
    color: '#78716c'
  },
  'Green Belt': {
    name: 'Green Belt',
    chineseName: '绿洲',
    imageUrl: null,
    color: '#4caf50'
  },
  'Mountain Valley': {
    name: 'Mountain Valley',
    chineseName: '隐秘山谷',
    imageUrl: null,
    color: '#689f38'
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