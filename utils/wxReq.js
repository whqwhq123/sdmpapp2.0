import { checkLogin, getPhone, getFoursInfo } from './../server/api';


// wx_login
// get_phone_number
// save_user_info
// sale_man

// 获取openID
export const getOpenId = (jsCode,success, fail, complete) => {
  console.log(jsCode)
	checkLogin({ jsCode }).then(res => {
    console.log(res)
		if (res.code == 0) {
      
      wx.setStorageSync('userInfo', res.data)
      
			if(res.data.phone) {
				wx.setStorageSync('userPhone', res.data.phone)
      }
      if(res.data.foursId) {
        wx.setStorageSync('foursId', res.data.foursId)
      }
		}
		if (success) {
			success(res)
		}
	}).catch(err => {
		if (fail) {
			fail(err)
		}
	})
}

// 获取手机号
export const get_phone = async (e) => {
  let userInfo = wx.getStorageSync('userInfo')
  if (e.detail.errMsg == 'getPhoneNumber:ok') {
    let res = await getPhone({
      iv: e.detail.iv,
      encryptedData: e.detail.encryptedData,
      session_key: userInfo.session_key,
      openId: userInfo.openid,
      type: 'phone'
    })

    if(res.data.phone) {
      userInfo.phone = res.data.phone
      wx.setStorageSync('userInfo', userInfo)
      wx.setStorageSync('userPhone', res.data.phone)
    }

    return res
  }
}

// 保存用户信息
export const save_user_info = async (id) => {
    let { foursId, phone, openid } = wx.getStorageSync('userInfo')
    let latLon = app.globalData.latLon || wx.getStorageSync('latLon') || []
    let systemInfo = getSystemInfo()

    let data = {
      foursId: id || foursId,
      phone,
      openid,
      position: latLon.length > 0 ? latLon.join() : '',
      phoneType: '',
      phoneOs: '',
      phoneNet: getNetworkType(),
      type: app.globalData.from_type || '',
    }

    if(systemInfo) {
      data.phoneType = `${systemInfo.brand} ${systemInfo.model}`,
      data.phoneOs = systemInfo.p_os
    }
    
    saveUserInfo(data).then(res=>{
      if(res.code != 0){
        wx.showToast({
          title: res.errMsg          
        })
      }
    })
}

// 获取4S店信息
export const getFoursInfoReq = async (id) => {
  let foursId = id || wx.getStorageSync('foursId') || ''
  let res = await getFoursInfo({ foursId })
  if (res.code === 0) {
    wx.setStorageSync('foursId', foursId)
    wx.setStorageSync('foursInfo', res.data)
    return res.data
  } else {
    return {}
  }
}

// 获取进入方式
export const getOptionsSync = async () => {
    let scene = wx.getLaunchOptionsSync().scene;
    let from_type = ''
    if (scene === 1011 || scene === 1012 || scene === 1013) {
      from_type = '扫小程序码'
    } else if (scene === 1036 || scene == 1007 || scene == 1008) {
      from_type = '小程序分享'
    } else if (scene == 1037) {
      from_type = '搜索小程序'
    }
    return from_type
}

// 获取设备信息
const getSystemInfo = async () => {
  let systemInfo = await wx.getSystemInfo();
  if (systemInfo.errMsg === "getSystemInfo:ok") {
    return systemInfo
  }
  return null
}

// 获取设备网络信息
const getNetworkType = async () => {
  let res = await wx.getNetworkType()
  return res.networkType || ''
}

// 获取位置信息
export const getPosition = async () => { // 纬度,经度
  try {
    let location = await wx.getLocation();
    let { latitude, longitude } = location
    wx.setStorageSync('latLon', [latitude, longitude])
    
    return [latitude, longitude]
  } catch(e) {
    return []
  }
}

// 再次获取位置授权
export const getLocationTwo =  async () => {
  try {
    let res = await wx.getSetting();
    if (!res.authSetting['scope.userLocation']) {
      let model = await wx.showModal({
        title: '是否授权当前位置',
        content: '需要获取您的地理位置，请确认授权，否则距离功能将无法使用',
      })
      if (model.confirm) {
        let location = await wx.openSetting()
        console.log(location)
        if (location.authSetting["scope.userLocation"] == true) {
          return await getPosition()
        }
      }
    }
  } catch (e) { 
    console.log(e)
  }
}

/**
 * 订阅消息封装
 * 
 */
export const requestSubscribeMessage = async function (id) {
  let promise = new Promise((resolve, reject)=> {
    wx.requestSubscribeMessage({
      tmplIds: [id],
      success(res) { 
        resolve(res)
      },
      fail(err) {
        reject(err)
      }
    })
  })
  return promise
}