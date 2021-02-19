// pages/ranking/index.js
import {
  getRankByEntity,
  getRankSeriesByEntity
} from "./../../../server/api";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    rankingArr: [],
    cartType: 1, // 1 品牌；2 车系
    carConfigArr: [
      "操控",
      "动力",
      "空间",
      "内饰",
      "能耗",
      "配置",
      "舒适性",
      "外观",
    ],
    activeIdx: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getRankData();
  },

  //切换榜单
  switchRanking(e) {
    this.setData({
      cartType: e.currentTarget.dataset.index
    })
    this.getRankData();
  },

  //切换配置
  onChange(event) {
    this.setData({
      activeIdx: event.detail.name
    })
    this.getRankData();
  },

  // 获取品牌排行数据
  getRankData() {
    const req = this.data.cartType == 1 ? getRankByEntity({
        bad: true,
        entity: this.data.carConfigArr[this.data.activeIdx],
      }) : getRankSeriesByEntity({
        bad: true,
        entity: this.data.carConfigArr[this.data.activeIdx],
      });

    req.then((res) => {
        if (res.code == "200") {
          // console.log(res.data);
          let sum = 0;
          let first = res.data[0]['cnt']
          res.data.forEach((item) => {
            sum += item.cnt;
          });
          let rankingArr = res.data.map((item, idx) => ({
            ...item,
            percentage: parseFloat((item.cnt / sum) * 100).toFixed(2),
            percentageStyle: parseFloat((item.cnt / first) * 100).toFixed(2),
          }));

          this.setData({
            rankingArr: rankingArr
          })
          // console.log(rankingArr);
        } else {
          wx.showToast({
            title: res.message,
            icon: 'none'
          })
        }
      })
      .catch(() => {
        console.log("error");
        wx.showToast({
          title: "服务器异常",
          icon: 'none'
        })
      });
  },
  // 跳转车系对比
  goSeries() {
    wx.navigateTo({
      url: "/pages/cart/series/index"
    })
    // this.$router.push("/series")
  }
})