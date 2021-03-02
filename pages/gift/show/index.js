const app = getApp()
import {
  getActivityInfoAndSingUpStatus
} from "../../../server/api"
Page({
  data: {
    id: '',
    oss_url: app.globalData.oss_url,
    content: {},
    end: 0,
    back: true
  },
  onLoad: function (options) {
    this.data.id = options['id']
  },
  onShow: function () {
    if(wx.getLaunchOptionsSync().scene == 1007 || wx.getLaunchOptionsSync().scene == 1008){
      this.setData({back : false})
    }
    this.get_content()
  },
  onShareAppMessage: function () {
    let that = this;
    return {
      title: that.data.content['activityName'],
      imageUrl: that.data.content['detailImg1'],
      path: '/pages/gift/show/index?id=' + this.data.id,
      success: (res) => {

      }
    }
  },
  get_content() {
    let obj = {}
    obj['signUpOneId'] = app.globalData.user_info.oneId
    obj['activityId'] = this.data.id
    getActivityInfoAndSingUpStatus(obj).then(res => {
      if (res.code == 0) {
        let end_time = this.time_to_str(res.data['endTime'])
        end_time = end_time.substr(0, 14)
        let now_time = this.get_time()
        if(now_time > end_time){
          this.setData({end: 1})
        }
        res.data['startTime'] = res.data['startTime'].substr(0, 10)
        res.data['endTime'] = res.data['endTime'].substr(0, 10)
        if (res.data['activityContent']) {
          res.data['activityContent'] = this.rich_text_img(res.data['activityContent'])
        }

        res.data['swiper'] = []
        if (res.data['detailImg1']) {
          res.data['swiper'].push(res.data['detailImg1'])
        }
        if (res.data['detailImg2']) {
          res.data['swiper'].push(res.data['detailImg2'])
        }
        if (res.data['detailImg3']) {
          res.data['swiper'].push(res.data['detailImg3'])
        }

        this.setData({ content: res.data })
      }
    })
  },
  rich_text_img(str) {
    str = str.replace(/\<img/gi, '<img');
    return str
  },
  join_gift() {
    wx.navigateTo({
      url: '/pages/gift/join/index?id=' + this.data.id
    })
  },
  time_to_str(str) {
    str = str.replace('T', '')
    str = str.replace('-', '')
    str = str.replace('-', '')
    str = str.replace(':', '')
    str = str.replace(':', '')
    return str
  },
  get_time() {
    let dateTime
    let yy = new Date().getFullYear() < 10 ? '0' + new Date().getFullYear() : new Date().getFullYear()
    let mm = new Date().getMonth() + 1
    if(mm < 10){
      mm = '0' + mm
    }
    let dd = new Date().getDate() < 10 ? '0' + new Date().getDate() : new Date().getDate()
    let hh = new Date().getHours() < 10 ? '0' + new Date().getHours() : new Date().getHours()
    let mf = new Date().getMinutes() < 10 ? '0' + new Date().getMinutes() : new Date().getMinutes()
    let ss = new Date().getSeconds() < 10 ? '0' + new Date().getSeconds() : new Date().getSeconds()
    dateTime = yy + mm + dd + hh + mf + ss
    return dateTime
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