// import Notify from '../../dist/vant/notify/notify';
// const utils = require("../../utils/util.js");
// const my = require("../../utils/my.js");

const app = getApp();

Page({

  data: {
    buttons: [{
      label: '添加',
      className: 'add',
      icon: '/images/add.png'
    }],
  },
  onLoad: function(options) {
    this.setData({})
  },
  onReady: function() {

  },
  onShow: function() {

  },
  onHide: function() {

  },
  onUnload: function() {

  },
  onPullDownRefresh: function() {

  },
  onReachBottom: function() {
    let loadmore = this.data.loadmore;
    if (!loadmore) {
      let pageInfo = this.data.pageInfo;
      let isLastPage = pageInfo.isLastPage;
      if (isLastPage) {
        return;
      }
      this.setData({
        loadmore: true
      })
      let nextPage = pageInfo.nextPage;
      my.selectAll(this, app, nextPage).then(res => {
        this.setData({
          loadmore: false
        })
      }).catch(res => {
        this.setData({
          loadmore: false
        })
      });
    }
  },
  onShareAppMessage: function() {

  },
  fabClick(e) {
    console.log(e)
    let index = e.detail.index
    if (index == 0) {
      this.setData({
        show: true
      })
    }
  },
  popupClose() {
    this.setData({
      show: false
    })
  },
  input(e) {
    console.log(e)
    let id = e.currentTarget.id;
    if ('title' == id) {
      this.setData({
        title: e.detail
      });
    } else if ('name' == id) {
      this.setData({
        name: e.detail
      });
    }
  },
})