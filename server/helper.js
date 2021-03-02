// 控制是否是线上  true 线上
const staging = false

var interface_url = ''
var oss_url = ''
var city = '北京市'
var user_info = {
  openId: '',
  nickName: '',
  avatarUrl: '',
  phone: '',
  oneId: ''
}
var session_key = ''

if (!staging) { //测试环境  
  interface_url = 'http://118.190.157.252:7030'
 //  interface_url = 'http://10.20.0.164:7030'
  // interface_url = 'https://prrprogram.pcmglobe.com'
  oss_url = 'https://saas-pcmatg.oss-cn-beijing.aliyuncs.com/sdmp2.0_images'
} else { // 生产环境
  interface_url = 'http://106.75.24.38:7030'
  oss_url = 'https://saas-pcmatg.oss-cn-beijing.aliyuncs.com/sdmp2.0_images'
}

const map_key = 'Y2CBZ-635R6-EOVS7-E2656-RWPL3-PYBCB'

module.exports = {
  staging,
  interface_url,
  oss_url,
  map_key,
  city,
  user_info,
  session_key
}