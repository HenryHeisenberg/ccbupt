import Notify from '../../dist/notify/notify';
import Dialog from '../../dist/dialog/dialog';
var Util = require('../../utils/util.js');
Page({
  data: {
    list : [],
    show : false,
    message : "",
    comment : {},
    replier : "管理员"
  },
  onLoad : function(options){
    var that =this;
    wx.request({
      url: "http://localhost/comments/selectAll",
      method: "GET",
      data: {
      },
      header: {
        "content-type": "application/x-www-form-urlencoded;charset=utf-8",
      },
      success: res => {
        console.log(res.data);
        if (res.data.status === "success") {
          if(res.data.data.length===0){
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
  deleteComment :function(e){
    var cid=e.target.dataset.cid;
    Dialog.confirm({
      message: '确认删除？'
    }).then(() => {
      wx.request({
        url: "http://localhost/comments/del",
        method: "POST",
        data: {
          id: cid
        },
        header: {
          "content-type": "application/x-www-form-urlencoded;charset=utf-8",
        },
        success: res => {
          if (res.data.status === "success") {
            wx.showToast({
              title: '删除成功'
            })
            getCurrentPages()[getCurrentPages().length - 1].onLoad();
          } else {
            wx.showToast({
              title: '服务器繁忙'
            })
          }
        }
      })
    }).catch(() => {
      Dialog.close;
    });
    
  },
  replyComment : function(e){
    var comment=e.target.dataset.comment;
    this.setData({
      show : true,
      comment :comment,
      message : ""
    })
  },
  onClose(event) {
    if (event.detail === 'confirm') {
      // 异步关闭弹窗
      setTimeout(() => {
        this.setData({
          show: false,
          message : ""
        });
      }, 1000);
    } else {
      this.setData({
        show: false,
        message: ""
      });
    }
  },
  messageChange : function(e){
    this.setData({
      message : e.detail
    })
  },
  confirmReply : function (e){
    if(this.data.message.length===0){
      console.log(e);
      wx.showToast({
        title: '信息不能为空',
        icon : "none"
      })
      return;
    }
    var replyContent=this.data.message;
    var comment=this.data.comment;
    console.log(comment);
    comment.replier=this.data.replier;
    comment.replyContent=replyContent;
    comment.replyTime=new Date();

    wx.request({
      url: "http://localhost/comments/update",
      method: "POST",
      data: Util.json2Form(comment),
      header: {
        "content-type": "application/x-www-form-urlencoded",
      },
      success: res => {
        if (res.data.status === "success") {
          wx.showToast({
            title: '回复成功'
          })
          getCurrentPages()[getCurrentPages().length - 1].onLoad();
        } else {
          wx.showToast({
            title: '服务器繁忙',
            icon: "loading"
          })
        }
      }
    })
  }
})