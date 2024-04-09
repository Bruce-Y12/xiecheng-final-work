// pages/details/details.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    coverUrl: '../../image/B575819BBCE6F5CFE34975489DE3DC53.png',
    title: '这是一篇小红书',
    author: '小红书作者',
    nickName: "柴柯基",
    description: '这篇小红书是关于...',
    avator: "../../image/B575819BBCE6F5CFE34975489DE3DC53.png",
    imgList:[
      '../../image/QQ图片20240327152602.jpg',
      '../../image/B575819BBCE6F5CFE34975489DE3DC53.png',
      '../../image/B575819BBCE6F5CFE34975489DE3DC53.png'
    ],
    publish_time: '2小时前',
    location: '上海'
  },
  getArticleDetails(articleId){
    const app = getApp();
    const apiUrl = `${app.globalData.BASE_URL}/articles/${articleId}`

    wx.request({
      url: apiUrl,
      method: 'GET',
      success: res => {
        const article = res.data;
        console.log("@articleDetails:",article)

        // 更新页面数据，用于展示
        this.setData({
          title: article.title,
          author: '小红书作者',
          nickName: "柴柯基",
          description: article.text,
          avator: "../../image/B575819BBCE6F5CFE34975489DE3DC53.png",
          imgList: article.images,
          publish_time: '2小时前',
          location: '上海'
        });
      },
      fail: err => {
        console.error('Failed to fetch article list:', err);
      }
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
      const id = options.id
      console.log("received id:", id);
      this.getArticleDetails(id);
      
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