//index.js
//获取应用实例
var login = require('../../pages/common/login.js')
var pullup = require('../../pages/common/pulluploading/pulluploading.js')
const app = getApp()

Page({
  data: {
    WDHeight: app.globalData.windowHeight,
    WDWidth: app.globalData.windowWidth,
    categories:['数码','衣物','日用','学习','美妆','娱乐','运动','零食'],
    maincolor: app.globalData.maincolor,
    productInfo:'',
    page:0
  },
  onLoad(){
    this.getGoods();
    if (app.globalData.userid === 0) {
      login.login();
    }
    
  },
  onPullDownRefresh(){
    console.log("refresh!");
    this.getGoods();
  },
  onShow(){
  },
  getGoods(){
    wx.showLoading({
      title: '玩命加载中',
    })
    var that = this;
    wx.request({
      url: getApp().globalData.url+'/publish/getpublishdetails',
      data:{
        page:0//显示的页数，一页传递20个数据
      },
      success(res){
       that.setData({
         productInfo:res.data,
         page:0
       });
       wx.hideLoading();
       wx.stopPullDownRefresh();
       wx.showToast({
         title: '刷新成功！',
         icon:'none'
       })
      }
    })
  },

  toCategory(e){
    var index = e.currentTarget.dataset.idx;
    var categories = this.data.categories;
    console.log(e.currentTarget.dataset.idx);
    wx.navigateTo({
      url: 'category/category',
      success: function (res) {
        res.eventChannel.emit('acceptDataFromOpenerPage', { idx: index, name: categories[index]})
      }
    })
  },
  toDetails(e){
    if(app.globalData.userInfo===''){
      login.authorization();
      return;
    }
    var data = e.currentTarget.dataset;
    console.log(e);
    wx.navigateTo({
      url: '../goodsdetails/goodsdetails',
      success: function (res) {
        res.eventChannel.emit('acceptDataFromOpenerPage', data)
    }
  })
  },


    onReachBottom: function () {
    var that = this;
    // 显示加载图标  
      pullup.loadingMore(that);
    
  }, 
})