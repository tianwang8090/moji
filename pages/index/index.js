//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    crt_view_index: 0,
    viewList: [
      {
        name: "latest",
        url: "https://www.umoo.wang/moji-api/photo",
        list: [],
        page: 1
      },
      {
        name: "popular",
        url: "https://www.umoo.wang/moji-api/photo",
        list: [],
        page: 1
      },
      {
        name: "random",
        url: "https://www.umoo.wang/moji-api/photo",
        list: [],
        page: 1
      }
    ],
    xhrTimer: -1,
    UTMString: '?utm_source=MOJI&utm_medium=referral&utm_campaign=api-credit'
  },
  onLoad: function () {
    this.getImageList();
  },
  onShareAppMessage: function () {
    return {
      title: "MOJI-寻觅好图片"
    }
  },
  onPullDownRefresh: function () { },
  tabTaphandle: function (e) {
    let dataset = e.currentTarget.dataset,
      _this = this;
    if (dataset.index === _this.data.crt_view_index) return;
    _this.setData({
      crt_view_index: dataset.index
    });
    if (_this.data.viewList[_this.data.crt_view_index].list.length) return;
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
        title: 'MOoOo...',
        mask: true
      });

      let view = _this.data.viewList[_this.data.crt_view_index], params = {};
      switch (view.name) {
        case "latest":
        case "popular":
          params = {
            page: view.page,
            orderBy: view.name
          };
          break;
        case "random":
          params = {
            orderBy: view.name
          };
          break;
        default:
          break;
      };
      wx.request({
        url: view.url,
        data: params,
        success: function (res) {
          if (res.statusCode === 200 && res.data.status) {
            view.page++;
            let data = res.data.data
            for (let i = 0; i < data.length; i++) {
              let e = data[i];
              view.list.push({
                id: e.id,
                url: e.urls.small,
                downUrl: e.urls.regular,
                authorName: e.user.name,
                authorLink: e.user.links.html,
              });
            }
            _this.setData(_this.data);
          } else {
            let msg = "MOJI-Slow and Better";
            switch (data.statusCode) {
              case 403:
                msg = "嘘~，MOJI睡着了，待会来叫它吧！";
                break;
              case 404:
                msg = "MOJI没找到这张图片！";
                break;
              case 401:
                msg = "咳咳~，MOJI生病了！"
              default:
                msg = "呀！MOJI出去玩了。";
                break;
            }
            wx.showModal({
              title: 'MOJI',
              content: msg,
              showCancel: false,
              confirmText: "好的"
            })
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
  },
  authorTapHandle(e) {
    let dataset = e.currentTarget.dataset,
      _this = this;
    wx.setClipboardData({
      data: dataset.link + _this.data.UTMString,
      success: function () {
        wx.showModal({
          title: 'MOJI提示',
          content: '因为小程序限制打开网页，MOJI帮你复制了图片作者的主页链接，去浏览器粘贴访问就好啦~',
          showCancel: false
        })
      }
    })
  },
  unsplashTapHandle(e) {
    let _this = this;
    wx.setClipboardData({
      data: 'https://unsplash.com' + _this.data.UTMString,
      success: function () {
        wx.showModal({
          title: 'MOJI提示',
          content: '因为小程序限制打开网页，MOJI帮你复制了网站的链接，去浏览器粘贴访问就好啦~',
          showCancel: false
        })
      }
    })
  }
})
