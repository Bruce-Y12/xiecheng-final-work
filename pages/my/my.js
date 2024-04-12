// pages/my/my.js
const token = wx.getStorageSync('token');
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    category: [       // 导航栏内容数据
      { name: '待审核', id: 'daishenhe' },
      { name: '已通过', id: 'yitongguo' },
      { name: '未通过', id: 'weitongguo' },
    ],
    testData0: [
      {
        // 第一条记录的数据
        // 可根据实际需要定义字段和对应的值
        id: 0,
        title: '文章标题1',
        Cover: 'https://img2.imgtp.com/2024/04/05/tm6oJn00.png',
        tx: '../../image/B575819BBCE6F5CFE34975489DE3DC53.png',
        name: '作者名字1',
        love: 10,
        num: 5,
      },
      {
        // 第二条记录的数据
        // 可根据实际需要定义字段和对应的值
        id: 1,
        title: '文章标题2',
        Cover: 'https://img2.imgtp.com/2024/04/05/tm6oJn00.png',
        tx: '../../image/B575819BBCE6F5CFE34975489DE3DC53.png',
        name: '作者名字2',
        love: 8,
        num: 3
      },
      {
        id: 2,
        title: '文章标题1',
        Cover: 'https://img2.imgtp.com/2024/04/05/tm6oJn00.png',
        tx: '../../image/B575819BBCE6F5CFE34975489DE3DC53.png',
        name: '作者名字1',
        love: 10,
        num: 5
      },
      {
        id: 3,
        title: '文章标题2',
        Cover: 'https://img2.imgtp.com/2024/04/05/tm6oJn00.png',
        tx: '../../image/B575819BBCE6F5CFE34975489DE3DC53.png',
        name: '作者名字2',
        love: 8,
        num: 3
      },
      {
        id: 4,
        title: '文章标题1',
        Cover: 'https://img2.imgtp.com/2024/04/05/tm6oJn00.png',
        tx: '../../image/B575819BBCE6F5CFE34975489DE3DC53.png',
        name: '作者名字1',
        love: 10,
        num: 5
      },
      {
        id: 5,
        title: '文章标题2',
        Cover: 'https://img2.imgtp.com/2024/04/05/tm6oJn00.png',
        tx: '../../image/B575819BBCE6F5CFE34975489DE3DC53.png',
        name: '作者名字2',
        love: 8,
        num: 3
      },
      {
        id: 6,
        title: '文章标题1',
        Cover: 'https://img2.imgtp.com/2024/04/05/tm6oJn00.png',
        tx: '../../image/B575819BBCE6F5CFE34975489DE3DC53.png',
        name: '作者名字1',
        love: 10,
        num: 5
      }
    ],
    testData1: [
      {
        // 第一条记录的数据
        // 可根据实际需要定义字段和对应的值
        id: 0,
        title: '文章标题1',
        Cover: 'https://img2.imgtp.com/2024/04/06/rrRGgTUZ.jpg',
        tx: '../../image/B575819BBCE6F5CFE34975489DE3DC53.png',
        name: '作者名字1',
        love: 10,
        num: 5
      },
      {
        // 第二条记录的数据
        // 可根据实际需要定义字段和对应的值
        id: 1,
        title: '文章标题2',
        Cover: 'https://img2.imgtp.com/2024/04/06/rrRGgTUZ.jpg',
        tx: '../../image/B575819BBCE6F5CFE34975489DE3DC53.png',
        name: '作者名字2',
        love: 8,
        num: 3
      },
      {
        id: 2,
        title: '文章标题1',
        Cover: 'https://img2.imgtp.com/2024/04/06/rrRGgTUZ.jpg',
        tx: '../../image/B575819BBCE6F5CFE34975489DE3DC53.png',
        name: '作者名字1',
        love: 10,
        num: 5
      },
      {
        id: 3,
        title: '文章标题2',
        Cover: 'https://img2.imgtp.com/2024/04/06/rrRGgTUZ.jpg',
        tx: '../../image/B575819BBCE6F5CFE34975489DE3DC53.png',
        name: '作者名字2',
        love: 8,
        num: 3
      },
      {
        id: 4,
        title: '文章标题1',
        Cover: 'https://img2.imgtp.com/2024/04/06/rrRGgTUZ.jpg',
        tx: '../../image/B575819BBCE6F5CFE34975489DE3DC53.png',
        name: '作者名字1',
        love: 10,
        num: 5
      },
    ],
    testData2: [
      {
        // 第一条记录的数据
        // 可根据实际需要定义字段和对应的值
        id: 0,
        title: '文章标题1',
        Cover: 'https://img2.imgtp.com/2024/04/05/azorUgBT.jpg',
        tx: '../../image/B575819BBCE6F5CFE34975489DE3DC53.png',
        name: '作者名字1',
        love: 10,
        num: 5
      },
      {
        // 第二条记录的数据
        // 可根据实际需要定义字段和对应的值
        id: 1,
        title: '文章标题2',
        Cover: 'https://img2.imgtp.com/2024/04/05/azorUgBT.jpg',
        tx: '../../image/B575819BBCE6F5CFE34975489DE3DC53.png',
        name: '作者名字2',
        love: 8,
        num: 3
      },
      {
        id: 2,
        title: '文章标题1',
        Cover: 'https://img2.imgtp.com/2024/04/05/azorUgBT.jpg',
        tx: '../../image/B575819BBCE6F5CFE34975489DE3DC53.png',
        name: '作者名字1',
        love: 10,
        num: 5
      },
      {
        id: 3,
        title: '文章标题2',
        Cover: 'https://img2.imgtp.com/2024/04/05/azorUgBT.jpg',
        tx: '../../image/B575819BBCE6F5CFE34975489DE3DC53.png',
        name: '作者名字2',
        love: 8,
        num: 3
      },
      {
        id: 4,
        title: '文章标题1',
        Cover: 'https://img2.imgtp.com/2024/04/05/azorUgBT.jpg',
        tx: '../../image/B575819BBCE6F5CFE34975489DE3DC53.png',
        name: '作者名字1',
        love: 10,
        num: 5
      },
    ],
    allArticleList: [],
    toAuditArticleList: [],
    acceptArticleList: [],
    rejectArticleList: [],
    curIndex: 0,
    toView: 0,
    userAvatar: "",
    username: "",
  },
  switchCategory(e) {
    this.setData({
      curIndex: e.currentTarget.dataset.index ? e.currentTarget.dataset.index : 0,
      toView: e.currentTarget.dataset.index,
    })
    app.data.toView = e.currentTarget.dataset.index;
    console.log("toView:", this.data.toView)
  },
  getUserInfo() {
    var that = this;
    const user_id = app.data.user_id;
    const getUserInfoApi = `${app.globalData.BASE_URL}/users/${user_id}`
    console.log("%%getUserInfo:", getUserInfoApi);
    wx.request({
      url: getUserInfoApi,
      method: 'GET',
      success: function (res) {
        that.setData({
          userAvatar: res.data.avatar,
          username: res.data.name
        })
      },
      fail: function (err) {
        console.error(err);
      }
    });
  },
  getAllArticleList() {
    var that = this;
    const app = getApp();
    const getAllArticleListApi = `${app.globalData.BASE_URL}/articles/`
    console.log("##getAllArticleListApi:", getAllArticleListApi)

    wx.request({
      url: getAllArticleListApi,
      method: 'GET',
      header: {
        'Authorization': 'Bearer ' + token
      },
      success: res => {
        const articleList = res.data;
        const processedArticleList = articleList.map(article => {

          const images = article.images;
          const Cover = images.length > 0 ? images[0] : '';
          return {
            id: article.dataValues.id,
            title: article.dataValues.title,
            status: article.dataValues.status,
            Cover: Cover,
            tx: 'https://img2.imgtp.com/2024/04/08/VDzGXt75.png',
            name: this.data.username,
            love: 10,
            num: 5
          };
        });

        this.setData({
          allArticleList: processedArticleList,

        });
        console.log("%%allArticleList:", this.data.allArticleList)

        this.setData({
          toAuditArticleList: this.data.allArticleList.filter(item => item.status === 0),
          acceptArticleList: this.data.allArticleList.filter(item => item.status === 1),
          rejectArticleList: this.data.allArticleList.filter(item => item.status === 2),
        })

        console.log("@@this.data.rejectArticleList:", this.data.rejectArticleList)
      },
      fail: function (err) {
        console.error(err);
      }
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getUserInfo();
    this.getAllArticleList();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.getAllArticleList();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})