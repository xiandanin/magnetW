export default {
  install: (Vue, options) => {
    const baseURL = 'https://magnetw.app'
    Vue.prototype.project = {
      baseURL: baseURL,
      icons: {
        baseUrl: `${baseURL}/favicon`,
        extension: 'ico'
      },
      menu: [
        {
          index: 'doc',
          text: '文档',
          submenu: [
            {link: `${baseURL}`, text: '文档首页'},
            {link: `${baseURL}/guide`, text: '使用指南'},
            {link: `${baseURL}/advanced`, text: '进阶指南'}
          ]
        }
      ],
      searchPlaceholder: '火影忍者',
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
                text: '如何编辑源站列表',
                link: `${baseURL}/advanced/rule-setting.html`
              },
              {
                text: '如何使用需要代理的源站',
                link: `${baseURL}/guide/proxy.html`
              }
            ]
          },
          {
            title: '免责声明',
            items: [
              {
                text: '本应用开源且免费，仅用于爬虫技术交流学习，搜索结果均来自源站，亦不承担任何责任'
              }
            ]
          },
          {
            title: '注意事项',
            items: [
              {
                text: '本应用没有群组，代码托管只有Github，其它地址分发的都有可能存在风险，请仔细辨别'
              }
            ]
          }
        ]
      },
      proxyDocURL: `${baseURL}/guide/proxy.html`,
      checkUpdateURL: `${baseURL}/update.json`
    }
  }
}
