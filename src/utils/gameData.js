export default [
  {
    'id': 101,
    'name': '飞机大战',
    'ref': 'planewar',
    'img': require('@/assets/img/phone3.png'),
    'rules': '点击飞机开始/暂停游戏，双击飞机游戏结束，飞机跟随鼠标移动，飞机碰到虫子游戏结束。',
    'begin': false, // 是否开始游戏
    'small': 0,   // 是否缩小 0:基础状态 1:缩小 2:恢复
    'delay': false,  // 用于缩小的延迟
    'outside': false, // 用于显示的优先级
  },
  {
    'id': 102,
    'name': '俄罗斯方块',
    'ref': 'tetris',
    'img': require('@/assets/img/tetirs.png'),
    'rules': '键盘上下左右控制方块，空格暂停/开始游戏。',
    'begin': false, // 是否开始游戏
    'small': 0,   // 是否缩小 0:基础状态 1:缩小 2:恢复
    'delay': false,  // 用于缩小的延迟
    'outside': false, // 用于显示的优先级
  },
  {
    'id': 103,
    'name': '贪吃蛇',
    'ref': 'snake',
    'img': require('@/assets/img/snake.png'),
    'rules': '键盘上下左右控制蛇的移动，空格暂停/开始游戏，每隔10秒墙会消失/出现，没墙时边界可穿越。',
    'begin': false, // 是否开始游戏
    'small': 0,   // 是否缩小 0:基础状态 1:缩小 2:恢复
    'delay': false,  // 用于缩小的延迟
    'outside': false, // 用于显示的优先级
  },
  {
    'id': 104,
    'name': '飞翔的小鸟',
    'ref': 'bird',
    'img': require('@/assets/img/bird.png'),
    'rules': '鼠标点击游戏内区域，小鸟会上升，触碰到管道、天空、地面游戏结束。',
    'begin': false, // 是否开始游戏
    'small': 0,   // 是否缩小 0:基础状态 1:缩小 2:恢复
    'delay': false,  // 用于缩小的延迟
    'outside': false, // 用于显示的优先级
  },
  {
    'id': 105,
    'name': '2048',
    'ref': '2048',
    'img': require('@/assets/img/2048.png'),
    'rules': '键盘上下左右控制数字移动，数字相同就会合并，达到128会有奖励分，无法连续5次移动同一边的数字。',
    'begin': false, // 是否开始游戏
    'small': 0,   // 是否缩小 0:基础状态 1:缩小 2:恢复
    'delay': false,  // 用于缩小的延迟
    'outside': false, // 用于显示的优先级
  },
  {
    'id': 106,
    'name': '五子棋',
    'ref': 'goBang',
    'img': require('@/assets/img/goBang.png'),
    'rules': '鼠标点击即可下棋，率先将横向、竖向、斜边连成5个子的一方获胜',
    'begin': false, // 是否开始游戏
    'small': 0,   // 是否缩小 0:基础状态 1:缩小 2:恢复
    'delay': false,  // 用于缩小的延迟
    'outside': false, // 用于显示的优先级
  },
  {
    'id': 107,
    'name': '扫雷',
    'ref': 'mineSweeper',
    'img': require('@/assets/img/phone3.png'),
    'rules': '一共有4个等级：9 * 9 雷:10（初级）、16 * 16 雷:40（中级）、22 * 22 雷:100（高级）、25 * 25 雷:200（地狱）。鼠标左键打开格子，右键标记地雷。',
    'begin': false, // 是否开始游戏
    'small': 0,   // 是否缩小 0:基础状态 1:缩小 2:恢复
    'delay': false,  // 用于缩小的延迟
    'outside': false, // 用于显示的优先级
  },
  {
    'id': 108,
    'name': '其他游戏',
    'ref': 'game1',
    'img': require('@/assets/img/otherGame.png'),
    'rules': '略......',
    'begin': false, // 是否开始游戏
    'small': 0,   // 是否缩小 0:基础状态 1:缩小 2:恢复
    'delay': false,  // 用于缩小的延迟
    'outside': false, // 用于显示的优先级
  },

]