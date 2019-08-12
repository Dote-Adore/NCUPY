// pages/goodsdetails/report/report.js
const app = getApp()
Page({
  data: {
    reportReason:[
      {title: '图片涉嫌传播不当内容', selected:false},
      {title: '疑似欺诈',selected:false},
      {title: '泄露隐私', selected: false},
      {title: '垃圾广告', selected: false},
      {title: '人生攻击', selected: false},
      {title: '假冒伪劣', selected: false},
      {title: '出售禁售物品', selected: false}
    ],
    remark:'',
    publishid:0
  },

  onLoad: function (options) {
    this.getperviousData()

  },
  getperviousData(){
    var that = this
    const eventChannel = this.getOpenerEventChannel();
    // 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
    eventChannel.on('acceptDataFromOpenerPage', function (data) {
      that.data.publishid = data.publishid
    });
  },
  toSelected(e) {
    var index = e.currentTarget.dataset.idx
    this.data.reportReason[index].selected = !this.data.reportReason[index].selected
    this.setData({
      reportReason: this.data.reportReason
    })
  },
  inputRemark(e){
    this.data.remark = e.detail.value
  },
  toReport(){
    let reportReason = this.data.reportReason;
    let selectedReason = [];
    for(let i = 0 ; i<reportReason.length; i++) {
      if(reportReason[i].selected){
        selectedReason.push(reportReason[i].title);
      }
    }
    console.log(selectedReason)
    if(!selectedReason[0]){
      wx.showToast({
        title: '请选择至少一条理由',
        icon: 'none'
      })
      return;
    }
    selectedReason = selectedReason.join(';')
    console.log(app.globalData.userInfo)
    wx.request({
      url: app.globalData.url+ '/report/create',
      method: 'post',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        informerid: app.globalData.userid,
        informername: app.globalData.userInfo.nickName,
        publishid:this.data.publishid ,
        reason: selectedReason,
        remark: this.data.remark
      },
      success: res=>{
        if(res.data.success){
          wx.showModal({
            title: '举报成功，请等待工作人员的回复',
            success(res) {
              wx.navigateBack({})
            }
          })
        } else{
          if (res.data.hasbeenreported){
            wx.showModal({
              title: '该商品已有人举报，请等候处理',
              success(res) {
                wx.navigateBack({})
              }
            })
          }
          else{
            wx.showModal({
              title: '发送出错',
              success(res) {
                wx.navigateBack({})
              }
            })
          }
        }
      }
    })
  }
})