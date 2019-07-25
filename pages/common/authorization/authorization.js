const app = getApp();
Page({
  data: {
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  getUserInfo(e){
    getApp().globalData.userInfo = e.detail.userInfo;
    var that = this;
    console.log(e);
    if (!e.detail.userInfo)//没有获取
    wx.showToast({
      title: '获取失败',
      icon:'none',
      duration:2000
    });
    else{
      wx.showToast({
        title: '获取成功',
        icon: 'success',
        duration: 2000
      });
    }
    var interval = setInterval(function(){
      wx.navigateBack({
      });
      clearInterval(interval);
    },2000)
  },
})