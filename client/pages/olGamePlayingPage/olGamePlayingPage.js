// pages/olGamePlayingPage/olGamePlayingPage.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    punishedPersonId:'',
    punishedPersonName:'',
    punishedPersonHeadPic:'',
    ifBeingPunished:false,
    ifChoosePunishMethod:false,
    cardList:[],
    currentChosenId:0,
    cardInfo:"initStatus",
  },

  punishMethod: function(e){
    this.setData({ifChoosePunishMethod:true})
    wx.request({
      url:'http://112.124.18.77:3389/dragonking/punishCardIndex',
      data:{
        way_for_punishing: e.currentTarget.id,
      },
      method:'GET',
      success:res => {
        console.log(res.data.punish_card_index);
        //if(res.data.punish_card_index==1)console.log("退出房间成功！")
        this.setData({cardList:res.data.punish_card_index})
      },
    })
  },
  choosePunish:function(e){
    var chosenCardId = e.currentTarget.id;
    console.log(chosenCardId);
    var _URL;
    if(this.data.currentChosenId==0)_URL='http://112.124.18.77:3389/dragonking/choosePunish';
    else _URL='http://112.124.18.77:3389/dragonking/changePunish';
    console.log(_URL)
    const _this = this;
    wx.request({
      url:_URL,
      data:{
        openid: getApp().globalData.myOpenid,
        card_id: chosenCardId,
      },
      method:'GET',
      success:res => {
        if(res.data.code==1){
          console.log("成功选择或更变惩罚！");
          _this.setData({currentChosenId:chosenCardId});
        }
      },
    })
  },
  acceptPunished: function(){
    wx.request({
      url:'http://112.124.18.77:3389/dragonking/acceptPunish',
      data:{
        openid:getApp().globalData.myOpenid,
        house_id:getApp().globalData.thisHouseId,
      },
      method:'GET',
      success:res => {
        if(res.data.code==1){
          console.log("我已经接受此惩罚！")
          wx.showToast({
            title: '我已接受惩罚！',
            icon: 'success',
            duration: 2000
          })
          getApp().globalData.ifOlGamePlayingPageShow = false
          setTimeout(function () {wx.navigateBack({delta: 1})},1000)
        }
      }
    })
  },
  reloadChosenCard: function(){
    const _this = this
    wx.request({
      url:'http://112.124.18.77:3389/dragonking/showPunishedStatusforOthers',
      data:{
        house_id:getApp().globalData.thisHouseId,
      },
      method:'GET',
      success:res => {
        if(res.data.code==1){
          console.log(res.data.punishuser_info)
          _this.setData({cardInfo:res.data.punishuser_info.card_info})
          // getApp().globalData.ifOlGamePlayingPageShow = false
          // setTimeout(function () {wx.navigateBack({delta: 1})},1000)
          if(res.data.punishuser_info.card_info==null){
            if(this.data.punishedPersonId!=getApp().globalData.myOpenid)clearInterval(this.data.reloadCardInterval)
            console.log("那个被惩罚人已经接受此惩罚！")
            wx.showToast({
              title: '对方已接受惩罚',
              icon: 'success',
              duration: 2000
            })
            getApp().globalData.ifOlGamePlayingPageShow = false
            setTimeout(function () {wx.navigateBack({delta: 1})},1000)
          }
        }
        else console.log("Fail to load card")
      },
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({punishedPersonId:options.punishedPersonId});
    this.setData({punishedPersonName:options.punishedPersonName});
    this.setData({punishedPersonHeadPic:options.punishedPersonHeadPic});
    if(this.data.punishedPersonId==getApp().globalData.myOpenid)this.setData({ifBeingPunished:true});
    else {
      this.setData({ifBeingPunished:false});
      this.data.reloadCardInterval = setInterval(this.reloadChosenCard, 800);
    }
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
    getApp().globalData.ifOlGamePlayingPageShow = false;
    if(this.data.punishedPersonId!=getApp().globalData.myOpenid)clearInterval(this.data.reloadCardInterval);
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