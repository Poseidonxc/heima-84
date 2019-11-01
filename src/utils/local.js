// 存储用户信息的相关API
// 利用sessionStorage存储数据
// 约定：key=hm-toutiao-pc-84-user-key
const KEY = 'hm-toutiao-pc-84-user-key'
const local = {
  // 存储
  setUser (user) {
    // 把user对象转换成json字符串
    const jsonStr = JSON.stringify(user)
    window.sessionStorage.setItem(KEY, jsonStr)
  },
  // 获取
  getUser () {
    const jsonStr = window.sessionStorage.getItem(KEY)
    // 利用Json.parse把json字符串还原成js中的数据
    return JSON.parse(jsonStr)
  },
  // 清除
  delUser () {
    window.sessionStorage.removeItem(KEY)
  }
}

export default local
