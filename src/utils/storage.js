/**
 * 本地存储封装模块
 */
export const getStorage = (name) => {
  const data = window.localStorage.getItem(name)
  // data 可能不是 JSON 格式字符串
  try {
    // 尝试把 data 转为 JavaScript 对象
    return JSON.parse(data)
  } catch (error) {
    // data 不是 JSON 格式字符串，直接原样返回
    return data
  }
}

export const setStorage = (name, value) => {
  // 如果是对象 就 转为 JSON
  if (typeof value === 'object') {
    value = JSON.stringify(value)
  }
  // 对象要转为字符串才能存入本地存储
  window.localStorage.setItem(name, value)

}

export const removeStorage = (name) => {
  window.localStorage.removeItem(name)
}