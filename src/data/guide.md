# 规则采集
对源站的规则采集有[自动采集](#自动采集)和[手动采集](#手动采集)两种方式

## 自动采集
自动采集需要使用[Tampermonkey](http://www.tampermonkey.net/)脚本 — [磁力搜自动采集](https://github.com/dengyuhan/LardMonkeyScripts#%E7%A3%81%E5%8A%9B%E6%90%9C%E8%87%AA%E5%8A%A8%E9%87%87%E9%9B%86)。

打开浏览器的`开发人员工具`，进入到源站搜索页，右上角会多一个采集按钮，可以分析页面并在控制台打印出所有版本的解析规则。

自动采集已经包含大部分字段，部分字段（如：`name`、`icon`、`proxy`等）还需根据实际情况手动调整。

<img src="/images/auto_xpath.gif" width="600"/>

>如果自动采集的结果无法正常使用，那么就需要[手动采集](#手动采集)
>
>也可以[反馈Bug](https://github.com/dengyuhan/LardMonkeyScripts/issues/new)，帮助提高分析的准确性


## 手动采集
以磁力果为例，先定义`源站信息`

* `id`&emsp;&emsp;需要是整个规则文件唯一的，`ciliguo `
* `name`&emsp;源站的名称，`磁力果`
* `url`&ensp;&emsp;首页地址，`https://ciliguo.cc`
* `icon`&emsp;这里使用源站图标url，`https://ciliguo.cc/favicon.ico`
* `proxy`&ensp;此源站需要代理，`true`
* `paths`&ensp;获取到完整的搜索地址，将**关键词**和**页码**替换为变量，去掉域名部分，作为默认排序，那么就是`preset : /search?q={k}&p={p}`

<img src="/images/rule_2.jpg" width="300"/>

那么`源站信息`部分的JSON如下：

```
{
  "id": "ciliguo",
  "name": "磁力果",
  "url": "https://ciliguo.cc",
  "icon": "https://ciliguo.cc/favicon.ico",
  "proxy": true,
  "paths": {
    "preset": "/search?q={k}&p={p}"
  }
}
```

打开`开发人员工具`进入搜索页面，定位到单个条目的最外层节点，复制XPath得到`//*[@id="__layout"]/div/div[1]/div[2]/div[1]/div/div[1]`，作为**group的原始表达式**。

可以看到节点的`class`为`card mb-4`，那么可以优化为`//div[@class=\"card mb-4\"]`，作为**最终使用的`group`表达式**。

<img src="/images/rule_3.jpg" width="600"/>

定位到`名称`节点，得到完整XPath`//*[@id="__layout"]/div/div[1]/div[2]/div[1]/div/div[1]/div[1]/div[1]/a/span`，但这里只需要名称部分，所以还需要删掉**group的原始表达式**，加上路径符`./`，那么`name`的表达式就是`./div[1]/div[1]/a`

<img src="/images/rule_4.jpg" width="600"/>

其它字段也使用同样的操作获得


所以最终的规则如下：
```
{
  "id": "ciliguo",
  "name": "磁力果",
  "url": "https://ciliguo.cc",
  "icon": "https://ciliguo.cc/favicon.ico",
  "proxy": true,
  "paths": {
    "preset": "/search?q={k}&p={p}"
  },
  "xpath": {
    "group": "//div[@class=\"card mb-4\"]",
    "magnet": "./div[1]/div[2]/div/button[1]/@data-src",
    "name": "./div[1]/div[1]/a",
    "size": "./div[2]/div/div[1]/small[2]/span",
    "date": "./div[2]/div/div[1]/small[1]/span",
    "hot": "./div[2]/div/div[1]/small[3]/span",
    "detail": {
      "files": "//div[@class=\"card mt-4 mb-4 card-info\"]/div[2]/div[1]/div/div[1]/span"
    }
  }
}
```
