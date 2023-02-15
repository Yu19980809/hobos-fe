// pages/shows/show/index.js
import event from '@codesmiths/event'
const app = getApp()

Page({

  /**
   * Page initial data
   */
  data: {
    show: '',
    isBooked: false
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad(options) {
    // 1. get id of current show
    // 2. fetch details of this show
    // 3. check booking status
    const { id } = options
    this.onFetchShowInfo(id)
    if (this.data.show && this.data.show !== '') {
      this.onCheckBookingStatus()
    } else {
      event.on('infoReady', this, this.onCheckBookingStatus)
    }
  },

  // send request to fetch show details
  onFetchShowInfo(id) {
    const _this = this
    wx.request({
      url: `${app.globalData.baseUrl}/shows/${id}`,
      header: app.globalData.header,
      success(res) {
        if (res.statusCode === 200) {
          _this.setData({ show: res.data.show })
          event.emit('infoReady')
        } else {
          wx.showToast({ title: '演出信息获取失败，请刷新重试！' })
        }
      }
    })
  },

  // check book status
  onCheckBookingStatus() {
    // 1. get audiences info
    // 2. fetch current user info
    // 3. check whether current user in the audiences lists or not
    const audiences = this.data.show.audiences
    const current_user = app.globalData.user
    const _this = this
    audiences.forEach(audience => {
      if (audience.id === current_user.id) {
        _this.setData({ isBooked: true })
      }
    })
  },

  // book current show
  onBook() {
    // 1. show modal to confirm
    // 2. send request to create a new booking record
    const _this = this
		wx.showModal({
      title: '确认提示',
      content: '确认要参加当前演出吗？',
      complete: (res) => {
        if (res.confirm) {
          _this.onCreateBookingRecord()
        }
      }
    })
  },

  // send request to create a new booking record
  onCreateBookingRecord() {
    // 1. get show id
    // 2. send request to create a new booking record
    // 3. change book status
    const _this = this
    const id = this.data.show.id
    wx.request({
      url: `${app.globalData.baseUrl}/bookings`,
      method: 'post',
      header: app.globalData.header,
      data: { show_id: id },
      success(res) {
        if (res.statusCode === 200) {
          _this.setData({ isBooked: true })
          _this.onFetchShowInfo(id)
        } else {
          wx.showToast({ title: '参加失败，请刷新重试！' })
        }
      }
    })
  },

  // unbook current show
  onUnbook() {
    // 1. show modal to confirm
    // 2. send request to destroy booking record
    const _this = this
    wx.showModal({
      title: '取消提示',
      content: '确认取消参加当前演出吗？',
      complete: (res) => {
        if (res.confirm) {
          _this.onDestroyBookingRecord()
        }
      }
    })
  },

  // send request to destroy booking record
  onDestroyBookingRecord() {
    // 1. get show id
    // 2. send request
    // 3. change booking status
    const { id } = this.data.show
    const _this = this
    wx.request({
      url: `${ app.globalData.baseUrl }/bookings/${id}`,
      method: 'delete',
      header: app.globalData.header,
      success(res) {
        if (res.statusCode === 200) {
          _this.setData({ isBooked: false })
          _this.onFetchShowInfo(id)
        } else {
          wx.showToast({ title: '取消失败，请刷新重试！' })
        }
      }
    })
  },

  // navigate to comedian detail page
  onNavigateToComeidanDetail(e) {
    // 1. get comedian id
    // 2. go to comdian detail page
    const { id } = e.currentTarget.dataset
    console.log('comedian detail', id)
    wx.navigateTo({
      url: `/pages/comedians/show/index?comedianId=${id}`
    })
  }

})