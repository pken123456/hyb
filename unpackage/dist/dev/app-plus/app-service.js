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
          formatAppLog("log", "at pages/tabbar/tabbar-1/tabbar-1.vue:25", "tabbar1:Received ID:", receivedId);
          uni.setStorageSync("generatedId", receivedId);
          uni.setStorageSync("isFromButton", true);
          uni.switchTab({
            url: "/pages/tabbar/tabbar-2/tabbar-2"
          });
        }).catch((err) => {
          formatAppLog("error", "at pages/tabbar/tabbar-1/tabbar-1.vue:35", "Failed to send data:", err);
          uni.showToast({
            title: `Failed to send data: ${err.errMsg}`,
            icon: "none"
          });
          this.isLoading = false;
        });
      },
      sendDataToDevice(data) {
        return new Promise((resolve, reject) => {
          const deviceIP = "http://192.168.145.40:5001";
          uni.request({
            url: `${deviceIP}/infer`,
            // 根据香橙派接收数据的接口路径
            method: "POST",
            data: { data },
            success: (res) => {
              if (res.statusCode === 200 && res.data && typeof res.data.receivedId === "number") {
                formatAppLog("log", "at pages/tabbar/tabbar-1/tabbar-1.vue:53", "数据发送成功", res);
                resolve(res.data.receivedId);
              } else {
                reject(new Error("Invalid response format"));
              }
            },
            fail: (err) => {
              formatAppLog("log", "at pages/tabbar/tabbar-1/tabbar-1.vue:60", "数据发送失败", err);
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
    new ResData(1, "awake", "111"),
    new ResData(2, "diaper", "222"),
    new ResData(3, "hug", "333"),
    new ResData(4, "hungry", "444"),
    new ResData(5, "sleepy", "555"),
    new ResData(6, "uncomfortable", "666"),
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
        formatAppLog("log", "at pages/tabbar/tabbar-2/tabbar-2.vue:20", "tabbar2:Retrieved ID:", generatedId);
        if (generatedId) {
          this.loadData(generatedId);
        }
        uni.removeStorageSync("isFromButton");
      } else {
        this.currentItem = null;
      }
      const history = uni.getStorageSync("historyRecords") || [];
      this.historyRecords = history;
      formatAppLog("log", "at pages/tabbar/tabbar-2/tabbar-2.vue:36", "tabbar2:historyRecords:", history);
    },
    methods: {
      loadData(id) {
        this.currentItem = this.resData.find((item) => item.id === parseInt(id));
        if (this.currentItem) {
          this.addHistoryRecord(this.currentItem);
        }
      },
      addHistoryRecord(item) {
        const currentTime = /* @__PURE__ */ new Date();
        const formattedTime = `${currentTime.getFullYear()}.${currentTime.getMonth() + 1}.${currentTime.getDate()}  ${currentTime.getHours()}:${currentTime.getMinutes() < 10 ? "0" + currentTime.getMinutes() : currentTime.getMinutes()}`;
        formatAppLog("log", "at pages/tabbar/tabbar-2/tabbar-2.vue:48", currentTime);
        formatAppLog("log", "at pages/tabbar/tabbar-2/tabbar-2.vue:49", formattedTime);
        this.historyRecords.unshift({ id: item.id, type: item.type, res: item.res, time: formattedTime });
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
        vue.createElementVNode("div", { class: "title" }, [
          vue.createElementVNode("h3", null, "历史记录")
        ]),
        $data.historyRecords.length === 0 ? (vue.openBlock(), vue.createElementBlock("div", { key: 0 }, "暂无记录")) : vue.createCommentVNode("v-if", true),
        vue.createElementVNode("ul", null, [
          (vue.openBlock(true), vue.createElementBlock(
            vue.Fragment,
            null,
            vue.renderList($data.historyRecords, (record) => {
              return vue.openBlock(), vue.createElementBlock("li", {
                class: "list1",
                key: record.time
              }, [
                vue.createElementVNode(
                  "span",
                  null,
                  "时间: " + vue.toDisplayString(record.time),
                  1
                  /* TEXT */
                ),
                vue.createElementVNode(
                  "span",
                  null,
                  "类型: " + vue.toDisplayString(record.type),
                  1
                  /* TEXT */
                ),
                vue.createElementVNode(
                  "span",
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
      ])
    ]);
  }
  const PagesTabbarTabbar2Tabbar2 = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["render", _sfc_render$2], ["__file", "D:/HBuilder demo/test6/pages/tabbar/tabbar-2/tabbar-2.vue"]]);
  const _sfc_main$2 = {
    data() {
      return {
        title: "Hello",
        cameraUrl: "",
        buttonText1: "openCamera",
        buttonText2: "musicon",
        isCameraOpen: false,
        isMusicOpen: false,
        musicList: [1, 2, 3, 4, 5, 6, 7]
      };
    },
    methods: {
      toggleCamera() {
        if (this.isCameraOpen) {
          this.sendVideoData(6);
          this.isCameraOpen = false;
          this.buttonText1 = "openCamera";
          this.cameraUrl = "";
        } else {
          this.sendVideoData(7);
          this.isCameraOpen = true;
          this.buttonText1 = "closeCamera";
          this.cameraUrl = "http://192.168.145.40:8080/?action=stream";
        }
      },
      toggleMusic() {
        if (this.isMusicOpen) {
          this.isMusicOpen = false;
          this.buttonText2 = "musicon";
        } else {
          this.isMusicOpen = true;
          this.buttonText2 = "musicoff";
        }
      },
      sendVideoData(data) {
        return new Promise((resolve, reject) => {
          const deviceIP = "http://192.168.145.40:5001";
          uni.request({
            url: `${deviceIP}/video`,
            // 根据香橙派接收数据的接口路径
            method: "POST",
            data: { data },
            success: (res) => {
              if (res.statusCode === 200 && res.data && typeof res.data.receivedId === "number") {
                formatAppLog("log", "at pages/tabbar/tabbar-4/tabbar-4.vue:64", "数据发送成功", res);
                resolve(res.data.receivedId);
              } else {
                reject(new Error("Invalid response format"));
              }
            },
            fail: (err) => {
              formatAppLog("log", "at pages/tabbar/tabbar-4/tabbar-4.vue:71", "数据发送失败", err);
              reject(err);
            }
          });
        });
      },
      sendMusicData(data) {
        return new Promise((resolve, reject) => {
          const deviceIP = "http://192.168.145.40:5001";
          uni.request({
            url: `${deviceIP}/music`,
            // 根据香橙派接收数据的接口路径
            method: "POST",
            data: { data },
            success: (res) => {
              if (res.statusCode === 200 && res.data && typeof res.data.receivedId === "number") {
                formatAppLog("log", "at pages/tabbar/tabbar-4/tabbar-4.vue:87", "数据发送成功", res);
                resolve(res.data.receivedId);
              } else {
                reject(new Error("Invalid response format"));
              }
            },
            fail: (err) => {
              formatAppLog("log", "at pages/tabbar/tabbar-4/tabbar-4.vue:94", "数据发送失败", err);
              reject(err);
            }
          });
        });
      }
    }
  };
  function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "content" }, [
      vue.createElementVNode("view", null, [
        vue.createElementVNode(
          "button",
          {
            onClick: _cache[0] || (_cache[0] = (...args) => $options.toggleCamera && $options.toggleCamera(...args))
          },
          vue.toDisplayString($data.buttonText1),
          1
          /* TEXT */
        ),
        $data.isCameraOpen ? (vue.openBlock(), vue.createElementBlock("img", {
          key: 0,
          src: $data.cameraUrl,
          autoplay: "",
          controls: "",
          "default-src": ""
        }, null, 8, ["src"])) : vue.createCommentVNode("v-if", true)
      ]),
      vue.createElementVNode(
        "button",
        {
          onClick: _cache[1] || (_cache[1] = (...args) => $options.toggleMusic && $options.toggleMusic(...args))
        },
        vue.toDisplayString($data.buttonText2),
        1
        /* TEXT */
      ),
      $data.isMusicOpen ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 0,
        class: "music-list"
      }, [
        (vue.openBlock(true), vue.createElementBlock(
          vue.Fragment,
          null,
          vue.renderList($data.musicList, (item) => {
            return vue.openBlock(), vue.createElementBlock("button", {
              key: item,
              onClick: ($event) => $options.sendMusicData(item)
            }, "Item " + vue.toDisplayString(item), 9, ["onClick"]);
          }),
          128
          /* KEYED_FRAGMENT */
        ))
      ])) : vue.createCommentVNode("v-if", true)
    ]);
  }
  const PagesTabbarTabbar4Tabbar4 = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["render", _sfc_render$1], ["__file", "D:/HBuilder demo/test6/pages/tabbar/tabbar-4/tabbar-4.vue"]]);
  const _sfc_main$1 = {
    data() {
      return {
        title: "Hello",
        userInput: "",
        messages: [],
        accessToken: "24.85adc768db8083a9a7b9f00c7caa4685.2592000.1721902062.282335-87043351",
        // 已知的 access token
        scrollTop: 0
        // 用于控制 scroll-view 的滚动位置
      };
    },
    methods: {
      updateScrollTop() {
        this.$nextTick(() => {
          const query = uni.createSelectorQuery().in(this);
          query.select(".chat-container").boundingClientRect((rect) => {
            this.scrollTop = rect.height;
          }).exec();
        });
      },
      async sendMessage() {
        if (this.userInput.trim() === "")
          return;
        this.messages.push({ text: this.userInput, user: true });
        this.updateScrollTop();
        const userMessage = this.userInput;
        this.userInput = "";
        try {
          const response = await uni.request({
            url: `https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/ernie-speed-128k?access_token=${this.accessToken}`,
            method: "POST",
            header: {
              "Content-Type": "application/json"
            },
            data: {
              messages: [
                {
                  role: "user",
                  content: userMessage
                }
              ]
            }
          });
          const botResponse = response.data.result;
          this.messages.push({ text: botResponse, user: false });
          this.updateScrollTop();
        } catch (error) {
          formatAppLog("error", "at pages/tabbar/tabbar-5/tabbar-5.vue:49", "Error during API call:", error);
          this.messages.push({ text: "Error: Unable to communicate with the bot", user: false });
          this.updateScrollTop();
        }
      }
    }
  };
  function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "content" }, [
      vue.createElementVNode("scroll-view", {
        class: "chat-container",
        "scroll-y": "",
        "scroll-top": $data.scrollTop
      }, [
        (vue.openBlock(true), vue.createElementBlock(
          vue.Fragment,
          null,
          vue.renderList($data.messages, (message, index) => {
            return vue.openBlock(), vue.createElementBlock(
              "view",
              {
                key: index,
                class: vue.normalizeClass(["message", { "user-message": message.user }])
              },
              vue.toDisplayString(message.text),
              3
              /* TEXT, CLASS */
            );
          }),
          128
          /* KEYED_FRAGMENT */
        ))
      ], 8, ["scroll-top"]),
      vue.withDirectives(vue.createElementVNode(
        "textarea",
        {
          class: "input-box",
          "confirm-type": "send",
          "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $data.userInput = $event),
          onBlur: _cache[1] || (_cache[1] = (...args) => $options.sendMessage && $options.sendMessage(...args)),
          placeholder: "Type your message..."
        },
        null,
        544
        /* NEED_HYDRATION, NEED_PATCH */
      ), [
        [vue.vModelText, $data.userInput]
      ]),
      vue.createElementVNode("button", {
        class: "send-button",
        onClick: _cache[2] || (_cache[2] = (...args) => $options.sendMessage && $options.sendMessage(...args))
      }, "发送")
    ]);
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
