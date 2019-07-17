<%--
  Created by IntelliJ IDEA.
  Date: 2019/5/5
  Time: 17:57
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ page isELIgnored="false" %>
<html>
<head>
    <title>磁力搜</title>
    <meta name="viewport"
          content="width=device-width,initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no"/>

    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/vant@2.0/lib/index.css">
    <script src="https://cdn.bootcss.com/vue/2.5.16/vue.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/vant@2.0/lib/vant.min.js"></script>
    <script src="https://cdn.bootcss.com/vue-resource/1.5.0/vue-resource.min.js"></script>
    <script src="resources/js/dist/vue-clipboard.min.js"></script>
    <link href="resources/css/mobile.css" rel="stylesheet">
</head>
<body>
<div v-cloak id="app">
    <div>
        <van-cell style="padding-bottom: 0px">
            <template v-if="config.versionLink.length>0">
                <a :href="config.versionLink" target="_blank">当前版本 v{{config.versionName}}</a>
            </template>
            <template v-else>
                <a class="empty-a" href="/">当前版本 v{{config.versionName}}</a>
            </template>
        </van-cell>
    </div>
    <div class="search-header-container">
        <van-dropdown-menu class="search-header-dropdown" z-index="100">
            <van-dropdown-item @change="handleSortChanged" v-model="current.sort"
                               :title="getCurrentSortName()"
                               :options="sortBy">
            </van-dropdown-item>
        </van-dropdown-menu>
        <van-search class="search-header" :placeholder="config.searchPlaceholder" clearable
                    v-model="current.keyword"
                    show-action>
            <div slot="action" class="search-action" @click="clickSearch">搜索</div>
        </van-search>
    </div>
    <div>
        <van-tabs v-model="current.site" color="409EFF" @click="handleTabClick">
            <van-tab v-for="it in sourceSites" :title="it.site" :name="it.site"/>
        </van-tabs>
        <div>
            <van-list
                    :immediate-check="false"
                    :error.sync="status.vanlist.error"
                    offset="200"
                    v-model="loading"
                    :finished="status.vanlist.finished"
                    finished-text="没有更多了"
                    :error-text="status.vanlist.errorText"
                    @load="requestMagnetList"
            >
                <van-cell v-for="it in list"
                          :key="it" class="result-item">
                    <div>
                        <template
                                v-if="it.resolution!=null&&it.resolution.length>0">
                            <van-tag
                                    v-if="it.resolution.indexOf('720')>=0||it.resolution.indexOf('1080')>=0"
                                    disable-transitions color="409EFF"
                                    size="mini">{{it.resolution}}
                            </van-tag>
                            <van-tag
                                    v-else-if="it.resolution.indexOf('2')==0||it.resolution.indexOf('4')==0"
                                    disable-transitions
                                    type="success" size="mini">{{it.resolution}}
                            </van-tag>
                        </template>

                        <a v-if="status.clicks.indexOf(it.magnet)!=-1" class="visited-a"
                           :href="it.magnet"
                           v-html="it.nameHtml"></a>
                        <a v-else :href="it.magnet" @click="handleClickMagnet(it.magnet)"
                           v-html="it.nameHtml"></a>
                    </div>

                    <van-row>
                        <van-col span="10">
                            <span class="result-item-label">大小：{{it.formatSize}}</span>
                        </van-col>
                        <van-col v-show="it.hot!=null&&it.hot.length>0" span="8"><span
                                class="result-item-label">人气：{{it.hot}}</span>
                        </van-col>
                    </van-row>
                    <div class="result-item-date-container">
                        <div class="result-item-date">
                            <van-icon name="clock-o" class="result-item-label-icon"></van-icon>
                            <span class="result-item-label van-ellipsis">{{it.date}}</span>
                        </div>

                        <div style="text-align: right">
                            <div>
                                <van-button v-clipboard:copy="it.magnet+trackersString"
                                            v-clipboard:success="handleCopy" plain
                                            size="mini">优化链接
                                </van-button>

                                <a :href="it.detailUrl" target="_blank">
                                    <van-button plain size="mini">详情</van-button>
                                </a>
                            </div>
                        </div>
                    </div>
                </van-cell>
            </van-list>
        </div>
    </div>
    <div class="scroll-top-button" v-show="showTopButton">
        <van-icon @click="scrollTop" class="scroll-top-icon" name="arrow-up"/>
    </div>
</div>
</body>
<script>
    function onVueCreated(vue) {
        vue._data.config = ${config};
        vue._data.sourceSites = ${source_sites};
        vue._data.current = ${current};

        //转成van-dropdown要的格式
        let sortList = ${sort_by};
        let sortBy = [];
        for (let i = 0; i < sortList.length; i++) {
            sortBy.push({"text": sortList[i].sortName, "value": sortList[i].sort})
        }
        vue._data.sortBy = sortBy;

        Vue.set(vue._data.status, 'vanlist', {
            finished: false,
            errorText: "加载失败",
        });

        vue.getCurrentSortName = function () {
            for (let i = 0; i < sortBy.length; i++) {
                if (sortBy[i].value === vue._data.current.sort) {
                    return sortBy[i].text;
                }
            }
            return sortBy[0].text;
        };


        /************重写的回调************/


        /**
         * 弹出消息提示
         * @param message
         * @param type
         */
        vue.onToastMessage = function (message, type) {
            vue.$toast({
                message: message,
                type: type
            });
        };

        /**
         * 请求开始前的回调
         */
        vue.onRequestStarted = function () {
            if (vue._data.current.page <= 1) {
                vue._data.list = []
            }
        };

        /**
         * 请求失败的回调
         * @param message
         */
        vue.onRequestError = function (message) {
            vue._data.status.vanlist.error = true;
            vue._data.status.vanlist.errorText = message;
        };

        /**
         * 成功的回调
         * @param data
         */
        vue.onRequestSuccess = function (data) {
            if (data.results.length > 0) {
                if (data.current.page > 1) {
                    vue._data.list.push.apply(vue._data.list, data.results);
                } else {
                    vue._data.list = data.results
                }
                vue._data.current.page++;
            } else {
                vue._data.status.vanlist.finished = true
            }
        };
    }

</script>
<script src="resources/js/index.js"></script>
</html>