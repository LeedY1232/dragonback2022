// pages/onlineGame/onlineGame.js
import request from "../../static/request.js";
Page({
  clickHelp: function ()  //访问数据库测试
  {
    wx.request({
      url:'http://112.124.18.77:3389/dragonking/punishCardIndex',
      data:{
        way_for_punishing: "challenge",
      },
      method:'GET',
      success:res => {
        console.log(res.data);
        console.log("success")
      }
    })
  },
  
  // clickInfo2: function () {
  //   const vm = this;
  //   request
  //       .get("startGame/", {
  //         house_id: 'infomation'
  //       })
  //       .then(res => {console.log("success")})
  //       .catch(err => {
  //         console.log(err);
  //         console.log("fail")
  //       });
  // },
  clickCreate: function (e) {
    // let n = Math.random() * 899999 + 100000;
    // n = n.toFixed(0);
    // /theNum=${n}
    wx.navigateTo({
      url: `../olGameCreateRoom/olGameCreateRoom`
    });
  },
  clickEnter: function () {
    wx.navigateTo({
      url: '../olGameEnterRoom/olGameEnterRoom'
    });
  },
  clickInfo: function () {
    wx.navigateTo({
      url: '../olMyInfo/olMyInfo'
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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