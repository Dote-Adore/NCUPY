const app = getApp()
Page({
  data: {
    maincolor: app.globalData.maincolor,
    tags: [
      { name: 'new', value: '全新',checked:false },
      { name: 'noBargain', value: '不讲价',checked:false }
    ],
    categories: ['数码', '衣物', '日用', '学习', '美妆', '娱乐', '运动', '零食'],
    index:-1
    
  },
  onLoad(){
    var pages = getCurrentPages()    //获取加载的页面( 页面栈 )
    var currentPage = pages[pages.length - 1]  // 获取当前页面
    var prevPage = pages[pages.length - 2]    //获取上一个页面
    var that = this
    var tags=prevPage.data.tags;
    console.log(tags);
    if (tags.classify!=''){
      console.log("将上一个页面的分类值写下")
      that.setData({
        index:tags.classify.index
      })
    }
    var mytags = that.data.tags;
    for(var i = 0;i<tags.choosentags.length;i++){
      for(var j=0;j<mytags.length;j++){
        if(tags.choosentags[i] == mytags[j].name){
          mytags[j].checked = true;
        }
      }
    }
    that.setData({
      tags:mytags
    })
    console.log(tags.choosentags)
    that.staticData.choosentags = tags.choosentags
  },
  staticData:{
    choosentags: []
  },
  checkboxChange: function (e) {
    // console.log('checkbox发生change事件，携带value值为：', e)
    // this.staticData.choosentags = e.detail.value
    // console.log(this.staticData.choosentags)、
    var data = e.currentTarget.dataset;
    this.data.tags[data.index].checked = !this.data.tags[data.index].checked;
    this.setData({
      tags:this.data.tags
    })
    if(this.data.tags[data.index].checked){//如果被选中
      this.staticData.choosentags.push(data.item.name);
    }
    else{
      for(let i = 0;i<this.staticData.choosentags.length;i++){
        if(this.staticData.choosentags[i]===data.item.name){
          this.staticData.choosentags.splice(i,1);
        }
      }
    }
    console.log(this.staticData.choosentags)
  },
  bindPickerChange: function (e) {
    var that = this;
    that.setData({
      index: e.detail.value
    })
  },
  cancel(){
    wx.navigateBack({
      dalta:1
    })
  },
  confirm(){
    var pages = getCurrentPages()    //获取加载的页面( 页面栈 )
    var currentPage = pages[pages.length - 1]  // 获取当前页面
    var prevPage = pages[pages.length - 2]    //获取上一个页面
    var that = this;
    　　// 设置上一个页面的数据（可以修改，也可以新增）
    prevPage.setData({
      tags:{
        choosentags: that.staticData.choosentags,
        classify:{
          index:that.data.index,
          value: that.data.categories[that.data.index]
        }
      }
    })
    console.log(prevPage.data.tags)
    wx.navigateBack({
      dalta: 1
    })
  }
  
})