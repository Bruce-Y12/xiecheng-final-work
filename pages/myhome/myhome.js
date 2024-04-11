// pages/userhome/userhome.js
const app = getApp()
let id = ''
// let username = ''
let nickname = ''

Page({
  data: {
    defaultImage: 'https://img2.imgtp.com/2024/04/05/tm6oJn00.png',
    selectedImage: 'https://img2.imgtp.com/2024/04/05/tm6oJn00.png',
    username: "",
    user_id: -1,
    avatar: "",
  },
  onLoad: function (option) {
    console.log("@@---onLoad---app.data:", app.data);
    this.setData({
      user_id: app.data.user_id,
    })
    const getUserInfoApi = `${app.globalData.BASE_URL}/users/${this.data.user_id}`;
    wx.request({
      url: getUserInfoApi,
      method: 'GET',

      success: res=> {
        console.log("@res.data:", res.data);
        this.setData({
          avatar: res.data.avatar,
          username: res.data.name
        })
      },
      fail: function(err){
        console.log("err", err);
      }
    })
  },
  chooseImage() {
    var that = this;
    console.log("app.data.username:", app.data.username)
    wx.chooseImage({
      success: function (res) {
        const tempFilePath = res.tempFilePaths[0];
        console.log("@@tempFilePath:", tempFilePath)
        // 调用接口上传图片
        wx.uploadFile({
          url: 'https://www.imgtp.com/api/upload',
          filePath: tempFilePath, // 选择的第一张图片路径
          name: 'image', // 上传文件的字段名
          success: function (res) {
            const data = JSON.parse(res.data); // 解析服务器返回的数据
            console.log("图片res.data.data.url:", data.data.url)
            const imageUrl = data.data.url; // 获取上传后的图片链接
            
            // 在这里可以根据需要进行后续操作，比如显示上传后的图片等
            console.log('上传成功，图片链接：', imageUrl);
            that.setData({
              selectedImage: imageUrl
            })
          },
          fail: function (error) {
            console.error('上传失败：', error);
          }
        });


        // 模拟发送请求到服务器
        wx.showLoading({
          title: '上传中...',
        });

        // 模拟处理服务器响应（这里使用setTimeout来模拟异步请求）
        setTimeout(() => {
          wx.hideLoading();

          // 模拟成功的响应
          const response = {
            status: 'success',
            message: 'Image uploaded successfully'
          };

          // 模拟处理服务器的响应
          that.handleUpload(response);
        }, 600);
      }
    })

  },
  handleUpload(res) {
    if (res.status == 'success') {
      console.log("上传成功！");
    }
    else {
      console.log("上传失败！");
    }
  },
  logout(){
    // TODO:退出登录
    wx.removeStorageSync('token');
    wx.redirectTo({
      url: '/pages/login/login',
    })
  }
})