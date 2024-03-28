// pages/userhome/userhome.js
const app = getApp()
let id = ''
let username = ''
let nickname = ''

Page({
  data:{
    selectedImage: ''
  },
  chooseImage(){
    var that = this;
    wx.chooseImage({
      success: function(res) {
        const tempFilePath = res.tempFilePaths[0];
        
        that.setData({
            selectedImage: tempFilePath
        })
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
  handleUpload(res){
    if(res.status == 'success')
    {
      console.log("上传成功！");
    }
    else{
      console.log("上传失败！");
    }
  }
})