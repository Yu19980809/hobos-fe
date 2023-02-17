const env = require('./config')
const Base64 = require('./Base64')
const Crypto = require('./crypto')
require('./hmac')
require('./sha1')

const getPolicyBase64 = function() {
	let date = new Date()
	date.setHours(date.getHours() + env.timeout)
	let srcT = date.toISOString()
	const policyText = {
		'expiration': srcT,
		'conditions': [
			// 设置上传文件的大小限制，最大为5MB
			['content-length-range', 0, 5 * 1024 * 1024]
		]
	}

	const policyBase64 = Base64.encode(JSON.stringify(policyText))
	return policyBase64
}

const getSignature = function() {
	const accessKey = env.AccessKeySecret
	const bytes = Crypto.HMAC(Crypto.SHA1, policyBase64, accessKey, { asBytes: true })
	const signature = Crypto.util.bytesToBase64(bytes)
	return signature
}

const uploadFile = function(params) {
	if (!params.filePath) {
		wx.showModal({
			title: '图片错误',
			content: '请重试',
			showCancel: false
		})

		return
	}

	const aliyunFileKey = params.open_id + '.png'
	const aliyunServerUrl = env.uploadImageUrl
	const accessId = env.OSSAccessKeyId
	const policyBase64 = getPolicyBase64()
	const signature = getSignature(policyBase64)

	wx.uploadFile({
		filePath: params.filePath,
		name: 'file',
		url: aliyunServerUrl,
		formData: {
			'key': aliyunFileKey,
			'policy': policyBase64,
			'OSSAccessKeyId': accessId,
			'signature': signature,
			'success_action_status': '200'
		},
		success(res) {
			console.log('success to upload', res)
		},
		fail(err) {
			console.log('fail to upload', err)
		}
	})
}

module.exports = uploadFile
