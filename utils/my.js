import Notify from '../dist/vant/notify/notify';
const Promise = require('./es6-promise.auto.min.js');
const utils = require("./util.js");
// 引入SDK核心类
const QQMapWX = require('./qqmap-wx-jssdk.min.js');

/**
 * 获取是否获得了定位授权
 * 如果未调用过授权为undefined
 * 调用过但是拒绝了返回false
 * 成功获取为true
 */
let getUserLocation = () => {
  let scope = 'scope.userLocation';
  //获取用户信息
  return new Promise((resolve, reject) => {
    wx.getSetting({
      success(res) {
        let authorize = res.authSetting[scope];
        console.log('scope.userLocation ', authorize);
        if (authorize === undefined) {
          wx.authorize({
            scope: scope,
            success(res) {},
            complete(res) {
              console.log('wx.authorize ' + scope, res);
              let search = res.errMsg.search('ok');
              console.log('search ', search);
              if (search != -1) {
                resolve(authorize);
              } else {
                resolve(false);
              }
            }
          })
        } else {
          resolve(authorize);
        }
      }
    })
  });
}



let getLocation = (that, app) => {
  // 实例化API核心类
  let qqmapsdk = new QQMapWX({
    key: 'QLJZL',
  });
  return new Promise((resolve, reject) => {
    wx.showToast({
      icon: 'loading',
      title: '定位中...',
      duration: 7000
    })
    /* 位置 */
    wx.getLocation({
      type: 'wgs84',
      success: function(res) {
        console.log(res);
        var latitude = res.latitude
        var longitude = res.longitude
        var speed = res.speed
        var accuracy = res.accuracy
        // 调用接口
        qqmapsdk.reverseGeocoder({
          location: {
            latitude,
            longitude
          },
          success: function(res) {
            console.log('reverseGeocoder', res);
            that.setData({
              qqmapLocation: res.result
            })
            resolve(res);
          },
          fail: function(res) {
            console.log('reverseGeocoderFail', res);
            reject(res);
          }
        });
      }
    })
    /* 位置 */
  })
}

const location = (that, app) => {
  my.getUserLocation().then(res => {
    if (res) {
      wx.showLoading({
        title: '定位中...',
      })
      this.setData({
        showLocation: false
      })
      my.getLocation(this, app).then(res => {
        wx.hideLoading()
        //TODO

      }).catch(res => {
        wx.showToast({
          title: '获取位置信息错误',
          icon: 'none'
        })
      })
    } else if (res === false) {
      wx.showToast({
        title: '请先授权获取位置信息',
        icon: 'none'
      })
      this.setData({
        showLocation: true
      })
    }
  })
}

const anniversarySave = (that, app, title, remark, time) => {
  wx.showToast({
    icon: 'loading',
    title: '提交中...',
    duration: 7000
  })
  let url = app.data.host + "/anniversary/save"
  let data = {
    title,
    remark,
    time
  };
  return utils.post(url, data).then(res => {
    let resData = res.data;
    if ('success' == resData.status) {
      wx.hideToast();
      wx.showToast({
        title: '成功',
      })
      //跳转
      wx.navigateBack({})
    } else {
      Notify(resData.msg);
      wx.hideToast();
    }
  }).catch(res => {
    Notify('失败');
    wx.hideToast();
  });
}

const anniversarySelectAll = (that, app) => {
  wx.showToast({
    icon: 'loading',
    title: '获取中...',
    duration: 7000
  })
  let url = app.data.host + "/students/selectAll"
  let data = {};
  return utils.get(url, data).then(res => {
    let resData = res.data;
    if ('success' == resData.status) {
      wx.hideToast();
      wx.showToast({
        title: '成功',
      })
      that.setData({
        data: resData.data
      })
    } else {
      Notify(resData.msg);
      wx.hideToast();
    }
  }).catch(res => {
    Notify('失败');
    wx.hideToast();
  });
}

const customerAdd = (that, app, idNum, name, candidateNum, major) => {
  wx.showToast({
    icon: 'loading',
    title: '提交中...',
    duration: 7000
  })
  let url = app.data.host + "/students/add"
  let data = {
    idNum,
    name,
    candidateNum,
    major
  };
  return utils.post(url, data).then(res => {
    let resData = res.data;
    if ('success' == resData.status) {
      wx.hideToast();
      wx.showToast({
        title: '成功',
      })
      //跳转
      wx.navigateBack({})
    } else {
      Notify(resData.msg);
      wx.hideToast();
    }
  }).catch(res => {
    Notify('失败');
    wx.hideToast();
  });
}

const customerSelectById = (that, app, id) => {
  wx.showToast({
    icon: 'loading',
    title: '获取中...',
    duration: 7000
  })
  let url = app.data.host + "/students/selectById"
  let data = {
    id
  };
  return utils.get(url, data).then(res => {
    let resData = res.data;
    if ('success' == resData.status) {
      wx.hideToast();
      that.setData({
        name: resData.data.name,
        idNum: resData.data.idNum,
        candidateNum: resData.data.candidateNum,
        major: resData.data.major
      })
    } else {
      Notify(resData.msg);
      wx.hideToast();
    }
  }).catch(res => {
    Notify('失败');
    wx.hideToast();
  });
}

const customerDel = (that, app, id) => {
  wx.showToast({
    icon: 'loading',
    title: '提交中...',
    duration: 7000
  })
  let url = app.data.host + "/students/del"
  let data = {
    id
  };
  return utils.post(url, data).then(res => {
    let resData = res.data;
    if ('success' == resData.status) {
      wx.hideToast();
      wx.showToast({
        title: '成功',
      })

    } else {
      Notify(resData.msg);
      wx.hideToast();
    }
    return resData;
  }).catch(res => {
    Notify('失败');
    wx.hideToast();
  });
}

const customerUpdate = (that, app,id,idNum, name, candidateNum, major) => {
  wx.showToast({
    icon: 'loading',
    title: '提交中...',
    duration: 7000
  })
  let url = app.data.host + "/students/update"
  let data = {
    id,
    idNum,
    name,
    candidateNum,
    major
  };
  return utils.post(url, data).then(res => {
    let resData = res.data;
    if ('success' == resData.status) {
      wx.hideToast();
      wx.showToast({
        title: '成功',
      })
      //跳转
      wx.navigateBack({})
    } else {
      Notify(resData.msg);
      wx.hideToast();
    }
  }).catch(res => {
    Notify('失败');
    wx.hideToast();
  });
}

const selectAll = (that, app, pageNum = 1, pageSize = 10) => {
  if (pageNum == 1) {
    wx.showToast({
      icon: 'loading',
      title: '获取中...',
      duration: 7000
    })
  }

  let url = app.data.host + "/students/selectAll"
  let data = {
    pageNum,
    pageSize
  };
  return utils.get(url, data).then(res => {

    let resData = res.data;
    if ('success' == resData.status) {
      wx.hideToast();
      //如果大于1执行添加
      let pageNum = resData.data.pageNum;
      if (pageNum > 1) {
        /*** 添加 ***/
        let list = that.data.pageInfo.list.concat(resData.data.list);
        resData.data.list = list;
        /*** 添加 ***/
      }
      that.setData({
        pageInfo: resData.data
      })
    } else {
      Notify(resData.msg);
      wx.hideToast();
    }
  }).catch(res => {
    Notify('失败');
    wx.hideToast();
  });
}


module.exports = {
  anniversarySave, //保存
  selectAll, //获取
  customerAdd,
  anniversarySelectAll,
  getUserLocation,
  customerSelectById,
  customerUpdate,
  customerDel,
  getLocation
}