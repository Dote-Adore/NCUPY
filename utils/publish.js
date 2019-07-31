const app = getApp();

function tocollect(that,data){
  var changedata = !that.data.collect.checked;
  if (changedata) {
    wx.request({
      url: app.globalData.url + '/collect',
      data: {
        userid: app.globalData.userid,
        publishid: data.id,
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
  } else {
    wx.request({
      url: app.globalData.url + '/collect',
      data: {
        userid: app.globalData.userid,
        publishid: data.id,
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
  that.data.collect.checked = changedata;
  that.setData({
    collect: that.data.collect
  })
}

module.exports = {
  tocollect: tocollect
}