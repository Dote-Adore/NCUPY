//index.js
//获取应用实例
const app = getApp()

Page({

  data: {
    searchContent:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },
  searchinput(e){
    this.setData({
      searchContent: e.detail.value
    })
  },
  confirmsearch(){
    var searchContent = this.data.searchContent
    if(searchContent!=''){
    wx.navigateTo({
      url: 'searchresult/searchresult',
      success:res=>{
        res.eventChannel.emit('acceptDataFromOpenerPage', searchContent)
      }
    })
    return;
    }
    else{
      wx.showToast({
        title: '请输入搜索内容',
        icon:'none'
      })
    }
  }

})