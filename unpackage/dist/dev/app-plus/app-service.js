if (typeof Promise !== "undefined" && !Promise.prototype.finally) {
  Promise.prototype.finally = function(callback) {
    const promise = this.constructor;
    return this.then(
      (value) => promise.resolve(callback()).then(() => value),
      (reason) => promise.resolve(callback()).then(() => {
        throw reason;
      })
    );
  };
}
;
if (typeof uni !== "undefined" && uni && uni.requireGlobal) {
  const global = uni.requireGlobal();
  ArrayBuffer = global.ArrayBuffer;
  Int8Array = global.Int8Array;
  Uint8Array = global.Uint8Array;
  Uint8ClampedArray = global.Uint8ClampedArray;
  Int16Array = global.Int16Array;
  Uint16Array = global.Uint16Array;
  Int32Array = global.Int32Array;
  Uint32Array = global.Uint32Array;
  Float32Array = global.Float32Array;
  Float64Array = global.Float64Array;
  BigInt64Array = global.BigInt64Array;
  BigUint64Array = global.BigUint64Array;
}
;
if (uni.restoreGlobal) {
  uni.restoreGlobal(Vue, weex, plus, setTimeout, clearTimeout, setInterval, clearInterval);
}
(function(vue) {
  "use strict";
  function formatAppLog(type, filename, ...args) {
    if (uni.__log__) {
      uni.__log__(type, filename, ...args);
    } else {
      console[type].apply(console, [...args, filename]);
    }
  }
  const _export_sfc = (sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props) {
      target[key] = val;
    }
    return target;
  };
  const _sfc_main$4 = {
    data() {
      return {
        isLoading: false
        // 控制加载动画显示的标志位
      };
    },
    onShow() {
      this.isLoading = false;
    },
    methods: {
      goToPage2() {
        this.isLoading = true;
        this.sendDataToDevice(1).then((receivedId) => {
          formatAppLog("log", "at pages/tabbar/tabbar-1/tabbar-1.vue:25", "Received ID:", receivedId);
          uni.setStorageSync("generatedId", receivedId);
          uni.setStorageSync("isFromButton", true);
          setTimeout(() => {
            uni.switchTab({
              url: "/pages/tabbar/tabbar-2/tabbar-2"
            });
          }, 500);
        }).catch((err) => {
          formatAppLog("error", "at pages/tabbar/tabbar-1/tabbar-1.vue:37", "Failed to send data:", err);
          uni.showToast({
            title: `Failed to send data: ${err.errMsg}`,
            icon: "none"
          });
          this.isLoading = false;
        });
      },
      sendDataToDevice(data) {
        return new Promise((resolve, reject) => {
          const deviceIP = "http://192.168.145.40:5000";
          uni.request({
            url: `${deviceIP}/send`,
            // 根据香橙派接收数据的接口路径
            method: "POST",
            data: { data: data.toString() },
            success: (res) => {
              if (res.statusCode === 200 && res.data && typeof res.data.receivedId === "number") {
                formatAppLog("log", "at pages/tabbar/tabbar-1/tabbar-1.vue:55", "数据发送成功", res);
                resolve(res.data.receivedId);
              } else {
                reject(new Error("Invalid response format"));
              }
            },
            fail: (err) => {
              formatAppLog("log", "at pages/tabbar/tabbar-1/tabbar-1.vue:62", "数据发送失败", err);
              reject(err);
            }
          });
        });
      }
    }
  };
  function _sfc_render$3(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "content" }, [
      $data.isLoading ? (vue.openBlock(), vue.createElementBlock("view", { key: 0 }, "Loading...")) : (vue.openBlock(), vue.createElementBlock("button", {
        key: 1,
        onClick: _cache[0] || (_cache[0] = (...args) => $options.goToPage2 && $options.goToPage2(...args))
      }, "Go to Page 2"))
    ]);
  }
  const PagesTabbarTabbar1Tabbar1 = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["render", _sfc_render$3], ["__file", "D:/HBuilder demo/test6/pages/tabbar/tabbar-1/tabbar-1.vue"]]);
  class ResData {
    constructor(id, type, res) {
      this.id = id;
      this.type = type;
      this.res = res;
    }
  }
  const resData1 = [
    new ResData(1, "hungry", "111"),
    new ResData(2, "tried", "222"),
    new ResData(3, "needs_burping", "333"),
    new ResData(4, "belly_pain", "444"),
    new ResData(5, "discomfort", "555"),
    new ResData(6, "cold_hot", "666"),
    new ResData(7, "dontknow", "777")
  ];
  class ResViewModel {
    // Load data from the rankData1 of the Mock file.
    loadResDataSource1() {
      return resData1;
    }
    getRest(target) {
      if (target) {
        return target.res;
      }
    }
  }
  const _sfc_main$3 = {
    data() {
      let resModel = new ResViewModel();
      let resSource1 = resModel.loadResDataSource1();
      return {
        resData: resSource1,
        // 此处resData用来在组件中存储资源数据
        currentItem: null,
        // 当前展示的数据项
        historyRecords: []
        // 历史记录
      };
    },
    onShow() {
      const isFromButton = uni.getStorageSync("isFromButton");
      if (isFromButton) {
        const generatedId = uni.getStorageSync("generatedId");
        formatAppLog("log", "at pages/tabbar/tabbar-2/tabbar-2.vue:39", "Retrieved ID:", generatedId);
        if (generatedId) {
          this.loadData(generatedId);
        }
        uni.removeStorageSync("isFromButton");
      } else {
        this.currentItem = null;
      }
      const history = uni.getStorageSync("historyRecords") || [];
      this.historyRecords = history;
    },
    methods: {
      loadData(id) {
        this.currentItem = this.resData.find((item) => item.id === parseInt(id));
        if (this.currentItem) {
          this.addHistoryRecord(this.currentItem);
        }
      },
      addHistoryRecord(item) {
        const currentTime = (/* @__PURE__ */ new Date()).toLocaleString();
        this.historyRecords.unshift({ id: item.id, type: item.type, res: item.res, time: currentTime });
        uni.setStorageSync("historyRecords", this.historyRecords);
      }
    }
  };
  function _sfc_render$2(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "content" }, [
      $data.currentItem ? (vue.openBlock(), vue.createElementBlock("div", {
        key: 0,
        class: "content2"
      }, [
        vue.createElementVNode(
          "p",
          null,
          vue.toDisplayString($data.currentItem.type),
          1
          /* TEXT */
        ),
        vue.createElementVNode(
          "p",
          null,
          vue.toDisplayString($data.currentItem.res),
          1
          /* TEXT */
        )
      ])) : vue.createCommentVNode("v-if", true),
      vue.createElementVNode("div", { class: "history" }, [
        vue.createElementVNode("h3", null, "历史记录"),
        $data.historyRecords.length === 0 ? (vue.openBlock(), vue.createElementBlock("div", { key: 0 }, "暂无记录")) : vue.createCommentVNode("v-if", true),
        (vue.openBlock(true), vue.createElementBlock(
          vue.Fragment,
          null,
          vue.renderList($data.historyRecords, (record) => {
            return vue.openBlock(), vue.createElementBlock("div", {
              key: record.time
            }, [
              vue.createElementVNode(
                "p",
                null,
                "时间: " + vue.toDisplayString(record.time),
                1
                /* TEXT */
              ),
              vue.createElementVNode(
                "p",
                null,
                "类型: " + vue.toDisplayString(record.type),
                1
                /* TEXT */
              ),
              vue.createElementVNode(
                "p",
                null,
                "结果: " + vue.toDisplayString(record.res),
                1
                /* TEXT */
              )
            ]);
          }),
          128
          /* KEYED_FRAGMENT */
        ))
      ])
    ]);
  }
  const PagesTabbarTabbar2Tabbar2 = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["render", _sfc_render$2], ["__file", "D:/HBuilder demo/test6/pages/tabbar/tabbar-2/tabbar-2.vue"]]);
  const _sfc_main$2 = {
    data() {
      return {
        title: "Hello"
      };
    },
    onLoad() {
    },
    methods: {
      openCamera() {
      }
    }
  };
  function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "content" }, [
      vue.createElementVNode("button", {
        onClick: _cache[0] || (_cache[0] = (...args) => $options.openCamera && $options.openCamera(...args))
      }, "openCamera")
    ]);
  }
  const PagesTabbarTabbar4Tabbar4 = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["render", _sfc_render$1], ["__file", "D:/HBuilder demo/test6/pages/tabbar/tabbar-4/tabbar-4.vue"]]);
  const _sfc_main$1 = {
    data() {
      return {
        title: "Hello"
      };
    },
    onLoad() {
    },
    methods: {}
  };
  function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "content" }, " 页面 - 5 ");
  }
  const PagesTabbarTabbar5Tabbar5 = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["render", _sfc_render], ["__file", "D:/HBuilder demo/test6/pages/tabbar/tabbar-5/tabbar-5.vue"]]);
  __definePage("pages/tabbar/tabbar-1/tabbar-1", PagesTabbarTabbar1Tabbar1);
  __definePage("pages/tabbar/tabbar-2/tabbar-2", PagesTabbarTabbar2Tabbar2);
  __definePage("pages/tabbar/tabbar-4/tabbar-4", PagesTabbarTabbar4Tabbar4);
  __definePage("pages/tabbar/tabbar-5/tabbar-5", PagesTabbarTabbar5Tabbar5);
  const _sfc_main = {
    onLaunch: function() {
      formatAppLog("log", "at App.vue:4", "App Launch");
    },
    onShow: function() {
      formatAppLog("log", "at App.vue:17", "App Show");
    },
    onHide: function() {
      formatAppLog("log", "at App.vue:20", "App Hide");
    }
  };
  const App = /* @__PURE__ */ _export_sfc(_sfc_main, [["__file", "D:/HBuilder demo/test6/App.vue"]]);
  function createApp() {
    const app = vue.createVueApp(App);
    return {
      app
    };
  }
  const { app: __app__, Vuex: __Vuex__, Pinia: __Pinia__ } = createApp();
  uni.Vuex = __Vuex__;
  uni.Pinia = __Pinia__;
  __app__.provide("__globalStyles", __uniConfig.styles);
  __app__._component.mpType = "app";
  __app__._component.render = () => {
  };
  __app__.mount("#app");
})(Vue);
