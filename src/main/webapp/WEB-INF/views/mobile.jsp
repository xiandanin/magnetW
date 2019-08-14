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
    <meta name="robots" content="noarchive">
    <meta name="robots" conrent="noindex,follow">

    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/vant@2.0/lib/index.css">
    <script src="https://cdn.bootcss.com/vue/2.5.16/vue.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/vant@2.0/lib/vant.min.js"></script>
    <script src="https://cdn.bootcss.com/vue-resource/1.5.0/vue-resource.min.js"></script>
    <script src="https://cdn.bootcss.com/js-cookie/latest/js.cookie.min.js"></script>
    <script src="resources/js/dist/vue-clipboard.min.js"></script>
    <script src="resources/js/dist/base64.min.js"></script>
    <link href="resources/css/mobile.css" rel="stylesheet">
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
                        @clear="clickClearSearch"
                        v-model="current.keyword"
                        @search="clickSearch"
                        show-action>
                <div slot="action" class="search-action" @click="clickSearch">搜索</div>
            </van-search>
        </form>
    </div>
    <!--选项-->
    <van-row class="option-row">
        <!--左边-->
        <van-col span="12" class="option-left">
            <a v-if="config.reportEnabled" @click="showReportDialog">自助举报</a>
        </van-col>
        <!--右边-->
        <van-col span="12" class="option-right">
            <div class="remember-source">
                <van-checkbox icon-size="14px" v-model="setting.memoryChoice"
                              @change="onChangeMemoryChoice">
                    记住上次选择的源站
                </van-checkbox>
            </div>
        </van-col>
    </van-row>
    <div v-show="successMessage" class="result-success-message">{{successMessage}}</div>
    <div>
        <van-tabs v-model="current.site" color="#409EFF" @click="handleTabClick">
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
            <van-cell title="文件列表" @click="clickFilesAction"
                      v-show="rule&&rule.detail"></van-cell>
            <van-cell title="源站详情" @click="clickDetailAction"></van-cell>
            <van-cell title="举报资源" v-if="config.reportEnabled"
                      @click="clickReportAction"></van-cell>
        </van-cell-group>
    </van-popup>

    <van-popup id="filter-dialog" v-model="filter.dialogVisible" round
               @confirm="requestReport">
        <div class="popup-title">自助举报</div>
        <div class="filter-message">{{filter.message}}</div>
        <van-field size="small" v-model="filter.value" clearable
                   :placeholder="filter.placeholder"></van-field>
        <div class="action">
            <van-button size="small" @click="filter.dialogVisible = false">取消</van-button>
            <van-button size="small" plain type="info" @click="requestReport"
                        :loading="filter.loading">确定
            </van-button>
        </div>
    </van-popup>

    <van-popup
            v-model="detail.show"
            round
            style="width:80%;max-height: 80% ">
        <div class="popup-title">文件列表</div>
        <van-loading class="detail-popup-loading" color="#1989fa"
                     v-show="detail.loading"></van-loading>
        <van-cell
                class="detail-file-item"
                v-for="it in detail.rsp.files"
                :key="it"
                :title="it"
        ></van-cell>
        <div class="detail-popup-error" v-show="!detail.rsp.files&&detail.errorMessage">
            {{detail.errorMessage}}
        </div>
    </van-popup>
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
            item: {}
        });

        vue.getCurrentSortName = function () {
            for (let i = 0; i < sortBy.length; i++) {
                if (sortBy[i].value === vue._data.current.sort) {
                    return sortBy[i].text;
                }
            }
            return sortBy[0].text;
        };

        vue.clickClearSearch = function () {
            vue._data.current.keyword = "";
        };

        /**
         * 更多操作
         */
        vue.clickMoreAction = function (item) {
            vue._data.status.popup.show = true;
            vue._data.status.popup.item = item;
        };

        /**
         * 复制
         */
        vue.clickCopyAction = function () {
            vue._data.status.popup.show = false;
            let url = vue.formatTrackersUrl(vue._data.status.popup.item.magnet);
            vue.$copyText(url).then(function (e) {
                vue.handleCopy()
            });
        };

        /**
         * 详情
         */
        vue.clickDetailAction = function () {
            vue._data.status.popup.show = false;
            window.open(vue._data.status.popup.item.detailUrl);
        };

        /**
         * miwifi
         */
        vue.clickMiWiFiAction = function () {
            vue._data.status.popup.show = false;
            window.open(vue.formatMiWifiUrl(vue._data.status.popup.item.magnet));
        };

        /**
         * 文件列表
         */
        vue.clickFilesAction = function () {
            vue._data.status.popup.show = false;
            vue.handleLazyLoadDetail(vue._data.status.popup.item);
        };

        /**
         * 举报资源
         */
        vue.clickReportAction = function () {
            vue._data.status.popup.show = false;
            vue.showReportDialog(vue._data.status.popup.item);
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
                duration: 1000
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
        vue.onRequestSuccess = function (rsp) {
            let data = rsp.data;
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
            if (vue._data.config.resultToast) {
                vue.$toast({
                    position: 'top',
                    message: rsp.message,
                    duration: 1000
                });
            }
        }
    }

</script>
<script src="resources/js/index.js"></script>
</html>