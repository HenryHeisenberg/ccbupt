// pages/login/login.js

import Dialog from '../../dist/vant/dialog/dialog';

const utils = require("../../utils/util.js");
const my = require("../../utils/my.js");
const app = getApp();

Page({


  data: {
    username: '',
    password: '',
    show:'',
    error:''
  },

  inputusername(event){
    var that=this;
    that.setData({
      username: event.detail
    });
  },

  inputpassword(event) {
    var that = this;
    that.setData({
      password: event.detail
    });
  },
  /**
   * 页面的初始数据
   */
  onClose() {
    this.setData({ show: false });
  },

  formSubmit: function (e) {
    var that = this;
    var username = that.data.username;
    var password = that.data.password;
    if(username == 'admin' && password == 'admin'){
      wx.navigateTo({
        url: '/pages/admin/admin',
      })
      return;
    }
    wx.request({
      method: 'POST',
      data: {
        'username': username,
        'password': password
      },
      url: app.data.host+"/students/login",
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success: function (res) {
        if (res.data.status=='success'){
          let student = JSON.stringify(res.data.data);
          app.student=res.data.data;
            setTimeout(function(){
              wx.navigateTo({
                url: "/pages/students/students?data=" + student,
              },2100)
            });
          }
          else{ 
          wx.showModal({
            title: '登陆错误',
            content: '没有查询到信息，请联系招生咨询电话：010-61227811、61227318、61227578。',
            showCancel: false,//是否显示取消按钮
            cancelText: "确定",//默认是“取消”
            cancelColor: 'skyblue',//取消文字的颜色
            confirmColor: 'skyblue'//确定文字的颜色
          })
          }
      },
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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

  getusername:function(event){
      console.log(event.target.dataset.username);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  goToWeb:function(){
    var that=this;
    wx.setClipboardData({
      data: 'www.ccbupt.com',
      success(res) {
        wx.getClipboardData({
          success(res) {
            console.log(res.data) // data
            utils.showToast("学校官网已复制成功，请到浏览器粘贴访问");
          }
        })
      }
    })
  },
  // login:function(){
  //   wx.request({
  //     url: 'http://localhost/students/selectAll',
  //     header:{
  //       'content-type':'application/json'
  //     },
  //     data:data,
  //     success:function(){
        
  //     }
  //   })
  // }
})