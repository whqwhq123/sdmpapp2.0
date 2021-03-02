const app = getApp();
import {
  getSmallProgramActivities
} from "../../server/api";
Page({
  data: {
    oss_url: app.globalData.oss_url,
    pageSize: 10,
    pageNum: 1,
    list: [],
    city: '',
    isFixedTop: false, 
  },
  onShow: function (options) {
   this.setData({
    pageSize: 10,
    pageNum: 1,
   })
    this.setData({city: app.globalData.city})
    this.get_list()
  },
  get_list() {
    let obj = {}
    obj['type'] = 'page'
    obj['pageSize'] = this.data.pageSize
    obj['pageNum'] = this.data.pageNum
    obj['city'] = app.globalData.city
    getSmallProgramActivities(obj).then(res => {
      if (res.code == 0) {
        let arr = this.data.list
        for(let i = 0; i < res.data.list.length; i++){
          res.data.list[i]['startTime'] = res.data.list[i]['startTime'].substr(0,10)
          res.data.list[i]['endTime'] = res.data.list[i]['endTime'].substr(0,10)
          res.data.list[i]['swiper'] = []
          if(res.data.list[i]['operationImg1']){
            res.data.list[i]['swiper'].push(res.data.list[i]['operationImg1'])
          }
          if(res.data.list[i]['operationImg2']){
            res.data.list[i]['swiper'].push(res.data.list[i]['operationImg2'])
          }
          if(res.data.list[i]['operationImg3']){
            res.data.list[i]['swiper'].push(res.data.list[i]['operationImg3'])
          }
        }
        console.log(res.data);
        arr.push(...res.data.list)
        this.setData({ list: arr })
      }
    })
  },
  to_show(e){
    wx.navigateTo({
      url: '/pages/gift/show/index?id='+e.currentTarget.dataset['id']
    })
  },
  to_location(){
    wx.navigateTo({
      url: '/pages/main/chooseACity/index',
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
  }
})