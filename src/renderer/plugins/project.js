export default {
  install: (Vue, options) => {
    const data = {
      icons: {
        baseUrl: 'https://magnetw.app/favicon',
        extension: 'ico'
      },
      menu: [
        {
          index: 'doc',
          link: 'https://magnetw.app',
          text: '文档',
          submenu: [
            {link: 'https://magnetw.app/doc', text: '使用指南'},
            {link: 'https://magnetw.app/doc', text: '进阶指南'},
            {link: 'https://magnetw.app/doc', text: '常见问题'}
          ]
        }
      ],
      searchPlaceholder: '钢铁侠',
      guide: {
        content: [
          {
            title: '常见问题',
            items: [
              {
                text: '使用指南',
                link: 'https://magnetw.app/guide'
              },
              {
                text: '如何添加源站',
                link: 'https://magnetw.app/guide'
              },
              {
                text: '如何使用需要代理的源站',
                link: 'https://magnetw.app/guide'
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
          }
        ]
      }
    }
    Vue.prototype.project = data
  }
}
