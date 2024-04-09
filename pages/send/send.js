const app = getApp()
Page({

  data: {
    uploadImgList: [],
    cloudImgList: [],
    tempImgList: [],
    inputValue: '',
    titleValue: '',
    tishi: '请输入正文内容',
    addresssInfo: {}
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

    console.log(app.globalData.userInfo)

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
      // wx.cloud.uploadFile({
      //   cloudPath:`actionImages/${Math.random()}_${Date.now()}.${this.data.tempImgList[i].match(/\.(\w+)$/)[1]}`,
      //   filePath: this.data.tempImgList[i],
      //   success(res){
      //     console.log(res.fileID)
      //     that.data.cloudImgList.push(res.fileID)
      //     that.setData({
      //       cloudImgList:that.data.cloudImgList
      //     })
      //   }
      // })

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
      title: '发布中',
      // mask: 'true'
    })
    const app = getApp();
    const url = `${app.globalData.BASE_URL}/articles/`
    wx.request({
      url: url,
      method: 'POST',
      data: {
        user_id: 2,
        title: this.data.title,
        text: this.data.inputValue,
        images: this.data.uploadImgList
      },
      success: function (res) {
        // 隐藏加载状态
        // wx.navigateTo({
        //   url: '/pages/my/my'
        // });
        setTimeout(function(){
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

    // setTimeout(() => {
    //   wx.showToast({
    //     title: '发布成功！',
    //   })
    //     that.setData({
    //       uploadImgList:[],
    //       inputValue: '',
    //       titleValue: '',
    //     })
    // }, 1500);


  },

  getTitleValue(event) {

    console.log(event.detail.value)
    this.setData({
      title: event.detail.value
    })

  }




})