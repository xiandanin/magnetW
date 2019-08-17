[[中文文档]](https://github.com/dengyuhan/magnetW/wiki)
# 项目来源 dengyuhan/magnetW

Docker版一键部署：

```
docker run -d -p 3003:8080 --name=magnetw baiyuetribe/magnetw
```
然后访问：http://ip:3003即可进入

## 其它说明

> 该项目为java程序，docker镜像获取的是原作程序，无任何修改，需要自定义的请参考作者的config.md

卸载： `docker rm -f magnetw`

停止： `docker stop magnetw`

重启： `docker restart magnetw`


<hr>
## 简介
__磁力搜不收录磁力链接，只是磁力的搬运工__  
>
>网页版是[Mac版磁力搜](https://github.com/youusername/magnetX)的衍生项目  
>根据制定的解析规则，一套代码解析多个磁力网站的HTML，将各个网站不同格式的搜索结果统一格式化

## 示例站点
[https://bt.biedian.me](https://bt.biedian.me)

示例站点较不稳定，建议自行搭建，所用图标来自[iconfont](https://www.iconfont.cn)  

#### 示例站点环境参考
* [搬瓦工](https://bwh88.net/aff.php?aff=48595)
* [宝塔面板](https://www.bt.cn/?invite_code=MV9va2p0bmQ=)
* [Tomcat9](https://tomcat.apache.org/download-90.cgi)
* [JDK8](https://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html)


## 截图
<img src="screenshots/5.gif" height="320"/><img src="screenshots/9.gif" height ="320"/>

## 其它版本
> Mac版：[magnetX](https://github.com/youusername/magnetX)
> 
> 小程序：[magnetw-mini](https://github.com/dengyuhan/magnetw-mini)

## 其它说明
涉及本项目的文章或文档，请务必注明原项目出处

## 相关项目
[jsoup](https://github.com/jhy/jsoup)  
[HtmlCleaner](https://mvnrepository.com/artifact/net.sourceforge.htmlcleaner/htmlcleaner)
