// pages/game1/game1.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ifLargeImgShow: 0,
    shownImgIndex: 0,
    animationMain: null,
    animationBack: null,
    shownImgAnimation: null,
    shuffleAnimation: null,
    choice: 0,
    remainCount: 3,
    bgColor1: "deepskyblue",
    bgColor2: "deepskyblue",
    truthPenalty: [{
      index: 0,
      level: 2,
      ifMainPage: false,
      content: '近一个星期内最让你开心的事。'
    }, {
      index: 1,
      level: 3,
      ifMainPage: false,
      content: '和异性发生过最暧昧的事情。'
    }, {
      index: 2,
      level: 1,
      ifMainPage: false,
      content: '肯德基或麦当劳，你选哪一个？'
    }, {
      index: 3,
      level: 1,
      ifMainPage: false,
      content: '百事或可口，你选哪一个？'
    }, {
      index: 4,
      level: 1,
      ifMainPage: false,
      content: '你向往的生活状态是什么样的？'
    }, {
      index: 5,
      level: 1,
      ifMainPage: false,
      content: '女朋友和妈妈掉进水里，你先救谁？'
    }, {
      index: 6,
      level: 2,
      ifMainPage: false,
      content: '小时候最糗的一件事？'
    }],
    adventurePenalty: [{
      index: 0,
      level: 2,
      content: '抱一下在座的一位异性。'
    }, {
      index: 1,
      level: 3,
      content: '请声情并茂地朗读以下语句：哼！都怪你！也不哄哄人家 (｡•ˇ‸ˇ•｡)人家超想哭的，捶你胸口，大坏蛋!!!(￣^￣)ゞ咩QAQ 捶你胸口！你好讨厌!(=ﾟωﾟ)ﾉ要抱抱~嘤嘤嘤……哼，人家拿小拳拳捶你胸口!!!(｡• ︿•̀｡)大坏蛋，打死你(つд⊂)'
    }, {
      index: 2,
      level: 2,
      content: '用卷纸缠头缠成阿拉丁的模样，一直到游戏结束。'
    }, {
      index: 3,
      level: 3,
      content: '外放打电话给列表一位异性，说自己喝醉了。'
    }, {
      index: 4,
      level: 1,
      content: '挑在座的一位，说一说ta做过让你印象最深的事。'
    }, {
      index: 5,
      level: 2,
      content: '大喊：我是猪！'
    }, {
      index: 6,
      level: 3,
      content: '大喊：李明骏sb！'
    },],
    cardBG: ["/images/blank.jpg",
      "/images/copper.jpg",
      "/images/silver.jpg",
      "/images/gold.jpg",
    ],
    randomTruthArray: [],
    randomAdventureArray: [],
    uncoveredCard: [],
  },

  onShow: function () {
    for (var i = 0; i < this.data.truthPenalty.length; i++) {
      this.data.randomTruthArray.push(i);
    }
    for (var i = 0; i < this.data.adventurePenalty.length; i++) {
      this.data.randomAdventureArray.push(i);
    }

    var temp1 = this.shuffle(this.data.randomTruthArray);
    var temp2 = this.shuffle(this.data.randomAdventureArray);
    this.setData({
      randomTruthArray: temp1,
      randomAdventureArray: temp2
    })
  },

  truth: function () {
    var choice = this.data.choice;
    if (choice == 0 || choice == 2) {
      this.setData({
        choice: 1,
        bgColor1: "lightblue",
        bgColor2: "deepskyblue"
      })
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
    }
  },

  resetTruthPenalty: function () {
    var temp1 = "truthPenalty[" + this.data.uncoveredCard[0] + "].animationMain";
    var temp2 = "truthPenalty[" + this.data.uncoveredCard[1] + "].animationMain";
    var temp3 = "truthPenalty[" + this.data.uncoveredCard[2] + "].animationMain";
    var temp4 = "truthPenalty[" + this.data.uncoveredCard[0] + "].animationBack";
    var temp5 = "truthPenalty[" + this.data.uncoveredCard[1] + "].animationBack";
    var temp6 = "truthPenalty[" + this.data.uncoveredCard[2] + "].animationBack";
    var temparray = [];
    var temp = this.shuffle(this.data.randomTruthArray);
    this.setData({
      remainCount: 3,
      randomTruthArray: temp,
      uncoveredCard: temparray,
      [temp1]: null,
      [temp2]: null,
      [temp3]: null,
      [temp4]: null,
      [temp5]: null,
      [temp6]: null,
    })
    this.data.shuffleAnimation = wx.createAnimation({
      duration: 400,
      timingFunction: 'linear',
    })
    this.data.shuffleAnimation.opacity(1).step();
    this.setData({
      shuffleAnimation: this.data.shuffleAnimation.export(),
    })
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
      var temp = "truthPenalty[" + index + "].ifMainPage";
      this.setData({
        [temp]:false
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
    setTimeout(this.resetTruthPenalty, 850);
  },

  changeAdventurePenalty: function () {
    var max = this.data.truthPenalty.length;
    var n = Math.random() * 6;
    n = n.toFixed(0);
    this.setData({
      num: n
    })
  },

  uncover: function (e) {
    if (this.data.remainCount > 0) {
      var index = e.currentTarget.dataset.id;
      this.data.uncoveredCard.push(index);
      var temparray = this.data.uncoveredCard;
      var temp = "truthPenalty[" + index + "].ifMainPage";
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
      })
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