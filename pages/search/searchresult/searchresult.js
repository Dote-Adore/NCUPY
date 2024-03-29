const app = getApp();
var pullup = require('../../../pages/common/pulluploading/pulluploading.js');
var login = require('../../../pages/common/login.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page:0,
    windowHeight: 0,
    content:'dasdadsadfd',
    productInfo:'',
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
    var that = this
    var data = this.data
    wx.request({
      url: app.globalData.url+'/publish/search',
      data:{
        content: data.content,
        page:data.page
      },
      success:res=>{
        that.setData({
          productInfo:res.data
        })
      },
      fail: (res)=>{
        wx.hideLoading();
        wx.showToast({
          title: '啊咧？！好像没连上网ORZ',
          icon: 'none'
        })
      }
    })
  },
  toDetails(e) {
    if (app.globalData.userInfo === '') {
      login.authorization();
      return;
    }
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