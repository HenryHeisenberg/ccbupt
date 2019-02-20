import Notify from '../../dist/vant/notify/notify';
const utils = require("../../utils/util.js");
const my = require("../../utils/my.js");

const app = getApp();

Page({

  data: {

  },
  onLoad: function(options) {
    this.setData({})
  },
  onShow: function() {
    utils.canIUseUserInfo().then(canIUseUserInfo => {
      if (canIUseUserInfo) {
        console.log("已授权")
        utils.checkRoleLogin()
      } else {
        console.log("未授权")
        this.setData({
          loginPopup: true
        })
      }
    });
  },
  bindGetUserInfo(e) {
    console.log('bindGetUserInfo', e)
    let errMsg = e.detail.errMsg
    if (errMsg.search('ok') > -1) {
      utils.checkRoleLogin().then(res => {
        this.setData({
          loginPopup: false
        })
      })
    }
  },
  input: function (e) {
    let id = e.currentTarget.id;
    if ('username' == id) {
      this.setData({
        username: e.detail
      });
    } else if ('password' == id) {
      this.setData({
        password: e.detail
      });
    }
  },
  submit() {
    let username = this.data.username;
    let password = this.data.password;
    if (username == '' || username == undefined) {
      utils.notify("账号未设置");
      return;
    } else if (password == '' || password == undefined) {
      utils.notify("密码未设置");
      return;
    }
  }
})