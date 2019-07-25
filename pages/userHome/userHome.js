const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getPrePageinfoData();
  },

  getPrePageinfoData() { //得到上一个页面发来的数据
    var that = this;
    const eventChannel = this.getOpenerEventChannel();
    // 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
    eventChannel.on('acceptDataFromOpenerPage', function (data) {
      that.setData({
        userInfo:data
      })
    });
  },

  onShow(){
  }
})