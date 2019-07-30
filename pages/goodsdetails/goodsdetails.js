const app = getApp();
var popup = require('../common/popup/popup.js')

Page({
  data: {
    productInfo: '',
    goodsimagesurl: "",
    WDHeight: app.globalData.windowHeight,
    WDWidth: app.globalData.windowWidth,
    height: app.globalData.windowHeight,
    collect: {
      name: "collect",
      value: "收藏",
      checked: false
    },
    sellerHeadPortraitimg: '/resoures/sellerHeadPortrait1.jpg',
    publishTimer: 0,
    iscommentting: false,
    commentContent: "",
    isowner: false,
    commentarr: '',
    myUserid: 0,
    showModal: false,
    tagsArray: [],
    popupanim_opc: null,
    popupanim: null,
    blurPosY: app.globalData.windowHeight*(-1)
  },
  onLoad: function(options) {
    var that = this
    this.getPrePageinfoData();
    this.getImagesUrl();
    this.isCollected();
    this.getComments();
    this.toTagArray()
    wx.getSystemInfo({
      success: function(res) {
        console.log(res);
          that.data.height =res.windowHeight
      },
    })
  },
  isCollected() { //是否被收藏
    let that = this
    wx.request({
      url: app.globalData.url + '/collect',
      data: {
        userid: app.globalData.userid,
        publishid: this.data.productInfo.id,
        method: 'isCollected'
      },
      success: res => {
        that.data.collect.checked = res.data
        that.setData({
          collect: that.data.collect,
          myUserid: app.globalData.userid
        })
      }
    })
  },
  getPrePageinfoData() { //得到上一个页面发来的数据
    var that = this;
    var productInfoData;
    const eventChannel = this.getOpenerEventChannel();
    // 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
    eventChannel.on('acceptDataFromOpenerPage', function(data) {
      productInfoData = data.productdata;
    });
    that.setData({
      productInfo: productInfoData
    })
    if (productInfoData.userid === app.globalData.userid)
      that.setData({
        isowner: true
      })
  },
  getImagesUrl() {
    var that = this;
    wx.request({
      url: getApp().globalData.url + '/goods/getimgurls',
      data: {
        id: this.data.productInfo.id
      },
      success(res) {
        that.setData({
          goodsimagesurl: res.data
        })
      }
    })
  },


  toTagArray() {
    var data = this.data.productInfo.commontags

    data = data.replace(/"/g, '');
    data = data.replace("[", '');
    data = data.replace("]", '');
    this.setData({
      tagsArray: data.split(",")
    })
  },
  handleImagePreview(e) {
    console.log(e.target.dataset.idx);
    const idx = e.target.dataset.idx;
    const images = this.data.goodsimagesurl;
    wx.previewImage({
      current: images[idx], //当前预览的图片
      urls: images //所有要预览的图片
    });
  },
  checkboxChange(e) {
    if (e.detail.value[0] == 'collect') {
      wx.request({
        url: app.globalData.url + '/collect',
        data: {
          userid: app.globalData.userid,
          publishid: this.data.productInfo.id,
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
          publishid: this.data.productInfo.id,
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
  comments() {
    console.log("comments");
    var that = this;
    that.setData({
      iscommentting: true,
      commentContent: that.data.commentContent
    })
  },
  loseFocus() {
    console.log("loseFoucs");
    var that = this;
    that.setData({
      iscommentting: false,
    })
  },
  sendComments() {
    var that = this;
    console.log('send');
    if (that.data.commentContent == '') {
      wx.showToast({
        title: '请输入文字内容',
        icon: 'none',
        duration: 2000,
      })
      return;
    };
    wx.showLoading({
      title: '正在发送',
    });
    wx.request({
      url: app.globalData.url + '/comments/create',
      data: {
        userid: app.globalData.userid,
        publishid: that.data.productInfo.id,
        content: that.data.commentContent
      },
      success: res => {
        console.log(res);
        wx.hideLoading();
        wx.showToast({
          title: '发送成功',
          duration: 1000
        })
        setTimeout(function() {
          that.getComments();
          that.setData({
            iscommentting: false
          })
        }, 1000)
      }
    })
  },
  inputComments(e) {
    console.log(e.detail.value);
    this.data.commentContent = e.detail.value;
  },

  toManage() {
    this.showDialogBtn();
  },
  toCancelManage() {
    this.hideModal();
  },
  toDeleteManage() {
    var that = this
    this.hideModal();
    wx.showModal({
      title: '',
      content: '确定要删除宝贝吗？',
      success: res => {
        if (res.confirm) {
          wx.showLoading({
            title: '正在删除',
          })
          wx.request({
            url: app.globalData.url + '/publish/delete',
            data: {
              publishid: that.data.productInfo.id,
              userid: that.data.productInfo.userid
            },
            success: res => {
              wx.hideLoading();
              if (res.data === 'successDelete') {
                wx.showToast({
                  title: '删除成功',
                  duration: 1000
                });
                setTimeout(function() {
                  wx.navigateBack({})
                }, 1000)
              }
            }
          })
        }
      }
    })
  },


  getComments() {
    var that = this
    wx.request({
      url: app.globalData.url + '/comments/get',
      data: {
        publishid: that.data.productInfo.id
      },
      success: res => {
        console.log(res.data);
        that.setData({
          commentarr: res.data
        })
      }
    })
  },


  toDeleteComments(e) {
    var that = this
    wx.showModal({
      title: '',
      content: '确定要删除此留言吗？',
      success: res => {
        if (res.confirm) {
          wx.request({
            url: app.globalData.url + '/comments/delete',
            data: {
              id: e.currentTarget.dataset.id
            },
            success: res => {
              if (res.data) {
                wx.showToast({
                  title: '删除成功！',
                  duration: 1000
                })
                that.getComments();
              }
            }
          })
        }
      }
    })
  },


  //滚动
  onPageScroll(e){
    this.setData({
      blurPosY: e.scrollTop * (-1) - this.data.height + 60
    })
  },

  //弹窗
  showDialogBtn() {
    this.setData({
      showModal: true
    })
    popup.popupanim(this);
    popup.opacanim(this)

  },
  /**
   * 弹出框蒙层截断touchmove事件
   */
  preventTouchMove() {},
  /**
   * 隐藏模态对话框
   */
  hideModal() {
    popup.popupanim(this);
    popup.opacanim_reverse(this)
    setTimeout(()=>{
      this.setData({
        showModal: false
      });
    },70)

  },
  toEditManage() {
    var that = this
    wx.navigateTo({
      url: '/pages/publish/edit/edit',
      success: function(res) {
        res.eventChannel.emit('acceptDataFromOpenerPage', that.data.productInfo)
      }
    })
  },



})