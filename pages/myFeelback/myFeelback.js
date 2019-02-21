// pages/myFeelback/myFeelback.js
import Notify from '../../dist/notify/notify';
var app=getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list : []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.request({
      url: app.data.host + "/comments/selectByUser",
      method: "GET",
      data: {
        id: app.student.name
      },
      header: {
        "content-type": "application/x-www-form-urlencoded;charset=utf-8",
      },
      success: res => {
        if (res.data.status === "success") {
          if (res.data.data.length === 0) {
            Notify({
              text: '暂无反馈内容',
              duration: 5000,
              selector: '#custom-selector',
              backgroundColor: '#1989fa'
            });
            return;
          }
          that.data.list = res.data.data;
          that.setData({
            list: that.data.list
          })
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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

  }
})