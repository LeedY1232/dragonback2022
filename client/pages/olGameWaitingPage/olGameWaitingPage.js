// pages/olGameWaitingPage/olGameWaitingPage.js
Page({
  

  /**
   * 页面的初始数据
   */
  data: {
    //readyInfo:"取消准备",
    roomNum:0,
    headPicId:0,
    headPicPath:"/images/headPicture/3.jpg",
    playerArray:[],
    ifThisRoomOwner:false,
    thisRoomOwnerId:'',
    readyStatus:false,
    allReady:false,
  },
  readyButton:function()
  {
    // console.log("press!");
    // if(this.data.readyInfo=="准备")this.setData({readyInfo:"取消准备"});
    // else if(this.data.readyInfo=="取消准备")this.setData({readyInfo:"准备"});
    wx.request({
      url:'http://112.124.18.77:3389/dragonking/userGetReady',
      data:{
        openid:getApp().globalData.myOpenid,
      },
      method:'GET',
      success:res => {
        if(res.data.code==1)console.log("修改准备状态成功")
      },
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  reloadData()
  {
    const _this = this;
    wx.request({
      url:'http://112.124.18.77:3389/dragonking/userInfoaboutHouse',
      data:{
        house_id: _this.data.roomNum,
      },
      method:'GET',
      success:res => {
        //console.log(res.data);// this.setData({house_id:res.data.house_id})
        var userList = res.data.content.slice(0,-1)
        _this.setData({playerArray:userList})
        var myInfoIndex = (userList.findIndex( (item)=> item.openid==getApp().globalData.myOpenid))
        _this.setData({readyStatus:userList[myInfoIndex].if_ready})
        if(_this.data.ifThisRoomOwner){
          //userList.splice(myInfoIndex,1);
          if(userList.length>1)this.setData({allReady:userList.every((item)=>item.if_ready==true||item.openid==_this.data.thisRoomOwnerId)})
          else this.setData({allReady:false})
          // var allready = true; // for(var i=0;i<userList.length;i++){//   if(userlist[i].openid != getApp().globalData.myOpenid){//     if(userlist[i].if_ready==false)allready =  false//   }// }// this.setData({allReady:allready})//console.log(userList)//console.log(_this.data.allReady)//console.log(_this.data.playerArray)
        };
        var punishedPersonList = userList.filter((item)=>(item.if_being_punished==true));
        if(punishedPersonList.length>0){
          if(getApp().globalData.ifOlGamePlayingPageShow==false){
            var punishedPersonId = punishedPersonList[0].openid
            var punishedPersonName = punishedPersonList[0].nick_name
            var punishedPersonHeadPic = punishedPersonList[0].head_pic
            wx.navigateTo({
              url: `../olGamePlayingPage/olGamePlayingPage?punishedPersonId=${punishedPersonId}&punishedPersonName=${punishedPersonName}&punishedPersonHeadPic=${punishedPersonHeadPic}`
            })
            getApp().globalData.ifOlGamePlayingPageShow = true
          }
        }
      },
    })
  },
  onLoad: function (options) {
    this.setData({roomNum:options.roomNum});
    getApp().globalData.thisHouseId = options.roomNum
    this.data.myInterval = setInterval(this.reloadData, 800);
    console.log(this.data.roomNum);
    this.setData({ifThisRoomOwner:getApp().globalData.ifRoomOwner});
    this.setData({thisRoomOwnerId:getApp().globalData.ownerOpenid});
  },

  extract:function(){
    //console.log('click!')
    const _this = this;
    wx.showModal({
      title: '抽取玩家',
      content: '随机抽取一位玩家吧',
      cancelText:"取消",//默认是“取消”
      confirmText:"抽取",//默认是“确定”
      confirmColor: 'rgb(255, 128, 64)',//确定文字的颜色
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定');
          var array = _this.data.playerArray;
          var punishedPlayerOpenid = array[Math.floor(Math.random()*(array.length))].openid;
          //console.log(array,array.length,Math.random()*(array.length))//
          console.log(punishedPlayerOpenid)
          wx.request({
            url:'http://112.124.18.77:3389/dragonking/startGame',
            data:{
              house_id: _this.data.roomNum,
              punished_openid: punishedPlayerOpenid
            },
            method:'GET',
            success:res => {
              if(res.data.code==1){
                console.log("成功选取被惩罚人")
              }
            },
          })
        }
      },
      fail: function (res) { },//接口调用失败的回调函数
      complete: function (res) { },//接口调用结束的回调函数（调用成功、失败都会执行）
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
  leaveRoom:function(){
    clearInterval(this.data.myInterval)
    const _this = this;
    wx.request({
      url:'http://112.124.18.77:3389/dragonking/leaveHouse',
      data:{
        openid: getApp().globalData.myOpenid,
        house_id: _this.data.roomNum,
      },
      method:'GET',
      success:res => {
        console.log(res.data);// this.setData({house_id:res.data.house_id})
        if(res.data.code==1)console.log("退出房间成功！")
      },
    })
  },
  onHide: function () {
    //this.leaveRoom();
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {//退出房间删除该联系
    this.leaveRoom();
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