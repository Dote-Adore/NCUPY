const app = getApp();

function loadingMore(that){

  that.setData({
    showThis:true
  })

  // 页数+1 
  that.data.page++;
  wx.request({
    url: app.globalData.url + '/publish/getpublishdetails',
    data: {
      page: that.data.page
    },
    success: function (res) {
      // 回调函数  
      var productInfo = that.data.productInfo;
      if(res.data.length===0){
        that.data.page--;
        that.setData({
          productInfo: productInfo,
          showThis: false
        })
        return;
      }
      for (var i = 0; i < res.data.length; i++) {
        productInfo.push(res.data[i]);
      }
      // 设置数据  
      that.setData({
        productInfo: productInfo,
        showThis:false
      })
    }
  })
}

module.exports.loadingMore = loadingMore