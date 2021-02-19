// 控制是否是线上  true 线上
const staging = false

var baseAPI = ''

if (!staging) {
  baseAPI = 'http://10.20.0.164:7044'
} else {
  baseAPI = 'http://192.168.100.143:7044'
}


module.exports = {
  staging,
  baseAPI
}
