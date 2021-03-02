const app = getApp()
import {
  getActivityInfoAndSingUpStatus,
  decrypt,
  addWxUser,
  addSignUp,
  getOneId
} from "../../../server/api";
Page({
  data: {
    id: '',
    oss_url: app.globalData.oss_url,
    content: {},
    reject: 0,
    username: '',
    phone: '',
    remark: '',
    num: [0, 0, 0],
    oneId: ''
  },
  onLoad: function (options) {
    this.data.id = options['id']
    this.setData({ phone: app.globalData.user_info.phone })
    this.get_content();
    this.getOneId();
  },
  getOneId() {
    let data = {
      openId: app.globalData.user_info.openId,
      phone: this.data.phone
    }
    getOneId(data).then(res => {
      if (res.code == 0) {
        this.setData({
          oneId: res.data
        })
      }
    })
  },

  get_content() {
    let obj = {}
    obj['signUpOneId'] = app.globalData.user_info.oneId
    obj['activityId'] = this.data.id
    getActivityInfoAndSingUpStatus(obj).then(res => {
      if (res.code == 0) {
        res.data['startTime'] = res.data['startTime'].substr(0, 10)
        res.data['endTime'] = res.data['endTime'].substr(0, 10)
        this.setData({ content: res.data })
      }
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

          })
        }
      })
    } else {
      this.setData({ reject: 1 })
    }
  },
  change_num(e) {
    let arr = this.data.num
    if (e.currentTarget.dataset['type'] == 1) {
      arr[e.currentTarget.dataset['index']] = arr[e.currentTarget.dataset['index']] + 1
    } else if (e.currentTarget.dataset['type'] == 0) {
      arr[e.currentTarget.dataset['index']] = arr[e.currentTarget.dataset['index']] - 1
    }
    this.setData({ num: arr })
  },
  form_name_change(e) {
    this.setData({
      username: e.detail.value
    })
  },
  form_phone_change(e) {
    this.setData({
      phone: e.detail.value
    })
  },
  form_remark_change(e) {
    this.setData({
      remark: e.detail.value
    })
  },
  submit() {
    if (this.data.num[0] == 0 && this.data.num[1] == 0 && this.data.num[2] == 0) {
      wx.showToast({
        title: '请选择参与人数',
        icon: 'none',
        duration: 1500
      })
      return
    }
    if (this.data.username == '') {
      wx.showToast({
        title: '请填写您的称呼',
        icon: 'none',
        duration: 1500
      })
      return
    }
    if (this.data.phone == '') {
      wx.showToast({
        title: '请填写手机号',
        icon: 'none',
        duration: 1500
      })
      return
    }

    let obj = {}
    obj['activityId'] = this.data.id
    obj['oneId'] = this.data.oneId
    obj['signUpName'] = this.data.username
    obj['signUpPhone'] = this.data.phone
    if (app.globalData.user_info.phone) {
      obj['openIdPhone'] = app.globalData.user_info.phone
    }
    obj['signUpMale'] = this.data.num[0]
    obj['signUpFemale'] = this.data.num[1]
    obj['signUpChild'] = this.data.num[2]
    obj['signUpRemark'] = this.data.remark
    addSignUp(obj).then(res => {
      if (res.code == 0) {
        wx.showToast({
          title: '报名成功',
          icon: 'none',
          duration: 1500
        })
        setTimeout(function () {
          wx.navigateBack({
            delta: 1
          })
        }, 1500);
      }
      else {
        wx.showToast({
          title: res.errMsg,
          icon: 'none',
          duration: 1500
        })
      }
    })
  },
  check_phone(phone) {
    let reg = new RegExp("^[1][3,4,5,7,8][0-9]{9}$");
    return reg.test(phone)
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
  }
})