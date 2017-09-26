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
    }
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
  onShareAppMessage() { },
  onPullDownRefresh() {

  },
  tabTaphandle(e) {
    let dataset = e.currentTarget.dataset;
    if (dataset.name === this.data.crt_view) return;
    this.setData({
      crt_view: dataset.name
    });
    if (this.data[this.data.crt_view + 'Img'].list.length) return;
    this.getImageList();
  },
  nextPage(e) {
    this.getImageList();
  },
  getImageList() {
    wx.showLoading({
      title: 'MOJING...',
      mask: true
    })
    wx.request({
      url: "https://api.unsplash.com/photos",
      data: {
        page: this.data[this.data.crt_view + 'Img'].page,
        per_page: 10,
        order_by: this.data.crt_view
      },
      header: {
        Authorization: 'Client-ID ' + app.globalData.client_id
      },
      success: data => {
        if (!data.data.errors) {
          this.data[this.data.crt_view + 'Img'].page++;
          data.data.forEach((e, i) => {
            this.data[this.data.crt_view + 'Img'].list.push({
              id: e.id,
              url: e.urls.regular
            });
          });
          this.setData(this.data);
        }
      },
      complete() {
        wx.hideLoading();
      }
    })
  }
})
