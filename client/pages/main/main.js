// pages/main/main.js
Page({
  data: {
    receiveMessage:'',
    help: false,
    showHelpBlock: null
  },
  onReady: function () //初次加载时获取临时凭证code
  {},
  goToLocalGame: function () {
    wx.navigateTo({
      url: '../game/game'
    })
  },
  goToOnlineGame: function () {
    wx.navigateTo({
      url: '../onlineGame/onlineGame'
    })
  },
  connectServer:function()
  {
    wx.showLoading({title: '尝试连接服务器中', icon: 'loading', duration: 10000});
    const _this = this;
    wx.login({
      success(res) {
        if (res.code) {
          getApp().globalData.myJscode = res.code
          // console.log(res.code);
          wx.request({
            // url: 'http://112.124.18.77:3389/dragonking/userLogin',
            url: 'https://api.weixin.qq.com/sns/jscode2session',
            data: {
              // code: res.code,
              appid:'wx7e7fa404e4354e31',
              secret:'c4e33b9fdb6a421e99b8a1eb1f9e4157',
              js_code:res.code,
              grant_type:'authorization_code'
            },
            method: 'GET',
            success: function(res){
              var openid = res.data.openid
              getApp().globalData.myOpenid = openid
              var thename = getApp().globalData.userName
              var thehead = getApp().globalData.myAvatarUrl
              wx.request({
                url: 'http://112.124.18.77:3389/dragonking/userLogin',
                data: {
                  head_pic:thehead,
                  openid:openid,
                  nick_name:thename,
                },
                method: 'GET',
                success: function(res2){
                  //console.log(res2.data)
                  _this.setData ({receiveMessage: res2.data.message})
                  if(_this.data.receiveMessage=='success')
                  {
                    wx.showToast({title: '成功登录',icon: 'success',duration: 2000});
                    _this.goToOnlineGame();
                  }
                },
                complete: () => {
                  wx.hideLoading()
                  if(_this.data.receiveMessage!='success')wx.showToast({title: '读取失败，请重启小程序',icon: 'none',duration: 2000})
              }
              })
            },
            fail(){
              wx.hideLoading();
              wx.showToast({title: '无法连接api',icon: 'loading',duration: 2000});
              console.log("fail") 
            }, 
          })
        } else {
          console.log('获取用户唯一表示码失败！' + res.errMsg)
        }
      },
    })
  },
  getUserInfo: function (e) {
    const that = this;
    // console.log(e) 
    wx.getSetting({ // 获取用户信息
      success(res) {// console.log("res", res)
        if (res.authSetting['scope.userInfo']) {
          console.log("已授权=====")// 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success(res) {
              console.log("获取用户信息成功" /*, res*/ )
              getApp().globalData.userName = res.userInfo.nickName;
              getApp().globalData.userLocation = res.userInfo.country + ' ' + res.userInfo.province + ' ' + res.userInfo.city;
              getApp().globalData.myAvatarUrl = res.userInfo.avatarUrl;
              getApp().globalData.myGender = res.userInfo.gender;
              console.log(getApp().globalData.userName);
              // console.log(getApp().globalData.userLocation);
              that.connectServer();
            },
            fail(res) {
              console.log("获取用户信息失败", res)
            }
          })
        } else {
          console.log("未授权=====")
          that.showSettingToast("请授权")
        }
      }
    })
  },
  showSettingToast: function (e) {
    wx.showModal({
      title: '提示！',
      confirmText: '去设置',
      showCancel: false,
      content: e,
      success: function (res) {
        if (res.confirm) {
          wx.navigateTo({
            url: '../setting/setting',
          })
        }
      }
    })
  },
  showHelp: function () {
    this.setData({
      help: true
    })
    this.data.showHelpBlock = wx.createAnimation({
      duration: 200,
      timingFunction: 'linear'
    })
    this.data.showHelpBlock.scale(10, 10).step();
    this.setData({
      showHelpBlock: this.data.showHelpBlock.export(),
    })
  },

  shrink: function (e) {
    this.setData({
      help: false,
      showHelpBlock: null,
    })
  },
})