const app = getApp();
const login = require('../../pages/common/login.js')
Page({
  data: {
    url: app.globalData.url,
    userid: app.globalData.userid,
    userInfoInWechat: '',
    userInfoInDB: undefined,
    sellingTotalPrice: "",
    maincolor: app.globalData.maincolor,
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    menu: [{
        name: '发布中',
        value: ""
      },
      {
        name: '已卖出',
        value: ""
      },
      {
        name: '我的收藏',
        value: ""
      }
    ],
    areaArr: [
      '天健园',
      '休闲区',
      '医学院',
      '其他'
    ],
    unreadnum: 0,
  },

  onLoad: function() {
    var that = this
    setTimeout(function(){
      that.requestTheDetails();
    },1000)
    setTimeout(function() {
      that.updateUserinfo();
    }, 4000)
  },

  onShow: function() {
    if (app.globalData.userInfo === '') {
      login.login();
      login.authorization();
      return;
    }
    this.requestTheDetails();
    this.data.hasUserInfo = true,
    this.setData({
      userInfoInWechat: app.globalData.userInfo,

      userid: app.globalData.userid
    })
    this.getNumreadMessagenum()
  },
  getNumreadMessagenum(){
    var that = this
    wx.request({
      url: app.globalData.url+'/message/getunreadnum',
      data:{
        userid:app.globalData.userid,
      },
      success(res) {
       if(res.data.success){
         that.setData({
           unreadnum:res.data.unreadnum,
         })
       }
      }
    })
  },
  toInfo(e) {
    var idx = e.target.dataset.idx;
    var data = {
      menu: this.data.menu[idx].name,
      userid: getApp().globalData.userid,
      name: this.data.menu[idx].name
    }
    wx.navigateTo({
      url: 'menu/menu',
      success: function(res) {
        res.eventChannel.emit('acceptDataFromOpenerPage', data)
      }
    })
  },

  requestTheDetails: function() {
    var that = this;
    var menu = that.data.menu;
    wx.request({
      url: this.data.url + '/getUserDetails',
      data: {
        id: getApp().globalData.userid
      },
      success: res => {
        menu[0].value = res.data.havePublishedNum;
        menu[1].value = res.data.dealDoneNum;
       // menu[2].value = res.data.purchasedNum;
        menu[2].value = res.data.collectionNum;
        that.data.sellingTotalPrice = res.data.sellingTotalPrice;

        this.setData({
          userInfoInDB: res.data.userinfo,
          menu: that.data.menu, //获取收藏等
          sellingTotalPrice: that.data.sellingTotalPrice,
        })
        console.log(that.data.userInfoInDB);
      }
    })
  },

  // toUserHome() {
  //   var that = this
  //   wx.navigateTo({
  //     url: '/pages/userHome/userHome',
  //     success: res => {
  //       res.eventChannel.emit('acceptDataFromOpenerPage', {
  //         userid: app.globalData.userid,
  //         avatarUrl: that.data.userInfo.avatarUrl
  //       })
  //     }
  //   })
  // },
  toEditUserInfo(e) {
    var that = this.data.userInfoInDB
    wx.navigateTo({
      url: 'editUserInfo/editUserInfo?area=' + that.area + '&enrollmentyear=' + that.enrollmentyear + '&id=' + that.id + '&phonenumber=' + that.phonenumber + '&schoolid=' + that.schoolid,
      // success:res=>{
      //   res.eventChannel.emit('acceptDataFromOpenerPage', {data:that})
      // }
    })
  },

  updateUserinfo() {
    var that = this.data
    if (that.userInfoInDB.avatar != app.globalData.userInfo.avatarUrl) {
      wx.request({
        url: app.globalData.url + '/user/edituserInfo',
        data: {
          avatar: app.globalData.userInfo.avatarUrl,
          userid: app.globalData.userid,
          method: "changeAvatar"
        }
      })
    }
    if (that.userInfoInDB.name != app.globalData.userInfo.nickName) {
      wx.request({
        url: app.globalData.url + '/user/edituserInfo',
        data: {
          name: app.globalData.userInfo.nickName,
          userid: app.globalData.userid,
          method: "changeName"
        }
      })
    }
  },
  tomessage(){
    wx.navigateTo({
      url: 'message/message',
    })
  },
  toAbout(){
    wx.navigateTo({
      url: 'about/about',
    })
  }
})