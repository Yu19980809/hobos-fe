// pages/users/index/index.js
import event from '@codesmiths/event'
const app = getApp()

Page({

  /**
   * Page initial data
   */
  data: {
    user: ''
  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow() {
    // 1. fetch user info
    // 2. check user role
    this.onFetchUserInfo()
    if (this.data.user && this.data.user !== '') {
      this.onCheckUserRole()
    } else {
      event.on('userInfoReady', this, this.onCheckUserRole)
    }
  },

  // send request to fetch user info
  onFetchUserInfo() {
    const _this = this
    const { id } = app.globalData.user
    wx.request({
      url: `${app.globalData.baseUrl}/users/${id}`,
      header: app.globalData.header,
      success(res) {
        if (res.statusCode === 200) {
          _this.setData({ user: res.data.user })
          event.emit('userInfoReady')
        } else {
          wx.showToast({ title: '获取用户信息失败，请刷新重试！' })
        }
      }
    })
  },

  // check user role
  onCheckUserRole() {
    const { role } = this.data.user
    const _this = this
    if (role === 'comedian') {
      _this.onFetchComedianFollower()
    } else if (role === 'manager') {
      _this.onFetchClubFollower()
    }
  },

  // send request to fetch club follower info
  onFetchClubFollower() {
    const _this = this
    const { id } = this.data.user
    wx.request({
      url: `${app.globalData.baseUrl}/users/${id}/club_followers`,
      header: app.globalData.header,
      success(res) {
        if (res.statusCode === 200) {
          let user = _this.data.user
          user.club_followers = res.data.club_followers
          _this.setData({ user })
        } else {
          wx.showToast({ title: '获取关注人数信息失败，请刷新重试1' })
        }
      }
    })
  },

  // send request to fetch comedian follower info
  onFetchComedianFollower() {
    const _this = this
    const { id } = this.data.user
    wx.request({
      url: `${app.globalData.baseUrl}/users/${id}/comedian_followers`,
      header: app.globalData.header,
      success(res) {
        if (res.statusCode === 200) {
          let user = _this.data.user
          user.comedian_followers = res.data.comedian_followers
          _this.setData({ user })
        } else {
          wx.showToast({ title: '获取关注人数信息失败，请刷新重试！' })
        }
      }
    })
  },

  // navigate to user info page
  onNavigateToInfo() {
    const { id } = this.data.user
    wx.navigateTo({ url: `/pages/users/edit/index?id=${id}` })
  },

  // navigate to following info page
  onNavigateToFollowing() {
    const { id } = this.data.user
    wx.navigateTo({ url: `/pages/followings/index/index?id=${id}` })
  },

  // navigate to booking history page
  onNavigateToBookingHistory() {
    const { id } = this.data.user
    wx.navigateTo({ url: `/pages/bookings/index/index?id=${id}` })
  },

  // navigate to show management page
  onNavigateToShowManagement() {
    const { id } = this.data.user
    wx.navigateTo({ url: `/pages/shows/management/index?id=${id}` })
  }

})