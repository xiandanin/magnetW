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
    <title>磁力搜 - 开源的磁力聚合搜索</title>
    <meta name="viewport"
          content="width=device-width,initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no"/>

    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/vant@2.0/lib/index.css">
    <script src="https://cdn.bootcss.com/vue/2.5.16/vue.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/vant@2.0/lib/vant.min.js"></script>
    <script src="https://cdn.bootcss.com/vue-resource/1.5.0/vue-resource.min.js"></script>
    <script src="resources/js/dist/vue-clipboard.min.js"></script>
    <script src="resources/js/dist/base64.min.js"></script>
    <link href="resources/css/mobile.css?v=1111" rel="stylesheet">
</head>
<body>
<div v-cloak id="app">
    <!--头-->
    <van-row class="header-row">
        <!--左边-->
        <van-col span="12">
            <template v-if="config.versionLink.length>0">
                <a :href="config.versionLink" target="_blank">当前版本 v{{config.versionName}}</a>
            </template>
            <template v-else>
                <a class="empty-a" href="/">当前版本 v{{config.versionName}}</a>
            </template>
        </van-col>
        <!--右边-->
        <van-col span="12" style="text-align: right">
            <a v-if="config.resultFilterEnabled" @click="showFilterDialog">自助屏蔽</a>
        </van-col>
    </van-row>
    <div class="search-header-container">
        <van-dropdown-menu class="search-header-dropdown" z-index="100">
            <van-dropdown-item @change="handleSortChanged" v-model="current.sort"
                               :title="getCurrentSortName()"
                               :options="sortBy">
            </van-dropdown-item>
        </van-dropdown-menu>
        <form action="/" class="search-header">
            <van-search :placeholder="config.searchPlaceholder" clearable
                        v-model="current.keyword"
                        @search="clickSearch"
                        show-action>
                <div slot="action" class="search-action" @click="clickSearch">搜索</div>
            </van-search>
        </form>
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

                        <div class="action-container">
                            <van-button v-clipboard:copy="it.magnet"
                                        v-clipboard:success="handleCopy" plain
                                        size="mini">复制
                            </van-button>
                            <van-button @click="clickMoreAction(it)" plain
                                        size="mini">更多
                            </van-button>
                        </div>
                    </div>
                </van-cell>
            </van-list>
        </div>
    </div>
    <div class="scroll-top-button" v-show="showTopButton">
        <van-icon @click="scrollTop" class="scroll-top-icon" name="arrow-up"/>
    </div>

    <van-popup id="action" v-model="status.popup.show" round>
        <div class="popup-title">更多操作</div>
        <van-cell-group>
            <van-cell title="磁力优化" @click="clickCopyAction"></van-cell>
            <van-cell title="小米路由" @click="clickMiWiFiAction"></van-cell>
            <van-cell title="源站详情" @click="clickDetailAction"></van-cell>
        </van-cell-group>
    </van-popup>

    <van-popup id="filter-dialog" v-model="filter.dialogVisible" round
               @confirm="requestSubmitFilter">
        <div class="popup-title">自助屏蔽</div>
        <div class="filter-message">{{filter.message}}</div>
        <van-field size="small" v-model="filter.keyword" clearable
                   :placeholder="filter.placeholder"></van-field>
        <div class="action">
            <van-button size="small" @click="filter.dialogVisible = false">取消</van-button>
            <van-button size="small" plain type="info" @click="requestSubmitFilter"
                        :loading="filter.loading">确定
            </van-button>
        </div>
    </van-popup>
</div>

<div v-if="config.busuanziEnabled">
    <script async
            src="//busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js">
    </script>
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

        //van-list需要的数据
        Vue.set(vue._data.status, 'vanlist', {
            finished: false,
            errorText: "加载失败",
        });

        //van-popup需要的数据
        Vue.set(vue._data.status, 'popup', {
            show: false,
            url: null,
            detail: null,
            miwifi: null
        });

        vue.getCurrentSortName = function () {
            for (let i = 0; i < sortBy.length; i++) {
                if (sortBy[i].value === vue._data.current.sort) {
                    return sortBy[i].text;
                }
            }
            return sortBy[0].text;
        };

        /**
         * 更多操作
         */
        vue.clickMoreAction = function (item) {
            vue._data.status.popup.url = this.formatTrackersUrl(item.magnet);
            vue._data.status.popup.detail = item.detailUrl;
            vue._data.status.popup.miwifi = this.formatMiWifiUrl(item.magnet);
            vue._data.status.popup.show = true;
        };

        /**
         * 复制
         */
        vue.clickCopyAction = function () {
            vue._data.status.popup.show = false;
            vue.$copyText(vue._data.status.popup.url).then(function (e) {
                vue.handleCopy()
            });
        };

        /**
         * 详情
         */
        vue.clickDetailAction = function () {
            vue._data.status.popup.show = false;
            window.open(vue._data.status.popup.detail);
        };

        /**
         * miwifi
         */
        vue.clickMiWiFiAction = function () {
            vue._data.status.popup.show = false;
            window.open(vue._data.status.popup.miwifi);
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
                type: type,
                duration: 800
            });
        };

        /**
         * 请求开始前的回调
         */
        vue.onRequestStarted = function () {
            vue._data.status.vanlist.error = false;
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