var pullup = require('../../../pages/common/pulluploading/pulluploading.js');
var login = require('../../../pages/common/login.js')
const app = getApp()
Page({
  data: {

    page: 0,
    category: {
      name: '',
      idx: 0
    },
    WDHeight: app.globalData.windowHeight,
    WDWidth: app.globalData.windowWidth,
    productInfo:'',
    noMore:false
  },
  onLoad() {
    var that = this;
    const eventChannel = this.getOpenerEventChannel();
    // 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
    eventChannel.on('acceptDataFromOpenerPage', function(data) {
      console.log(data)
      that.setData({
        category: data
      });
    });

    wx.setNavigationBarTitle({
      title: that.data.category.name
    });
    this.getGoods();
  },
  onShow() {
    this.getGoods();
  },

  onPullDownRefresh() {
    this.getGoods();
    this.setData({
      noMore:false
    })
  },

  getGoods() {
    var that = this;
    wx.request({
      url: getApp().globalData.url + '/publish/getpublishdetails',
      data: {
        categoryid: that.data.category.idx,
        page: 0
      },
      success(res) {
        that.setData({
          productInfo: res.data,
          page: 0
        })
        wx.stopPullDownRefresh();
      }
    })
  },




  toDetails(e) {
    if (app.globalData.userInfo === '') {
      login.authorization();
      return;
    }
    var data = e.currentTarget.dataset;
    console.log(e.currentTarget.dataset);
    wx.navigateTo({
      url: '/pages/goodsdetails/goodsdetails',
      success: function(res) {
        res.eventChannel.emit('acceptDataFromOpenerPage', data)
      }
    })
  },

  onReachBottom: function() {
    var that = this;
    // 显示加载图标  
    pullup.loadingMore(that);
  },
})