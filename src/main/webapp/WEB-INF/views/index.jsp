<%--
  Created by IntelliJ IDEA.
  Date: 2019/5/5
  Time: 17:57
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ page isELIgnored="false" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<html>
<head>
    <title>磁力搜</title>
    <meta name="viewport"
          content="width=device-width,initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no"/>

    <link href="https://cdn.bootcss.com/element-ui/2.3.7/theme-chalk/index.css" rel="stylesheet">
    <link href="https://cdn.bootcss.com/amazeui/2.7.2/css/amazeui.min.css" rel="stylesheet">

    <script src="https://cdn.bootcss.com/vue/2.5.16/vue.min.js"></script>
    <script src="https://cdn.bootcss.com/vue-resource/1.5.0/vue-resource.min.js"></script>
    <script src="https://cdn.bootcss.com/element-ui/2.3.7/index.js"></script>
    <script src="/resources/js/dist/vue-clipboard.min.js"></script>
    <link href="/resources/css/search_result.css" rel="stylesheet">
</head>
<body>
<div style="width: 1080px;margin: 2% auto auto auto" id="app">
    <el-container>
        <!--头-->
        <el-header style="height: 30px">
            <div style="text-align: right">
                <span style="float: left">
                    <c:choose>
                        <c:when test="${config.versionLink.length()>0}">
                            <a href="${config.versionLink}">当前版本 v${config.versionName}</a>
                        </c:when>
                        <c:otherwise>
                            <a>当前版本 v${config.versionName}</a>
                        </c:otherwise>
                    </c:choose>
                </span>
            </div>
        </el-header>

        <!--内容-->
        <el-main>
            <div>
                <div id="search-input-container">
                    <el-input :placeholder="searchPlaceholder" class="input-with-select"
                              @keyup.enter.native="clickSearch"
                              v-model="current.keyword">
                        <el-button slot="append" icon="el-icon-search" @click="clickSearch">
                            搜索
                        </el-button>
                    </el-input>
                </div>

                <!--源站列表-->
                <div class="search_site">
                    <el-tabs type="card" v-model="current.site"
                             @tab-click="handleTabClick">
                        <c:forEach var="it" items="${source_sites}">
                            <el-tab-pane label="${it.site}"
                                         key="${it.site}"
                                         name="${it.site}">
                            </el-tab-pane>
                        </c:forEach>
                    </el-tabs>
                </div>

                <!--列表-->
                <div v-loading="loading" id="table-container">
                    <div v-cloak v-show="list != null&&list.length>0">
                        <div style="margin-bottom: 2%">
                            <el-row>
                                <el-col :span="6">
                                    <div class="grid-content bg-purple-dark"></div>
                                    <el-select v-model="current.sort" placeholder="排序"
                                               size="small"
                                               @change="handleSortChanged">
                                        <c:forEach var="it" items="${sort_by}">
                                            <el-option key="${it.sort}"
                                                       label="${it.sortName}"
                                                       value="${it.sort}">
                                            </el-option>
                                        </c:forEach>
                                    </el-select>
                                </el-col>

                                <el-col :span="18">
                                    <div style="text-align: right;">
                                        <div class="el-pagination is-background">
                                            <button type="button" class="btn-prev"
                                                    @click="handlePageChanged(current.page-1)"><i
                                                    class="el-icon el-icon-arrow-left"></i></button>
                                            <ul class="el-pager">
                                                <!--最多只显示4个页码-->
                                                <template
                                                        v-for="n in current.page>4?4:current.page-1">
                                                    <li class="number"
                                                        @click="handlePageChanged(n)">{{n}}
                                                    </li>
                                                </template>
                                                <template v-if="current.page>4">
                                                    <li class="el-icon more btn-quickprev el-icon-more" @click="handlePageChanged(current.page-1)"></li>
                                                </template>
                                                <li class="number active">{{current.page}}
                                                </li>
                                            </ul>
                                            <button type="button" class="btn-next"
                                                    @click="handlePageChanged(current.page+1)">
                                                <i class="el-icon el-icon-arrow-right"></i>
                                            </button>
                                        </div>
                                    </div>
                                </el-col>
                            </el-row>
                        </div>
                        <el-table
                                :empty-text="message"
                                ref="tableWrapper"
                                size="mini"
                                :data="list"
                                border
                                style="width: 100%">
                            <el-table-column
                                    width="60"
                                    type="index">
                            </el-table-column>
                            <el-table-column
                                    min-width="150"
                                    label="名称">
                                <template slot-scope="scope">
                                    <a :href="scope.row.magnet" @click="handleClickMagnet"
                                       v-html="scope.row.nameHtml"></a>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    width="90"
                                    label="清晰度"
                                    prop="resolution">
                            </el-table-column>
                            <el-table-column
                                    width="120"
                                    label="大小"
                                    prop="formatSize">
                            </el-table-column>
                            <el-table-column
                                    width="100"
                                    label="人气"
                                    prop="hot">
                            </el-table-column>
                            <el-table-column
                                    label="发布时间"
                                    width="130"
                                    prop="date">
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
                        <div style="text-align: right;margin-top: 2%">
                            <div class="el-pagination is-background">
                                <button type="button" class="btn-prev"
                                        @click="handlePageChanged(current.page-1)"><i
                                        class="el-icon el-icon-arrow-left"></i></button>
                                <ul class="el-pager">
                                    <!--最多只显示3个页码-->
                                    <template
                                            v-for="n in current.page>3?3:current.page-1">
                                        <li class="number"
                                            @click="handlePageChanged(n)">{{n}}
                                        </li>
                                    </template>
                                    <template v-if="current.page>3">
                                        <li class="el-icon more btn-quickprev el-icon-more"></li>
                                    </template>
                                    <li class="number active">{{current.page}}
                                    </li>
                                </ul>
                                <button type="button" class="btn-next"
                                        @click="handlePageChanged(current.page+1)">
                                    <i class="el-icon el-icon-arrow-right"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div id="message" v-cloak
                         v-show="(list == null||list.length<=0)&&message!=null&&message.length>0">
                        <h2 style="font-weight: lighter">{{message}}</h2>
                    </div>
                </div>


                <!--不蒜子统计-->
                <div id="busuanzi" style="display: none">
                    <c:if test="${config.busuanziEnabled}">
                        <script async
                                src="//busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js">
                        </script>
                        <c:if test="${config.busuanziShow}">
                            <div class="busuanzi">
                                <span id="busuanzi_title">流量统计</span> |
                                <span id="busuanzi_container_site_pv">
    总访问量[<span id="busuanzi_value_site_pv"></span>]
</span> | <span id="busuanzi_container_site_uv">
  总访客数[<span id="busuanzi_value_site_uv"></span>]
</span>
                            </div>
                        </c:if>
                    </c:if>
                </div>
            </div>

        </el-main>
    </el-container>
    <div id="page-component-up" @click="scrollTop" v-cloak v-show="showTopButton"><i
            class="el-icon-caret-top"></i></div>
</div>
</body>
<script>
    Vue.http.options.timeout = 20000;
    new Vue({
        el: '#app',
        data: {
            showTopButton: false,
            searchPlaceholder: "${config.searchPlaceholder}",
            message: null,
            loading: false,
            list: [],
            current: {
                site: "${current.site}",
                keyword: "${current.keyword}",
                sort: "${current.sort}",
                page: ${current.page},
            }
        },
        mounted: function () {
            var busuanzi = document.getElementById("busuanzi");
            if (busuanzi != null && busuanzi !== undefined) {
                setTimeout(function () {
                    busuanzi.style.display = "block"
                }, 400);
            }
            
            window.addEventListener('scroll', this.onScrollTopButtonState);

            if (this.current.keyword != null && this.current.keyword.length > 0) {
                this.requestMagnetList()
            }
        },
        methods: {
            getParamsString() {
                let keywordString = "";
                if (this.current.keyword != null && this.current.keyword.length > 0) {
                    keywordString = "?k=" + this.current.keyword + "&s=" + this.current.sort + "&p=" + this.current.page;
                }
                return keywordString
            },
            redirectSearch() {
                let keywordString = "";
                if (this.current.keyword != null && this.current.keyword.length > 0) {
                    keywordString = "?k=" + this.current.keyword;
                }
                window.location.href = "/search/" + this.current.site + keywordString
            },
            /**
             * 刷新地址栏地址
             */
            updateAddress() {
                let host = window.location.protocol + "//" + window.location.host;
                let url = host + "/search/" + this.current.site + this.getParamsString();
                history.replaceState(0, document.title, url);
            },
            handleTabClick(tab) {
                this.redirectSearch()
            },
            clickSearch() {
                this.current.page = 1;
                if (this.current.keyword == null || this.current.keyword === '') {
                    this.current.keyword = this.searchPlaceholder
                }
                this.requestMagnetList(true)
            },
            handlePageChanged(page) {
                if (page <= 0) {
                    return
                }
                this.current.page = page;
                this.requestMagnetList(true)
            },
            handleSortChanged(sort) {
                this.current.sort = sort;
                this.requestMagnetList(true)
            },
            handleClickMagnet(a) {
                a.target.className = "visited-a"
            },
            /**
             * 请求列表
             * @param updateAddr 是否刷新地址栏
             */
            requestMagnetList(updateAddr) {
                if (this.current.keyword != null && this.current.keyword.length > 0) {

                    //修改地址栏参数
                    if (updateAddr) {
                        this.updateAddress()
                    }

                    var that = this;
                    this.request(this.$http.get("/api/search", {
                            params: {
                                source: this.current.site,
                                keyword: this.current.keyword,
                                page: this.current.page,
                                sort: this.current.sort
                            }
                        }, {emulateJSON: true})
                        , function (rsp) {
                            that.list = rsp.results;

                            if (that.list.length <= 0) {
                                that.message = "什么也没搜到"
                            }
                        });
                }
            },
            onCopy: function (e) {
                this.$message({
                    message: '复制成功',
                    type: 'success'
                });
            },
            onScrollTopButtonState() {
                let viewHeight = document.body.clientHeight;
                let curHeight = document.body.scrollTop;
                this.showTopButton = curHeight > viewHeight / 10;
            },
            scrollTop() {
                document.body.scrollTop = 0;
            },
            /**
             * 成功处理
             */
            request(http, success) {
                this.loading = true;
                http.then(function (response) {
                    this.loading = false;
                    this.handeResponse(response, success)
                }).catch(function (error) {
                    this.loading = false;
                    this.handleError(error)
                });
            },
            /**
             * 成功处理
             */
            handeResponse(response, callback) {
                if (response.body.success) {
                    //console.log(JSON.stringify(response.body.data));
                    callback(response.body.data)
                } else {
                    this.handleError(response)
                }
            },
            /**
             * 异常处理
             */
            handleError(error) {
                console.log(error);
                this.message = error.body.message;
            }
        }
    })
</script>
</html>