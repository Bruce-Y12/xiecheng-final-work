// index.js
const token = wx.getStorageSync('token');
Page({
  data: {
    keyword: "",
    item: {},
    msg1: 'recommend',
    articleList: [],
    searchResults: [],
    normalData: [
      {
        // 第一条记录的数据
        // 可根据实际需要定义字段和对应的值
        id: 0,
        title: '文章标题1',
        Cover: '../../image/B575819BBCE6F5CFE34975489DE3DC53.png',
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
        Cover: '../../image/QQ图片20240327152531.jpg',
        tx: '../../image/B575819BBCE6F5CFE34975489DE3DC53.png',
        name: '作者名字2',
        love: 8,
        num: 3
      },
      {
        id: 2,
        title: '文章标题1',
        Cover: '../../image/QQ图片20240327152550.jpg',
        tx: '../../image/B575819BBCE6F5CFE34975489DE3DC53.png',
        name: '作者名字1',
        love: 10,
        num: 5
      },
      {
        id: 3,
        title: '文章标题2',
        Cover: '../../image/QQ图片20240327152556.jpg',
        tx: '../../image/B575819BBCE6F5CFE34975489DE3DC53.png',
        name: '作者名字2',
        love: 8,
        num: 3
      },
      {
        id: 4,
        title: '文章标题1',
        Cover: '../../image/QQ图片20240327152602.jpg',
        tx: '../../image/B575819BBCE6F5CFE34975489DE3DC53.png',
        name: '作者名字1',
        love: 10,
        num: 5
      },
      {
        id: 5,
        title: '文章标题2',
        Cover: '../../image/QQ图片20240327152608.jpg',
        tx: '../../image/B575819BBCE6F5CFE34975489DE3DC53.png',
        name: '作者名字2',
        love: 8,
        num: 3
      },
      {
        id: 6,
        title: '文章标题1',
        Cover: '../../image/B575819BBCE6F5CFE34975489DE3DC53.png',
        tx: '../../image/B575819BBCE6F5CFE34975489DE3DC53.png',
        name: '作者名字1',
        love: 10,
        num: 5
      },
      {
        id: 7,
        title: '文章标题2',
        Cover: '../../image/B575819BBCE6F5CFE34975489DE3DC53.png',
        tx: '../../image/B575819BBCE6F5CFE34975489DE3DC53.png',
        name: '作者名字2',
        love: 8,
        num: 3
      },
      {
        id: 8,
        title: '文章标题1',
        Cover: '../../image/B575819BBCE6F5CFE34975489DE3DC53.png',
        tx: '../../image/B575819BBCE6F5CFE34975489DE3DC53.png',
        name: '作者名字1',
        love: 10,
        num: 5
      },
      {
        id: 9,
        title: '文章标题2',
        Cover: '../../image/B575819BBCE6F5CFE34975489DE3DC53.png',
        tx: '../../image/B575819BBCE6F5CFE34975489DE3DC53.png',
        name: '作者名字2',
        love: 8,
        num: 3
      },
      {
        id: 10,
        title: '文章标题1',
        Cover: '../../image/B575819BBCE6F5CFE34975489DE3DC53.png',
        tx: '../../image/B575819BBCE6F5CFE34975489DE3DC53.png',
        name: '作者名字1',
        love: 10,
        num: 5
      },
      {
        id: 11,
        title: '文章标题2',
        Cover: '../../image/B575819BBCE6F5CFE34975489DE3DC53.png',
        tx: '../../image/B575819BBCE6F5CFE34975489DE3DC53.png',
        name: '作者名字2',
        love: 8,
        num: 3
      },
    ],
    // 请求参数对象
    queryObj:{
      pagenum: 1,// 页码值
      pagesize: 10 // 每页显示多少条数据
    },
    // 总数量，用来实现分页
    total: 0  
  },
  onLoad() {
    this.getArticleList();
  },
  onReachBottom: function () {
    console.log('*********');
    // 1. 重置关键数据
    let pagenum = 'queryObj.pagenum'
    this.setData({
      [pagenum]:1,
      total :0,
      isloading : false,
    })
    // 2. 重新发起请求 并关闭下拉窗口
    this.getArticleList()
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  onInput: function (event) {
    const keyword = event.detail.value;
    this.setData({
      keyword: keyword
    });
  },
  search() {
    const keyword = this.data.keyword;
    console.log("@@keyword:", keyword)

    const filteredData = this.data.articleList.filter(item => {
      return  item.title.includes(keyword);
    });
    console.log("@@filteredData:", filteredData)

    this.setData({
      searchResults: filteredData
    })
  },
  getArticleList: function () {

    wx.showLoading({
      title: '数据加载中...',
    })

    // 在这里调用获取文章列表的接口
    // 假设接口返回一个包含文章列表信息的 JSON 对象
    const app = getApp();
    // const apiUrl = 'http://106.14.145.28:7001/articles';
    const apiUrl = `${app.globalData.BASE_URL}/articles/`

    wx.request({
      url: apiUrl,
      method: 'GET',
      header: {
        'Authorization': 'Bearer ' + token // 在请求头中添加 Authorization 字段，并携带 token
      },
      success: res => {
        const articleList = res.data;
        console.log("@articleList:", articleList)
        // 对每个文章进行处理
        const processedArticleList = articleList.map(article => {
          // 提取并处理 Cover
          const images = article.images;
          const Cover = images.length > 0 ? images[0] : ''; // 取第一个字符串作为 Cover，如果没有则为空字符串
          // 构建新的文章对象
          return {
            id: article.dataValues.id,
            title: article.dataValues.title,
            Cover: Cover,
            tx: 'https://img2.imgtp.com/2024/04/08/VDzGXt75.png', // 这里根据你的需求处理其他字段
            name: 'Issac', // 这里根据你的需求处理其他字段
            love: 0,
            num: 0
          };
        });

        // 更新页面数据，用于展示
        let newArr = [...this.data.searchResults, ...processedArticleList];
        console.log("@@this.data.searchResults:", this.data.searchResults);
        this.setData({
          // articleList: processedArticleList,
          // searchResults: processedArticleList
          searchResults: newArr,
          total: this.data.total + processedArticleList.length
        });
      },
      // 无论获取数据是否成功都会执行该方法
      complete:()=>{
        wx.hideLoading() // 关闭loading
      },      
      fail: err => {
        console.error('Failed to fetch article list:', err);
      }
    });
  },

})
