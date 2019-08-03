const app = getApp()
function sellgoods(data,callback){
  wx.showModal({
    title: '确定将此条发布标记为 已卖出 吗？',
    content: '其他人将无法看到你发布的宝贝。',
    success:res=>{
      if(res.confirm){
        wx.showLoading({
          title: '正在标记...',
        })
        wx.request({
          url: app.globalData.url+'/trade/sell',
          data:{
            publishid:data.id,
            sellerid:data.userid,
            introduction: data.introduction,
            price:data.price,
            mainimgsrc:data.mainimgsrc
          },
          success:res=>{
            console.log(res);
            if(res.data==='success'){
              wx.showToast({
                title: '标记成功',
              })
              callback();
            }
            else{
              wx.showToast({
                title: '标记失败！请检查网络后重试',
                icon:'none'
              })
            }
            wx.hideLoading();
          }
        })

        }
      }
  })
}


module.exports = {
  sellgoods: sellgoods
}