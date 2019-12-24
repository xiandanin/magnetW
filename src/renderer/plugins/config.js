import Vue from 'vue'

Vue.use({
  install: (Vue, options) => {
    const baseURL = 'https://magnetw.app'
    Vue.prototype.$config = {
      baseURL: baseURL,
      icons: {
        baseUrl: `${baseURL}/favicon`,
        extension: 'ico'
      },
      searchPlaceholder: ['火影忍者', '钢铁侠', '美国队长', '犬夜叉', '七龙珠', '奥特曼', '千与千寻', '你的名字。'],
      proxyDocURL: `${baseURL}/guide/proxy.html`,
      guide: {
        content: [
          {
            title: '常见问题',
            items: [
              {
                text: '使用指南',
                link: `${baseURL}/guide`
              },
              {
                text: '如何使用需要代理的源站',
                link: `${baseURL}/guide/proxy.html`
              },
              {
                text: '如何编辑源站列表',
                link: `${baseURL}/advanced/rule-setting.html`
              },
              {
                text: '搜索出现超时或错误',
                link: `${baseURL}/faq`
              },
              {
                text: '反馈失效与贡献源站',
                link: `${baseURL}/feedback`
              }
            ]
          },
          {
            title: '免责声明',
            items: [
              {
                text: '本应用仅用于爬虫技术交流学习，搜索结果均来自源站，更不会存储任何数据，亦不承担任何责任'
              }
            ]
          },
          {
            title: '注意事项',
            items: [
              {
                text: '本应用没有群组，其它地址分发的都有可能存在风险，请仔细辨别'
              }
            ]
          }
        ]
      },
      menu: [
        {
          index: 'doc',
          text: '文档中心',
          submenu: [
            {link: `${baseURL}`, text: '文档首页'},
            {link: `${baseURL}/guide`, text: '使用指南'},
            {link: `${baseURL}/advanced`, text: '进阶指南'}
          ]
        }
      ]
    }
  }
}
)
