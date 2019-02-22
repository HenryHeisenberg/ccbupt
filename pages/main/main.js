// pages/main/main.js
const my = require("../../utils/my.js");
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */

  data: {
    activeNum:'',
    activeNick: ['1'],
    contentLength: 0,
    newsContent:'',

    activeNames: ['1'],
    list: [
      {
        question: "如何到达学校？",
        answer: `一、公交车880坐到康庄西站，到达学校门口（注：880和880区间均可到达学校，880北京市站点在朱辛庄）；
二、公交车919坐到大浮坨加油站下车（注：919从北京市德胜门坐，919分为快车和慢车，但是两车均可到大浮坨加油站，推荐坐919快车），打黑车到北京邮电大学世纪学院（一般站点就有黑车，25元）。
        三、霍营坐s2线小火车到延庆，之后做公交车Y44到康庄粮库路口下车，走200米就是学校。或者下小火车打黑车到北京邮电大学世纪学院。`
      },
      {
        question: "如何充值一卡通？",
        answer: `一、学生可以在综合服务楼一楼充值口进行充值；
二、点击支付宝，搜索大学生活，点击一卡通，按着要求输入即可充值。`
      }
    ],
    stepList : [
    "1.去操场找到本系场地，领取物质",
    "2.寝室整理",
    "3.体检",
    ],
    result :[
      
    ],
  },

onCheck: function(e){
  console.log(e.detail);
  if(e.detail.length!=0){
    var stepOne = e.detail.find((value, index, arr) => {
      return value === this.data.stepList[0];
    })
    if (!stepOne) {
      wx.showToast({
        title: '请完成步骤一再进行步骤二和步骤三',
        icon : "none"
      })
      return;
    }
  }

  this.setData({
    result: e.detail
  });
},

input:function(e){
  var length=e.detail.value.length;
  this.setData({
    contentLength : length
  });
},
onClickLeft:function(){

},

goToNews:function(event){
  var that=this;
  console.log(event.currentTarget.id);
  var id = event.currentTarget.id;
  this.setData({
    activeNum: 100
  });
  wx.request({
    url: app.data.host + "/board/selectById?id="+id,
    header: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    method: "GET",
    success: function (res) {
        that.setData({
          newsContent: res.data.data
        });
      console.log(that.data.newsContent);
      if (res.data.status === "success") {
        wx.showToast({
          title: "加载成功",//这里打印出登录成功
          icon: 'success',
          duration: 1000
        })
      }
    }
  })
},

turn(event){
  this.setData({
    activeNames: event.detail
  });
},

  turnTo(event) {
    this.setData({
      activeNick: event.detail
    });
  },

  submitFeedback: function (e) {
    var content = e.detail.value.content;
    var asker = app.student.name;
    if (content.length === 0) {
      wx.showToast({
        title: '信息不能为空!',
        icon: 'none'
      })
    } else {
      wx.request({
        url: app.data.host +"/comments/add",
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        method: "POST",
        data: {
          asker: asker,
          askContent: content,
          askTime: new Date()
        },
        success: function (res) {
          if (res.data.status === "success") {
            wx.showToast({
              title: "反馈成功",
              icon: 'success',
              duration: 1000
            })
          }
        }
      })
    }

  },

  navBack:function(){
    this.setData({
      activeNum:0
    });
  },

  onChange(event) {
    this.setData({
      activeNum: event.detail
    });
    console.log(this.data.activeNum);
    // if (event.detail==0){
    //   wx.navigateTo({
    //     url: '/pages/main/main',
    //   })
    // }
    // else if (event.detail==1){
    //   wx.navigateTo({
    //     url: '',
    //   })
    // }
    // else if (event.detail == 2) {
    //   wx.navigateTo({
    //     url: '/pages/feedback/feedback',
    //   })
    // }
    // else if (event.detail == 3) {
    //   wx.navigateTo({
    //     url: '',
    //   })
    // }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    try {
      const result = wx.getStorageSync('result')
      if (result) {
        this.setData({
          result : result
        })
      }
    } catch (e) {
     
    }
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
    my.boardSelectAll(this,app)
  },


  navigateBack: function () {
      wx.navigateBack({ changed: true });//返回上一页
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