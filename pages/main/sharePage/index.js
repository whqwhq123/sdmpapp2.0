// pages/main/sharePage/index.js
import { 
  getWxUser,
  getOpenId,
  getOneId
} from './../../../server/api'
// import { getFoursInfoReq, getActivityInviteDetailById } from './../../../utils/wxReq'
const app = getApp();

/**
 * options
 * [类型，分享人身份role，销售顾问ID，具体页面需要参数]
 * 例：【1,,50，'50-20-30'】
 * const pageType = {
 *  '1': '活动分享',  // 需要类型，销售顾问ID，活动Id
 * }
 */ 


Page({
  /**
   * 页面的初始数据
   */
  data: {
    oss_url: app.globalData.oss_url,
    request_loading: true,
    scene:[] ,
    status: 1,
    shareTitle: '',
    sharePath: '',
    shareImg:'',
    palette: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // if (app.globalData.userInfo) {
    //   this._init(options)
    // } else {
    //   // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //   // 所以此处加入 callback 以防止这种情况
    //   app.userInfoReadyCallback = res => {
    //     this._init(options)
    //   }
    // }
    this.get_openId()
    this._init(options)
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  _init(options) {
    let scene = options.scene ? decodeURIComponent(options.scene).split(',') : [];
    console.log(scene)
    this.setData({
      scene,
      status: scene[1] || 1,
      request_loading: false
    }, ()=>{
      this.isPage()
    })
  },

  async isPage() {
    let scene = this.data.scene

    if(scene[0] == '1') { // 活动分享
      wx.reLaunch({
        url: '/pages/main/sharePage/shareActivity/index?scene='+ decodeURIComponent(scene),
      })
    }
    //  else if(scene[1] == '2') { // 名片分享
    //   this.setData({
    //     shareTitle: '好友分享给你一张名片，敬请查阅！',
    //     sharePath: '/pages/mine/card/index?scene='+ decodeURIComponent(scene),
    //   }, ()=>{
    //     this.get_card()
    //   })
    // }
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
                if(res_user.data){
                  app.globalData.user_info = res_user.data
                }
              });
             
              getOneId(obj).then(res=>{
                if(res.code==0){
                  app.globalData.user_info.oneId=res.data
                }
              })
            }
          })
        }
      }
    })
  },

  // drawPalette_quotation(data) {
  //   let palette = {
  //     width: '750rpx',
  //     height: '600rpx',
  //     background: '#fff',
  //     views: [{
  //         type: 'image',
  //         url: '/images/price_note.png',
  //         css: {
  //           mode: 'scaleToFill',
  //           top: '0',
  //           left: '0',
  //           width: '750rpx',
  //           height: '600rpx'
  //         }
  //     }, {
  //       type: 'text',
  //       text: data.electronicQuotationSheetInfo.carTypeName,
  //       css: {
  //         top: '190rpx',
  //         left: '170rpx',
  //         fontSize: '38rpx',
  //         color: "#000",
  //         maxLines: '1',
  //       }
  //     }, {
  //       type: 'text',
  //       text: String((data.electronicQuotationSheetInfo.guidePrice/10000).toFixed(2))+'万',
  //       css: {
  //         bottom: '204rpx',
  //         right: '240rpx',
  //         fontSize: '34rpx',
  //         color: "#000",
  //         maxLines: '1',
  //       }
  //     }, {
  //       type: 'text',
  //       text: String((data.electronicQuotationSheetInfo.favorablePrice/10000).toFixed(2))+'万',
  //       css: {
  //         bottom: '144rpx',
  //         right: '240rpx',
  //         fontSize: '34rpx',
  //         color: "#000",
  //         maxLines: '1',
  //       }
  //     }]
  //   }
  //   this.setData({
  //     palette
  //   })
  // },

  // drawPalette_card(data) {
  //   let palette = {
  //     width: '750rpx',
  //     height: '600rpx',
  //     background: '#fff',
  //     views: [{
  //         type: 'image',
  //         url: data.foursLogo,
  //         css: {
  //           top: '3rpx',
  //           right: '28rpx'
  //         }
  //       }, {
  //         type: 'image',
  //         url: '/images/share_card.png',
  //         css: {
  //           mode: 'scaleToFill',
  //           top: '103rpx',
  //           left: '0',
  //           width: '750rpx',
  //           height: '394rpx'
  //         }
  //       }, {
  //         type: 'image',
  //         url: data.headImg,
  //         css: {
  //           top: '260rpx',
  //           left: '40rpx',
  //           width: '116rpx',
  //           height: '116rpx',
  //           borderRadius: '58rpx',
  //         }
  //       }, {
  //         type: 'text',
  //         text: data.salesmanName,
  //         css: {
  //           top: '266rpx',
  //           left: '170rpx',
  //           fontSize: '42rpx',
  //           color: "#fff",
  //           fontWeight: 'blod',
  //           maxLines: '1',
  //         }
  //       }, {
  //         type: 'text',
  //         text: data.roleName,
  //         css: {
  //           top: '320rpx',
  //           left: '172rpx',
  //           fontSize: '34rpx',
  //           color: "#fff",
  //           maxLines: '1',
  //         }
  //       }, {
  //         type: 'text',
  //         text: data.foursName,
  //         css: {
  //           bottom: '144rpx',
  //           right: '68rpx',
  //           fontSize: '34rpx',
  //           color: "#fff",
  //           maxLines: '1',
  //         }
  //       }
  //     ]
  //   }
  //   this.setData({
  //     palette
  //   })
  // },

  // onImgOK(e) {
  //   this.setData({
  //     shareImg: e.detail.path
  //   })
  //   console.log(e.detail.path)
  // },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    // console.log(this.data.sharePath)
    // return {
    //   title: this.data.shareTitle,
    //   path: this.data.sharePath,
    //   imageUrl: this.data.shareImg
    // }
  }
})