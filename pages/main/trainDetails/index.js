const app = getApp();
import Toast from '@vant/weapp/toast/toast';
import { getCarModelLevel, getCarStyle, getSmallProgramActivities } from './../../../server/api'
Page({
  data: {
    navbarInitTop: 0, //导航栏初始化距顶部的距离
    isFixedTop: false, //是否固定顶部
    oss_url: app.globalData.oss_url,
    city: '',
    showShare: false,
    carStyleData: [],
    list_gift: [],
    currentIndex: 0,
    carStyle: '',
    modelId: '',
    price: '',
    ossUrl: '',
    options: [
      { name: '微信', icon: 'wechat', openType: 'share' },
      { name: '复制链接', icon: 'link' },
    ],
  },
  onLoad: function (options) {
    let data = {
      modelId: options.modelId
    }

    this.getCarModelDetail(data);
    this.getCarStyleData(data);
    wx.setNavigationBarTitle({
      title: options.modelName,
    })
    this.setData({
      ossUrl: options.ossUrl,
      price: options.price,
      modelId: options.modelId
    })
    this.get_gift()
  },
  getCarModelDetail(data) {
    getCarModelLevel(data).then(res => {
      if (res.code == 0) {
        this.setData({
          carStyle: res.data
        })
      }
    })
  },
  getCarStyleData(data) {
    getCarStyle(data).then(res => {
      if (res.code == 0) {
        this.setData({
          carStyleData: res.data
        })
      }
    })
  },
  onShow: function () {
    var that = this;
    if (that.data.navbarInitTop == 0) {
      wx.createSelectorQuery().select('#navbar').boundingClientRect(function (rect) {
        if (rect && rect.top > 0) {
          var navbarInitTop = parseInt(rect.top);
          that.setData({
            navbarInitTop: navbarInitTop
          });
        }
      }).exec();

    }
    this.setData({
      city: app.globalData.city
    })
    this.get_gift()
  },
  swiperChange(e) {
    let { current } = e.detail;
    this.setData({
      currentIndex: current
    })
  },
  get_gift() {
    let obj = {}
    obj['type'] = 'detail'
    obj['city'] = app.globalData.city
    obj['modelId'] = this.data.modelId
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
  to_gift() {
    wx.navigateTo({
      url: '/pages/main/activityCourtesy/index?id=' + this.data.modelId,
    })
  },
  to_show(e) {
    wx.navigateTo({
      url: '/pages/gift/show/index?id=' + e.currentTarget.dataset['id']
    })
  },
  onPageScroll: function (e) {
    if (e.scrollTop >= 300) {
      this.setData({
        isOperate: true,
      })
    } else {
      this.setData({
        isOperate: false
      })
    }
    var that = this;
    var scrollTop = parseInt(e.scrollTop); //滚动条距离顶部高度
    //判断'滚动条'滚动的距离 和 '元素在初始时'距顶部的距离进行判断
    var isSatisfy = scrollTop >= that.data.navbarInitTop ? true : false;
    //为了防止不停的setData, 这儿做了一个等式判断。 只有处于吸顶的临界值才会不相等
    if (that.data.isFixedTop === isSatisfy) {
      return false;
    }
    that.setData({
      isFixedTop: isSatisfy
    });
  },
  //分享设置
  shareClick(event) {
    // console.log(event,"eventevent");
    this.setData({ showShare: true });
  },

  onClose() {
    this.setData({ showShare: false });
  },

  onSelect(event) {
    Toast(event.detail.name);
    this.onClose();
  },
  //地址切换选择
  addressClick() {
    wx.navigateTo({
      url: '/pages/main/chooseACity/index',
    })
  },
  dealersList() {  //调至经销商页面
    wx.navigateTo({
      url: `/pages/main/dealerList/index?modelId=${this.data.modelId}`,
    })
  },
  // 在售车型点击事件
  modelsSaleClick(e) {
    let { modelid, styleid, price, stylefullname, } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/main/modelDetails/index?modelId=${modelid}&styleId=${styleid}&vendorPrice=${price}&saleCarTitle=${stylefullname}&ossUrl=${this.data.ossUrl}`,
    })
  },
  askPrice() {
    wx.navigateTo({
      url: `/pages/main/askFloorPrice/index?modelId=${this.data.modelId}&ossUrl=${this.data.ossUrl}`,
    })
  },
  testDrive() {
    wx.navigateTo({
      url: `/pages/main/testDrive/index?modelId=${this.data.modelId}&ossUrl=${this.data.ossUrl}`,
    })
  }
})
