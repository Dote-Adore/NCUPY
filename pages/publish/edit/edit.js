const app = getApp();
Page({

  data: {
    url: app.globalData.url,
    maincolor: app.globalData.maincolor,

    publishid: 0,
    images: [],
    price: '',
    introduction: '',
    tags: {
      choosentags: 0,
      classify: ''
    },
    tagarray: '',
    userid: '',
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
    categories: ['数码', '衣物', '日用', '学习', '美妆', '娱乐', '运动', '零食'],


  },
  onLoad() {
    var that = this;
    console.log(that.data.tags);
    this.getPervious();
    this.getImagesUrl()
  },

  getImagesUrl() {
    var that = this;
    wx.request({
      url: getApp().globalData.url + '/goods/getimgurls',
      data: {
        id: that.data.publishid
      },
      success(res) {
        that.setData({
          images: res.data
        })
      }
    })
  },

  getPervious() {
    var that = this;
    const eventChannel = this.getOpenerEventChannel();
    // 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
    eventChannel.on('acceptDataFromOpenerPage', function(data) {
      console.log(data);
      var choosentags = that.toArray(data.commontags);
      console.log(choosentags);
      that.setData({
        price: data.price,
        publishid: data.id,
        introduction: data.introduction,
        tags: {
          choosentags: choosentags,
          classify: {
            index: data.categoryid,
            value: that.data.categories[data.categoryid]

          }
        },
        tagarray: data.commontags,
        userid: data.userid
      })
    });
  },
  toArray(data) {
    data = data.replace(/"/g, '');
    data = data.replace("[", '');
    data = data.replace("]", '');
    return data.split(",")
  },
  onShow() {
    this.toTagArray();
  },
  toTagArray() {
    var that = this;
    var finaltagarray = [];
    for (var i = 0; i < that.data.tags.choosentags.length; i++) {
      for (var j = 0; j < that.data.items.length; j++)
        if (that.data.tags.choosentags[i] === that.data.items[j].name || that.data.tags.choosentags[i] === that.data.items[j].value) {
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
      url: '../tags/tags'
    })
  },
  startPublish() { //发布信息
    console.log(this.data.tagarray)
    if (app.globalData.userid === 0) {
      common.login()
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
      });
      this.uploadTextinfo();
    }
  },

  uploadTextinfo() { //上传文本信息
    var that = this;
    var commontags = [];
    for (var i = 0; i < that.data.tags.choosentags.length; i++) {
      for (var j = 0; j < that.data.items.length; j++)
        if (that.data.tags.choosentags[i] === that.data.items[j].name || that.data.tags.choosentags[i] === that.data.items[j].value) {
          commontags.push(that.data.items[j].value);
        }
    }
    wx.request({
      url: this.data.url + "/publish/edit",
      data: {
        id: that.data.publishid,
        price: this.data.price,
        introduction: this.data.introduction,
        category: this.data.tags.classify.index,
        commontags: commontags,
        userid: this.data.userid
      },
      //成功上传文本信息后上传图片
      success: this.uploadimages.bind(this),
      fail(res) {
        console.log(res);
      }
    })
  },

  uploadimages(res) { //压缩加上传图片图片
    var that = this;


    for (let i = 0; i < that.data.images.length; i++) {
      //压缩图片
      if (that.data.images[i].substring(0, 11) === 'https://ncu') {
        wx.request({
          url: getApp().globalData.url + "/publish/edit",
          data: {
            imageurl: that.data.images[i],
            method: "images",
            index: i,
            publishid: that.data.publishid
          },
          success: res => {
            if (i === that.data.images.length - 1) {
              wx.hideLoading();
              wx.showModal({
                title: '恭喜',
                content: '编辑成功',
                success(res) {
                  if (res.confirm) {
                    wx.navigateBack({})
                  }
                }
              })
            }
          }
        })
        continue;
      }
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
    console.log(that.data.publishid)
    wx.uploadFile({
      url: getApp().globalData.url + "/publish/edit",
      filePath: that.data.images[i],
      //filePath: res.tempFilePath,
      name: "publishedimg_userid=" + that.data.userid + "_publishid=" + that.data.publishid + "_index=" + i,
      formData: {
        userid: that.data.userid,
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
            content: '编辑成功',
            success(res) {
              if (res.confirm) {
                wx.navigateBack({})
              }
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