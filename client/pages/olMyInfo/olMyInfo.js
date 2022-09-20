// pages/olMyInfo/olMyInfo.js
Page({
  data: {
    userName:'',
    // headPicId:0,
    headPicPath:'',
    userLocation:'',
    gender:'',
    // dataSets:[1,2,3,4,5,6]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({userName:getApp().globalData.userName});
    this.setData({userLocation:getApp().globalData.userLocation});
    this.setData({headPicPath:getApp().globalData.myAvatarUrl});
    if(getApp().globalData.myGender==1)this.setData({gender:'男'});
    else if(getApp().globalData.myGender==2)this.setData({gender:'女'});
    else if(getApp().globalData.myGender==3)this.setData({gender:'未知'});
    wx.request({
      url:'https://api.weixin.qq.com/cgi-bin/token',
      data:{
        grant_type: 'client_credential',
        appid: 'wx7e7fa404e4354e31',
        secret:'c4e33b9fdb6a421e99b8a1eb1f9e4157',
      },
      method:'GET',
      success:res => {
        //console.log(res.data.access_token);
        var accessToken = res.data.access_token;
        console.log(accessToken);
        wx.request({
          url:'https://api.weixin.qq.com/cgi-bin/user/info',
          data:{
            access_token: accessToken,
            openid: getApp().globalData.myOpenid,
            lang: "zh_CN",
          },
          method:'GET',
          success:res2 => {console.log(res2)},
        })
      },
    })
  },
  /*
  clickChange:function(e){
    // console.log(e)
    //console.log(e.currentTarget.dataset.id)
    getApp().globalData.headPicture=e.currentTarget.dataset.id;
    this.setData({headPicId:getApp().globalData.headPicture});
    this.setData({headPicPath:"/images/headPicture/"+this.data.headPicId.toString()+".jpg"});
  },
  */
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