// pages/mine/index.js
const app = getApp();
import {
  getBrandList,
  getCarModelList,
  getCitysList,
  getSmallProgramActivities,
  getCarModelOrderList,
  getSelectCarModel,
  getWxUser,
  getOpenId,
  getOneId
} from './../../../server/api'
Page({
  data: {
    oss_url: app.globalData.oss_url,
    openId: app.globalData.user_info.openId,
    phone: app.globalData.user_info.phone,
    brandList: [],
    hotCarList: [],
    currentIndex: 0,
    activeName: 'sale',
    show: false,
    tabShow: false,
    lockLocall: true,
    tabsTitle: ['在售', '未售/停售'],
    list_gift: [],
    currentCity: '',
    makeId: '',
    makeName: '',
    carModelList: [],
    isSale:1,
    navigation_show: true
  },
  onLoad: function (options) {
    this.get_openId();
    this.getBrandData();
    this.getHotCarsList();
    this.cityData();
  },
  onShow: function () {
    this.setData({
      currentCity: app.globalData.city
    })
    this.get_gift();
  },
  getOneId() {
    let data = {
      openId: app.globalData.user_info.openId,
      phone: this.data.phone
    }
    getOneId(data).then(res => {
      if (res.code == 0) {
        app.globalData.user_info.oneId = res.data
      }
    })
  },
  getBrandData() {
    getBrandList().then(res => {
      if (res.code == 0) {
        this.setData({
          brandList: res.data
        })
      }
    })
  },
  getHotCarsList() {
    getCarModelList().then(res => {
      if (res.code == 0) {
        this.setData({
          hotCarList: res.data
        })
      }
    })
  },
  cityData() {
    getCitysList().then(res => {
      if (res.code == 0) {
        this.setData({
          currentCity: res.data[0].nameCity
        })
      }
    })
  },
  swiperChange(e) {
    let { current } = e.detail;
    this.setData({
      currentIndex: current
    })
  },
  showSaleCars(e) {
    let { makeid, makename } = e.currentTarget.dataset;
    let data = {
      makeId: makeid,
      onSale: this.data.isSale
    }
    this.getCarModelData(data)
    this.setData({
      show: true,
      tabShow: true,
      makeName: makename,
      makeId: makeid
    })
  },
  getCarModelData(data) {
    console.log(data)
    let that=this;
    getSelectCarModel(data).then(res => {
      if (res.code == 0) {
        that.setData({
          carModelList: res.data
        })
      }
    })
  },
  saleData(e) {
    if(e.currentTarget.id=='sale'){
      this.data.isSale=1
    }else{
      this.data.isSale=0
    }
    let data = {
      makeId: this.data.makeId,
      onSale: this.data.isSale
    }
    getSelectCarModel(data).then(res => {
      if (res.code == 0) {
        this.setData({
          carModelList: res.data
        })
      }
    })
  },
  hideOverlay() {
    this.setData({
      show: false
    })
  },
  chooseCity: function () {
    wx.navigateTo({
      url: '/pages/main/chooseACity/index',
    })
  },
  goDetails(e) {
    // console.log(e)
    let { ossurl, modelid, modelname, price } = e.currentTarget.dataset;
    wx.navigateTo({
      url: '/pages/main/trainDetails/index?ossUrl=' + ossurl + '&modelId=' + modelid + '&modelName=' + modelname + '&price=' + price
    })
  },
  get_openId() {
    wx.login({
      success(res) {
        if (res.code) {
          let obj = {}
          obj['jsCode'] = res.code
          getOpenId(obj).then(res_openId => {
            if (res_openId.code == 0) {
              app.globalData.user_info.openId = res_openId.data.openid
              app.globalData.session_key = res_openId.data.session_key
              let obj = {}
              obj['openId'] = app.globalData.user_info.openId
              getWxUser(obj).then(res_user => {
                if (res_user.data) {
                  app.globalData.user_info = res_user.data
                }
              });

              getOneId(obj).then(res => {
                if (res.code == 0) {
                  app.globalData.user_info.oneId = res.data
                }
              })
            }
          })
        }
      }
    })
  },
  get_gift() {
    let obj = {}
    obj['type'] = 'index'
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
        this.setData({ list_gift: arr })
      }
    })
  },
  to_show(e) {
    wx.navigateTo({
      url: '/pages/gift/show/index?id=' + e.currentTarget.dataset['id']
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