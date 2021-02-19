// pages/cart/carStyle/brand.js
import {
  getBrands
} from "../../../server/api"
Page({
  /**
   * 页面的初始数据
   */
  data: {
    autoLogos: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.get_list()
  },
  get_list() {
    getBrands({}).then((res) => {
        this.setData({
          autoLogos: res.data
        })
      })
      .catch(() => {
        console.log("error");
        this.$message({
          message: "服务器异常",
          type: "error",
        });
      });
  },
  brandRouter(e){
    wx.navigateTo({
      url:"/pages/cart/carStyle/index?bname=" +e.currentTarget.dataset.name
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