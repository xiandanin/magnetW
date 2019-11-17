export default {
  install: (Vue, options) => {
    const data = {
      headerText: '本应用开源且免费，仅用于爬虫技术交流学习，搜索结果均来自源站，亦不承担任何责任',
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
            {link: 'https://magnetw.app/doc', text: '指南'},
            {link: 'https://magnetw.app/doc', text: '进阶'},
            {link: 'https://magnetw.app/doc', text: '常见问题'}
          ]
        }
      ],
      searchPlaceholder: '钢铁侠'
    }
    Vue.prototype.project = data
  }
}
