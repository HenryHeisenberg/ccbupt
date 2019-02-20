import Notify from '../dist/vant/notify/notify';

const Promise = require('./es6-promise.auto.min.js');
const host = "https://127.0.0.1";

const loginUrl = host + '/wxUser/login';

const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function json2Form(json) {
  var str = [];
  for (var p in json) {
    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(json[p]));
  }
  return str.join("&");
}


const formatDayAgoTime = (now, dayAgo = 0) => {
  const date = new Date(now.getTime() - dayAgo * 24 * 3600 * 1000);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();
  return [year, month, day].map(formatNumber).join('-');
}

const formatTimeStr = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatTimeNum = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  return [year, month, day].map(formatNumber).join('') + [hour, minute, second].map(formatNumber).join('');
}


const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

/**
 * 计算相差天数
 */
const diffDay = (start, end) => {
  let oneDay = 24 * 60 * 60 * 1000; //86400000
  let oneWeek = oneDay * 7; //604800000
  let startTime = new Date(start).valueOf();
  let endTime = new Date(end).valueOf();
  return (endTime - startTime) / oneDay
}

/**
 * 获取现在星期几,1:星期一,...,7:星期天
 */
const getNowtWeek = () => {
  let date = new Date();
  let nowtWeek = date.getDay();
  // console.log("nowtWeek", nowtWeek);
  if (nowtWeek != 0) {
    return nowtWeek;
  } else {
    return 7;
  }
}

/**
 * 计算相差周数
 */
const diffWeek = (start, end) => {
  return diffDay / 7
}

/**
 * 打印出所有数据存储
 */
const printAllStorageInfo = () => {
  wx.getStorageInfo({
    success: function (res) {
      for (let i = 0; i < res.keys.length; i++) {
        console.log(res.keys[i], wx.getStorageSync(res.keys[i]))
      }
      console.log(res.currentSize)
      console.log(res.limitSize)
    }
  })
}

/**
 * get方式请求
 * header默认是
 * header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      */
function requestGetDefault(url, data) {
  let header = {
    'content-type': 'application/x-www-form-urlencoded',
    'Authorization': ''
  };
  return request(url, 'GET', data, header)
}

/**
 * post方式请求
 */
function requestPostDefault(url, data) {
  let header = {
    'content-type': 'application/x-www-form-urlencoded',
    'Authorization': ''
  };
  return request(url, 'POST', data, header)
}

/**
 * get方式请求
 */
function requestGet(url, data, header) {
  return request(url, 'GET', data, header)
}

/**
 * post方式请求
 */
function requestPost(url, data, header) {
  return request(url, 'POST', data, header)
}

//封装Request请求方法
function request(url, method, data = {}, header = {}, tryLogin = true) {
  wx.showNavigationBarLoading()
  let authorization_token = wx.getStorageSync('authorization_token');
  header.Authorization = authorization_token;
  console.log("封装Request请求方法", url, data, header, method);
  return new Promise((resolve, reject) => {
    wx.request({
      url: url,
      data: data,
      header: header,
      method: method.toUpperCase(), // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      success: function (res) {
        console.log("success", url, res)
        wx.hideNavigationBarLoading()
        wx.hideLoading()
        if (res.statusCode != 200) {
          reject(res);
        }
        //如果未认证重新登录一次，并尝试再次提交
        let status = res.data.status;
        if (status != undefined) {
          if (status == 'unauth') {
            //如果未认证
            if (tryLogin) {
              console.log("---------------tryLogin---------------")
              login().then((res) => {
                request(url, method, data, header, false).then((res) => {
                  resolve(res);
                }).catch((res) => {
                  reject(res);
                })
              }).catch((res) => {
                // wx.showModal({
                //   title: '提示',
                //   content: '登录失败！',
                // })
              })
            }
          } else {
            //存在status的请求，已经通过授权
            resolve(res);
          }
        } else {
          resolve(res);
        }
      },
      fail: function (msg) {
        console.error('reqest error', msg)
        //检测网络
        wx.getNetworkType({
          success: function (res) {
            console.log('NetworkType', res);
            let networkType = res.networkType;
            if ('none' != networkType) {
              //有网络，但是请求失败
              wx.showToast({
                icon: 'none',
                title: '连接超时，请求失败！',
                duration: 3000
              })
            }
          }
        })
        wx.hideNavigationBarLoading()
        wx.hideLoading()
        reject(msg);
      }
    })
  })
}


/* 函数描述：作为上传多个文件时递归上传的函数体体； 
 * 参数描述： 
 * tempFiles是文件路径数组 
 * name是文件对应的 key , 开发者在服务器端通过这个 key 可以获取到文件二进制内容
 * data是 HTTP 请求中其他额外的 form data
 * successUp是成功上传的个数 
 * failUp是上传失败的个数 
 * i是文件路径数组的下标
 * length是文件路径数组的长度 
 * 
 */
function uploadFileMore(url, tempFiles, name, data = {}, successUp, failUp, i, length) {
  let authorization_token = wx.getStorageSync('authorization_token');
  let header = {
    'content-type': 'multipart/form-data',
    'Authorization': authorization_token
  };
  console.log("uploadFileMore方法", url, tempFiles, name, data, successUp, failUp, i, length, header, tryLogin = true);
  wx.showNavigationBarLoading();
  return new Promise((resolve, reject) => {
    wx.uploadFile({
      url: url,
      header: header,
      filePath: tempFiles[i].path,
      name: name,
      formData: data,
      success: function (res) {
        console.log("success", res)
      },
      fail: function (msg) {
        failUp++;
        console.log('reqest error', msg)
        wx.hideNavigationBarLoading()
        reject(msg);
      },
      complete: function (res) {
        console.log("complete", res);
        //如果未认证重新登录一次，并尝试再次提交
        try {
          res.data = JSON.parse(res.data);
        } catch (e) {

        }
        let status = res.data.status;
        if (status != undefined) {
          if (status == 'unauth') {
            //如果未认证
            if (tryLogin) {
              console.log("---------------tryLogin---------------")
              login().then((res) => {
                return uploadFileMore(url, tempFiles, name, data, successUp, failUp, i, length, false);
              }).catch((res) => {
                wx.showModal({
                  title: '提示',
                  content: '登录失败！',
                })
              })
            }
          } else {
            i++;
            if (i >= length) {
              console.log('总共' + successUp + '个文件上传成功, ' + failUp + '个文件上传失败！');
              wx.hideNavigationBarLoading()
              resolve(res);
            } else { //递归调用uploadFileMore函数 
              uploadFileMore(url, tempFiles, name, data, successUp, failUp, i, length);
            }
          }
        } else {
          i++;
          if (i >= length) {
            console.log('总共' + successUp + '个文件上传成功, ' + failUp + '个文件上传失败！');
            wx.hideNavigationBarLoading()
            resolve(res);
          } else { //递归调用uploadFileMore函数 
            uploadFileMore(url, tempFiles, name, data, successUp, failUp, i, length);
          }
        }
      },
    });
  });
}

/* 函数描述：作为上传单个文件时的函数体体； 
 * 参数描述： 
 * tempPath是文件路径
 * name是文件对应的 key , 开发者在服务器端通过这个 key 可以获取到文件二进制内容
 * data是 HTTP 请求中其他额外的 form data
 */
function uploadFileOne(url, tempPath, name, data = {}, tryLogin = true) {
  let authorization_token = wx.getStorageSync('authorization_token');
  let header = {
    'content-type': 'multipart/form-data',
    'Authorization': authorization_token
  };
  console.log("uploadFileOne方法", url, tempPath, name, data);
  wx.showNavigationBarLoading();
  return new Promise((resolve, reject) => {
    wx.uploadFile({
      header: header,
      url: url,
      filePath: tempPath,
      name: name,
      formData: data,
      success: function (res) {
        console.log("success", res)
        wx.hideNavigationBarLoading()
        //如果未认证重新登录一次，并尝试再次提交
        try {
          res.data = JSON.parse(res.data);
        } catch (e) {

        }
        let status = res.data.status;
        if (status != undefined) {
          if (status == 'unauth') {
            //如果未认证
            if (tryLogin) {
              console.log("---------------tryLogin---------------")
              login().then((res) => {
                uploadFileOne(url, tempPath, name, data = {}, false).then((res) => {
                  resolve(res);
                }).catch((res) => {
                  reject(msg);
                })
              }).catch((res) => {
                wx.showModal({
                  title: '提示',
                  content: '登录失败！',
                })
              })
            }
          } else {
            resolve(res);
          }
        } else {
          resolve(res);
        }
      },
      fail: function (msg) {
        console.log('reqest error', msg)
        wx.hideNavigationBarLoading()
        reject(msg);
      }
    });
  });
}

//弹出提示框事件//警告弹窗
function showTopTips(that, TopTips, time) {
  that.setData({
    TopTips: TopTips,
    showTopTips: true
  });
  setTimeout(function () {
    that.setData({
      showTopTips: false
    });
  }, time);
}

//弹出提示框事件//成功弹窗
function showSuccessTopTips(that, TopTips, time) {
  that.setData({
    SuccessTopTips: TopTips,
    showSuccessTopTips: true
  });
  setTimeout(function () {
    that.setData({
      showSuccessTopTips: false
    });
  }, time);
}

/**
 * 获取当前时间的星期一的0点0时0分的date对象,运用于课表
 */
function getFirstDay() {
  //根据当前周获取第一周星期一的时间
  let date = new Date();
  //1获取今天是星期几
  let day = date.getDay();
  //如果day是0那么就是星期天
  if (day == 0) {
    day = 7;
  }
  //2如果今天是星期天，那么先获得今天0点的时间-6天就是星期一
  date.setHours(0, 0, 0);
  let time = date.getTime();
  time = time - (24 * 60 * 60 * 1000 * (day - 1));
  date.setTime(time);
  return date;
}

/**
 * 传入当前是第几周，获取第一周的0点0时0分的date对象,运用于课表
 */
function getFirstWeek(currentWeekInt) {

  //获取本周的新星期一
  let date = getFirstDay();
  let time = date.getTime();
  //通过当前周获取第一周的时间
  time = time - (7 * 24 * 60 * 60 * 1000 * (currentWeekInt - 1));
  date.setTime(time);
  return date;
}

/**
 * 是否能使用获取用户信息权限
 */
let canIUseUserInfo = () => {
  return new Promise((resolve, reject) => {
    // 查看是否授权
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.userInfo']) {
          resolve(true)
        } else {
          resolve(false)
        }
      }
    })
  });
}

/**
 * 
 * 成功返回：resolve("success");//成功
 * 服务器返回登录失败返回：reject("fail");//失败
 * 调用login失败返回： reject("maybeNotNet");//失败
 */
function login() {
  console.log('loginUrl', loginUrl);
  return new Promise((resolve, reject) => {
    wx.login({

      success: function (res) {
        console.log('login', res);
        new Promise((resolve, reject) => {
          canIUseUserInfo().then(canIUseUserInfo => {
            if (canIUseUserInfo) {
              // 已经授权，可以直接调用 getUserInfo 获取头像昵称
              wx.getUserInfo({
                success: function (res) {
                  console.log('getSetting', res)
                  resolve(res);
                }
              })
            } else {
              resolve('');
            }
          })
        }).then(resUserInfo => {
          console.log('resUserInfo', resUserInfo)
          let userInfo = '';
          if (resUserInfo != '') {
            userInfo = JSON.stringify(resUserInfo);
          }
          if (res.code) {
            let code = res.code;
            let data = {
              "code": code,
              "processId": 'jzsh+',
              "user": userInfo
            };
            // loginUrl在顶部以常量定义了
            requestPostDefault(loginUrl, data).then((res) => {
              let resData = res.data;
              if ('success' == resData.status) {
                wx.setStorageSync('authorization_token', resData.token);
                resolve(res);
              } else {
                reject(res)
              }
            }).catch((res) => {
              reject(res)
            })
          }
        })
      }
    });
  });
}


//封装Request请求方法
const downloadFile = (url, filePath, header = {}) => {
  let authorization_token = wx.getStorageSync('authorization_token');
  header.Authorization = authorization_token;
  console.log("封装Request请求方法", url, header, filePath);
  return new Promise((resolve, reject) => {
    wx.downloadFile({
      url,
      header,
      filePath,
      success(res) {
        console.log("success", res);
        resolve(res);
      },
      fail(msg) {
        console.error('reqest error', msg);
        reject(msg);
      }
    })
  });
}

const route = (that, app, path) => {
  //判断是否有头信息switchTab:/navigateTo:/navigateBack:如果没有匹配的默认是redirectTo
  if (path.match('switchTab:')) {
    path = path.replace('switchTab:', '')
    wx.switchTab({
      url: path,
    })
  } else if (path.match('navigateTo:')) {
    path = path.replace('navigateTo:', '')
    wx.navigateTo({
      url: path,
    })
  } else if (path.match('navigateBack:')) {
    wx.navigateBack({})
  } else if (path.match('redirectTo:')) {
    path = path.replace('redirectTo:', '')
    wx.redirectTo({
      url: path
    })
  } else {
    wx.redirectTo({
      url: path
    })
  }
  //有路由，清空路由中的值
  // app.data.route = "";
}

const notify = (text, backgroundColor = '#f44', color = '#fff', duration = 1000, selector = '#van-notify') => {
  Notify({
    text,
    backgroundColor,
    color,
    duration,
    selector
  });
}

const notifySuccess = (text, backgroundColor = '#1989fa') => {
  notify(text, backgroundColor);
}

const showToast = (msg) => {
  wx.showToast({
    title: msg,
    icon: 'none'
  })
}

const loadMore = (that, app, func, pageInfo) => {
  let loadmore = that.data.loadmore;
  if (!loadmore) {
    if (!pageInfo) {
      pageInfo = that.data.pageInfo;
    }
    let isLastPage = pageInfo.isLastPage;
    if (isLastPage) {
      return;
    }
    that.setData({
      loadmore: true
    })
    let nextPage = pageInfo.nextPage;
    func(that, app, nextPage).then(res => {
      that.setData({
        loadmore: false
      })
    }).catch(res => {
      that.setData({
        loadmore: false
      })
    });
  }
}


module.exports = {
  json2Form,
  formatTime,
  formatDayAgoTime,
  formatTimeStr,
  formatTimeNum,
  diffDay,
  getNowtWeek,
  printAllStorageInfo,
  showTopTips,
  showSuccessTopTips,
  getFirstWeek,
  getFirstDay,
  //请求相关
  canIUseUserInfo, //是否授权用户权限
  login,
  requestGet,
  requestPost,
  get: requestGetDefault,
  post: requestPostDefault,
  uploadFileMore: uploadFileMore,
  uploadFileOne: uploadFileOne,
  downloadFile,
  route,
  notify,
  notifySuccess,
  showToast,
  loadMore,
}