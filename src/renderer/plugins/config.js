import Vue from 'vue'

Vue.use({
    install: (Vue, options) => {
      const baseURL = 'https://magnetw.app'
      Vue.prototype.$config = {
        baseURL: baseURL,
        docURL: `${baseURL}/guide`,
        icons: {
          baseUrl: `${baseURL}/favicon`,
          extension: 'ico'
        },
        searchPlaceholder: ['火影忍者', '钢铁侠', '美国队长', '犬夜叉', '七龙珠', '奥特曼', '千与千寻', '你的名字。'],
        proxyDocURL: `${baseURL}/guide/proxy.html`,
        guide: {
          content: [
          ]
        },
        menu: [
        ]
      }
    }
  }
)
