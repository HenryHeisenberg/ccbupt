import Notify from '../../dist/vant/notify/notify';
const utils = require("../../utils/util.js");
const my = require("../../utils/my.js");

const app = getApp();

Page({

  data: {
    str:'',
    page:0,
    buttons: [{
      label: '增加学生',
      className: 'add',
      icon: '/images/add.png'
    },
      // {
      //   label: '查找学生',
      //   className: 'select',
      //   icon: '/images/查找.png'
      // }
    ],
  },
  onLoad: function (options) {
    this.setData({})
  },
  onShow: function () {
    my.anniversarySelectAll(this, app);
  },
  onSearch: function (event){
    this.setData({
      page:1
    });
    let str = JSON.stringify(event.detail)
    setTimeout(function () {
      wx.navigateTo({
        url: "/pages/search/search?data=" + str,
      }, 2100)
    });
    
},

  onClick(e) {
    console.log(e)
    let index = e.detail.index
    if (index == 0) {
      wx.navigateTo({
        url: '/pages/add/add',
      })
    }
    // else if (index == 1) {
    //   wx.navigateTo({
    //     url: '/pages/selectStu/selectStu',
    //   })
    // }
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