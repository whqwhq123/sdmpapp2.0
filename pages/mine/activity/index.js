const app = getApp();
import {
  joinActivities
} from "../../../server/api";
Page({
  data: {
    oss_url: app.globalData.oss_url,
    list: []
  },
  onLoad: function (options) {
    this.get_list()
  },
  get_list() {
    let obj = {}
    obj['type'] = 'activity'
    obj['oneId'] = app.globalData.user_info.oneId
    joinActivities(obj).then(res => {
      if (res.code == 0) {
        let arr = this.data.list
        for(let i = 0; i < res.data.length; i++){
          res.data[i]['startTime'] = res.data[i]['startTime'].substr(0,10)
          res.data[i]['endTime'] = res.data[i]['endTime'].substr(0,10)
          res.data[i]['swiper'] = []
          if(res.data[i]['operationImg1']){
            res.data[i]['swiper'].push(res.data[i]['operationImg1'])
          }
          if(res.data[i]['operationImg2']){
            res.data[i]['swiper'].push(res.data[i]['operationImg2'])
          }
          if(res.data[i]['operationImg3']){
            res.data[i]['swiper'].push(res.data[i]['operationImg3'])
          }
        }
        arr.push(...res.data)
        this.setData({ list: arr })
      }
    })
  },
  to_show(e){
    wx.navigateTo({
      url: '/pages/gift/show/index?id='+e.currentTarget.dataset['id']
    })
  }
})