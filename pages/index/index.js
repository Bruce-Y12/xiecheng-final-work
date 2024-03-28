// index.js
Page({
  data: {
    item: {},
    msg1: 'recommend',
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
        id:5,
        title: '文章标题2',
        Cover: '../../image/QQ图片20240327152608.jpg',
        tx: '../../image/B575819BBCE6F5CFE34975489DE3DC53.png',
        name: '作者名字2',
        love: 8,
        num: 3
      },  
      {
        id:6,
        title: '文章标题1',
        Cover: '../../image/B575819BBCE6F5CFE34975489DE3DC53.png',
        tx: '../../image/B575819BBCE6F5CFE34975489DE3DC53.png',
        name: '作者名字1',
        love: 10,
        num: 5
      },
      {
        id:7,
        title: '文章标题2',
        Cover: '../../image/B575819BBCE6F5CFE34975489DE3DC53.png',
        tx: '../../image/B575819BBCE6F5CFE34975489DE3DC53.png',
        name: '作者名字2',
        love: 8,
        num: 3
      },      
       {
        id:8,
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
         id:10,
        title: '文章标题1',
        Cover: '../../image/B575819BBCE6F5CFE34975489DE3DC53.png',
        tx: '../../image/B575819BBCE6F5CFE34975489DE3DC53.png',
        name: '作者名字1',
        love: 10,
        num: 5
      },
      {
        id:11,
        title: '文章标题2',
        Cover: '../../image/B575819BBCE6F5CFE34975489DE3DC53.png',
        tx: '../../image/B575819BBCE6F5CFE34975489DE3DC53.png',
        name: '作者名字2',
        love: 8,
        num: 3
      },     
    ]
  },
  onLoad(){

  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // const db= wx.cloud.database();
    const simulatedData = [
      {
        // 第一条记录的数据
        // 可根据实际需要定义字段和对应的值
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
        title: '文章标题2',
        Cover: '../../image/B575819BBCE6F5CFE34975489DE3DC53.png',
        tx: '../../image/B575819BBCE6F5CFE34975489DE3DC53.png',
        name: '作者名字2',
        love: 8,
        num: 3
      }
      
    ];

    // db.collection('homepage').where({
    //   name:'tuijain'
    // })
    // .get({
    //   success: (res)=>{
    //     // res.data 是包含以上定义的两条记录的数组
    //     console.log(res.data);
    //     console.log(this);

    //     this.setData({
    //       normalData:res.data[0]
    //     })
    //     console.log(res.data[0]);
    //     this.setData({
    //     item:{
    //     }
    //   })
    //   }
    // })
    // 模拟异步请求，延时一段时间后返回模拟数据
    // setTimeout(() => {
    //   console.log(simulatedData);
    //   console.log(this);

    //   this.setData({
    //     normalData: simulatedData[0]
    //   });
    //   console.log(simulatedData[0]);
    //   this.setData({
    //     item: {}
    //   });
    // }, 500);
  },
})
