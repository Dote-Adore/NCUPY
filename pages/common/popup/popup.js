
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
module.exports.showDialogBtn = showDialogBtn
module.exports.preventTouchMove = preventTouchMove
module.exports.hideModal = hideModal
module.exports.onCancel = onCancel
module.exports.onConfirm = onConfirm
