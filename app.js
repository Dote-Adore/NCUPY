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
    maincolor:'#00688b',
    userid:0,
    url2:"https://www.ncutradingplatform.top:8443/NCUTradingPlatform",
    url:"http://localhost:8080/NCUTradingPlatform"
  }
}) 