const app = getApp();
import {
  queryDealerByCityNameAndCarSeriesId
} from "../../../server/api";
Page({
  data: {
    oss_url: app.globalData.oss_url,
    city: '',
    list_dealer: []
  },
  onLoad: function (options) {
    this.setData({ car_info: options })
  },
  onShow: function (options) {
    this.setData({ city: app.globalData.city })
    this.get_dealer()
  },
  get_dealer() {
    let obj = {}
    obj['cityName'] = app.globalData.city
    obj['carSeriesId'] = this.data.car_info['modelId']
    obj['city'] = app.globalData.city
    queryDealerByCityNameAndCarSeriesId(obj).then(res => {
      if (res.code == 0) {
        this.setData({ list_dealer: res.data })
      }
    })
  },
  to_show(e) {
    wx.navigateTo({
      url: '/pages/gift/show/index?id=' + e.currentTarget.dataset['id']
    })
  },
  make_phone(e) {
    // if (e.currentTarget.dataset.phone == '') {
    //   return
    // }
    wx.makePhoneCall({
      // phoneNumber: e.currentTarget.dataset.phone
      phoneNumber: '4008086931'
    })
  },
  to_location() {
    wx.navigateTo({
      url: '/pages/main/chooseACity/index',
    })
  }
})