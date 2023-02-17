// pages/users/edit/index.js
import event from '@codesmiths/event'
import { uploadFile } from '../../../utils/uploadFileToAliyun/uploadToAliyun'
const app = getApp()

Page({

  /**
   * Page initial data
   */
  data: {
    user: '',
	  isMenuShow: false,
	  index: 0,
	  roles: ['观众', '演员', '主理人']
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad(options) {
    // 1. get user id
    // 2. fetch user info
    // 3. set index for dropdown menu
    const { id } = options
    this.onFetchUserInfo(id)
    if (this.data.user && this.data.user !== '') {
      this.onSetIndex()
    } else {
      event.on('userInfoReady', this, this.onSetIndex)
    }
  },

  // send request to fetch user info
  onFetchUserInfo(id) {
    const _this = this
    wx.request({
      url: `${app.globalData.baseUrl}/users/${id}`,
      header: app.globalData.header,
      success(res) {
        if (res.statusCode === 200) {
          _this.setData({ user: res.data.user, currentRole: res.data.user.role })
          event.emit('userInfoReady')
        } else {
          wx.showToast({ title: '获取用户信息失败，请刷新重试！' })
        }
      }
    })
	},
	
	// click dropdown menu
	onSelectTaps(e) {
    this.setData({ isMenuShow: !this.data.isMenuShow })
	},

	// select dropdown menu option
	onOptionTaps(e) {
    const { index } = e.currentTarget.dataset
    this.setData({ index, isMenuShow: !this.data.isMenuShow })
	},

	// set index for dropdown menu
	onSetIndex() {
    let { role } = this.data.user
    switch(role) {
      case 'manager':
        role = '主理人'
        break
      case 'comedian':
        role = '演员'
        break
      default:
        role = '观众'
    }

	const index = this.data.roles.indexOf(role)
	  this.setData({ index })
  },
  
  // choose avatar
  onChooseAvatar(e) {
    const { avatarUrl } = e.detail
    this.setData({ avatarUrl })
  },

  // submit to update info
  onEditUserInfo(e) {
    // 1. check role
    const value = e.detail.value
    const { currentRole } = this.data
    const { nickname } = value
    const _this = this
    let role = this.data.roles[this.data.index]
    let userData

    switch (role) {
      case '主理人':
        const { clubName, clubAddr, clubDesc } = value
        userData = { nickname, role: 'manager' }
        const clubData = {
          name: clubName,
          address: clubAddr,
          description: clubDesc,
          user_id: _this.data.user.id
        }
        currentRole === 'manager' ? _this.onUpdateClubInfo(clubData) : _this.onCreateClub(clubData)
        _this.onUpdateUserInfo(userData)
        break
      case '演员':
        const { slogan, experience } = value
        userData = { nickname, slogan, experience, role: 'comedian' }
        _this.onUpdateUserInfo(userData)
        break
      default:
        userData = { nickname, role: 'audience' }
        _this.onUpdateUserInfo(userData)
    }
  },

	// send request to update user info
	onUpdateUserInfo(data) {
		const { id } = this.data.user
		wx.request({
			url: `${app.globalData.baseUrl}/users/${id}`,
			method: 'put',
			data: { user: data },
			header: app.globalData.header,
			success(res) {
        if (res.statusCode === 200) {
          wx.switchTab({ url: '/pages/users/index/index' })
          wx.showToast({ title: '用户信息更新成功' })
        } else {
          wx.showToast({ title: '用户信息更新失败，请刷新重试！' })
        }
			}
		})
	},

  // send rquest to update club info
  onUpdateClubInfo(data) {
    const { id } = this.data.user.club
    wx.request({
      url: `${app.globalData.baseUrl}/clubs/${id}`,
      method: 'put',
      data: { club: data },
      header: app.globalData.header,
      success(res) {
        if (res.statusCode !== 200) {
          wx.showToast({ title: '俱乐部信息更新失败' })
        }
      }
    })
  },

  // send request to create a new club
  onCreateClub(data) {
    wx.request({
      url: `${app.globalData.baseUrl}/clubs`,
      method: 'post',
      data: { club: data },
      header: app.globalData.header,
      success(res) {
        if (res.statusCode !== 200) {
          wx.showToast({ title: '新建俱乐部失败' })
        }
      }
    })
  }

})