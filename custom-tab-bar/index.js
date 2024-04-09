Component({
  data: {
    quot: '"',
    selected: 0,
    sysMessageCount: 0,
    color: 'rgb(140,140,140)', // 只能是rgb格式，默认值：rgb(140,140,140)，需要引号
    selectColor: 'rgb(50,50,50)', // 只能是rgb格式，默认值：rgb(0,0,0)，需要引号
    size: 31,
    selectSize: 33,
    midSize: 42,
    midColor: '#fc3a72',
    list: [{
      pagePath: "/pages/index/index",
      // iconPath: "/static/icon/iconfont.ttf#mini-shouye",
      // selectedIconPath: "/static/icon/iconfont.ttf#mini-shouye",
      name: "mini-wx-shouye",
    }, 
    {
      pagePath: "/pages/tabbar/circle/circle",
      // iconPath: "/image/tabbar/tab_shop_normal.png",
      // selectedIconPath: "/image/tabbar/tab_shop_active.png",
      name: "mini-wx-faxian",
    },
    {
      pagePath: "/pages/send/send",
      name: "mini-wx-fabu",
      isSpecial: 1,
    },
    {
      pagePath: "/pages/tabbar/notice/notice",
      // iconPath: "/image/tabbar/tab_nearby_normal.png",
      // selectedIconPath: "/image/tabbar/tab_nearby_active.png",
      name: "mini-wx-xiaoxi",
    }, 
    {
      pagePath: "/pages/my/my",
      // iconPath: "/image/tabbar/tab_user_normal.png",
      // selectedIconPath: "/image/tabbar/tab_user_active.png",
      name: "mini-wx-wo",
    }]
  },
  attached: function () {
    this.setData({
      midColor: this.hex2rgb(this.data.midColor)
    });
  },
  methods: {
    hex2rgb: function (hex) {
      console.log(hex);
      var rgb = [];
      hex = hex.substr(1);

      if (hex.length === 3) {
        hex = hex.replace(/(.)/g, '$1$1');
      }
      hex.replace(/../g, function (color) {
        rgb.push(parseInt(color, 0x10));
        return color;
      });

      return 'rgb(' + rgb.join(',') + ')';
    },
    switchTab: function (e) {
      let index = e.currentTarget.dataset.index;
      let url = e.currentTarget.dataset.url;
      // if (this.data.list[index].isSpecial) {
      if (this.data.list[index].isSpecial) {
        wx.navigateTo({
          url
        });
      } else {
        wx.switchTab({
          url
        });
        // this.setData({
        //     selected: index
        // })
      }
    }
  }
});