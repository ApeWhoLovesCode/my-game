/**
 * 获得两个时间点之间的间隔
 * @param {(Object|string|number)} startTime
 * @param {(Object|string|number)} endTime
 */
export function timeInterval(startTime, endTime, show7 = true) {
  if (!startTime) return
  if (!endTime) {
    endTime = new Date()
  }
  startTime = new Date(parseTime(startTime))
  endTime = new Date(parseTime(endTime))
  var timeDiff = endTime.getTime() - startTime.getTime()
  if (timeDiff < 0) {
    console.error('输入错误，开始时间要在结束时间之前')
    return ''
    // return parseTime(startTime, '{y}-{m}-{d}')
  }
  var daysDiff = Math.floor(timeDiff / (1000 * 3600 * 24))
  var level1 = timeDiff % (1000 * 3600 * 24) // 计算完天后剩余的毫秒数
  var hoursDiff = Math.floor(level1 / (3600 * 1000))
  var level2 = level1 % (3600 * 1000) // 计算完小时后剩余的毫秒数
  var minutesDiff = Math.floor(level2 / (60 * 1000))
  var level3 = level2 % (60 * 1000) // 计算完分钟后剩余的毫秒数
  var secondsDiff = Math.round(level3 / 1000)
  if (daysDiff >= 7) {
    if (!show7) {
      return ''
    }
    return this.parseTime(startTime, '{y}-{m}-{d}')
  } else if (daysDiff >= 1) {
    return daysDiff + '天前'
  } else if (hoursDiff >= 1) {
    return hoursDiff + '小时前'
  } else if (minutesDiff >= 1) {
    return minutesDiff + '分钟前'
  } else if (secondsDiff >= 10) {
    return secondsDiff + '秒前'
  } else {
    return '刚刚'
  }
}

/**
 * 格式化时间字符串
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string}
 */
export function parseTime(time, cFormat) {
  if (arguments.length === 0) {
    return null
  }
  if (!time) { return null }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'string') {
    time = time.replace(/-/g, '/')
  }
  if (typeof time === 'object') {
    date = time
  } else {
    if ((typeof time === 'string') && (/^[0-9]+$/.test(time))) {
      time = parseInt(time)
    }
    if ((typeof time === 'number') && (time.toString().length === 10)) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value ] }
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
  return time_str
}

// 处理时间
export function dateFormatter(date, fmt) {
  date = typeof date === 'string' ? date.replace(/-/g, '/') : date
  date = new Date(date)
  if (!date.getDate()) {
    return ''
  }
  fmt = fmt || 'yyyy-MM-dd hh:mm:ss'
  const o = {
    'M+': date.getMonth() + 1, // 月份
    'd+': date.getDate(), // 日
    'h+': date.getHours(), // 小时
    'm+': date.getMinutes(), // 分
    's+': date.getSeconds(), // 秒
    'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
    S: date.getMilliseconds() // 毫秒
  }

  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  for (const k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      const len = k === 'S' ? 3 : ('' + o[k]).length
      // const len = k === 'S' ? 3 : 2;
      if (k === 'S') {
        fmt = fmt.replace(RegExp.$1, ('0000' + o[k]).slice(-len))
      } else {
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(len)))
      }
    }
  }
  return fmt
}

/* 根据出生日期算出年龄 */
export function getAge(strBirthday) {
  let returnAge
  strBirthday = dateFormatter(strBirthday, 'yyyy/MM/dd')
  const strBirthdayArr = strBirthday.split('/')
  const birthYear = Number(strBirthdayArr[0])
  const birthMonth = Number(strBirthdayArr[1])
  const birthDay = Number(strBirthdayArr[2])

  const d = new Date()
  const nowYear = d.getFullYear()
  const nowMonth = d.getMonth() + 1
  const nowDay = d.getDate()

  if (nowYear === birthYear) {
    returnAge = 0// 同年 则为0岁
  } else {
    const ageDiff = nowYear - birthYear // 年之差
    if (ageDiff > 0) {
      if (nowMonth === birthMonth) {
        const dayDiff = nowDay - birthDay// 日之差
        if (dayDiff < 0) {
          returnAge = ageDiff - 1
        } else {
          returnAge = ageDiff
        }
      } else {
        const monthDiff = nowMonth - birthMonth// 月之差
        if (monthDiff < 0) {
          returnAge = ageDiff - 1
        } else {
          returnAge = ageDiff
        }
      }
    } else {
      returnAge = -1// 返回-1 表示出生日期输入错误 晚于今天
    }
  }

  return returnAge// 返回周岁年龄
}

export function fillZero(num) {
  return num < 10 ? '0' + num : num
}

export function updateFormatTime(time) {
  const formatTime = time.map(item => new Date(item))
  const info = formatTime.map((item, index) => ([
    item.getFullYear(),
    fillZero(item.getMonth() + 1),
    fillZero(item.getDate() + index)
  ]))
  const [startTime, endTime] = info.map(item => item.join('-'))
  return [startTime, endTime]
}
