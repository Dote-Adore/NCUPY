const app = getApp();


function login(){
   // 获取用户信息


//function getUserInfo(e) {
  var that = this;
  wx.getSetting({
    success: res => {
      if (res.authSetting['scope.userInfo']) {
        // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
        wx.getUserInfo({
          success: res => {
            // 可以将 res 发送给后台解码出 unionId
            console.log(res.userInfo);
            app.globalData.userInfo = res.userInfo
            mylogin();
            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
            // 所以此处加入 callback 以防止这种情况
            if (that.userInfoReadyCallback)
              that.userInfoReadyCallback(res)
          },
        })
      }
      else {//没有授权,引导授权
        console.log("获取用户信息失败")
        wx.showModal({
          title: '警告',
          content: '尚未进行授权，请点击去认定跳转到授权页面进行授权',
          success: function (res) {
            if (res.confirm) {
              console.log('用户点击确定')
              wx.navigateTo({
                url: '/pages/common/authorization/authorization',
              })
            }
          }
        })
      }
    }
  });
}

function mylogin() {
  wx.login({
    success: res => {
      wx.request({
        url: app.globalData.url + '/getOpenId',
        data: {
          "code": res.code,
        },
        success: res => {
          console.log(res.data);
          if (!res.data.hasAccount) {  //如果返回的为假，则该用户没有被注册
            console.log("注册");
            app.globalData.openid = res.data.openid;
            registerAccount();
          } else {
            app.globalData.userid = res.data.id;//如果为真
            console.log(app.globalData.userid);
          }
        }
      })
    }
  })
}

function registerAccount() {
  var userinfo = app.globalData.userInfo;
  wx.request({
    url: app.globalData.url + '/register',
    data: {
      nickName: userinfo.nickName,
      avatar: userinfo.avatarUrl,
      openid: app.globalData.openid
    }, success: res => {
      console.log(res);
    }
  })
}
module.exports = {
  login: login
}