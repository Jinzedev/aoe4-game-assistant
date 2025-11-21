interface CivilizationInfo {
  name: string;
  imageUrl: string;
  color: string;
}

const SUPABASE_CIV_BASE_URL = 'https://mydjgffyqobzvndmltzm.supabase.co/storage/v1/object/public/aoe4/aoe4_civs/';

const civilizationMap: { [key: string]: CivilizationInfo } = {
  'abbasid_dynasty': {
    name: '黑衣大食王朝',
    imageUrl: `${SUPABASE_CIV_BASE_URL}Abbasid-Dynasty.webp`,
    color: '#1a5490'
  },
  'ayyubids': {
    name: '阿尤布',
    imageUrl: `${SUPABASE_CIV_BASE_URL}Ayyubids.webp`,
    color: '#228b22'
  },
  'byzantine': {
    name: '拜占庭',
    imageUrl: `${SUPABASE_CIV_BASE_URL}Byzantines.webp`,
    color: '#800080'
  },
  'byzantines': {
    name: '拜占庭',
    imageUrl: `${SUPABASE_CIV_BASE_URL}Byzantines.webp`,
    color: '#800080'
  },
  'chinese': {
    name: '中国',
    imageUrl: `${SUPABASE_CIV_BASE_URL}Chinese.webp`,
    color: '#c41e3a'
  },
  'delhi_sultanate': {
    name: '德里苏丹国',
    imageUrl: `${SUPABASE_CIV_BASE_URL}Delhi-Sultanate.webp`,
    color: '#ff6b35'
  },
  'english': {
    name: '英格兰',
    imageUrl: `${SUPABASE_CIV_BASE_URL}English.webp`,
    color: '#c8102e'
  },
  'french': {
    name: '法兰西',
    imageUrl: `${SUPABASE_CIV_BASE_URL}French.webp`,
    color: '#002c84'
  },
  'holy_roman_empire': {
    name: '神圣罗马帝国',
    imageUrl: `${SUPABASE_CIV_BASE_URL}Holy-Roman-Empire.webp`,
    color: '#ffcc02'
  },
  'house_of_lancaster': {
    name: '兰开斯特王朝',
    imageUrl: `${SUPABASE_CIV_BASE_URL}House-of-Lancaster.webp`,
    color: '#dc143c'
  },
  'japanese': {
    name: '日本',
    imageUrl: `${SUPABASE_CIV_BASE_URL}Japanese.webp`,
    color: '#dc143c'
  },
  'jeanne_darc': {
    name: '圣女贞德',
    imageUrl: `${SUPABASE_CIV_BASE_URL}Jeanne-d%27Arc.webp`,
    color: '#4169e1'
  },
  'knights_templar': {
    name: '圣殿骑士团',
    imageUrl: `${SUPABASE_CIV_BASE_URL}Knights-Templar.webp`,
    color: '#ffffff'
  },
  'malians': {
    name: '马里',
    imageUrl: `${SUPABASE_CIV_BASE_URL}Malians.webp`,
    color: '#ff8c00'
  },
  'golden_horde': {
    name: '金帐汗国',
    imageUrl: `${SUPABASE_CIV_BASE_URL}Golden-Horde.webp`,
    color: '#d4af37'
  },
  'sengoku_daimyo': {
    name: '战国大名',
    imageUrl: `${SUPABASE_CIV_BASE_URL}Sengoku-Daimyo.webp`,
    color: '#7c0a02'
  },
  'macedonian_dynasty': {
    name: '马其顿王朝',
    imageUrl: `${SUPABASE_CIV_BASE_URL}Macedonian-Dynasty.webp`,
    color: '#1c3faa'
  },
  'tughlaq_dynasty': {
    name: '图格鲁克王朝',
    imageUrl: `${SUPABASE_CIV_BASE_URL}Tughlaq-Dynasty.webp`,
    color: '#0a7f83'
  },
  'mongols': {
    name: '蒙古',
    imageUrl: `${SUPABASE_CIV_BASE_URL}Mongols.webp`,
    color: '#8b4513'
  },
  'order_of_the_dragon': {
    name: '龙之骑士团',
    imageUrl: `${SUPABASE_CIV_BASE_URL}Order-of-the-Dragon.webp`,
    color: '#8b0000'
  },
  'ottomans': {
    name: '奥斯曼',
    imageUrl: `${SUPABASE_CIV_BASE_URL}Ottomans.webp`,
    color: '#e30613'
  },
  'rus': {
    name: '罗斯',
    imageUrl: `${SUPABASE_CIV_BASE_URL}Rus.webp`,
    color: '#ffd700'
  },
  'zhu_xis_legacy': {
    name: '朱子遗训',
    imageUrl: `${SUPABASE_CIV_BASE_URL}Zhu-Xi-Legacy.webp`,
    color: '#ff4500'
  },
  'japan': {
    name: '日本',
    imageUrl: `${SUPABASE_CIV_BASE_URL}Japanese.webp`,
    color: '#dc143c'
  },
  'dragon': {
    name: '龙之骑士团',
    imageUrl: `${SUPABASE_CIV_BASE_URL}Order-of-the-Dragon.webp`,
    color: '#8b0000'
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
    // 中文名称映射到英文键
    const chineseToEnglish: { [key: string]: string } = {
      '龙骑士团': 'order_of_the_dragon',
      '龙之骑士团': 'order_of_the_dragon',
      '日本': 'japanese',
      '中国': 'chinese',
      '英格兰': 'english',
      '法兰西': 'french',
      '神圣罗马帝国': 'holy_roman_empire',
      '德里苏丹国': 'delhi_sultanate',
      '阿拔斯王朝': 'abbasid_dynasty',
      '黑衣大食王朝': 'abbasid_dynasty',
      '蒙古': 'mongols',
      '马里': 'malians',
      '奥斯曼': 'ottomans',
      '罗斯': 'rus',
      '圣殿骑士团': 'knights_templar',
      '圣女贞德': 'jeanne_darc',
      '兰开斯特家族': 'house_of_lancaster',
      '兰开斯特王朝': 'house_of_lancaster',
      '朱熹之学': 'zhu_xis_legacy',
      '朱子遗训': 'zhu_xis_legacy',
      '拜占庭': 'byzantine',
      '阿尤布王朝': 'ayyubids',
      '阿尤布': 'ayyubids',
      '金帐汉国': 'golden_horde',
      '金帐汗国': 'golden_horde',
      '战国大名': 'sengoku_daimyo',
      '马其顿': 'macedonian_dynasty',
      '马其顿王朝': 'macedonian_dynasty',
      '图格鲁克': 'tughlaq_dynasty',
      '图格鲁克王朝': 'tughlaq_dynasty'
    };
    
    const chineseKey = chineseToEnglish[civilization];
    if (chineseKey) {
      result = civilizationMap[chineseKey];
    }
  }
  
  if (!result) {
    // 尝试一些常见的别名
    const aliases: { [key: string]: string } = {
      'byzant': 'byzantine',
      'byzantium': 'byzantine',
      'byz': 'byzantine',
      // 添加更多可能的API返回格式
      'china': 'chinese',
      'england': 'english',
      'france': 'french',
      'holy roman empire': 'holy_roman_empire',
      'hre': 'holy_roman_empire',
      'delhi': 'delhi_sultanate',
      'abbasid': 'abbasid_dynasty',
      'japan': 'japanese',
      'mongol': 'mongols',
      'mali': 'malians',
      'ottoman': 'ottomans',
      'russia': 'rus',
      'rus_principalities': 'rus',
      'order of the dragon': 'order_of_the_dragon',
      'dragon': 'order_of_the_dragon',
      'templar': 'knights_templar',
      'knights': 'knights_templar',
      'jeanne': 'jeanne_darc',
      'joan': 'jeanne_darc',
      'lancaster': 'house_of_lancaster',
      'zhu xi': 'zhu_xis_legacy',
      'zhu_xi': 'zhu_xis_legacy',
      'golden horde': 'golden_horde',
      'sengoku': 'sengoku_daimyo',
      'daimyo': 'sengoku_daimyo',
      'macedon': 'macedonian_dynasty',
      'tughlaq': 'tughlaq_dynasty'
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