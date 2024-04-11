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
    compressedImageUrl: '' // 压缩后的图片地址
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
      success: async function (res) {
        that.data.tempImgList = res.tempFilePaths;
        console.log("@@that.data.tempImgList:", that.data.tempImgList)
        for (let i = 0; i < that.data.tempImgList.length; i++) {
          const tempFilePath = res.tempFilePaths[i];
          
          /*压缩图片*/
          const imgInfo = await that.getImgInfo(tempFilePath);
          const compressedImage = await that.contraction(imgInfo, 'myCanvas');

          // 调用接口上传图片
          wx.uploadFile({
            url: 'https://www.imgtp.com/api/upload',
            filePath: compressedImage.tempFilePath, // 选择的第一张图片路径
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
  // 选择图片
  chooseImageTest() {
    wx.chooseImage({
      count: 1, // 最多可以选择的图片张数
      sizeType: ['original', 'compressed'], // 原图和压缩图
      sourceType: ['album', 'camera'], // 图片来源，相册或相机
      success: async (res) => {
        try {
          // 获取选中图片的临时路径
          const tempFilePath = res.tempFilePaths[0];
          // 获取图片信息
          const imgInfo = await this.getImgInfo(tempFilePath);
          // 压缩图片
          const compressedImage = await this.contraction(imgInfo, 'myCanvas');
          console.log("@conpressedImage:", compressedImage);
          // this.saveImageToPhotosAlbum(compressedImage.tempFilePath);
          // 更新页面数据，展示压缩后的图片
          this.setData({
            compressedImageUrl: compressedImage.tempFilePath
          });
        } catch (error) {
          console.error(error);
          wx.showToast({
            title: '图片处理失败，请重试',
            icon: 'none'
          });
        }
      },
      fail: (error) => {
        console.error(error);
        wx.showToast({
          title: '选择图片失败，请重试',
          icon: 'none'
        });
      }
    });
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
      title: '发布中',
      // mask: 'true'
    })
    const app = getApp();
    const url = `${app.globalData.BASE_URL}/articles/`
    wx.request({
      url: url,
      method: 'POST',
      header: {
        'Authorization': 'Bearer ' + token
      },
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

  },
  /* 获取图片信息
   * @param {string} tempFilePath 图片路径
   * @returns 图片信息
   */
  async getImgInfo(tempFilePath) {
    try {
      let image = await new Promise((resolve, reject) => {
        wx.getImageInfo({
          src: tempFilePath,
          success(res) {
            let imgInfo = {
              type: res.type,
              height: res.height,
              width: res.width,
              path: res.path
            }
            resolve(imgInfo)
          },
          fail(err) {
            reject(err)
          }
        })
      })
      return image
    } catch (err) { console.log(err); }
  },

  /**
    * 图片压缩
    * @param {object} file 图片信息：width、height、type、path 
    * @param {string} canvasId canvas的id名 
    * @param {object} config 限制最大宽高
    * @returns 压缩完成后的图片path 
  */
  async contraction(file, canvasId, config = { maxWidth: 1024, maxHeight: 768 }) {
    try {
      let ctxInfo = await new Promise((resolve, reject) => {
        // 获取图片原始宽高
        let width = file.width
        let height = file.height

        // 计算图片当前大小和目标大小的比例：目标大小 / 图片当前大小
        // 根据比例调整图片的尺寸：
        // 新宽度 = 原始宽度 * √(目标大小 / 图片当前大小) 
        // 新高度 = 原始高度 * √(目标大小 / 图片当前大小)
        // 宽高同比例调整
        // 宽度 > 最大限宽 -> 重置尺寸
        if (width > config.maxWidth) {
          const ratio = config.maxWidth / width
          width = config.maxWidth
          height = height * ratio
        }
        // 高度 > 最大限高度 -> 重置尺寸
        if (height > config.maxHeight) {
          const ratio = config.maxHeight / height
          width = width * ratio
          height = config.maxHeight
        }

        // 获取canvas元素
        const query = this.createSelectorQuery()
        let dom = query.select(`#${canvasId}`)
        dom.fields({ node: true, size: true })
          .exec((res) => {
            // Canvas 对象
            const canvas = res[0].node
            // 渲染上下文
            const ctx = canvas.getContext('2d')

            // 根据设备像素比处理尺寸 = 大小 * 设备像素
            const dpr = wx.getSystemInfoSync().pixelRatio
            canvas.width = width * dpr
            canvas.height = height * dpr
            ctx.scale(dpr, dpr)

            //创建img对象
            let img = canvas.createImage();
            img.src = file.path; // 给图片添加路径
            //图片加载完毕
            img.onload = function () {
              // 将图片绘制到 canvas
              ctx.drawImage(img, 0, 0, width, height)
              // 生成图片
              wx.canvasToTempFilePath({
                canvas,
                x: 0,
                y: 0,
                destWidth: width,
                destHeight: height,
                success(res) {
                  resolve(res); // 生成临时文件路径
                }
              })
            }
          })
      })
      return ctxInfo
    } catch (err) { console.log("err:", err); }
  },

  async afterRead(file) {
    let imgInfo = await this.getImgInfo(file.tempFilePath);  // 获取图片信息
    let ctxInfo = await this.contraction(imgInfo, 'myCanvas');  // 图片压缩
    // 后续保存操作.....
    console.log("@@ctxInfo:", ctxInfo);
  },
  // 保存图片到相册
  saveImageToPhotosAlbum(filePath) {
    wx.saveImageToPhotosAlbum({
      filePath,
      success: () => {
        wx.showToast({
          title: '保存成功',
          icon: 'success'
        });
      },
      fail: (error) => {
        console.error(error);
        wx.showToast({
          title: '保存失败，请重试',
          icon: 'none'
        });
      }
    });
  }
})