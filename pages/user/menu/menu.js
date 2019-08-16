const app = getApp()
var publish = require('../../../utils/publish.js')
var trade = require('../../../utils/trade.js')
Page({
  data: {
    basicData:'',
    goods:null,
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
    else if(that.data.basicData.name==='已卖出')
      this.getTrade();

  },

//发布中
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
      }
    })
  },

//我的收藏
  getcollect(){
    var that = this
    wx.request({
      url: getApp().globalData.url + '/collect',
      data:{
        userid:app.globalData.userid,
        method:'getAllCollections'
      },
      success:res=>{
 
        for(let i = 0;i<res.data.length;i++){
          res.data[i].collect = true;
        }
        that.setData({
          goods:res.data
        })
      }
    })
  },
  //已卖出
  getTrade(){
    var that = this;
    wx.request({
      url: app.globalData.url+'/trade/get',
      data:{
        userid:app.globalData.userid
      },
      success:res=>{
        that.setData({
          goods:res.data
        })
      }
    })
  },
  toComments(e){
  },
  
  toDetails(e){//进入详情界面
    if(this.data.basicData.name==='已卖出')
      return;
    console.log(e);
    var data = e.currentTarget.dataset
    wx.navigateTo({
      url: '../../goodsdetails/goodsdetails',
      success: function (res) {
        res.eventChannel.emit('acceptDataFromOpenerPage', data)
      }
  })
  },
  toCollect(e){

    publish.tocollect(this, this.data.goods[e.currentTarget.dataset.idx]);
    this.data.goods[e.currentTarget.dataset.idx].collect = !this.data.goods[e.currentTarget.dataset.idx].collect;
    this.setData({
      goods:this.data.goods
    })
  },
  toEdit(e){
    wx.navigateTo({
      url: '/pages/publish/edit/edit',
      success: function (res) {
        res.eventChannel.emit('acceptDataFromOpenerPage', e.currentTarget.dataset.info)
      }
    })
  },
  tosell(item) {
    var that = this
    var data = item.currentTarget.dataset.info;
    trade.sellgoods(data, function () {
      that.getPublish();
    })
  },
})