// pages/user/message/message.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // type0: 处罚通知 type1：举报结果通知
    messageList: []
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
  },
  topublishdetails(e){
    var publishid = e.currentTarget.dataset.publishid;
    var that = this
    //获取商品详情
    wx.request({
      url: app.globalData.url + '/publish/getbyid',
      data:{
        id:publishid
      },
      success:res=>{
        if(res.data.id){
          console.log('success!')
          that.todetails(res.data)
        }
        else
          console.log("fail!")
      }
    })
  },
  todetails(data){
    console.log(data)
    wx.navigateTo({
      url: '/pages/goodsdetails/goodsdetails',
      success: function (res) {
        res.eventChannel.emit('acceptDataFromOpenerPage', {productdata:data})
      }
    })

  }
})