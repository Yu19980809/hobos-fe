// app.js
import event from '@codesmiths/event'

App({
  onLaunch() {
    const _this = this

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        _this.onLogin(res.code)
      }
    })
  },

  // send request to login
  onLogin(code) {
    const _this = this

    wx.request({
      url: `${_this.globalData.baseUrl}/login`,
      method: 'post',
      data: { code },
      success(res) {
        if(res.statusCode === 200) {
          // success
          _this.globalData.user = res.data.user
          _this.globalData.header = { 'Authorization': res.header['Authorization'] }
          event.emit('tokenReady')
        } else {
          // fail to login
          wx.showToast({ title: '登录失败，请重新登录！' })
        }
      }
    })
  },

  globalData: {
    baseUrl: 'http://localhost:3000/api/v1',
    user: null,
    header: null
  }
})
