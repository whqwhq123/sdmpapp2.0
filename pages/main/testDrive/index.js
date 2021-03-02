// pages/mine/index.js
const app = getApp();
import Toast from '@vant/weapp/toast/toast';
import { getDealersData, postAskPrice, getCarStyle, getCitysList,decrypt,addWxUser} from './../../../server/api'
import { get_phone } from './../../../utils/util'
Page({
  data: {
    oss_url: app.globalData.oss_url,
    ossUrl: '',
    city: app.globalData.city,
    rightIcon: '',
    white: '#fff',
    activeIndex: 0,
    userData: {},
    citys: [],
    countryIndex: 0,
    genterIndex: 0,
    reject: 0,
    customerName: '',
    phone: '',
    show: false,
    showtime: false,
    sex: '先生',
    countryCodeIndex: '',
    dealerResult: '',
    dealerList: [],
    nowSaleCarsData: [],
    date:new Date(),
    driveTime:'',
    genter: [
      {
        sex: '先生'
      },
      {
        sex: '女士'
      }
    ],
    currentDate: new Date().getTime(),
    minDate: new Date().getTime(),
    formatter(type, value) {
      if (type === 'year') {
        return `${value}`;
      } else if (type === 'month') {
        return `${value}`;
      }
      return value;
    },
  },
  onInput(event) {

    this.setData({
      currentDate: event.detail,
    });
  },
  confirmFun(value){
    this.setData({ showtime: false });
  },
  cancelFun(){
    this.setData({ showtime: false,currentDate:new Date().getTime()});
  },
  bindDateChange(e){
    this.setData({
      currentDate: e.detail.value,
      date:e.detail.value
  })
  },
  onLoad: function (options) {
    this.setData({
      rightIcon: this.data.oss_url + '/right-icon.png',
      ossUrl: options.ossUrl,
      modelId: options.modelId,
      phone: app.globalData.user_info.phone,
      oneId: app.globalData.user_info.oneId,
      city: app.globalData.city
    })
    
    let data = {
      modelId: options.modelId
    }
    this.getDealersList();
    this.getCarStyleData(data);
    this.cityData();
    this.getNowFormatDate()
  },
  getNowFormatDate() {
      var date = new Date();
      var seperator1 = "1";
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      var strDate = date.getDate();
      if (month >= 1 && month <= 9) {
          month = "0" + month;
      }
      if (strDate >= 0 && strDate <= 9) {
          strDate = "0" + strDate;
      }
      var currentdate = year + '/' + month + '/' + strDate;
      this.setData({
        date:currentdate
      })
    },
  onShow: function () {

  },
  to_agreement() {
    wx.navigateTo({
      url: '/pages/mine/agreement/index',
    })
  },
  getDealersList() {
    let data = {
      carSeriesId: this.data.modelId,
      cityName: this.data.city
    }

    getDealersData(data).then(res => {
      if (res.code == 0) {
        this.setData({
          dealerList: res.data
        })
      }
    })
  },
  getCarStyleData(data) {
    getCarStyle(data).then(res => {
      if (res.code == 0) {
        this.setData({
          nowSaleCarsData: res.data
        })
      }
    })
  },
  showSaleCars() {
    this.setData({
      show: true
    })
  },
  hideOverlay() {
    this.setData({
      show: false
    })
  },
  form_phone_change(e) {
    this.setData({
      phone_input: e.detail.value
    })
  },
  getName(e) {
    this.setData({
      customerName: e.detail.value
    })
  },
  get_phone(e) {
    if (e.detail.errMsg == "getPhoneNumber:ok") {
      let obj = {}
      obj['openId'] = app.globalData.user_info.openId
      obj['session_key'] = app.globalData.session_key
      obj['encryptedData'] = e.detail.encryptedData
      obj['iv'] = e.detail.iv
      decrypt(obj).then(res => {
        if (res.code == 0) {
          app.globalData.user_info.phone = res.data.phone
          this.setData({ phone: app.globalData.user_info.phone })
          let obj_phone = {}
          obj_phone['openId'] = app.globalData.user_info.openId
          obj_phone['phone'] = app.globalData.user_info.phone
          addWxUser(obj_phone).then(res_phone => {
          //  console.log(res_phone,"res_phoneres_phone");
          })
        }
      })
    } else {
      this.setData({ reject: 1 })
    }
  },
  get_openid() {
    wx.login({
      success(res) {

        if (res.code) {
          let obj = {}
          obj['jsCode'] = res.code
          getOpenId(obj).then(res_openid => {
            if (res_openid.code == 0) {
              app.globalData.user_info.openid = res_openid.data.openid
              let obj = {}
              obj['openId'] = app.globalData.user_info.openid
              getWxUser(obj).then(res_user => {
                if (res_user.data) {
                  app.globalData.user_info = res_user.data
                }
              })
            }
          })
        }
      }
    })
  },
  formValidate() {
    //  let dealerId='';
    if (this.data.customerName == '') {
      wx.showToast({
        title: '请填写您的称呼',
        icon: 'none',
        duration: 1500
      })
      return
    }
    if (this.data.reject == 0 && this.data.phone == '') {
      wx.showToast({
        title: '请填写手机号',
        icon: 'none',
        duration: 1500
      })
      return
    }
    if (this.data.reject == 1 && !this.check_phone(this.data.phone_input)) {
      wx.showToast({
        title: '请填写手机号',
        icon: 'none',
        duration: 1500
      })
      return
    }

    if (this.data.dealerResult == '') {
      wx.showToast({
        title: '请选择经销商',
        icon: 'none',
        duration: 1500
      })
      return
    }
    let dealerId = this.data.dealerResult.toString();
    let data = {
      oneId: this.data.oneId,
      sex: this.data.sex,
      customerName: this.data.customerName,
      mobile: this.data.phone,
      city: this.data.city,
      dealerIds: dealerId,
      driveTime:this.data.date,
      client:'program'
    }
    postAskPrice(data).then(res => {
      if (res.code == 0) {
        wx.showToast({
          title: '已申请试驾，稍后会有销售顾问联系您',
          icon: 'none',
          duration: 1500
        })
        setTimeout(function(){
          wx.navigateBack({
            delta: 1
          })
        },2000)
      } else {
        wx.showToast({
          title: res.errMsg,
          icon: 'none',
          duration: 1500
        })
      }
    })
  },
  genterSelect(e) {
    this.setData({
      activeIndex: e.currentTarget.dataset.index,
      sex: e.currentTarget.dataset.sex
    })
  },
  bindCountryChange(e) {
    this.setData({
      city: this.data.citys[e.detail.value]
    })
   
  },
  checkboxChange(event) {
    if(event.detail.value.length > 5){
      wx.showToast({
        title: '最多选择5家经销商',
        icon: 'none',
        duration: 1000
      })
    }
    let arr = this.data.dealerList
    for(let i = 0; i < arr.length; i++){
      if(event.detail.value.indexOf(arr[i]['deptId'].toString()) > -1 && i < 5){
        arr[i]['checked'] = true
      }
      else{
        arr[i]['checked'] = false
      }
    }

    this.setData({
      dealerResult: event.detail.value,
      dealerList: arr
    });
  },
  cityData() {
    getCitysList().then(res => {
      if (res.code == 0) {
        let arr = []
        for(let i = 0; i < res.data.length; i++){
          for(let j = 0; j < res.data[i]['city'].length; j++){
            arr.push(res.data[i]['city'][j]['nameCity'])
          }
        }
        this.setData({
          citys: arr
        })
      }
    })
  },
  onClosetime(){
    this.setData({ showtime: false });
  },
  showPopup() {
    this.setData({ showtime: true });
  },
  get_phone(e) {
    if (e.detail.errMsg == "getPhoneNumber:ok") {
      let obj = {}
      obj['openId'] = app.globalData.user_info.openId
      obj['session_key'] = app.globalData.session_key
      obj['encryptedData'] = e.detail.encryptedData
      obj['iv'] = e.detail.iv
      decrypt(obj).then(res => {
        if (res.code == 0) {
          app.globalData.user_info.phone = res.data.phone
          this.setData({ phone: app.globalData.user_info.phone })
          let obj_phone = {}
          obj_phone['openId'] = app.globalData.user_info.openId
          obj_phone['phone'] = app.globalData.user_info.phone
          addWxUser(obj_phone).then(res_phone => {
         //     console.log(res_phone,"获取的手机数据");
              this.setData({
                phone:res_phone.data || ''
              })
              wx.showToast({
                title: res.errMag,
              })
          })
        }
      })
    } else {
      this.setData({ reject: 1 })

    }
  },
})