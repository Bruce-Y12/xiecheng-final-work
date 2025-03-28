Component({
  behaviors: [],
  // 组件属性列表,里面存放要从父组件接受的数据
  properties: {
    // 要接收数据的名称
    normalData: Array,
  },
  data: {

  },
  lifetimes: {
    created() {
    },
    attached() {

    },
    moved() {

    },
    detached() {

    },
  },
  methods: {
    goNewsDetail(event) {
      console.log(event);
      var newsId = event.currentTarget.dataset.newsid;
      console.log(newsId);
      wx.navigateTo({
        url: '../ActiveDetail/ActiveDetail?newsId=' + newsId,
      })

    },
    // 下拉刷新触发的方法
    onPullDownRefresh: function () {
      // 触发父组件事件，通知父组件下拉刷新
      this.triggerEvent('pullDownRefresh');
    },
  },
}
); 
