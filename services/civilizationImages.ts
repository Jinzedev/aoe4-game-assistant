interface CivilizationInfo {
  name: string;
  imageUrl: string;
  color: string;
}

const civilizationMap: { [key: string]: CivilizationInfo } = {
  'abbasid_dynasty': {
    name: '阿拔斯王朝',
    imageUrl: 'https://static.aoe4world.com/assets/flags/abbasid_dynasty-b722e3e4ee862226395c692e73cd14c18bc96c3469874d2e0d918305c70f8a69.png',
    color: '#1a5490'
  },
  'ayyubids': {
    name: '阿尤布王朝',
    imageUrl: 'https://static.aoe4world.com/assets/flags/ayyubids-9ba464806c83e293ac43e19e55dddb80f1fba7b7f5bcb6f7e53b48c4b9c83c9e.png',
    color: '#228b22'
  },
  'byzantine': {
    name: '拜占庭',
    imageUrl: 'https://static.aoe4world.com/assets/flags/byzantines-cfe0492a2ed33b486946a92063989a9500ae54d9301178ee55ba6b4d4c7ceb84.png',
    color: '#800080'
  },
  'byzantines': {
    name: '拜占庭',
    imageUrl: 'https://static.aoe4world.com/assets/flags/byzantines-cfe0492a2ed33b486946a92063989a9500ae54d9301178ee55ba6b4d4c7ceb84.png',
    color: '#800080'
  },
  'chinese': {
    name: '中国',
    imageUrl: 'https://static.aoe4world.com/assets/flags/chinese-2d4edb3d7fc7ab5e1e2df43bd644aba4d63992be5a2110ba3163a4907d0f3d4e.png',
    color: '#c41e3a'
  },
  'delhi_sultanate': {
    name: '德里苏丹国',
    imageUrl: 'https://static.aoe4world.com/assets/flags/delhi_sultanate-7f92025d0623b8e224533d9f28b9cd7c51a5ff416ef3edaf7cc3e948ee290708.png',
    color: '#ff6b35'
  },
  'english': {
    name: '英格兰',
    imageUrl: 'https://static.aoe4world.com/assets/flags/english-8c6c905d0eb11d6d314b9810b2a0b9c09eec69afb38934f55b329df36468daf2.png',
    color: '#c8102e'
  },
  'french': {
    name: '法兰西',
    imageUrl: 'https://static.aoe4world.com/assets/flags/french-c3474adb98d8835fb5a86b3988d6b963a1ac2a8327d136b11fb0fd0537b45594.png',
    color: '#002c84'
  },
  'holy_roman_empire': {
    name: '神圣罗马帝国',
    imageUrl: 'https://static.aoe4world.com/assets/flags/holy_roman_empire-fc0be4151234fc9ac8f83e10c83b4befe79f22f7a8f6ec1ff03745d61adddb4c.png',
    color: '#ffcc02'
  },
  'house_of_lancaster': {
    name: '兰开斯特家族',
    imageUrl: 'https://static.aoe4world.com/assets/flags/house_of_lancaster-4b590484b88bb49e122c8e7933913f35774fd4d2c5e1505fdc93b628da8b6174.png',
    color: '#dc143c'
  },
  'japanese': {
    name: '日本',
    imageUrl: 'https://static.aoe4world.com/assets/flags/japanese-16a9b5bae87a5494d5a002cf7a2c2c5de5cead128a965cbf3a89eeee8292b997.png',
    color: '#dc143c'
  },
  'jeanne_darc': {
    name: '圣女贞德',
    imageUrl: 'https://static.aoe4world.com/assets/flags/jeanne_darc-aeec47c19181d6af7b08a015e8a109853d7169d02494b25208d3581e38d022eb.png',
    color: '#4169e1'
  },
  'knights_templar': {
    name: '圣殿骑士团',
    imageUrl: 'https://static.aoe4world.com/assets/flags/knights_templar-0dc0979a16240ed364b6859ec9aef4cd53f059144ee45b6fd3ea7bfaea209b16.png',
    color: '#ffffff'
  },
  'malians': {
    name: '马里',
    imageUrl: 'https://static.aoe4world.com/assets/flags/malians-edb6f54659da3f9d0c5c51692fd4b0b1619850be429d67dbe9c3a9d53ab17ddd.png',
    color: '#ff8c00'
  },
  'mongols': {
    name: '蒙古',
    imageUrl: 'https://static.aoe4world.com/assets/flags/mongols-7ce0478ab2ca1f95d0d879fecaeb94119629538e951002ac6cb936433c575105.png',
    color: '#8b4513'
  },
  'order_of_the_dragon': {
    name: '龙骑士团',
    imageUrl: 'https://static.aoe4world.com/assets/flags/order_of_the_dragon-cad6fa9212fd59f9b52aaa83b4a6173f07734d38d37200f976bcd46827667424.png',
    color: '#8b0000'
  },
  'ottomans': {
    name: '奥斯曼',
    imageUrl: 'https://static.aoe4world.com/assets/flags/ottomans-83c752dcbe46ad980f6f65dd719b060f8fa2d0707ab8e2ddb1ae5d468fc019a2.png',
    color: '#e30613'
  },
  'rus': {
    name: '罗斯',
    imageUrl: 'https://static.aoe4world.com/assets/flags/rus-cb31fb6f8663187f63136cb2523422a07161c792de27852bdc37f0aa1b74911b.png',
    color: '#ffd700'
  },
  'zhu_xis_legacy': {
    name: '朱熹之学',
    imageUrl: 'https://static.aoe4world.com/assets/flags/zhu_xis_legacy-c4d119a5fc11f2355f41d206a8b65bea8bab2286d09523a81b7d662d1aad0762.png',
    color: '#ff4500'
  }
};

export function getCivilizationInfo(civilization: string): CivilizationInfo {
  const civKey = civilization?.toLowerCase().replace(/\s+/g, '_') || '';
  
  // 尝试多种可能的键名匹配
  let result = civilizationMap[civKey];
  
  if (!result) {
    // 尝试去掉复数 's'
    const singularKey = civKey.endsWith('s') ? civKey.slice(0, -1) : civKey + 's';
    result = civilizationMap[singularKey];
  }
  
  if (!result) {
    // 尝试一些常见的别名
    const aliases: { [key: string]: string } = {
      'byzant': 'byzantine',
      'byzantium': 'byzantine',
      'byz': 'byzantine'
    };
    const aliasKey = aliases[civKey];
    if (aliasKey) {
      result = civilizationMap[aliasKey];
    }
  }
  
  return result || {
    name: civilization || '未知文明',
    imageUrl: '',
    color: '#6b7280'
  };
}

export function getCivilizationImage(civilization: string): string {
  return getCivilizationInfo(civilization).imageUrl;
}

export function getCivilizationColor(civilization: string): string {
  return getCivilizationInfo(civilization).color;
} 