// pages/message/message.js
const app = getApp();
var inputVal = '';
var msgList = [];
var windowWidth = wx.getSystemInfoSync().windowWidth;
var windowHeight = wx.getSystemInfoSync().windowHeight;
var keyHeight = 0;

/**
 * 初始化数据
 */
function initData(that) {
  inputVal = '';

  msgList = [{
      speaker: 'server',
      contentType: 'text',
      content: '我是一个智能聊天机器人，可以回答你的问题并与你进行对话。'
    },
    // {
    //   speaker: 'customer',
    //   contentType: 'text',
    //   content: '你好哇~'
    // }
  ]
  that.setData({
    msgList,
    inputVal
  })
}

/**
 * 计算msg总高度
 */
// function calScrollHeight(that, keyHeight) {
//   var query = wx.createSelectorQuery();
//   query.select('.scrollMsg').boundingClientRect(function(rect) {
//   }).exec();
// }

Page({

  /**
   * 页面的初始数据
   */
  data: {
    scrollHeight: '100vh',
    inputBottom: 0,
    userAvatar: "",
    loading: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    initData(this);
    this.getUserInfo();

    this.setData({
      cusHeadIcon: this.data.userAvatar,
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 获取聚焦
   */
  focus: function(e) {
    keyHeight = e.detail.height;
    this.setData({
      scrollHeight: (windowHeight - keyHeight) + 'px'
    });
    this.setData({
      toView: 'msg-' + (msgList.length - 1),
      inputBottom: keyHeight + 'px'
    })
    //计算msg高度
    // calScrollHeight(this, keyHeight);

  },

  //失去聚焦(软键盘消失)
  blur: function(e) {
    this.setData({
      scrollHeight: '100vh',
      inputBottom: 0
    })
    this.setData({
      toView: 'msg-' + (msgList.length - 1)
    })

  },
  // 封装异步操作的函数
  sendRequestToChatbot(inputValue) {
    return new Promise((resolve, reject) => {
      // 发送请求到聊天机器人的 API
      wx.request({
        url: 'http://113.31.106.229:85/hunyuan',
        method: 'POST',
        data: inputValue,
        success: (res) => {
          // 请求成功，返回聊天机器人的回复
          const response = res.data;
          resolve(response);
        },
        fail: (err) => {
          // 请求失败，返回错误信息
          reject(err);
        }
      });
    });
  },
  /**
   * 发送点击监听
   */
  sendClick: function (e) {
    const inputValue = e.detail.value;
    var that = this;
  
    // 模拟聊天机器人回答
    msgList.push({
      speaker: 'customer',
      contentType: 'text',
      content: inputValue
    });
  
    // 显示加载中的提示
    wx.showLoading({
      title: '加载中...',
    });
  
    // 调用封装的异步函数
    this.sendRequestToChatbot(inputValue)
      .then((response) => {
        // 请求成功，更新消息列表
        msgList.push({
          speaker: 'server',
          contentType: 'text',
          content: response
        });
        // 清空输入框内容
        inputVal = '';
        that.setData({
          msgList,
          inputVal,
          loading: false // 隐藏加载中提示
        });
      })
      .catch((err) => {
        console.error('Failed to send request:', err);
        // 请求失败，显示错误提示
        wx.showToast({
          title: '请求失败，请重试',
          icon: 'none',
        });
      })
      .finally(() => {
        // 隐藏加载中提示
        wx.hideLoading();
      });
  
    // 更新消息列表，添加模拟聊天机器人的回答
    msgList.push({
      speaker: 'server',
      contentType: 'text',
      content: response
    });
    // 清空输入框内容
    inputVal = '';
    this.setData({
      msgList,
      inputVal
    });
  },

  /**
   * 退回上一页
   */
  toBackClick: function() {
    wx.navigateBack({})
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
        })
      },
      fail: function (err) {
        console.error(err);
      }
    });
  },

})