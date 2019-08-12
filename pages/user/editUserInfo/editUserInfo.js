const app = getApp()

Page({
  data: {

    areaArr: [
        '天健园',
        '休闲区',
        '医学院',
        '其他'
    ],
    areaIdx:0,
    schoolid:'',
    phonenumber:'',
    enrollmentyear:'',
    userinfo:'',
    maincolor:app.globalData.maincolor
  },

  onLoad(options) {
    console.log(options);
    const eventChannel = this.getOpenerEventChannel();
    // 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
    // eventChannel.on('acceptDataFromOpenerPage', function (data) {
    //   console.log(data);
    // });
    this.setData({
      areaIdx:options.area,
      schoolid:options.schoolid,
      phonenumber:options.phonenumber,
      enrollmentyear:options.enrollmentyear
    })
    
  },
  areaChange(e){
    this.setData({
      areaIdx: e.detail.value
    })

  },
  schoolIDinput(e){
    this.data.schoolid = e.detail.value

  },
  phoneNuminput(e){
    this.data.phonenumber = e.detail.value
  },
  enrollmentYearInput(e){

    this.data.enrollmentyear = e.detail.value;
  },
  confirm(){
    if (this.data.phonenumber === '' || this.data.phonenumber===null){
      wx.showModal({
        content: '请填写您的联系方式，方便卖家联系你噢~',
      })
      return
    }
    wx.showLoading({
      title: '正在更改...',
    })
    var that = this
    wx.request({
      url: app.globalData.url+'/user/edituserInfo',
      data:{
        userid:app.globalData.userid,
        area:that.data.areaIdx,
        schoolid:that.data.schoolid,
        phonenum:that.data.phonenumber,
        enrollmentyear: that.data.enrollmentyear,
        method:"changeElse"
      },
      success(res){
        wx.hideLoading();
      if(res.data==='success'){
        wx.showToast({
          title: '修改成功!',
          duration: 1000,
        })
        setTimeout(function () {
          wx.navigateBack({
          })
        }, 1000)
      }
      }
    })
  },
  cancel(){
    wx.navigateBack({
    })
  }
})