// pages/shows/index/index.js
import event from '@codesmiths/event'
import { checkShowExpired } from '../../../utils/util'
const app = getApp()

Page({

  /**
   * Page initial data
   */
  data: {
		query: '',
		isSearch: false
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
	
	// fetch all shows
  onFetchShows() {
    const _this = this

    wx.request({
      url: `${app.globalData.baseUrl}/shows`,
      header: app.globalData.header,
      success(res) {
				if (res.statusCode === 200) {
					wx.hideLoading()
					checkShowExpired(_this, res.data.shows)
				} else {
					wx.showToast({ title: '获取数据失败，请刷新重试！' })
				}
      }
    })
	},

	// search show
	onSearchShow(e) {
		// 1. get query content
		// 2. check the content
		// 2.1 no content (set search status as false)
		// 2.2 has content
		// 2.2.1. save this content and check search status
		// 2.2.2. send request to search shows
		const _this = this
		const query = e.detail.value
		if (query === '') {
			_this.setData({ query: '', isSearch: false })
			_this.onFetchShows()
		} else {
			_this.setData({ isSearch: true, query })
			_this.onSendSearchShowRequest(query)
		}
	},

	// send request to search show
	onSendSearchShowRequest(query) {
		const _this = this

		wx.request({
			url: `${app.globalData.baseUrl}/shows?query=${query}`,
			header: app.globalData.header,
			success(res) {
				if (res.statusCode === 200) {
					checkShowExpired(_this, res.data.shows)
				} else {
					wx.showToast({ title: '搜索失败，请刷新重试！' })
				}
			}
		})
	},

	// cancel search
	onCancelSearch() {
		// 1. clear the bar
		// 2. change search status
		// 3. list all shows
		this.setData({ query: '', isSearch: false })
		this.onFetchShows()
	},

	// navigate show detail page
	onNavigateToDetail(e) {
		// 1. get id of clicked show
		// 2. go to detail page
		const { id } = e.currentTarget.dataset
		wx.navigateTo({ url: `/pages/shows/show/index?id=${id}` })
	}
	
})