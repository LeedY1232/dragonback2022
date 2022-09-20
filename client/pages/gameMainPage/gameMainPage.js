// pages/game1/game1.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    gameType: 1,
    ifLargeImgShow: 0,
    shownImgIndex: 0,
    ifFlipping: false,
    animationMain: null,
    animationBack: null,
    shownImgAnimation: null,
    shuffleAnimation: null,
    wayForPunishing: "",
    choice: 0,
    remainCount: 3,
    bgColor1: "deepskyblue",
    bgColor2: "deepskyblue",
    truthPenalty: [],
    adventurePenalty: [],
    frontCardImage: [
      "/images/cardPicture/blank.jpg",
      "/images/cardPicture/copper.jpg",
      "/images/cardPicture/silver.jpg",
      "/images/cardPicture/gold.jpg",
    ],
    backCardImage: [
      "/images/cardPicture/blank.jpg",
      "/images/cardPicture/copperblank.jpg",
      "/images/cardPicture/silverblank.jpg",
      "/images/cardPicture/goldblank.jpg"
    ],
    randomTruthArray: [],
    randomAdventureArray: [],
    uncoveredCard: [],
  },

  onLoad: function (options) {
    this.setData({
      gameType: options.gameType
    });
    console.log(this.data.gameType);
  },
  getData: function () {
    var that = this;
    wx.request({
      url: 'http://112.124.18.77:3389/dragonking/punishCardIndexAllVersion/',
      data: {
        gameType:this.data.gameType
      },
      method: 'GET',
      success: function (res) {
        that.setData({
          truthPenalty: res.data.truth,
          adventurePenalty: res.data.challenge
        })
      }
    })
  },
  onShow: function () {
    this.getData();
  },

  truth: function () {
    var choice = this.data.choice;
    if (choice == 0 || choice == 2) {
      this.setData({
        choice: 1,
        bgColor1: "lightblue",
        bgColor2: "deepskyblue",
        wayForPunishing: "truth"
      })
      if (this.data.randomTruthArray.length == 0) {
        for (var i = 0; i < this.data.truthPenalty.length; i++) {
          this.data.randomTruthArray.push(i);
        }
      }
      var temp1 = this.shuffle(this.data.randomTruthArray);
      this.setData({
        remainCount: 3,
        randomTruthArray: temp1,
      })
      for (var i = 0; i < this.data.uncoveredCard.length; i++) {
        var index = this.data.uncoveredCard[i];
        var temp = "adventurePenalty[" + index + "].is_front";
        this.setData({
          [temp]: false
        })
      }
      console.log(this.data.truthPenalty);
    }
  },

  adventure: function () {
    var choice = this.data.choice;
    if (choice == 0 || choice == 1) {
      this.setData({
        choice: 2,
        bgColor2: "lightblue",
        bgColor1: "deepskyblue"
      })
      if (this.data.randomAdventureArray.length == 0) {
        for (var i = 0; i < this.data.adventurePenalty.length; i++) {
          this.data.randomAdventureArray.push(i);
        }
      }
      var temp2 = this.shuffle(this.data.randomAdventureArray);
      this.setData({
        remainCount: 3,
        randomAdventureArray: temp2
      })
      for (var i = 0; i < this.data.uncoveredCard.length; i++) {
        var index = this.data.uncoveredCard[i];
        var temp = "truthPenalty[" + index + "].is_front";
        this.setData({
          [temp]: false
        })
      }
    }
  },

  changeTruthPenalty: function () {
    //把翻开的三张牌转回去
    for (var i = 0; i < 3; i++) {
      var index = this.data.uncoveredCard[i];
      this.animationMain = wx.createAnimation({
        duration: 400,
        timingFunction: 'linear'
      })
      this.animationBack = wx.createAnimation({
        duration: 400,
        timingFunction: 'linear'
      })
      this.animationMain.rotateY(0).step();
      this.animationBack.rotateY(-180).step();
      this.setData({
        animationMain: this.animationMain.export(),
        animationBack: this.animationBack.export(),
      })
      var temp = "truthPenalty[" + index + "].is_front";
      this.setData({
        [temp]: false
      })
    }
    //这里插一个洗牌的动画
    this.data.shuffleAnimation = wx.createAnimation({
      duration: 400,
      timingFunction: 'linear',
      delay: 400
    })
    this.data.shuffleAnimation.opacity(0).step();
    this.setData({
      shuffleAnimation: this.data.shuffleAnimation.export(),
    })
    const that = this;
    setTimeout(function () {
      var temparray = [];
      var temp = that.shuffle(that.data.randomTruthArray);
      that.setData({
        remainCount: 3,
        randomTruthArray: temp,
        uncoveredCard: temparray,
      })
      that.data.shuffleAnimation = wx.createAnimation({
        duration: 400,
        timingFunction: 'linear',
      })
      that.data.shuffleAnimation.opacity(1).step();
      that.setData({
        shuffleAnimation: that.data.shuffleAnimation.export(),
      })
    }, 850);
  },

  changeAdventurePenalty: function () {
    for (var i = 0; i < 3; i++) {
      var index = this.data.uncoveredCard[i];
      this.animationMain = wx.createAnimation({
        duration: 400,
        timingFunction: 'linear'
      })
      this.animationBack = wx.createAnimation({
        duration: 400,
        timingFunction: 'linear'
      })
      this.animationMain.rotateY(0).step();
      this.animationBack.rotateY(-180).step();
      this.setData({
        animationMain: this.animationMain.export(),
        animationBack: this.animationBack.export(),
      })
      var temp = "adventurePenalty[" + index + "].is_front";
      this.setData({
        [temp]: false
      })
    }
    //这里插一个洗牌的动画
    this.data.shuffleAnimation = wx.createAnimation({
      duration: 400,
      timingFunction: 'linear',
      delay: 400
    })
    this.data.shuffleAnimation.opacity(0).step();
    this.setData({
      shuffleAnimation: this.data.shuffleAnimation.export(),
    })
    const that = this;
    setTimeout(function () {
      var temparray = [];
      var temp = that.shuffle(that.data.randomAdventureArray);
      that.setData({
        remainCount: 3,
        randomAdventureArray: temp,
        uncoveredCard: temparray,
      })
      that.data.shuffleAnimation = wx.createAnimation({
        duration: 400,
        timingFunction: 'linear',
      })
      that.data.shuffleAnimation.opacity(1).step();
      that.setData({
        shuffleAnimation: that.data.shuffleAnimation.export(),
      })
    }, 850);
  },

  uncoverTruth: function (e) {
    if (this.data.ifFlipping == false && this.data.remainCount > 0) {
      var index = e.currentTarget.dataset.id;
      this.data.uncoveredCard.push(index);
      var temparray = this.data.uncoveredCard;
      var temp = "truthPenalty[" + index + "].is_front";
      this.setData({
        [temp]: true,
        remainCount: this.data.remainCount - 1,
        uncoveredCard: temparray
      })
      this.animationMain = wx.createAnimation({
        duration: 400,
        timingFunction: 'linear'
      })
      this.animationBack = wx.createAnimation({
        duration: 400,
        timingFunction: 'linear'
      })
      this.animationMain.rotateY(180).step();
      this.animationBack.rotateY(0).step();
      this.setData({
        animationMain: this.animationMain.export(),
        animationBack: this.animationBack.export(),
        ifFlipping: true
      })
      const that = this;
      setTimeout(function () {
        that.setData({
          ifFlipping: false
        })
      }, 400);
    }
  },

  uncoverAdventure: function (e) {
    if (this.data.ifFlipping == false && this.data.remainCount > 0) {
      var index = e.currentTarget.dataset.id;
      this.data.uncoveredCard.push(index);
      var temparray = this.data.uncoveredCard;
      var temp = "adventurePenalty[" + index + "].is_front";
      this.setData({
        [temp]: true,
        remainCount: this.data.remainCount - 1,
        uncoveredCard: temparray
      })
      this.animationMain = wx.createAnimation({
        duration: 400,
        timingFunction: 'linear'
      })
      this.animationBack = wx.createAnimation({
        duration: 400,
        timingFunction: 'linear'
      })
      this.animationMain.rotateY(180).step();
      this.animationBack.rotateY(0).step();
      this.setData({
        animationMain: this.animationMain.export(),
        animationBack: this.animationBack.export(),
        ifFlipping: true
      })
      const that = this;
      setTimeout(function () {
        that.setData({
          ifFlipping: false
        })
      }, 400);
    }
  },

  enlarge: function (e) {
    var index = e.currentTarget.dataset.id;
    this.setData({
      ifLargeImgShow: 1,
      shownImgIndex: index,
    })
    this.data.shownImgAnimation = wx.createAnimation({
      duration: 200,
      timingFunction: 'linear'
    })
    this.data.shownImgAnimation.scale(8, 8).step();
    this.setData({
      shownImgAnimation: this.data.shownImgAnimation.export(),
    })
  },

  shrink: function (e) {
    this.setData({
      ifLargeImgShow: 0,
      shownImgAnimation: null,
    })
  },

  shuffle: function (arr) {
    for (var i = 0; i < arr.length; i++) {
      var iRand = parseInt(arr.length * Math.random());
      var temp = arr[i];
      arr[i] = arr[iRand];
      arr[iRand] = temp;
    }
    return arr;
  }
})