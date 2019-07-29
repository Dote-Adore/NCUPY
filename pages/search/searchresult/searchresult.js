const app = getApp();
var pullup = require('../../../pages/common/pulluploading/pulluploading.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page:0,
    windowHeight: 0,
    content:'dasdadsadfd',
    productInfo:null,
    showThis:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
     const eventChannel = this.getOpenerEventChannel();
     eventChannel.on('acceptDataFromOpenerPage', function (data) {
       that.setData({
         content:data,
         windowHeight: app.globalData.windowHeight
       })
     })
    that.getList()
  },
  getList(){
    wx.showLoading({
      title: '玩命加载中...',
    })
    var that = this
    var data = this.data
    wx.request({
      url: app.globalData.url+'/publish/search',
      data:{
        content: data.content,
        page:data.page
      },
      success:res=>{
        wx.hideLoading();
        that.setData({
          productInfo:res.data
        })
      }
    })
  },
  toDetails(e) {
    var data = e.currentTarget.dataset;
    console.log(e);
    wx.navigateTo({
      url: '/pages/goodsdetails/goodsdetails',
      success: function (res) {
      res.eventChannel.emit('acceptDataFromOpenerPage', data)
      }
    })
  },



  onReachBottom: function () {
    var that = this
    that.setData({
      showThis: true
    })

    // 页数+1 
    that.data.page++;
    wx.request({
      url: app.globalData.url+'/publish/search',
      data: {
        content: that.data.content,
        page: that.data.page
      },
      success: function (res) {
        // 回调函数  
        var productInfo = that.data.productInfo;
        if (res.data.length === 0) {
          that.data.page--;
          that.setData({
            showThis: false
          })
          return;
        }
        for (var i = 0; i < res.data.length; i++) {
          productInfo.push(res.data[i]);
        }
        // 设置数据  
        that.setData({
          productInfo: productInfo,
          showThis: false
        })
      }
    })
  }, 
})