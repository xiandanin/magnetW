module.exports = {
  title: 'magnetW',
  description: '磁力链接聚合搜索',
  themeConfig: {
    logo: '/logo.png',
    nav: [
      {text: 'Home', link: '/'},
      {text: 'Guide', link: '/guide/'},
      {
        text: '选择语言',
        items: [
          {text: 'Chinese', link: '/language/chinese'},
          {text: 'Japanese', link: '/language/japanese'}
        ]
      },
      {text: 'Github', link: 'https://github.com/dengyuhan/magnetW'},
    ],
    sidebar: [
      {
        title: 'Group 1',
        children: [
          '/'
        ]
      },
      {
        title: 'Group 2',
        children: [ /* ... */]
      }
    ],
    displayAllHeaders: true // 默认值：false
  }
}
