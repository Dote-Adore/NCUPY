// pages/user/about/about.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    githubUrl:'github.com/Dote-Adore',
    showEgg:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  copy(){
    var that = this
    wx.setClipboardData({
      data: that.data.githubUrl,
      success:res=>{
        wx.showToast({
          title: '复制成功！',
        })
      }
    })
  },
  toEgg(){
    this.setData({
      showEgg:true
    }),
    wx.setNavigationBarTitle({
      title: "嘿嘿嘿..."
    });
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#333333',
    })
  }
})