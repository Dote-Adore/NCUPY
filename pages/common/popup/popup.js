
  function showDialogBtn () {
    this.setData({
      showModal: true
    })
  }
  /**
   * 弹出框蒙层截断touchmove事件
   */
  function preventTouchMove() {
  }
  /**
   * 隐藏模态对话框
   */
  function hideModal () {
    this.setData({
      showModal: false
    });
  }
  /**
   * 对话框取消按钮点击事件
   */
  function onCancel () {
    this.hideModal();
  }
  /**
   * 对话框确认按钮点击事件
   */
  function onConfirm() {
    this.hideModal();
  }
function popupanim(that) {
  console.log("createanim");
  var anim = wx.createAnimation({
    duration: 20,
    timingFunction: 'linear',
    transformOrigin: '50% 50% 0',
  })
  anim.scale(1, 1).step(0);
  that.setData({
    popupanim:anim.export()
  })
  setTimeout(()=>{
    anim = wx.createAnimation({
      duration: 40,
      timingFunction: 'linear',
      transformOrigin: '50% 50% 0',
    })
    anim.scale(1.1, 1.1).step()
    anim.scale(1, 1).step()
    that.setData({
      popupanim: anim.export(),
    })
  },22)
}


function opacanim(that){
  console.log("opacanim")
  var anim = wx.createAnimation({
    duration: 10,
    timingFunction: 'linear',
    transformOrigin: '50% 50% 0',
  })
  anim.opacity(0).step();
  that.setData({
    opacanim: anim.export()
  })
  setTimeout(() => {
    anim = wx.createAnimation({
      duration: 100,
      timingFunction: 'linear',
      transformOrigin: '50% 50% 0',
    })
    anim.opacity(0.5).step()
    that.setData({
      opacanim: anim.export(),
    })
  }, 12)
}

function opacanim_reverse(that){
  console.log("opacanim_reverse")
  var anim = wx.createAnimation({
    duration: 10,
    timingFunction: 'linear',
    transformOrigin: '50% 50% 0',
  })
  anim.opacity(0.5).step();
  that.setData({
    opacanim: anim.export()
  })
  setTimeout(() => {
    anim = wx.createAnimation({
      duration: 50,
      timingFunction: 'linear',
      transformOrigin: '50% 50% 0',
    })
    anim.opacity(0).step()
    that.setData({
      opacanim: anim.export(),
    })
  }, 12)
}
module.exports = {
  popupanim: popupanim,
  showDialogBtn: showDialogBtn,
  preventTouchMove: preventTouchMove,
  hideModal: hideModal,
  onCancel: onCancel,
  onConfirm: onConfirm,
  opacanim: opacanim,
  opacanim_reverse: opacanim_reverse
}