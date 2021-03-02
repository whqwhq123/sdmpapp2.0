const app = getApp();
import {
  getSmallProgramActivities,
  queryDealerByCityNameAndCarSeriesId
} from "../../../server/api";
Page({
  data: {
    oss_url: app.globalData.oss_url,
    isOperate: false,
    car_info: {},
    list_gift: [],
    list_dealer: [],
    city: ''
  },
  onLoad: function (options) {
    this.setData({car_info: options,city: app.globalData.city})
    this.get_gift()
    this.get_dealer()
  },
  get_dealer(){
    let obj = {}
    obj['cityName'] = app.globalData.city
    obj['carSeriesId'] = this.data.car_info['modelId']
    obj['city'] = app.globalData.city
    queryDealerByCityNameAndCarSeriesId(obj).then(res => {
      if (res.code == 0) {

        this.setData({list_dealer:res.data})
        console.log(this.data.list_dealer);
      }
    })
  },
  get_gift(){
    let obj = {}
    obj['type'] = 'detail'
    obj['modelId'] = this.data.car_info['modelId']
    obj['city'] = app.globalData.city
    getSmallProgramActivities(obj).then(res => {
      if (res.code == 0) {
        let arr = res.data
        for (let i = 0; i < arr.length; i++) {
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
        this.setData({ list_gift: arr })
      }
    })
  },
  to_show(e) {
    wx.navigateTo({
      url: '/pages/gift/show/index?id=' + e.currentTarget.dataset['id']
    })
  },
  onPageScroll(e) {
    if (e.scrollTop >= 200) {
      this.setData({
        isOperate: true,
      })
    } else {
      this.setData({
        isOperate: false
      })
    }
  },
  make_phone(e){
    if(e.currentTarget.dataset.phone == '' || e.currentTarget.dataset.phone == null){
      // wx.showToast({
      //   title: '暂无电话拨打',
      //   icon:'none'
      // })
      wx.makePhoneCall({
        phoneNumber: '4008086931'
      })
      return
    }
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.phone
    })
  },
  // pages/main/trainDetails/index
  make_train(e){
    // e.currentTarget.dataset
    wx.navigateTo({
      url: '/pages/main/askFloorPrice/index?modelId='+1,
    })
  }
})