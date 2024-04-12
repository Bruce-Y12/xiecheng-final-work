// pages/details/details.js
const token = wx.getStorageSync('token');
const app = getApp();
const toView = app.data.toView;
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
    imgList: [
      '../../image/QQ图片20240327152602.jpg',
      '../../image/B575819BBCE6F5CFE34975489DE3DC53.png',
      '../../image/B575819BBCE6F5CFE34975489DE3DC53.png'
    ],
    publish_time: '2小时前',
    location: '上海',
    current_article_id: -1,
    rejected_reason: "",
    //评论数据
    comment_list: [
      {
        comment_id: 1, //评论id
        comment_pr_id: 1,//评论文章所属id
        comment_user_avatar: 'https://img2.imgtp.com/2024/04/06/rrRGgTUZ.jpg', //评论用户头像(路径替换为你的图片路径)
        comment_user_name: '审核员', //评论人昵称
        comment_text: '去办理优待证是挺难的，但是办理了优待证之后福利特别好', //评论内容
        comment_time: '2020年8月18日', //评论时间
        reply_id: 0, //回复谁的评论，默认为0
        parent_id: 0, //评论所属评论id，默认为0
        reply_name: '' //回复评论用户的昵称 默认为''
      },

    ],

    //回复数据
    comment_list2: [
      {
        comment_id: 4,
        comment_pr_id: 1,
        comment_user_name: '张剑锋',
        comment_user_avatar: '/images/assemblyNumber/discoveryDetails/per3.png',
        comment_text: "大家快去办理吧!!!",
        comment_time: '2020年8月18日',
        reply_id: 3,
        parent_id: 3,
        reply_name: ''
      }
    ],
    /*定义一些数据*/
    focus: false, //输入框是否聚焦
    placeholder: '说点什么...', //底部输入框占字符
    placeholder2: '说点什么，让ta也认识看笔记的你', //顶部输入框占字符
    value: null, //顶部输入框内容
    comment_text: null, //底部评论框内容

    /*
     *以下初始化数据是用户点击任意一条评论或回复时需要设置的数据
     *然后将设置好的数据传递给评论时新创建的评论数据对象
    */
    now_reply_name: null, //当前点击的评论或回复评论的用户昵称
    now_reply_type: 0, //当前回复类型 默认为0 1为回复评论 2为回复回复
    now_parent_id: 0, //当前点击的评论或回复评论的所属评论id
    now_reply: 0, //当前点击的评论或回复评论的id

    //模拟用户信息
    userinfo: {
      nickName: '马飞', //用户昵称
      avatarUrl: '/images/assemblyNumber/discoveryDetails/per5.png' //用户头像
    },
    rejectedCommentFlag:-1,
  },
  getArticleDetails(articleId) {
    const app = getApp();
    const apiUrl = `${app.globalData.BASE_URL}/articles/${articleId}`

    wx.request({
      url: apiUrl,
      method: 'GET',
      header: {
        'Authorization': 'Bearer ' + token
      },
      success: res => {
        const article = res.data;
        console.log("@articleDetails:", article)

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
    this.setData({
      current_article_id: id,
      rejectedCommentFlag: app.data.toView
    })
    // 获取拒绝理由
    this.getOneArticle(options.id);
  },
  formatTime(timeString) {

    // 创建一个新的 Date 对象
    var date = new Date(timeString);

    // 获取年、月、日
    var year = date.getFullYear();
    var month = date.getMonth() + 1; // 月份是从 0 开始的，所以要加 1
    var day = date.getDate();

    // 格式化为 "xx年xx月xx日" 格式
    var formattedDate = year + "年" + month + "月" + day + "日";

    // 输出结果
    return formattedDate
  },
  getOneArticle(articleId) {
    const getOneArticleApi = `${app.globalData.BASE_URL}/articles/${articleId}`
    wx.request({
      url: getOneArticleApi,
      method: 'GET',
      header: {
        'Authorization': 'Bearer ' + token
      },
      success: (res) => {
        console.log("@res.data:", res.data);
        let tmp = this.data.comment_list;
        tmp[0].comment_text = res.data.rejected_reason;
        tmp[0].comment_time = this.formatTime(res.data.audit_at);
        this.setData({
          rejected_reason: res.data.rejected_reason,
          comment_list: tmp
        })
      },
      fail() {
        console.log('fail')
      },
    })
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

  },
  showOptions: function () {
    var that = this;
    wx.showActionSheet({
      itemList: ['编辑', '删除'],
      success: function (res) {
        if (!res.cancel) {
          if (res.tapIndex === 0) {
            // 点击了编辑按钮
            console.log('点击了编辑按钮');
            wx.navigateTo({
              url: `/pages/article-edit/article-edit?articleId=${that.data.current_article_id}`
            });

          } else if (res.tapIndex === 1) {
            // 点击了删除按钮
            wx.showModal({
              title: '确认删除',
              content: '是否确定删除该文章？',
              success: function (res) {
                if (res.confirm) {
                  console.log('用户点击确定');
                  // 执行删除操作
                  that.deleteArticle(that.data.current_article_id);
                } else if (res.cancel) {
                  console.log('用户点击取消');
                }
              }
            });
          }
        }
      }
    });
  },
  deleteArticle(articleId) {
    const apiUrl = `${app.globalData.BASE_URL}/articles/${articleId}`
    wx.request({
      url: apiUrl,
      method: 'DELETE',
      header: {
        'Authorization': 'Bearer ' + token
      },
      success: (res) => {
        console.log("@res.data:", res.data);
        wx.switchTab({
          url: `/pages/my/my`
        });
      },
      fail() {
        console.log('fail')
      },
    })
  },


})