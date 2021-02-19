/**  
* 接口文档
*/
const http = require('./http.js') //请求
import helper from './helper.js' //静态变量

/**
 * 品牌排行?bad=true&entity=内饰
 */
const getRankByEntity = (datas) => {
  return http._get(`/koubei/getRankByEntity`, datas, true)
}

//车型列表
const getRankSeriesByEntity = (datas) => {
  return http._get(`/koubei/getRankSeriesByEntity`, datas, true)
}

//车型对比
const getPk = (datas) => {
  return http._get(`/koubei/getCompetitionEntity`, datas)
}

//车型对比雷达图
const getPkRadar = (datas) => {
  return http._get(`/koubei/getCompetitionStatistics`, datas)
}

//品牌选择
const getBrands = (datas) => {
  return http._post(`/koubei/getBrands`, datas)
}
//车型选择
const getSeriesNames = (datas) => {
  return http._get(`/koubei/getSeriesNames`, datas)
}
//车型竞品列表
const getCompetitions = (datas) => {
  return http._get(`/koubei/getCompetitions`, datas)
}
/*
*  移动商品
*
* @activityId: 活动id
*/
// const operateGoodsMsg = (datas) => {
//   return http._post(`/koubei/getRankByEntity`, datas)
// }
/**
 * 获取formId
 * 
 */
// const getFormId = (datas) => {
// 	let options = {
// 		baseUrl: helper.wxServiceUrl,
// 		header: {
// 			'content-type': 'application/x-www-form-urlencoded' // 表单提交
// 		},
//   }
  
//   return http._post(`/wxFormId/save`, datas, false, false, options);
// }

module.exports = {
  getRankByEntity,
  getBrands,
  getSeriesNames,
  getRankSeriesByEntity,
  getPk,
  getPkRadar,
  getCompetitions
}