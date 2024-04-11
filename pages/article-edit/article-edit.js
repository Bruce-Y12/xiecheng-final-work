const app = getApp()
const token = wx.getStorageSync('token');

Page({

  data: {
    uploadImgList: [],
    cloudImgList: [],
    tempImgList: [],
    inputValue: '',
    titleValue: '',
    tishi: '请输入正文内容',
    addresssInfo: {},
    current_article_id: -1,

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
    location: '上海',
    //
    titleValue: '',
    inputValue: '',
  },

  //选择类型
  bindPickerChange(e) {
    console.log(e)
    this.setData({
      chooseTypeName: this.data.typesList[e.detail.value].name,
      typeId: this.data.typesList[e.detail.value]._id
    })

  },
  getTypes() {
    wx.cloud.database().collection('types')
      .get()
      .then(res => {
        console.log(res)

        let array = []
        for (let l in res.data) {
          array.push(res.data[l].name)
        }
        this.setData({
          typesList: res.data,
          typeNameList: array
        })
      })
  },
  chooseVideo(e) {
    var that = this;
    wx.chooseVideo({
      sourceType: ['album', 'camera'],
      maxDuration: 60,
      compressed: false,
      camera: 'back',
      success(res) {
        console.log(res)
        console.log(res.tempFilePath.match(/\.(\w+)$/)[1])
        wx.showLoading({
          title: '上传中',
        })
        wx.cloud.uploadFile({
          cloudPath: `actionVideos/${Math.random()}_${Date.now()}.${res.tempFilePath.match(/\.(\w+)$/)[1]}`,
          filePath: res.tempFilePath,
          success(suc) {
            console.log(suc.fileID)
            that.setData({
              videoUrl: suc.fileID
            })
            wx.hideLoading({})
          }
        })
      }
    })
  },

  onLoad: function (options) {

    console.log("@@articleId", options.articleId);
    this.setData({
      current_article_id: options.articleId
    })
    const app = getApp();
    const apiUrl = `${app.globalData.BASE_URL}/articles/${this.data.current_article_id}`
    wx.request({
      url: apiUrl,
      method: 'GET',
      header: {
        'Authorization': 'Bearer ' + token
      },
      success:(res)=>{
        console.log("@@res.data", res.data);
        const { title, text, images } = res.data;
        console.log("@title", title);
        console.log("@text", text);
        this.setData({
          title: title,
          description: text,
          uploadImgList: images,
          titleValue: title,
          inputValue: text,
        })
      },
      fail() {
        console.log('fail')
      },
    })
  },
  getValue(e) {
    console.log(e.detail.value)
    this.setData({
      inputValue: e.detail.value
    })
  },
  chooseImage() {
    var that = this;
    wx.chooseImage({
      success: function (res) {
        that.data.tempImgList = res.tempFilePaths;
        console.log("@@that.data.tempImgList:", that.data.tempImgList)
        for (let i = 0; i < that.data.tempImgList.length; i++) {
          const tempFilePath = res.tempFilePaths[i];

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
                uploadImgList: [...that.data.uploadImgList, imageUrl]
              })
            },
            fail: function (error) {
              console.error('上传失败：', error);
            }
          });
        }



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
  uploadImages() {
    var that = this;
    for (var i = 0; i < this.data.tempImgList.length; i++) {


      wx.uploadFile({
        url: 'https://www.imgtp.com/api/upload',
        filePath: this.data.tempImgList[i],
        name: 'image',
        success(res) {
          const data = res.data
          console.log("res.dat.data:", data.data)
        },
        fail: function (error) {
          console.error('上传失败：', error);
        }
      })
    }

  },
  deleteImg(e) {
    console.log(e.currentTarget.dataset.index)
    this.data.uploadImgList.splice(e.currentTarget.dataset.index, 1)
    this.setData({
      uploadImgList: this.data.uploadImgList
    })
  },

  submitData() {
    var that = this;
    if (!this.data.title) {
      wx.showToast({
        icon: 'error',
        title: '标题为空！',
      })
      return
    }
    if (!this.data.inputValue) {
      wx.showToast({
        icon: 'error',
        title: '正文内容为空！',
      })
      return
    }

    if (!this.data.videoUrl && this.data.uploadImgList.length == 0) {
      wx.showToast({
        icon: 'error',
        title: '图片为空',
      })
      return
    }
    wx.showLoading({
      title: '更新中',
      // mask: 'true'
    })
    const app = getApp();
    const url = `${app.globalData.BASE_URL}/articles/${this.data.current_article_id}`
    wx.request({
      url: url,
      method: 'PUT',
      header: {
        'Authorization': 'Bearer ' + token
      },
      data: {
        user_id: 2,
        title: this.data.titleValue,
        text: this.data.inputValue,
        images: this.data.uploadImgList
      },
      success: function (res) {

        setTimeout(function () {
          wx.hideLoading();
          wx.switchTab({
            url: '/pages/my/my',
          })
        }, 800)

      },
      fail: function (err) {
        console.error(err);
      }
    })

  },

  getTitleValue(event) {

    console.log(event.detail.value)
    this.setData({
      title: event.detail.value
    })

  }




})