/**  
 * wx.request封装
 * 
 * url 接口路径
 * data 请求参数
 * isLoading 请求时是否有loading
 * isToken 请求头信息 (有无token)
 * ...other 其他请求参数，默认 method: 'get'
 * 
 */
const helper = require('./helper.js');

//请求头
function getHeader(isToken) {
  const token = wx.getStorageSync('token')
  // const userMsg = wx.getStorageSync('userMsg')

  let header = {
    'Content-Type': 'application/json'
  }

  if (isToken) {
    header['Authorization'] = token;
  }
  return header;
}

/**
 * 拼接url参数
 */
function jumptoSearchUrl(obj, url) {
  let ary = [];
  let reqUrl = url || ''
  for (let p in obj) {
    // if (obj.hasOwnProperty(p) && obj[p]) {
    if (typeof obj[p] == 'object') {
      ary.push(encodeURIComponent(p) + '=' + obj[p]);
    } else {
      ary.push(encodeURIComponent(p) + '=' + obj[p]);
    }
    // }
  }
  reqUrl += '?' + ary.join('&');
  return encodeURI(reqUrl);
}

const http = ({
  url = '',
  data = {},
  isLoading = true,
  isToken = true,
  ...other
} = {}) => {
  if (isLoading) {
    wx.showLoading({
      title: '加载中'
    });
  }
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${ other.baseUrl || helper.baseAPI }${ url }`,
      header: getHeader(isToken),
      data,
      ...other,
      success: function (res) {
        if (isLoading) {
          wx.hideLoading()
        }
        // console.log(res)
        if (res.statusCode === 200) {
          // if (res.data.code == '0') {
          resolve(res.data); // 请求成功后的数据
          // } else {
          //   reject(res.data.message);
          // }
        } else {
          wx.showToast({
            title: '服务异常(错误码:' + res.statusCode + '):' + res.data.message,
            icon: "none"
          })
          reject(res.data.message);
        }

      },
      fail: function (res) {
        if (isLoading) {
          wx.hideLoading()
        }
        wx.showToast({
          title: '网络错误',
          icon: "none"
        })
        console.log(res)
        reject({
          error: '网络错误',
          code: 0
        });
      }
    });
  })
}
// get方法
const _get = (url, data = {}, isLoading = false, isToken = false, options) => {
  let reqUrl = jumptoSearchUrl(data, url)

  return http({
    url: reqUrl,
    isLoading,
    isToken,
    method: 'get',
    ...options
  })
}
// post方法
const _post = (url, data = {}, isLoading = false, isToken = false, options) => {
  return http({
    url,
    data,
    isLoading,
    isToken,
    method: 'post',
    ...options
  })
}
// put方法
const _put = (url, data = {}, isLoading = false, isToken = false, options) => {
  return http({
    url,
    data,
    isLoading,
    isToken,
    method: 'put',
    ...options
  })
}
//delete方法
const _delete = (url, data = {}, isLoading = false, isToken = false, options) => {
  return http({
    url,
    data,
    isLoading,
    isToken,
    method: 'delete',
    ...options
  })
}

/**
 * 将小程序的API封装成支持Promise的API
 * @params fn {Function} 小程序原始API，如wx.login
 * 举例：wxPromisify(wx.getLocation);//获取经纬度
 */
const wxPromisify = fn => {
  return function (obj = {}) {
    return new Promise((resolve, reject) => {
      obj.success = function (res) {
        resolve(res)
      }

      obj.fail = function (res) {
        reject(res)
      }

      fn(obj)
    })
  }
}


module.exports = {
  _get,
  _post,
  _put,
  _delete,
  wxPromisify
}