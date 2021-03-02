const app = getApp()
import {
  getActivityInfoAndSingUpStatus,
  getUserAllInfo
} from "./../../../../server/api"
Page({
  data: {
    scene: [],
    id: '',
    oss_url: app.globalData.oss_url,
    content: {},
    adviserInfo: {},
    userInfo: {}
  },
  onLoad: function (options) {
    let scene = decodeURIComponent(options.scene).split(',');

    this.setData({
      scene,
      id: scene[3],
      userInfo: app.globalData.user_info || {}
    }, ()=>{
      this.get_content()
      this.get_userAllInfo()
    })
  },
  onShareAppMessage: function () {
    let that = this;
    return {
      title: that.data.content['activityName'],
      imageUrl: that.data.content['detailImg1'],
      path: '/pages/gift/show/index',
      success: (res) => {

      }
    }
  },
  get_content() {
    let obj = {}
    obj['signUpOneId'] = this.data.userInfo.oneId
    obj['activityId'] = this.data.id
    getActivityInfoAndSingUpStatus(obj).then(res => {
      if (res.code == 0) {
        res.data['startTime'] = res.data['startTime'] ? res.data['startTime'].substr(0, 10) : ''
        res.data['endTime'] = res.data['endTime'] ? res.data['endTime'].substr(0, 10) : ''
        if(res.data['activityContent']){
          res.data['activityContent'] = this.rich_text_img(res.data['activityContent'])
        }

        res.data['swiper'] = []
        if(res.data['detailImg1']){
          res.data['swiper'].push(res.data['detailImg1'])
        }
        if(res.data['detailImg2']){
          res.data['swiper'].push(res.data['detailImg2'])
        }
        if(res.data['detailImg3']){
          res.data['swiper'].push(res.data['detailImg3'])
        }

        if(res.data['activityType'] == '见面礼') {
          wx.setNavigationBarTitle({
            title: '见面礼'
          })
        }
        this.setData({ content: res.data })
      }
    })
  },

  get_userAllInfo() {
    getUserAllInfo({
      userId: this.data.scene['2']  || ''
    }).then(res => {
      if (res.code == 0) {
        res.data['userName'] = res.data && res.data['userName'] ? res.data['userName'].substr(0,4) : ""
        this.setData({ adviserInfo: res.data })
      }
    })
  },
  phoneCall(e) {
    uni.makePhoneCall({
      phoneNumber: this.adviserInfo.userPhone
    });
  },
  rich_text_img(str) {
    str = str.replace(/\<img/gi, '<img');
    return str
  },
  join_gift() {
    wx.navigateTo({
      url: '/pages/gift/join/index?id=' + this.data.id,
    })
  },
  get_phone(e) {
    if (e.detail.errMsg == "getPhoneNumber:ok") {
      let obj = {}
      obj['openId'] = this.data.userInfo.openId
      obj['session_key'] = app.globalData.session_key
      obj['encryptedData'] = e.detail.encryptedData
      obj['iv'] = e.detail.iv
      decrypt(obj).then(res => {
        if (res.code == 0) {
          app.globalData.user_info.phone = res.data.phone
          this.setData({ 'userInfo.phone': res.data.phone })
          
          addWxUser({
            openId: app.globalData.user_info.openId,
            phone: app.globalData.user_info.phone
          }).then(res_phone => {
            this.receive()
          })
        }
      })
    }
  },

  receive(){
    addSignUp({
      activityId: this.data.id || '',
      oneId: this.data.userInfo.openId || '',
      salesmanId: this.data.scene['2']  || '',
      openIdPhone:  this.data.userInfo.phone || '',
      signUpPhone:  this.data.userInfo.phone || '',
    }).then(res => {
      if (res.code == 0) {
        wx.showToast({
          title: '领取成功',
          icon: 'none',
          duration: 1500
        })
        this.get_content()
      }
      else{
        wx.showToast({
          title: res.errMsg,
          icon: 'none',
          duration: 1500
        })
      }
    })
  }
})