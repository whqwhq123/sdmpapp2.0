// pages/car/pk.js
import * as echarts from '../../../components/ec-canvas/echarts';
let chart = null;
import {
  getPk,
  getPkRadar
} from "../../../server/api";
Page({
  data: {
    ec: {
      lazyLoad: true
    },
    list: [],
    list_car: [],
    list_radar: [],
    list_radar_car: [],
    pk_value: 1,
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
    list_radar_sort: [
      '内饰',
      '动力',
      '外观',
      '操控',
      '空间',
      '能耗',
      '舒适性',
      '配置'
    ],
    activeIdx: 0
  },
  onLoad: function (options) {
    this.echartsComponnet = this.selectComponent('#mychart');
    this.setData({list_car:options['car'].split(',')})
    this.get_list()
    this.get_list_radar()
  },
  get_list(){
    let obj = {}
    obj['seriesName'] = this.data.list_car.join(',')
    obj['adjType'] = this.data.pk_value == 1 ? '好' : '差'
    obj['entityType'] = this.data.carConfigArr[this.data.activeIdx]
    getPk(obj).then(res => {
      if (res.code == 200) {
        let arr = res.data
        let isset = 0
        let obj_temp = {}
        for(let i = 0; i < this.data.list_car.length; i++){
          isset = 0
          for(let j = 0; j < arr.length;j++){
            if(this.data.list_car[i] == arr[j]['seriesName']){
              isset = 1
            }
          }
          if(isset == 0){
            obj_temp = {}
            obj_temp['seriesName'] = this.data.list_car[i]
            arr.push(obj_temp)
          }
        }
        this.setData({list:arr})
      }
    });
  },
  delete_car(e){
    let arr = this.data.list_car
    arr.splice(e.currentTarget.dataset.index, 1)
    this.setData({list_car:arr})
    this.get_list()
    this.get_list_radar()
  },
  onChange(event) {
    this.setData({
      activeIdx: event.detail.name
    })
    this.get_list();
  },
  pk_value_change(e) {
    this.setData({
      pk_value:e.detail.value
    })
    this.get_list()
  },
  get_list_radar() {
    let obj = {}
    obj['seriesName'] = this.data.list_car.join(',')
    getPkRadar(obj).then(res => {
      if (res.code == 200) {
        let arr = res.data
        let obj_temp = {}
        this.data.list_radar = []
        this.data.list_radar_car = []
        for (let i = 0; i < arr.length; i++) {
          obj_temp = {}
          obj_temp['name'] = arr[i]['seriesName']
          obj_temp['value'] = []
          this.data.list_radar_car.push(arr[i]['seriesName'])
          for (let j = 0; j < 8; j++) {
            obj_temp['value'].push(this.check_type(arr[i]['entityTypeVoList'], this.data.list_radar_sort[j]))
          }
          this.data.list_radar.push(obj_temp)
        }
        this.chart_show()
      }
    });
  },
  check_type(arr, str) {
    let isset = 0
    for (let i = 0; i < arr.length; i++) {
      if (str == arr[i]['entityType']) {
        isset = Math.log(arr[i]['cnt'])
      }
    }
    return isset
  },
  chart_show() {
    let option = {
      legend: {
        data: this.data.list_radar_car
      },
      radar: {
        name: {
          textStyle: {
            color: '#fff',
            backgroundColor: '#999',
            borderRadius: 3,
            padding: [3, 5]
          },
        },
        radius: 110,
        indicator: [{
            name: '内饰'
          },
          {
            name: '动力'
          },
          {
            name: '外观'
          },
          {
            name: '操控'
          },
          {
            name: '空间'
          },
          {
            name: '能耗'
          },
          {
            name: '舒适性'
          },
          {
            name: '配置'
          }
        ]
      },
      series: [{
        type: 'radar',
        data: this.data.list_radar,
        // label: {
        //   normal: {
        //     show: true,
        //     formatter: function(params) {
        //       return params.value;
        //     }
        //   }
        // }
      }]
    };
    this.echartsComponnet.init((canvas, width, height) => {
      var chart = echarts.init(canvas, null, {
        width: width,
        height: height
      });
      chart.setOption(option);
      return chart;
    });
  },
})