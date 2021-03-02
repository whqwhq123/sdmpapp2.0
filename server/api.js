const http = require('./http.js') //请求
import helper from './helper.js' //静态变量

// 获取openId
export const getOpenId = (datas) => {
  return http._post('/label/WxApi/getOpenId', datas, false, false)
}


//获取oneId
export const getOneId = (datas) => {
  return http._post('/label/smallProgram/generateOneId', datas, false, false)
}

// 获取活动
export const getSmallProgramActivities = (datas) => {
  return http._post('/label/activity/getSmallProgramActivities', datas, false, false)
}

// 获取经销商信息
export const getUserAllInfo = (datas) => {
  return http._post('/logon/user/queryUserAllInfo', datas, false, false)
}


// // 潜客分析
// export const addAnalysisLog = (datas) => {
//   let options = {
// 		baseUrl: helper.manuAdmin_url,
// 		header: {
// 			'content-type': 'application/x-www-form-urlencoded' // 表单提交
// 		},
//   }
//   return  http._post(`/userLog/addUserLog`, datas, false, false, options)
// }

//城市列表
export const getCitysList = () => {
  return http._post(`/logon/dept/queryCityListByDeptId`)
}
//品牌运营位
export const getBrandList = () => {
  return http._post(`/label/carMakeOrder/getCarMakeOrderList`)
}
//车系运营位
export const getCarModelList = () => {
  return http._post(`/label/carModelOrder/getCarModelOrderList`)
}
// 获取用户信息
export const getWxUser = (datas) => {
  return http._post('/label/WxApi/getWxUser', datas, false, false)
}

// 保存用户信息
export const addWxUser = (datas) => {
  return http._post('/label/WxApi/addWxUser', datas, false, false)
}

// 活动详情
export const getActivityInfo = (datas) => {
  return http._post('/label/activity/getActivityInfo', datas, false, false)
}

//获取首页父品牌下的车系列表
export const getSelectCarModel = (datas) => {
  return http._post(`/label/smallProgram/getSelectCarModel`,datas,false,false)
}

//车系级别
export const getCarModelLevel = (datas) => {
  return http._post(`/label/smallProgram/getCarModelLevel`,datas,false,false)
}
//根据车系获取车型列表
export const getCarStyle = (datas) => {
  return http._post(`/label/smallProgram/getCarStyle`,datas,false,false)
}
//经销商信息
export const getDealersData = (datas) => {
  return http._post(`/logon/dept/queryDealerByCityNameAndCarSeriesId`,datas,false,false)
}
//询底价
export const postAskPrice = (datas) => {
  return http._post(`/clue/original/save`,datas,false,false)
}

export const getActivityInfoAndSingUpStatus = (datas) => {
  return http._post('/label/smallProgram/getActivityInfoAndSingUpStatus', datas, false, false)
}

// 获取手机号
export const decrypt = (datas) => {
  return http._post('/label/WxApi/decrypt', datas, false, false)
}

// 活动报名
export const addSignUp = (datas) => {
  return http._post('/label/smallProgram/addSignUp', datas, false, false)
}

// 获取经销商
export const queryDealerByCityNameAndCarSeriesId = (datas) => {
  return http._post('/logon/dept/queryDealerByCityNameAndCarSeriesId', datas, false, false)
}

// 参加的活动和礼物
export const joinActivities = (datas) => {
  return http._post('/label/smallProgram/joinActivities', datas, false, false)
}
