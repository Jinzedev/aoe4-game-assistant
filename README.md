# AOE4游戏助手

这是一个基于React Native和Expo构建的AOE4游戏助手应用，为《帝国时代4》玩家提供数据追踪和游戏辅助功能。应用包含多个功能页面：

## 功能特性

### 🏠 主页 (HomeScreen)
- 用户头像和基本信息显示
- 钻石段位标识和排名
- 核心数据统计（胜率、总场次、ELO分数）
- 本月表现统计
- 最近对战记录展示

### 📊 详细统计 (StatsScreen)
- 胜率趋势图表
- 文明使用统计
- 深入的数据分析

### 📖 对战历史 (HistoryScreen)
- 按日期分组的对战记录
- 胜利/失败状态显示
- 详细的对局信息
- 筛选功能

### 🏆 排名追踪 (RankingScreen)
- 当前1v1和团队排名
- 排名趋势图
- 月度目标设定和进度追踪

## 技术栈

- **React Native** - 跨平台移动应用框架
- **Expo** - React Native开发平台
- **NativeWind** - 基于Tailwind CSS的样式系统
- **TypeScript** - 类型安全的JavaScript
- **Expo Vector Icons** - 图标库
- **Expo Linear Gradient** - 渐变背景支持

## 安装和运行

### 前置要求
- Node.js (推荐v18或更高版本)
- npm 或 yarn
- Expo CLI
- Expo Go 应用 (在手机上测试)

### 安装步骤

1. 克隆项目并进入目录：
```bash
cd my-expo-app
```

2. 安装依赖：
```bash
npm install
```

3. 启动开发服务器：
```bash
npm start
# 或
npx expo start
```

4. 使用Expo Go扫描二维码在手机上预览，或选择模拟器运行

### 可用脚本

- `npm start` - 启动Expo开发服务器
- `npm run android` - 在Android设备/模拟器上运行
- `npm run ios` - 在iOS设备/模拟器上运行
- `npm run web` - 在浏览器中运行
- `npm run lint` - 运行ESLint检查
- `npm run format` - 格式化代码

## 项目结构

```
my-expo-app/
├── components/          # 可复用组件
│   ├── GameRecord.tsx   # 游戏记录卡片组件
│   ├── StatsScreen.tsx  # 统计页面
│   ├── HistoryScreen.tsx # 历史页面
│   └── RankingScreen.tsx # 排名页面
├── App.tsx             # 主应用入口
├── global.css          # 全局样式
└── package.json        # 项目配置
```

## 设计特色

- **玻璃态设计** - 使用半透明背景和模糊效果
- **渐变色彩** - 深色主题配合紫色渐变
- **响应式布局** - 适配不同屏幕尺寸
- **统一的UI组件** - 可复用的游戏记录卡片
- **现代化界面** - 圆角设计和柔和阴影

## 开发说明

该应用为《帝国时代4》玩家提供全面的数据追踪和游戏辅助功能。通过集成AoE4World API，为玩家提供实时的游戏数据分析和个人成长追踪。

### 主要功能
- 个人数据统计和排名追踪
- 游戏历史记录分析
- 文明使用统计
- 多平台更新检查
- 现代化的用户界面

### 组件化设计
- 使用可复用的组件来展示游戏数据
- 每个页面独立为单独的组件，便于维护
- 统一的导航和主题系统

### 样式系统
- 使用NativeWind实现Tailwind CSS样式
- 支持响应式设计
- 深色主题配合现代化UI设计

## 许可证

MIT License
