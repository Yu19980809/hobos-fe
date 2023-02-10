// pages/shows/index/index.js
import event from '@codesmiths/event'
const app = getApp()

Page({

  /**
   * Page initial data
   */
  data: {

  },

  // fetch all shows
  onFetchShows() {
    const _this = this

    wx.request({
      url: `${app.globalData.baseUrl}/shows`,
      header: app.globalData.header,
      success(res) {
        console.log('fetchAllShows', res)
      }
    })
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad(options) {

  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady() {

  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow() {
    wx.showLoading({ title: '正在加载数据' })

    if(getApp().globalData.header && getApp().globalData.headr !== null) {
      // token is ready, go get all shows
      this.onFetchShows()
    } else {
      // token isn't ready, wait token
      event.on('tokenReady', this, this.onFetchShows)
    }
  },

  /**
   * Lifecycle function--Called when page hide
   */
  onHide() {

  },

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload() {

  },

  /**
   * Page event handler function--Called when user drop down
   */
  onPullDownRefresh() {

  },

  /**
   * Called when page reach bottom
   */
  onReachBottom() {

  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage() {

  }
})