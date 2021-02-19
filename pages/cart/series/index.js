// pages/cart/carStyle/series.js
import {
  getCompetitions
} from "../../../server/api"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    checkArr: [],
    contendList: [],
    carArr:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (wx.getStorageSync('query')) {
      this.setData({
        checkArr: JSON.parse(wx.getStorageSync('query'))
      })
      for (let i = 0; i < this.data.checkArr.length; i++) {
        if (this.data.checkArr[i].bCheckout) {
            this.data.carArr.push(this.data.checkArr[i].pname)
        }
    }
    this.setData({
      carArr: this.data.carArr
    })
    }
    this.getlist()
  },
  //车型选择
  getcar(event) {
    //多选矿启用禁用
    for (let i = 0; i < this.data.checkArr.length; i++) {
      if (this.data.checkArr[i].pname == event.currentTarget.dataset.item.pname) {
        this.data.checkArr[i].bCheckout = event.detail
      }
    }
    this.setData({
      checkArr: this.data.checkArr,
    });
    var arr = []
    //选中车型
    if (event.currentTarget.dataset.item.bCheckout) {
      this.data.carArr.push(event.currentTarget.dataset.item.pname)
      this.setData({
        carArr: this.data.carArr
      })
    } else {
      this.data.carArr.splice(this.data.carArr.findIndex(item => item === event.currentTarget.dataset.item.pname), 1);
      this.setData({
        carArr: this.data.carArr
      })
    }
console.log(this.data.carArr)
  },
  //竞品选择
  getcars(event){
    console.log(event.currentTarget.dataset.item)
    for (let i = 0; i < this.data.contendList.length; i++) {
      if (this.data.contendList[i].pname == event.currentTarget.dataset.item.pname) {
        this.data.contendList[i].bCheckout = event.detail
      }
    }
    this.setData({
      contendList: this.data.contendList,
    });
  },
  getlist() {
    let data = {}
    data.seriesNames = this.data.carArr.join(",")
    getCompetitions(data).then(res => {
        if (res.code == 200) {
            var arr = []
            for (let i = 0; i < res.data.length; i++) {
                arr.push({
                    bCheckout: false,
                    pname: res.data[i]
                })
            }
            this.setData({
              contendList:arr
            })
        }
    });
},
isPk() {
  let array = []
  for (let i = 0; i < this.data.checkArr.length; i++) {
      if (this.data.checkArr[i].bCheckout) {
          array.push(this.data.checkArr[i].pname)
      }
  }
  for (let i = 0; i < this.data.contendList.length; i++) {
      if (this.data.contendList[i].bCheckout) {
          array.push(this.data.contendList[i].pname)
      }
  }
  var carStyle = array.join(",")

  wx.navigateTo({
    url: "/pages/cart/pk/index?car="+carStyle
  })
},
  routerPush() {
    wx.navigateTo({
      url: "/pages/cart/brand/index"
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