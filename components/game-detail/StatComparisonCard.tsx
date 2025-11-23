import React from 'react';
import { View, Text, ScrollView, Image } from 'react-native';
import { getCivilizationInfo } from '../../services/civilizationImages';
import { GameSummaryPlayer } from '../../types';
import { calculateMaxWorkers } from '../../utils/gameUtils';

interface StatComparisonCardProps {
  players: GameSummaryPlayer[];
  currentProfileId: number;
}

// === 高度常量保持不变 ===
const CELL_WIDTH = 70;
const ROW_HEIGHT = 48;
const HEADER_HEIGHT = 68;
const HEADER_TOP_H = 32;
const HEADER_BOT_H = 36;

export function StatComparisonCard({ players, currentProfileId }: StatComparisonCardProps) {
  if (!players || players.length < 2) return null;

  // ... (辅助函数 formatNumber, getStat, calculateKD, DataCell, GroupHeader, HeaderCell 保持不变) ...
  const formatNumber = (num: number | undefined) => {
    if (num === undefined || num === null) return '0';
    if (num >= 10000) return (num / 1000).toFixed(1) + 'k';
    return num.toString();
  };

  const getStat = (player: GameSummaryPlayer, key: keyof NonNullable<GameSummaryPlayer['_stats']>) => {
    return player._stats?.[key] || 0;
  };

  const calculateKD = (kills: number, deaths: number) => {
    if (deaths === 0) return kills.toFixed(1);
    return (kills / deaths).toFixed(1);
  };

  const DataCell = ({ value, color = 'text-gray-400', isBold = false, bgClass = '' }: any) => (
    <View 
      style={{ width: CELL_WIDTH, height: ROW_HEIGHT }}
      className={`items-center justify-center border-r border-white/5 ${bgClass}`}
    >
      <Text className={`text-center text-[11px] ${color} ${isBold ? 'font-bold' : ''}`}>
        {value}
      </Text>
    </View>
  );

  const GroupHeader = ({ title, colSpan }: { title: string; colSpan: number }) => (
    <View 
      style={{ width: CELL_WIDTH * colSpan, height: HEADER_TOP_H }}
      className="items-center justify-center border-r border-white/10 border-b bg-white/5"
    >
      <Text className="text-[10px] font-bold text-gray-300 uppercase tracking-wider">{title}</Text>
    </View>
  );

  const HeaderCell = ({ title }: { title: string }) => (
    <View 
      style={{ width: CELL_WIDTH, height: HEADER_BOT_H }}
      className="items-center justify-center border-r border-white/10"
    >
      <Text className="text-[10px] font-bold text-gray-500 uppercase">{title}</Text>
    </View>
  );

  return (
    <View className="mt-4 mb-6 rounded-2xl bg-slate-800 overflow-hidden border border-white/10 mx-1">
      {/* === 修改 1: 顶部大标题居中 === */}
      {/* 添加 items-center 和 justify-center */}
      <View className="px-4 py-3 bg-slate-900/50 border-b border-white/10 items-center justify-center">
        <Text className="text-white font-bold text-base">详细数据对比</Text>
      </View>

      <View className="flex-row">
        {/* === 左侧固定列 === */}
        <View className="z-10 bg-slate-800 border-r border-white/10 shadow-lg w-28">
          
          {/* === 修改 2: "玩家" 表头居中 === */}
          {/* 移除 pl-3，添加 items-center */}
          <View 
            style={{ height: HEADER_HEIGHT }}
            className="border-b border-white/10 bg-slate-900/50 justify-center items-center"
          >
             <Text className="text-xs font-bold text-gray-400">玩家</Text>
          </View>

          {players.map((player, index) => {
            const isCurrent = Number(player.profileId) === Number(currentProfileId);
            const civInfo = getCivilizationInfo(player.civilization);
            const isWin = player.result === 'win';

            return (
              <View 
                key={player.profileId} 
                style={{ height: ROW_HEIGHT }}
                // 玩家名字列表依然保持左对齐 (pl-3)，这样比较美观
                className={`flex-row items-center pl-3 border-b border-white/5 ${index % 2 !== 0 ? 'bg-white/5' : ''}`}
              >
                <Image source={{ uri: civInfo.imageUrl }} className="h-5 w-5 mr-2 rounded-sm" />
                <View className="flex-1 pr-1 justify-center overflow-hidden"> 
                  <Text 
                    numberOfLines={1} 
                    className={`text-[11px] font-bold ${isCurrent ? 'text-yellow-400' : 'text-white'}`}
                  >
                    {player.name}
                  </Text>
                  <Text className={`text-[9px] ${isWin ? 'text-green-400' : 'text-red-400'}`}>
                    {isWin ? '胜利' : '失败'}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>

        {/* === 右侧滚动区域 (保持不变) === */}
        <ScrollView horizontal showsHorizontalScrollIndicator={true} contentContainerStyle={{flexGrow: 1}}>
          <View>
            {/* ... 表头部分保持不变 ... */}
            <View style={{ height: HEADER_TOP_H }} className="flex-row bg-slate-900/80">
              <GroupHeader title="得分" colSpan={5} />
              <GroupHeader title="资源消耗" colSpan={6} />
              <GroupHeader title="最大工人" colSpan={3} />
              <GroupHeader title="军事" colSpan={4} />
              <GroupHeader title="建筑" colSpan={2} />
              <GroupHeader title="科技" colSpan={1} />
              <GroupHeader title="杂项" colSpan={1} />
              <GroupHeader title="圣地" colSpan={3} />
            </View>

            <View style={{ height: HEADER_BOT_H }} className="flex-row bg-slate-900/40 border-b border-white/10">
              <HeaderCell title="经济" />
              <HeaderCell title="科技" />
              <HeaderCell title="社会" />
              <HeaderCell title="军事" />
              <HeaderCell title="总分" />

              <HeaderCell title="食物" />
              <HeaderCell title="木材" />
              <HeaderCell title="黄金" />
              <HeaderCell title="石头" />
              <HeaderCell title="橄榄油" />
              <HeaderCell title="总计" />

              <HeaderCell title="村民" />
              <HeaderCell title="商人" />
              <HeaderCell title="渔船" />

              <HeaderCell title="生产" />
              <HeaderCell title="击杀" />
              <HeaderCell title="死亡" />
              <HeaderCell title="K/D" />

              <HeaderCell title="摧毁" />
              <HeaderCell title="损失" />

              <HeaderCell title="研究" />

              <HeaderCell title="APM" />

              <HeaderCell title="占领" />
              <HeaderCell title="丢失" />
              <HeaderCell title="中立化" />
            </View>

            {/* ... 数据行部分保持不变 ... */}
            {players.map((player, index) => {
               const rowBg = index % 2 !== 0 ? 'bg-white/5' : '';
               const ekills = getStat(player, 'ekills');
               const edeaths = getStat(player, 'edeaths');
               const { maxVillagers, maxTraders, maxFishing } = calculateMaxWorkers(player);
               
               return (
                <View 
                  key={player.profileId} 
                  style={{ height: ROW_HEIGHT }}
                  className={`flex-row border-b border-white/5 ${rowBg}`}
                >
                  <DataCell value={formatNumber(player.scores?.economy)} />
                  <DataCell value={formatNumber(player.scores?.technology)} />
                  <DataCell value={formatNumber(player.scores?.society)} />
                  <DataCell value={formatNumber(player.scores?.military)} />
                  <DataCell value={formatNumber(player.scores?.total)} isBold color="text-white" />

                  <DataCell value={formatNumber(player.totalResourcesSpent?.food)} color="text-red-300" />
                  <DataCell value={formatNumber(player.totalResourcesSpent?.wood)} color="text-amber-700" />
                  <DataCell value={formatNumber(player.totalResourcesSpent?.gold)} color="text-yellow-300" />
                  <DataCell value={formatNumber(player.totalResourcesSpent?.stone)} color="text-stone-400" />
                  <DataCell value={formatNumber(player.totalResourcesSpent?.oliveoil)} color="text-purple-300" />
                  <DataCell value={formatNumber(player.totalResourcesSpent?.total)} isBold color="text-white" />

                  <DataCell value={formatNumber(maxVillagers)} />
                  <DataCell value={formatNumber(maxTraders)} />
                  <DataCell value={formatNumber(maxFishing)} />

                  <DataCell value={formatNumber(getStat(player, 'sqprod'))} />
                  <DataCell value={ekills} color="text-green-300" />
                  <DataCell value={edeaths} color="text-red-300" />
                  <DataCell value={calculateKD(ekills, edeaths)} isBold color="text-white" />

                  <DataCell value={getStat(player, 'structdmg')} color="text-green-300" />
                  <DataCell value={getStat(player, 'blost')} color="text-red-300" />

                  <DataCell value={getStat(player, 'upg')} />

                  <DataCell value={player.apm || 0} />

                  <DataCell value={getStat(player, 'pcap')} />
                  <DataCell value={getStat(player, 'plost')} />
                  <DataCell value={getStat(player, 'precap')} />
                </View>
              );
            })}
          </View>
        </ScrollView>
      </View>
    </View>
  );
}