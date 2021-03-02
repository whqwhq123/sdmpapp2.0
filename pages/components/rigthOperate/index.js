// pages/components/rigthOperate/index.js
const app = getApp()

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    top: {
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    oss_url: app.globalData.oss_url,
    top_use: 1
  },

  /**
   * 组件的方法列表
   */
  methods: {
    _goHome() {
      wx.switchTab({
        url: '/pages/main/home/index'
      })
    },
    _goTop() {
      if(wx.pageScrollTo) {
        wx.pageScrollTo({
          scrollTop: 0,
        })
      } else {
        wx.showModal({
          title: '提示',
          content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本重试。'
        })
      }
    }
  },
  observers: {
    'top': function (top) {
      this.setData({
        top_use: top
      })
    }
  },
})
