const app = getApp();
import {
  getSmallProgramActivities
} from "../../../server/api";
Page({
  data: {
    oss_url: app.globalData.oss_url,
    list: [],
    modelId: 0
  },
  onLoad: function (options) {
    this.data.modelId = options.id
    this.get_list()
  },
  get_list() {
    let obj = {}
    obj['type'] = 'page'
    obj['city'] = app.globalData.city
    obj['modelId'] = this.data.modelId
    getSmallProgramActivities(obj).then(res => {
      if (res.code == 0) {
        let arr = res.data.list
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
        this.setData({ list: arr })
        console.log(this.data.list)
      }
    })
  },
  to_show(e) {
    wx.navigateTo({
      url: '/pages/gift/show/index?id=' + e.currentTarget.dataset['id']
    })
  }
})