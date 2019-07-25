//index.js
//获取应用实例
const app = getApp()

Page({
  searchlist:{
    url:"",
    name:"宝贝1"
  },
  searchinput(){
  },
  confirmsearch(){
    wx.navigateTo({
      url: 'searchresult/searchresult',
    })
  }
})
