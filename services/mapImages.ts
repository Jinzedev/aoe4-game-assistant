// 帝国时代4地图图片映射
export interface MapInfo {
  name: string;
  imageUrl: string | null; // 网络图片URL
  color: string; // 备用颜色
}

// 地图名称到图片的映射，使用AoE4World官方图片
export const mapImages: Record<string, MapInfo> = {
  // 使用官方AoE4World图片
  'Ancient Spires': {
    name: 'Ancient Spires',
    imageUrl: 'https://static.aoe4world.com/assets/maps/ancient_spires-f6d4ed2baecb3e883eed7abbb0bc2d0cd9b0ade0b06052886455f9d903064c45.png',
    color: '#7e57c2'
  },
  'Baltic': {
    name: 'Baltic',
    imageUrl: 'https://static.aoe4world.com/assets/maps/baltic-8d5630ac2768fa0c0db75d7b6b4bb27c998aadaaef4920612e971b9a2ad0b6d4.png',
    color: '#2196f3'
  },
  'Canal': {
    name: 'Canal',
    imageUrl: 'https://static.aoe4world.com/assets/maps/canal-11ab0ebadc68ee8903829b57d072ecb42032ab5fde67fcc05e976ab1cbf5a42d.png',
    color: '#00bcd4'
  },
  'Carmel': {
    name: 'Carmel',
    imageUrl: 'https://static.aoe4world.com/assets/maps/carmel-78bdc24e1ccb991db6e122afb6f021ab2ffcfc57e6721aaf65533988dfc79213.png',
    color: '#8b7355'
  },
  'Cliffside': {
    name: 'Cliffside',
    imageUrl: 'https://static.aoe4world.com/assets/maps/cliffside-02b81ebe7ca8aae7124a42ecdae93f236d62b7cae3f751ca0e4c5437d3b70afe.png',
    color: '#6b7280'
  },
  'Danube River': {
    name: 'Danube River',
    imageUrl: 'https://static.aoe4world.com/assets/maps/danube_river-fb83fa5ec52e63c87867619e4e010bc4f32717ba99234fbc327a86e4e4d6af9d.png',
    color: '#42a5f5'
  },
  'Dry Arabia': {
    name: 'Dry Arabia',
    imageUrl: 'https://static.aoe4world.com/assets/maps/dry_arabia-a38664e3a1140c77c184c56ce6ccc91b83ab9bf9e69f463621bf4acc6e663240.png',
    color: '#d4a574'
  },
  'Enlightened Horizon': {
    name: 'Enlightened Horizon',
    imageUrl: 'https://static.aoe4world.com/assets/maps/enlightened_horizon-34781d4de7032a57264b8688301c843f23ecc579603ddc33f516750a25f7654a.png',
    color: '#ff9800'
  },
  'Forest Ponds': {
    name: 'Forest Ponds',
    imageUrl: 'https://static.aoe4world.com/assets/maps/forest_ponds-251f78780b3deee83db9becc49ba6a63a8927486ed7c36e0e5ad9685899e5aff.png',
    color: '#2e7d32'
  },
  'Forts': {
    name: 'Forts',
    imageUrl: 'https://static.aoe4world.com/assets/maps/forts-46770b9ab10c2ebb50eafa0678cb53bc9aa169719c325334a3d8de883a48846b.png',
    color: '#795548'
  },
  'Four Lakes': {
    name: 'Four Lakes',
    imageUrl: 'https://static.aoe4world.com/assets/maps/four_lakes-eb90c0b139243782a53f6ce4fb4227d1f6827e9e00672d11a1879a58fa2737aa.png',
    color: '#4a90e2'
  },
  'Glade': {
    name: 'Glade',
    imageUrl: 'https://static.aoe4world.com/assets/maps/glade-158cc025ccea142d30020d94e38ef780d99a0f5c307e35439d2a1bc607798075.png',
    color: '#4caf50'
  },
  'Golden Pit': {
    name: 'Golden Pit',
    imageUrl: 'https://static.aoe4world.com/assets/maps/golden_pit-58ea140f24ea6a779ba831592617f59e317b4b3f5e495ecaa2667fc12fd8e7e0.png',
    color: '#ffc107'
  },
  'Gorge': {
    name: 'Gorge',
    imageUrl: 'https://static.aoe4world.com/assets/maps/gorge-2957c507ddfc9f5dd65204119a742da12c2e29bb6b462537f88dcc624d1a423d.png',
    color: '#8bc34a'
  },
  'Hidden Valley': {
    name: 'Hidden Valley',
    imageUrl: 'https://static.aoe4world.com/assets/maps/hidden_valley-805beca1bb4e706ca9de9d75f07a8ca031866511f576a5decf70227ba9f6bf29.png',
    color: '#689f38'
  },
  'Hideout': {
    name: 'Hideout',
    imageUrl: 'https://static.aoe4world.com/assets/maps/hideout-844a7defa35996b750bc7ddd26d0ba0bc3185bc407bfb0f07b3d391982c96471.png',
    color: '#5d4037'
  },
  'High View': {
    name: 'High View',
    imageUrl: 'https://static.aoe4world.com/assets/maps/high_view-554e3c206c2ab5de03eff825bae1782c995f43c3d49045c445c37167755dc756.png',
    color: '#7cb342'
  },
  'Hill and Dale': {
    name: 'Hill and Dale',
    imageUrl: 'https://static.aoe4world.com/assets/maps/hill_and_dale-786767834511f75ca224324806ade2552c4667e89e57a2153c02fd44684ddee.png',
    color: '#7cb342'
  },
  'Himeyama': {
    name: 'Himeyama',
    imageUrl: 'https://static.aoe4world.com/assets/maps/himeyama-1365508247f2287fd8dfded1748c36d9a6e2905b9d06171f2f88b9997b1dbc83.png',
    color: '#8b5a3c'
  },
  'King of the Hill': {
    name: 'King of the Hill',
    imageUrl: 'https://static.aoe4world.com/assets/maps/king_of_the_hill-17717abfb688a8e8ea05bb4a0799dced0c13a3cfc864fa28fb6bf2d010e77180.png',
    color: '#8d6e63'
  },
  'Lakeside': {
    name: 'Lakeside',
    imageUrl: 'https://static.aoe4world.com/assets/maps/lakeside-49c8b4267fab0c335d28aeff1d73a868587945d252f02f5ebead9c2fd92c2dbf.png',
    color: '#4a90e2'
  },
  'Land MegaRandom': {
    name: 'Land MegaRandom',
    imageUrl: 'https://static.aoe4world.com/assets/maps/land_megarandom-1d7b3df69ecd238ae215b6031d92f68659908b4e3f87bdfd85cdd77832c3e5ea.png',
    color: '#795548'
  },
  'Lipany': {
    name: 'Lipany',
    imageUrl: 'https://static.aoe4world.com/assets/maps/lipany-d1e494f8fd09007b948dee6ce146402ab57a382ca9c52265f140d668c3ea6b5e.png',
    color: '#689f38'
  },
  'Marshland': {
    name: 'Marshland',
    imageUrl: 'https://static.aoe4world.com/assets/maps/marshland-0c8daa2bd2ee7458cfa18ebaccee932dfe5f5fc69e7c6ab17b6ebf6d7e913b1f.png',
    color: '#4caf50'
  },
  'Migration': {
    name: 'Migration',
    imageUrl: 'https://static.aoe4world.com/assets/maps/migration-858695ce51bfcf37e5ca182490587542a139cc2ddfe4d898bc86116039b5109a.png',
    color: '#8bc34a'
  },
  'MegaRandom': {
    name: 'MegaRandom',
    imageUrl: 'https://static.aoe4world.com/assets/maps/megarandom-164c04761154526a883de15a40c78a6200d89fe178da24ea2a948f8ef3712383.png',
    color: '#9c27b0'
  },
  'Mongolian Heights': {
    name: 'Mongolian Heights',
    imageUrl: 'https://static.aoe4world.com/assets/maps/mongolian_heights-d2e6345c97a7d30d9bcb6349e599833ae70b1b16ea3029c10c986ecda996dc50.png',
    color: '#795548'
  },
  'Mountain Pass': {
    name: 'Mountain Pass',
    imageUrl: 'https://static.aoe4world.com/assets/maps/mountain_pass-0b69b081bdb9f8df2c302d3ac3b8847a27f49e75631e2d677fa2f3b730d6ef04.png',
    color: '#8d6e63'
  },
  'Nagari': {
    name: 'Nagari',
    imageUrl: 'https://static.aoe4world.com/assets/maps/nagari-a89f44d0283a3e6ca61443994d0fbf025c41e362b0c21297bc889efe9bc91889.png',
    color: '#ff9800'
  },
  'Prairie': {
    name: 'Prairie',
    imageUrl: 'https://static.aoe4world.com/assets/maps/prairie-4019a464af9a1ef8ae866ff607cedfa683889afaf2542bf16dd48c3a9295dcb5.png',
    color: '#689f38'
  },
  'Relic River': {
    name: 'Relic River',
    imageUrl: 'https://static.aoe4world.com/assets/maps/relic_river-691237e37dc0ab45b9462b29f6661b4540c899baa4601bac41f692cfec889a10.png',
    color: '#42a5f5'
  },
  'Rocky River': {
    name: 'Rocky River',
    imageUrl: 'https://static.aoe4world.com/assets/maps/rocky_river-b89f84bf6594d401f8c3b3aa2ca4e84bbdd2204047ea84d8d0ee4a46348d6cf2.png',
    color: '#607d8b'
  },
  'Rugged': {
    name: 'Rugged',
    imageUrl: 'https://static.aoe4world.com/assets/maps/rugged-b1393575c8bcae737ef08569e2b68897d4626bccc07143bbf113cee7dacc59ab.png',
    color: '#8d6e63'
  },
  'Socotra': {
    name: 'Socotra',
    imageUrl: 'https://static.aoe4world.com/assets/maps/socotra-6cd38407b889d5f6b03b3504635e858abfb249ef659df1b8d71c8f88e5ff6fb2.png',
    color: '#ff7043'
  },
  'Sunkenlands': {
    name: 'Sunkenlands',
    imageUrl: 'https://static.aoe4world.com/assets/maps/sunkenlands-2cb6fccb7a7532991354b7f4145494efdd581671409ec5203239146b6a71e5ba.png',
    color: '#607d8b'
  },
  'Waterholes': {
    name: 'Waterholes',
    imageUrl: 'https://static.aoe4world.com/assets/maps/waterholes-963431442e462e2f4607e3b7c902f8057b31fdc857e4ce60d992b881be46d2e9.png',
    color: '#4a90e2'
  },
  'Water Lanes': {
    name: 'Water Lanes',
    imageUrl: 'https://static.aoe4world.com/assets/maps/waterlanes-278d516946d4496c7b09739a9e3e63360beb87903a5c97c81e197d1cff77d163.png',
    color: '#1976d2'
  }
};

// 清理地图名称（移除特殊字符和额外空格）
const normalizeMapName = (name: string): string => {
  return name
    .replace(/[_\-\s]+/g, ' ')    // 将下划线、连字符替换为空格
    .replace(/\s+/g, ' ')         // 合并多个空格
    .trim()
    .toLowerCase();
};

// 获取地图信息的辅助函数
export const getMapInfo = (mapName: string): MapInfo => {
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
  
  // 如果找不到，返回默认值
  return {
    name: mapName,
    imageUrl: null,
    color: '#6b7280'
  };
};

// 检查地图图片是否存在
export const hasMapImage = (mapName: string): boolean => {
  const mapInfo = getMapInfo(mapName);
  return mapInfo.imageUrl !== null;
}; 