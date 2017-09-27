//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    crt_view: "latest",
    latestImg: {
      list: [],
      page: 1
    },
    oldestImg: {
      list: [],
      page: 1,
    },
    popularImg: {
      list: [],
      page: 1
    },
    xhrTimer: -1
  },
  onLoad: function () {
    this.getImageList();
  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  onShareAppMessage: function () {
    return {
      title: "MOJI-发现好图片"
    }
  },
  onPullDownRefresh: function () { },
  tabTaphandle: function (e) {
    let dataset = e.currentTarget.dataset,
      _this = this;
    if (dataset.name === _this.data.crt_view) return;
    _this.setData({
      crt_view: dataset.name
    });
    if (_this.data[_this.data.crt_view + 'Img'].list.length) return;
    _this.getImageList();
  },
  nextPage: function (e) {
    this.getImageList();
  },
  getImageList: function () {
    let _this = this;
    if (_this.data.xhrTimer > 0) return;
    _this.data.xhrTimer = setTimeout(() => {
      wx.showLoading({
        title: 'MOJING...',
        mask: true
      });
      wx.request({
        url: "https://api.unsplash.com/photos",
        data: {
          page: _this.data[_this.data.crt_view + 'Img'].page,
          per_page: 10,
          order_by: _this.data.crt_view
        },
        header: {
          Authorization: 'Client-ID ' + app.globalData.client_id
        },
        success: function (data) {
          if (!data.data.errors) {
            _this.data[_this.data.crt_view + 'Img'].page++;
            for (let i = 0; i < data.data.length; i++) {
              let e = data.data[i];
              _this.data[_this.data.crt_view + 'Img'].list.push({
                id: e.id,
                url: e.urls.small,
                downUrl: e.urls.regular,
                authorName: e.user.name
              });
            }
            _this.setData(_this.data);
          }
        },
        complete: function () {
          clearTimeout(_this.data.xhrTimer);
          _this.data.xhrTimer = -1;
          wx.hideLoading();
        }
      });
    }, 300);
  },
  imgTapHandle: function (e) {
    let dataset = e.currentTarget.dataset;
    wx.previewImage({
      urls: [dataset.downurl]
    })
  }
})
