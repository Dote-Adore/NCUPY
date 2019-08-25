//app.js


App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    // 登录
    try {
      const res = wx.getSystemInfoSync()
      this.globalData.windowHeight = res.windowHeight;
      this.globalData.windowWidth = res.windowWidth;
      this.globalData.height =res.safeArea.height;
      this.globalData.top = res.safeArea.top;
      console.log(res);
    } catch (e) {

    }
  },



  globalData: {
    need2Rigster:false,
    userInfo: "",
    openid:"",
    windowHeight:"null",
    windowWidth:"null",
    height:null,
    top:null,
    maincolor:'#FE483D',
    userid:0,
    url:"https://www.ncutradingplatform.top:8443/NCUTradingPlatform",
    url2:"http://localhost:8080/NCUTradingPlatform"
  }
}) 