// pages/comedians/show/index.js
import event from '@codesmiths/event'
import { checkShowExpired } from '../../../utils/util'
const app = getApp()

Page({

  /**
   * Page initial data
   */
  data: {
    comedian: '',
    isFollowed: false,
    index: 0,
    isMenuShow: false,
    category: ['近期热演', '往期演出']
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad(options) {
    // 1. get comedian id
    // 2. fetch comedian info
    // 3. check follow status
    const { comedianId } = options
    this.setData({ comedianId })
    this.onFetchComedianInfo(comedianId)
    if (this.data.comedian && this.data.comedian !== '') {
      this.onCheckFollowStatus()
    } else {
      event.on('comedianReady', this, this.onCheckFollowStatus)
    }
  },

  // send request to fetch comedian info
  onFetchComedianInfo(id) {
    const _this = this
    wx.request({
      url: `${app.globalData.baseUrl}/comedian?id=${id}`,
      header: app.globalData.header,
      success(res) {
        if (res.statusCode === 200) {
          _this.setData({ comedian: res.data.comedian })
          checkShowExpired(_this, res.data.comedian.shows)
          event.emit('comedianReady')
        } else {
          wx.showToast({ title: '获取演员信息失败，请刷新重试！' })
        }
      }
    })
  },

  // check follow status
  onCheckFollowStatus() {
    // 1. get current comedian info
    // 2. fetch comedian_following lists
    // 3. check whether curretn comedian in comedian_following lists
    const current_comedian = this.data.comedian
    const _this = this

    wx.request({
      url: `${app.globalData.baseUrl}/comedian_followings`,
      header: app.globalData.header,
      success(res) {
        if (res.statusCode === 200) {
          const { comedians } = res.data
          comedians.forEach(comedian => {
            if (comedian.id === current_comedian.id) {
              _this.setData({ isFollowed: true })
            }
          })
        } else {
          wx.showToast({ title: '获取关注信息失败，请刷新重试！' })
        }
      }
    })
  },

  // click dropdown menu to show options
  onSelectTaps(e) {
    this.setData({ isMenuShow: !this.data.isMenuShow });
  },

  // select dropdown menu option
  onOptionTaps(e) {
    const index = e.currentTarget.dataset.index
    this.setData({ index, isMenuShow: !this.data.isMenuShow })
  },

  // follow current comedian
  onFollowComedian() {
    // 1. show modal to confirm
    // 2. send request to create a new comedian_following record
    const _this = this
    wx.showModal({
      title: '确认提示',
      content: '确认关注当前演员吗？',
      complete: (res) => {
        if (res.confirm) {
          _this.onCreateComedianFollowingRecord()
        }
      }
    })
  },

  // send request to create a new comedian_following record
  onCreateComedianFollowingRecord() {
    // 1. get current comedian's id
    // 2. send request
    // 3. change follow status
    const { id } = this.data.comedian
    const _this = this
    wx.request({
      url: `${app.globalData.baseUrl}/comedian_followings`,
      method: 'post',
      data: { comedian_id: id },
      header: app.globalData.header,
      success(res) {
        if (res.statusCode === 200) {
          _this.setData({ isFollowed: true })
        } else {
          wx.showToast({ title: '关注失败，请刷新重试！' })
        }
      }
    })
  },

  // unfollow current comedian
  onUnfollowComedian() {
    // 1. show modal to confirm
    // 2. send request to destroy comedian_following record
    const _this = this
    wx.showModal({
      title: '取关提示',
      content: '确认取关当前演员吗？',
      complete: (res) => {
        if (res.confirm) {
          _this.onDestroyComedianFollowingRecord()
        }
      }
    })
  },

  // send request to destroy comedian_following record
  onDestroyComedianFollowingRecord() {
    // 1. get current comedian's id
    // 2. send request
    // 3. change follow status
    const { id } = this.data.comedian
    const _this = this
    wx.request({
      url: `${app.globalData.baseUrl}/comedian_followings/${id}`,
      method: 'delete',
      header: app.globalData.header,
      success(res) {
        if (res.statusCode === 200) {
          _this.setData({ isFollowed: false })
        } else {
          wx.showToast({ title: '取关失败，请刷新重试！' })
        }
      }
    })
  },

  // navigate to show(upcoming) detail page
  onNavigateToDetailUpcoming(e) {
    // 1. get show id
    // 2. navigate
    const { id } = e.currentTarget.dataset
    wx.navigateTo({ url: `/pages/shows/show/index?id=${id}&isExpired=false` })
  },

  // navigate to show(expired) detail page
  onNavigateToDetailExpired(e) {
    // 1. get show id
    // 2. navigate
    const { id } = e.currentTarget.dataset
    wx.navigateTo({ url: `/pages/shows/show/index?id=${id}&isExpired=true` })
  }

})