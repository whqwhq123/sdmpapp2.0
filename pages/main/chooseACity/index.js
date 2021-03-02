// pages/main/chooseACity/index.js
import {
  getCitysList
} from './../../../server/api'
const app = getApp();
Page({
  data: {
    indexList: [],
    oss_url: app.globalData.oss_url,
    citysData: [],
    currentCity: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({currentCity: app.globalData.city})
    this.cityData()
  },
  cityData() {
    getCitysList().then(res => {
      if (res.code == 0) {
        this.setData({
          citysData: res.data,
        })
        if(app.globalData.city == ''){
          this.setData({
            currentCity: res.data[0].nameCity
          })
        }
      }
    })
  },
  selectCity(e) {
    let city = e.currentTarget.dataset.city;
    app.globalData.city = city
    wx.navigateBack({
      delta: 1
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  }
})