import Notify from '../../dist/vant/notify/notify';
const utils = require("../../utils/util.js");
const my = require("../../utils/my.js");

const app = getApp();

Page({

  data: {

  },
  onLoad: function (options) {
    let type = options.type
    if (type != '' && type != undefined) {
      let id = options.id
      this.setData({
        type,
        id
      })
      my.customerSelectById(this, app, id)
    }
  },
  onShow: function () {

  },
  show(e) {
    this.setData({
      show: true
    })
  },
  onConfirm(e) {
    console.log(e)
    this.setData({
      birthday: utils.formatDate(new Date(e.detail)),
      show: false
    })

  },
  onClose() {
    this.setData({
      show: false
    })
  },
  onChange(e) {
    // console.log(e)
    let sex = e.currentTarget.dataset.name
    this.setData({
      sex
    })
  },
  input: function (e) {
    console.log(e)
    let id = e.currentTarget.id;
    if ('name' == id) {
      this.setData({
        name: e.detail
      });
    } else if ('idNum' == id) {
      this.setData({
        idNum: e.detail
      });
    } else if ('candidateNum' == id) {
      this.setData({
        candidateNum: e.detail
      });
    } else if ('major' == id) {
      this.setData({
        major: e.detail
      });
    }
  },
  submit() {
    let name = this.data.name;
    let idNum = this.data.idNum;
    let candidateNum = this.data.candidateNum;
    let major = this.data.major;
    let type = this.data.type;
    if (name == '' || name == undefined) {
      Notify("姓名未设置");
      return;
    } else if (idNum == '' || idNum == undefined) {
      Notify("身份证号码未设置");
      return;
    } else if (candidateNum == '' || candidateNum == undefined) {
      Notify("考生号未设置未设置");
      return;
    } else if (major == '' || major == undefined) {
      Notify("专业未设置");
      return;
    }
    if ('edit' == type) {
      let id = this.data.id;
      my.customerUpdate(this, app, id,idNum, name, candidateNum, major)
    } else {
      my.customerAdd(this, app, idNum, name, candidateNum, major)
    }
  }
})