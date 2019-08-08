// pages/user/message/message.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // type0: 处罚通知 type1：举报结果通知
    messageList:[]
  },
  onLoad: function (options) {
    this.getMessageList()
  },
  onShow: function () {
  },

  getMessageList(){
    var that = this
    wx.request({
      url: app.globalData.url+'/message/getlist',
      data: {
        userid: app.globalData.userid
      },
      success:res=>{
        that.setData({
          messageList:res.data
        })
      }
    })
  }
})