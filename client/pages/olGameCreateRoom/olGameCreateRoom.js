// pages/olGameCreateRoom/olGameCreateRoom.js
Page({
  data: {
    house_id:'loading',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (/*options*/) {
    wx.showLoading({title: '加载中', icon: 'loading', duration: 10000});
    wx.request({
      url:'http://112.124.18.77:3389/dragonking/buildHouse',
      data:{
        openid: getApp().globalData.myOpenid,
      },
      method:'GET',
      success:res => {
        console.log(res.data);
        this.setData({house_id:res.data.house_id})
      },
      complete: () => {
        wx.hideLoading()
      }
    })
  },
  enterThisRoom:function(){
    wx.showLoading({title: '查找房间中', icon: 'loading', duration: 10000});
    let id = this.data.house_id;
    wx.request({//需要检测房间是否存在或者过期
      url:'http://112.124.18.77:3389/dragonking/joinHouse',
      data:{
        openid: getApp().globalData.myOpenid,
        house_id: id,
      },
      method:'GET',
      success:res => {
        console.log(res.data);// this.setData({house_id:res.data.house_id})
        if(res.data.code==1)
        {
          if(res.data.if_game_start==false)
          {
            getApp().globalData.ifRoomOwner = res.data.if_owner;
            getApp().globalData.ownerOpenid = res.data.owner_id;
            wx.navigateTo({
              url: `../olGameWaitingPage/olGameWaitingPage?roomNum=${id}`
              })
          }
          else{
            wx.showToast({title: '此房间已开始游戏',icon: 'none',duration: 2000})
          }
        }
        else wx.showToast({title: '该房间已关闭',icon: 'none',duration: 2000})
      },
      complete: () => {
         wx.hideLoading()
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})