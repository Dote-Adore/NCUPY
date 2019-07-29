const app = getApp()

Page({
  data: {
    basicData:'',
    goods:'',
    collect: {
      name: "collect",
      value: "收藏",
      checked: true
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var beforedata;
    const eventChannel = this.getOpenerEventChannel();
    // 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
    eventChannel.on('acceptDataFromOpenerPage', function (data) {
      beforedata = data;
    });
    that.setData({
      basicData: beforedata
    });
    console.log(beforedata);
    wx.setNavigationBarTitle({
      title:beforedata.name
    });
    if (that.data.basicData.name==='发布中')
      that.getPublish()
    else if(that.data.basicData.name==='我的收藏')
      this.getcollect();

  },

  onPullDownRefresh(){
    if (this.data.basicData.name === '发布中')
      this.getPublish()
    else if (this.data.basicData.name === '我的收藏')
      this.getcollect();
  },

  getPublish(){
    var that = this
    wx.request({
      url: getApp().globalData.url+'/publish/getpublishdetails',
      data:{
        userid:getApp().globalData.userid,
        name:that.data.basicData.name
      },
      success(res){
        console.log(res);
        that.setData({
          goods:res.data
        });
        wx.stopPullDownRefresh();
        wx.showToast({
          title: '刷新成功！',
          icon: 'none'
        })
      }
    })
  },

  getcollect(){
    var that = this
    wx.request({
      url: getApp().globalData.url + '/collect',
      data:{
        userid:app.globalData.userid,
        method:'getAllCollections'
      },
      success:res=>{
        that.setData({
          goods:res.data
        })
        wx.stopPullDownRefresh();
        wx.showToast({
          title: '刷新成功！',
          icon: 'none'
        })
      }
    })
  },
  toComments(e){
  },
  
  toDetails(e){//进入详情界面
  console.log(e);
    var data = e.currentTarget.dataset
    wx.navigateTo({
      url: '../../goodsdetails/goodsdetails',
      success: function (res) {
        res.eventChannel.emit('acceptDataFromOpenerPage', data)
      }
  })
  },
  checkboxChange(e) {
    let publishid = e.currentTarget.dataset.publishid
    if (e.detail.value[0] == 'collect') {
      wx.request({
        url: app.globalData.url + '/collect',
        data: {
          userid: app.globalData.userid,
          publishid: publishid,
          method: 'collect'
        },
        success: res => {
          wx.showToast({
            title: '收藏成功',
            icon: 'success',
            duration: 1000,
          })
        }
      })
    }
    else {
      console.log(this.data.goods);
      wx.request({
        url: app.globalData.url + '/collect',
        data: {
          userid: app.globalData.userid,
          publishid: publishid,
          method: 'cancelCollect'
        },
        success: res => {
          wx.showToast({
            title: '取消收藏成功',
            icon: 'success',
            duration: 1000,
          })
        }
      })
    }
  },
  
})