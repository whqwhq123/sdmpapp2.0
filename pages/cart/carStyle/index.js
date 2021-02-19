// pages/cart/carStyle/carSelect.js
import {
  getSeriesNames
} from "../../../server/api"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    autoLogos: [],
    setArray: [],
    bname: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      bname: options.bname
    })
    if (wx.getStorageSync('query')) {
      var arr = JSON.parse(wx.getStorageSync('query'))
      var array = []
      for (let i = 0; i < arr.length; i++) {
        array.push(arr[i].pname)
      }
      var newSet = new Set(array);
      this.setData({
        setArray: this.dedupe(newSet)
      })
    }
    this.get_list()
  },
  dedupe(arr) {
    var newSet = new Set(arr);
    return Array.from(newSet);
  },
  get_list() {
    let data = {}
    data.brandName = this.data.bname
    getSeriesNames(data).then(res => {
      if (res.code == 200) {
        this.setData({
          autoLogos: res.data
        })
        for (let i = 0; i < this.data.setArray.length; i++) {
          for (let j = 0; j < this.data.autoLogos.length; j++) {
            if (this.data.setArray[i] == this.data.autoLogos[j]) {
              this.data.autoLogos.splice(this.data.autoLogos.findIndex(item => item === this.data.autoLogos[j]), 1)
            }
          }
        }
        this.setData({
          autoLogos: this.data.autoLogos
        })
      }
    });
  },
  brandRouter(e) {
    var obj = {}
    let arr = []
    if (wx.getStorageSync('query')) {
      arr = JSON.parse(wx.getStorageSync('query'))
    }
    obj.bname = this.data.bname
    obj.bCheckout = true
    obj.pname = e.currentTarget.dataset.name
    arr.push(obj)
    wx.setStorageSync('query', JSON.stringify(arr))
    wx.reLaunch({
      url: "/pages/cart/series/index",
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})