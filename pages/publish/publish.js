const app = getApp();
const login = require('../../pages/common/login.js')
Page({

  data: {
    url: app.globalData.url,
    maincolor: app.globalData.maincolor,
    userInfoInDB: '',
    publishid: 0,
    images: [],
    price: '',
    introduction: '',
    tags: {
      choosentags: [],
      classify: ''
    },
    tagarray: '',

    deviceWidth: app.globalData.windowWidth,
    items: [{
        name: 'new',
        value: '全新'
      },
      {
        name: 'noBargain',
        value: '不讲价'
      }
    ],


  },
  onLoad() {
    var that = this;
    console.log(that.data.tags);
  },
  onShow() {
    var that = this;
    var finaltagarray = [];
    for (var i = 0; i < that.data.tags.choosentags.length; i++) {
      for (var j = 0; j < that.data.items.length; j++)
        if (that.data.tags.choosentags[i] === that.data.items[j].name) {
          finaltagarray.push(that.data.items[j].value);
        }
    }
    finaltagarray.push(that.data.tags.classify.value);
    console.log("tagarry:" + finaltagarray)
    that.setData({
      tagarray: finaltagarray
    })
    if (that.data.tagarray === null)
      that.setData({
        tagarray: '>'
      })
    this.getuserinfo();
  },
  getuserinfo(){
    var that = this
    wx.request({
      url: app.globalData.url +'/getUserDetails',
      data:{
        id: app.globalData.userid
      },
      success: res =>{
        that.data.userInfoInDB = res.data.userinfo
      }
    })
    console.log(that.data.userInfoInDB)
  },
  getIntroduction(e) {
    this.data.introduction = e.detail.value;
    console.log(this.data.introduction);
  },
  getPrice(e) {
    this.data.price = e.detail.value;
  },

  chooseImage(e) {
    wx.chooseImage({
      success: this.handleChooseImageSucc.bind(this)
    })
  },


  handleChooseImageSucc(res) { //选择图片
    var that = this;
    const images = res.tempFilePaths;
    console.log(images);
    var choosenimagesArr = that.data.images;
    if (choosenimagesArr.length + images.length <= 9) {
      for (var i = 0; i < images.length; i++)
        choosenimagesArr.push(images[i]);
      console.log(choosenimagesArr);
      that.setData({
        images: choosenimagesArr
      })
    }

  },
  removeImage(e) {
    console.log("removepics:" + e.target.dataset.idx);
    var that = this;
    const idx = e.target.dataset.idx;
    const resultimage = this.data.images;
    resultimage.splice(idx, 1);
    that.setData({
      images: resultimage
    })
  },
  handleImagePreview(e) {
    console.log(e);
    const idx = e.target.dataset.idx;
    const images = this.data.images;
    wx.previewImage({
      current: images[idx], //当前预览的图片
      urls: images, //所有要预览的图片
    });
  },
  chooseTag() {
    console.log("openTag");
    wx.navigateTo({
      url: 'tags/tags'
    })
  },
  startPublish() { //发布信息
    if (app.globalData.userInfo === '') {
      login.authorization();
      return;
    }
    if (this.data.userInfoInDB.phonenumber === '' || this.data.userInfoInDB.phonenumber === null || this.data.userInfoInDB.phonenumber === undefined){
      wx.showModal({
        title: '请在我的-编辑个人资料中完善个人信息再发布噢~'
      })
      return;
    }
    console.log(this.data.tagarray)
    if (app.globalData.userid === 0) {
      login.login()
    } else if (this.data.price === '' || this.data.price === 0) {
      wx.showToast({
        title: '请输入你想卖出的价格哦~',
        icon: "none"
      });
    } else if (this.data.introduction === '') {
      wx.showToast({
        title: '请介绍一下您的物品吧！',
        icon: "none"
      });

    } else if (!this.data.tagarray[0]) {
      wx.showToast({
        title: '请选择一下标签，方便更好的卖出去哦~',
        icon: "none"
      });
    } else if (!this.data.images[0]) {
      wx.showToast({
        title: '请选择至少一张图片哦~',
        icon: "none"
      });
    } else {
      wx.showLoading({
        title: '正在发布',
        mask: true
      });
      this.uploadTextinfo();
    }
  },

  uploadTextinfo() { //上传文本信息
    var that = this;
    var commontags = [];
    for (var i = 0; i < that.data.tags.choosentags.length; i++) {
      for (var j = 0; j < that.data.items.length; j++)
        if (that.data.tags.choosentags[i] === that.data.items[j].name) {
          commontags.push(that.data.items[j].value);
        }
    }
    wx.request({
      url: this.data.url + "/publish/publishgoods",
      data: {
        price: this.data.price,
        introduction: this.data.introduction,
        category: this.data.tags.classify.index,
        commontags: commontags,
        userid: getApp().globalData.userid
      },
      //成功上传文本信息后上传图片
      success: this.uploadimages.bind(this),
      fail(res) {
        console.log(res);
      }
    })
  },

  uploadimages(res) { //压缩加上传图片图片s
    var that = this;
    console.log(res.data);
    that.data.publishid = res.data; //获得发布号码
    for (let i = 0; i < that.data.images.length; i++) {
      //压缩图片
      wx.compressImage({
        src: that.data.images[i],
        quality: 20,
        success(res) {
          console.log("压缩图片：" + i + '成功');
          //成功压缩一张图片后上传一张图片
          that.data.images[i] = res.tempFilePath;
          that.uploadAImg(i);
        },
        fail(res) {
          that.uploadAImg(i);

        }
      })
    }
  },


  uploadAImg(i) {
    console.log(i);
    var that = this;
    wx.uploadFile({
      url: getApp().globalData.url + "/publish/publishgoods",
      filePath: that.data.images[i],
      //filePath: res.tempFilePath,
      name: "publishedimg_userid=" + that.data.userid + "_publishid=" + that.data.publishid + "_index=" + i,
      formData: {
        userid: getApp().globalData.userid,
        publishid: that.data.publishid,
        index: i
      },
      success(res) {
        console.log(res.data);
        console.log(i);
        if (i === that.data.images.length - 1) {
          wx.hideLoading();
          wx.showModal({
            title: '恭喜',
            content: '发布成功',
            success(res) {
              that.setData({
                publishid: 0,
                images: [],
                price: '',
                introduction: '',
                tags: {
                  choosentags: 0,
                  classify: ''
                },
                tagarray: '',
              })

            }
          })
        }
      },
      fail(res) {
        console.log(res);

      }
    })
  }
})