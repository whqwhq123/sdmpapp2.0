const app = getApp();
import {
  getSmallProgramActivities,
  addWxUser
} from "../../server/api";
Page({
  data: {
    oss_url: app.globalData.oss_url,
    list: [],
    user_info: {},
    navigation_show: true
  },
  onLoad: function () {
    this.get_list()
    this.setData({user_info: app.globalData.user_info})
  },
  get_list() {
    let obj = {}
    obj['type'] = 'my'
    obj['city'] = app.globalData.city
    getSmallProgramActivities(obj).then(res => {
      if (res.code == 0) {
        let arr = res.data
        for (let i = 0; i < arr.length; i++) {
          arr[i]['startTime'] = arr[i]['startTime'].substr(0, 10)
          arr[i]['endTime'] = arr[i]['startTime'].substr(0, 10)
          arr[i]['swiper'] = []
          if (arr[i]['operationImg1']) {
            arr[i]['swiper'].push(arr[i]['operationImg1'])
          }
          if (arr[i]['operationImg2']) {
            arr[i]['swiper'].push(arr[i]['operationImg2'])
          }
          if (arr[i]['operationImg3']) {
            arr[i]['swiper'].push(arr[i]['operationImg3'])
          }
        }
        this.setData({ list: arr })
      }
    })
  },
  to_show(e) {
    wx.navigateTo({
      url: '/pages/gift/show/index?id=' + e.currentTarget.dataset['id']
    })
  },
  please_wait() {
    wx.showToast({
      title: '敬请期待',
      icon: 'none',
      duration: 1500
    })
  },
  get_user_info(e) {
    if (e.detail.userInfo) {
      this.setData({user_info: e.detail.userInfo})
      app.globalData.user_info['nickName'] = e.detail.userInfo.nickName
      app.globalData.user_info['avatarUrl'] = e.detail.userInfo.avatarUrl
      let obj = {}
      obj['openId'] = app.globalData.user_info.openId
      obj['nickName'] = e.detail.userInfo.nickName
      obj['avatarUrl'] = e.detail.userInfo.avatarUrl
      addWxUser(obj).then(res => {

      })
    }
  },
  to_activity(){
    wx.navigateTo({
      url: '/pages/mine/activity/index',
    })
  },
  to_gift(){
    wx.navigateTo({
      url: '/pages/mine/gift/index',
    })
  },
  onPageScroll: function (e) {
    if (e.scrollTop >= 30) {
      this.setData({
        navigation_show: false
      })
    } else {
      this.setData({
        navigation_show: true
      })
    }
  }
})