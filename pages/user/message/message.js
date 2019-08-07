// pages/user/message/message.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // type0: 处罚通知 type1：举报结果通知
    messageList:[
      {
        type: 0,
        title:"处罚结果通知",
        time:"2019-5-13 20:23:43",
        content:'重复发布相同内容;商品介绍涉嫌违法;禁止发布的商品类型',
        remark: "同学你好，你的发布“健身房的肌肤”部分内容违规，已做下架删除处理",
        content2: "塞尔焦点事件佛i大家hi哦分和山东哈佛i是否",
        imgsrc: "https://ncutradingplatform.oss-cn-shanghai.aliyuncs.com/publishimg/2019/08/03/publishedimg_userid=46_publishid=209_index=1.jpg",
        hasRead:false
      },
      {
        type: 1,
        title: "举报结果通知",
        time: "2019-8-34",
        content: "举报成功",
        remark: "",
        hasRead: true
      },
      {
        title: "处罚结果通知",
        time: "2019-9-50",
        content: ""
      }
    ]
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