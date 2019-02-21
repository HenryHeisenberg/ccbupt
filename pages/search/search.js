import Notify from '../../dist/vant/notify/notify';
const utils = require("../../utils/util.js");
const my = require("../../utils/my.js");

const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    str: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    let str = JSON.parse(options.data);
    that.setData({
      str: str
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

onCancel:function(){
  wx.navigateTo({
    url: '/pages/index/index',
  })
},
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    my.studentsSelectByOne(this, app, this.data.str);
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  more(e) {
    let that = this;
    let index = e.currentTarget.dataset.index
    let item = this.data.data[index];
    wx.showActionSheet({
      itemList: ['编辑', '删除'],
      success(res) {
        let tapIndex = res.tapIndex;
        if (tapIndex == 0) {
          wx.navigateTo({
            url: '/pages/add/add?type=edit&id=' + item.id,
          })
        } else if (tapIndex == 1) {
          wx.showModal({
            title: '提示',
            content: '删除' + item.name + '?',
            success(res) {
              if (res.confirm) {
                my.customerDel(this, app, item.id).then(res => {
                  if ('success' == res.status) {
                    that.data.data.splice(index, 1);
                    that.setData({
                      data: that.data.data
                    })
                  }
                })
              }
            }
          })
        }
      }
    })
  }
})