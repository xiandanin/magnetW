<%--
  Created by IntelliJ IDEA.
  Date: 2018/3/7
  Time: 14:18
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ page isELIgnored="false" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn" %>
<html>
<head>
    <%--<c:set var="contextpath" value="http://asset.dyhdyh.com/resources/magnetw"></c:set>--%>
    <c:set var="contextpath" value="resources"></c:set>
    <title>磁力搜</title>
    <meta name="viewport"
          content="width=device-width,initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no"/>

    <link href="http://cdn.bootcss.com/bootstrap/3.3.7/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdn.bootcss.com/element-ui/2.3.7/theme-chalk/index.css" rel="stylesheet">
    <link href="https://cdn.bootcss.com/amazeui/2.7.2/css/amazeui.min.css" rel="stylesheet">
    <link href="${contextpath}/css/base.css" rel="stylesheet">
    <link href="${contextpath}/css/search_result.css" rel="stylesheet">

    <script src="https://cdn.bootcss.com/vue/2.5.16/vue.min.js"></script>
    <script src="https://cdn.bootcss.com/vue-resource/1.5.0/vue-resource.min.js"></script>
    <script src="https://cdn.bootcss.com/element-ui/2.3.7/index.js"></script>
    <script src="${contextpath}/js/dist/vue-clipboard.min.js"></script>
</head>
<body>
<div class="container" style="margin-top: 2%" id="app">
    <el-container>
        <el-header style="height: 30px">
            <div style="text-align: right">
                <span style="float: left">当前版本：v1.1.8</span>
            </div>
        </el-header>
        <el-main>
            <div v-loading.fullscreen.lock="fullscreenLoading"
                 class="container-margin-bottom">
                <div id="search-input-container">
                    <el-input :placeholder="searchPlaceholder" class="input-with-select"
                              @keyup.enter.native="clickSearch"
                              v-model="inputSearch">
                        <el-button slot="append" icon="el-icon-search" @click="clickSearch">
                            搜索
                        </el-button>
                    </el-input>
                </div>
                <div class="search_site">
                    <el-row type="flex">

                        <el-col :span="20">
                            <el-radio-group v-model="currentSourceSite" @change="handleTabClick">
                                <el-radio-button :label="item" v-for="item in sourceSites">{{item}}
                                </el-radio-button>
                            </el-radio-group>
                        </el-col>

                        <el-col :span="4">
                            <div>
                                <el-select v-model="currentSortOptions" placeholder="排序"
                                           @change="handleSortChanged">
                                    <el-option
                                            v-for="item in sortOptions"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value">
                                    </el-option>
                                </el-select>
                            </div>
                        </el-col>
                    </el-row>
                </div>
                <div v-loading="loading" style="min-height: 40%">
                    <template v-if="response.results != null">
                        <el-table
                                ref="tableWrapper"
                                size="mini"
                                :data="response.results"
                                border
                                style="width: 100%">
                            <el-table-column
                                    width="60"
                                    type="index">
                            </el-table-column>
                            <el-table-column
                                    label="名称">
                                <template slot-scope="scope">
                                    <a :href="scope.row.magnet" v-html="scope.row.nameHtml"></a>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    width="120"
                                    :sortable="false"
                                    label="大小"
                                    sort-by="size"
                                    prop="formatSize">
                            </el-table-column>
                            <el-table-column
                                    width="120"
                                    label="清晰度"
                                    prop="resolution">
                            </el-table-column>
                            <el-table-column
                                    label="发布时间"
                                    width="200"
                                    prop="count">
                            </el-table-column>
                            <el-table-column
                                    label="操作"
                                    align="center"
                                    width="160">
                                <template slot-scope="scope">
                                    <el-button size="mini"
                                               type="button"
                                               v-clipboard:copy="scope.row.magnet"
                                               v-clipboard:success="onCopy">复制
                                    </el-button>
                                    <a :href="scope.row.detailUrl" target="_blank">
                                        <el-button size="mini"
                                                   type="button">详情
                                        </el-button>
                                    </a>
                                </template>
                            </el-table-column>
                        </el-table>
                        <el-button type="primary" :loading="loadMoreLoading" style="width: 100%"
                                   v-on:click="requestMagnetList"
                                   v-show="isShowLoadMore">
                            {{loadingBtnMessage}}
                        </el-button>
                    </template>
                </div>
                <div v-show="response.errorMessage!=null" style="text-align: center">
                    <h2>{{response.errorMessage}}</h2>
                </div>
            </div>

        </el-main>
    </el-container>

    <div id="page-component-up" style="" @click="scrollTop" v-show="showTopButton"><i
            class="el-icon-caret-top"></i></div>
</div>
</body>

<script>
    Vue.http.options.timeout = 20000;
    new Vue({
        el: '#app',
        data: {
            fullscreenLoading: false,
            loading: false,
            loadMoreLoading: false,
            showTopButton: false,
            loadingBtnMessage: "点击加载更多",
            isShowLoadMore: false,
            currentSourceSite: "",
            searchPlaceholder: "钢铁侠",
            inputSearch: "",
            requestPageNumber: 1,
            currentSortOptions: "default",

            sourceSites: [],
            response: {},
            sortOptions: [
                {
                    value: "default",
                    label: "默认排序"
                }, {
                    value: "size",
                    label: "文件大小"
                }
            ],
        },
        mounted: function () {
            window.addEventListener('scroll', this.onScrollTopButtonState);  //滚动事件监听
            this.initMagnetPage()
        },
        methods: {
            handleTabClick(tab) {
                this.currentSourceSite = tab
                this.requestPageNumber = 1
                if (this.inputSearch != null && this.inputSearch != '') {
                    this.clickSearch()
                }
            },
            handleSortClick(command) {
                console.log(command)
            },
            clickSearch() {
                this.loading = true
                this.requestPageNumber = 1
                if (this.inputSearch == null || this.inputSearch == '') {
                    this.inputSearch = this.searchPlaceholder
                }
                this.response.results = null
                this.requestMagnetList()
            },
            initMagnetPage: function () {
                this.fullscreenLoading = true;
                this.$http.get("api/source-site")
                    .then(function (response) {
                        this.fullscreenLoading = false;
                        Vue.set(this, "sourceSites", response.body)
                        if (this.sourceSites.length > 0) {
                            this.currentSourceSite = this.sourceSites[0];
                        }
                    })
                    .catch(function (response) {
                        this.fullscreenLoading = false;
                        this.errorMessage()
                        console.log("error->" + response)
                    });
            }, handleSortChanged: function (value) {
                console.log(value)
                this.currentSortOptions = value
                this.clickSearch()
            },
            requestMagnetList: function () {
                var sourceSite = this.currentSourceSite
                var keyword = this.inputSearch;

                var page = this.requestPageNumber
                var sort = this.currentSortOptions

                console.log(sourceSite + " " + keyword + " " + page)

                this.loadMoreLoading = true
                this.loadingBtnMessage = "正在加载下一页"
                this.$http.post("api/search", {
                    source: sourceSite,
                    keyword: keyword,
                    page: page,
                    sort: sort
                }, {emulateJSON: true})
                    .then(function (response) {
                        Vue.set(this, "response.errorMessage", response.body.errorMessage)
                        if (response.body.currentSourceSite != null && response.body.currentSourceSite != '' && response.body.currentSourceSite != undefined && this.currentSourceSite != response.body.currentSourceSite) {
                            return
                        }

                        this.loading = false
                        this.loadMoreLoading = false
                        this.loadingBtnMessage = "点击加载更多"
                        this.isShowLoadMore = response.body.results !== null && response.body.results !== undefined && response.body.results.length > 0

                        if (response.body.currentPage <= 1) {
                            this.requestPageNumber++
                            Vue.set(this, "response", response.body)
                        } else {
                            if (this.isShowLoadMore) {
                                this.requestPageNumber++
                                this.response.results.push.apply(this.response.results, response.body.results)
                            }
                        }
                        //console.log(this.response.results)
                    })
                    .catch(function (response) {
                        this.loading = false
                        this.loadMoreLoading = false
                        this.loadingBtnMessage = "加载失败 点击重试"
                        console.log('error', response)
                        this.errorMessage()
                    });
            },
            openDisclaimerDialog: function () {
                this.$alert('本网站作为开源项目示例，仅用于技术交流学习，用户使用本工具进行的任何操作，本服务器均不保存。<br/><br/>' +
                    '本网站不会存储，不能分享，也不提供任何传播信息与资源的功能, 对此工具的非法使用概不负责。', '免责声明', {
                    dangerouslyUseHTMLString: true,
                    confirmButtonText: '确定',
                    callback: action => {

                    }
                });
            },
            onCopy: function (e) {
                this.$message({
                    message: '复制成功',
                    type: 'success'
                });
            },
            errorMessage: function () {
                this.$message({
                    showClose: true,
                    message: '加载失败',
                    type: 'error'
                });
            },
            sortSize(a, b) {
                console.log(parseFloat(a.size))
                return true;
            },
            scrollTop() {
                document.body.scrollTop = 0;
            },
            onScrollTopButtonState() {
                let curHeight = document.documentElement.scrollTop || document.body.scrollTop;
                let viewHeight = document.body.clientHeight;
                if (curHeight > viewHeight / 3) {
                    this.showTopButton = true;
                } else {
                    this.showTopButton = false;
                }
            }
        }
    })
</script>
</html>