
import { addAnalysisLog } from './../server/api'
const app = getApp();

// 场景类型
const sceneClass = {
  '1': '潜客分析',
  '2': '购车需求分析',
  '3': '离店场景分析',
  '4': '交易决策',
  '5': '成交战败'
}

// 埋点页面
const pageClass = {
  '11': '见面礼',
  '12': '购车津贴',
  '13': '名片分享',
  '14': '优惠券',
  '15': '到店邀请函',
  '21': '车型推荐',
  '22': '电子报价单',
  '23': '气质选车',
  '24': '数据选车',
  '25': 'AR寻礼',
  '31': '报价对比',
  '32': '查看资讯',
  '41': '权益兑换',
  '51': '成交',
  '52': '战败'
}

//埋点
export const addUserLog = (type, foursId, phone, success, fail, complete) => {
  try {
    if (!type || typeof type != 'string') return
    let sceneIdx = type.split('-')[0] || '0'
    let pageIdx = type.split('-')[1] ||　'0'
  
    let data = {
      userPhone: phone || wx.getStorageSync('userPhone') || '',
      foursId: foursId || wx.getStorageSync('foursId') || '',
      masterNode:sceneClass[sceneIdx] || '',
      slaveNode: pageClass[pageIdx] || '',
    }
    // console.log(data)
    addAnalysisLog(data).then(res => {
      if (res.data.code === 0) {
        if (success) {
          success(res.data)
        }
      } else {
        if (fail) {
          fail(res.data)
        }
      }
    })

  } catch (e) {
    return { code: 1, errMsg: '添加日志失败' }
  }
}
