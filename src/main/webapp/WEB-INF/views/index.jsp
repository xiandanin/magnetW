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

    <link href="https://cdn.bootcss.com/element-ui/2.3.7/theme-chalk/index.css" rel="stylesheet">
    <link href="https://cdn.bootcss.com/amazeui/2.7.2/css/amazeui.min.css" rel="stylesheet">

    <script src="https://cdn.bootcss.com/vue/2.5.16/vue.min.js"></script>
    <script src="https://cdn.bootcss.com/vue-resource/1.5.0/vue-resource.min.js"></script>
    <script src="https://cdn.bootcss.com/element-ui/2.3.7/index.js"></script>
    <script src="resources/js/dist/vue-clipboard.min.js"></script>
    <script src="resources/js/dist/base64.min.js"></script>
    <link href="resources/css/index.css" rel="stylesheet">
</head>
<body>
<div v-cloak style="min-width: 1080px;padding: 2% 7%;" id="app">
    <el-container>
        <!--头-->
        <el-header style="height: 30px;">
            <div style="text-align: right">
                <span style="float: left">
                 <template v-if="config.versionLink.length>0">
                     <a :href="config.versionLink" target="_blank">当前版本 v{{config.versionName}}</a>
                 </template>
                 <template v-else>
                     <a class="empty-a" href="/">当前版本 v{{config.versionName}}</a>
                 </template>
                </span>
            </div>
        </el-header>

        <!--内容-->
        <el-main>
            <div>
                <div id="search-input-container">
                    <el-input :placeholder="config.searchPlaceholder"
                              autocomplete="on"
                              @keyup.enter.native="clickSearch"
                              v-model="current.keyword">
                        <template slot="append">
                            <el-button icon="el-icon-search" @click="clickSearch">搜索</el-button>
                        </template>
                    </el-input>
                </div>

                <!--源站列表-->
                <div class="search_site">
                    <!--少于11个就用正常尺寸-->
                    <el-tabs v-if="sourceSites.length<=11" type="card" v-model="current.site"
                             @tab-click="handleTabClick">
                        <el-tab-pane v-for="it in sourceSites"
                                     :label="it.site"
                                     :key="it.site"
                                     :name="it.site">
                        </el-tab-pane>
                    </el-tabs>
                    <el-tabs v-else type="card" v-model="current.site" class="el-tab-small"
                             @tab-click="handleTabClick">
                        <el-tab-pane v-for="it in sourceSites"
                                     :label="it.site"
                                     :key="it.site"
                                     :name="it.site">
                        </el-tab-pane>
                    </el-tabs>
                </div>

                <!--列表-->
                <div v-loading="loading" id="table-container">
                    <div v-show="list != null&&list.length>0">
                        <div style="margin-bottom: 2%">
                            <el-row>
                                <el-col :span="6">
                                    <el-select v-model="current.sort" placeholder="排序"
                                               size="small"
                                               @change="handleSortChanged">
                                        <el-option v-for="it in sortBy"
                                                   :label="it.sortName"
                                                   :key="it.sort"
                                                   :value="it.sort">
                                        </el-option>
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
                                                    <li class="el-icon more btn-quickprev el-icon-more"
                                                        @click="handlePageChanged(current.page-1)"></li>
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
                                    width="50"
                                    type="index">
                            </el-table-column>
                            <el-table-column
                                    min-width="150"
                                    label="名称">
                                <template slot-scope="scope">
                                    <template
                                            v-if="scope.row.resolution!=null&&scope.row.resolution.length>0">
                                        <el-tag v-if="scope.row.resolution.indexOf('720')>=0||scope.row.resolution.indexOf('1080')>=0"
                                                disable-transitions
                                                size="mini">{{scope.row.resolution}}
                                        </el-tag>
                                        <el-tag v-else-if="scope.row.resolution.indexOf('2')==0||scope.row.resolution.indexOf('4')==0"
                                                disable-transitions
                                                type="success" size="mini">{{scope.row.resolution}}
                                        </el-tag>
                                    </template>
                                    <a v-if="status.clicks.indexOf(scope.row.magnet)!=-1"
                                       class="visited-a"
                                       :href="scope.row.magnet"
                                       v-html="scope.row.nameHtml"></a>
                                    <a v-else :href="scope.row.magnet"
                                       @click="handleClickMagnet(scope.row.magnet)"
                                       v-html="scope.row.nameHtml"></a>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    header-align="center"
                                    width="120"
                                    label="大小"
                                    prop="formatSize">
                            </el-table-column>
                            <el-table-column
                                    header-align="center"
                                    width="70"
                                    label="人气"
                                    prop="hot">
                            </el-table-column>
                            <el-table-column
                                    width="120"
                                    prop="date"
                                    align="center"
                                    label="发布时间">
                            </el-table-column>
                            <el-table-column
                                    label="操作"
                                    align="center"
                                    width="140">
                                <template slot-scope="scope">
                                    <el-button size="mini"
                                               type="button"
                                               v-clipboard:copy="scope.row.magnet"
                                               v-clipboard:success="handleCopy">复制
                                    </el-button>
                                    <el-popover
                                            placement="right-start"
                                            trigger="click">
                                        <h3 class="more-action-title">更多操作</h3>
                                        <div class="more-action-button">
                                            <el-tooltip v-if="config.trackersEnabled" effect="light"
                                                        content="速度慢可以试试这个"
                                                        placement="top">
                                                <el-button type="button" size="mini" plain
                                                           v-clipboard:copy="formatTrackersUrl(scope.row.magnet)"
                                                           v-clipboard:success="handleCopy">磁力优化
                                                </el-button>
                                            </el-tooltip>
                                        </div>
                                        <div class="more-action-button">
                                            <a class="el-button el-button--button el-button--mini"
                                               :href="formatMiWifiUrl(scope.row.magnet)"
                                               target="_blank">小米路由
                                            </a>
                                        </div>
                                        <div class="more-action-button">
                                            <a class="el-button el-button--button el-button--mini"
                                               v-if="scope.row.detailUrl!=null&&scope.row.detailUrl.length>0"
                                               :href="scope.row.detailUrl" target="_blank">源站详情
                                            </a>
                                        </div>
                                        <el-button slot="reference"
                                                   size="mini"
                                                   type="button">更多
                                        </el-button>
                                    </el-popover>
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
                    <div id="message"
                         v-show="(list == null||list.length<=0)&&message!=null&&message.length>0">
                        <h2 style="font-weight: lighter">{{message}}</h2>
                    </div>
                </div>


                <!--不蒜子统计-->
                <div id="busuanzi" style="display: none;margin-top: 30px">
                    <div v-if="config.busuanziEnabled">
                        <script async
                                src="//busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js">
                        </script>
                        <div class="busuanzi">
                            <span id="busuanzi_title">流量统计</span> |
                            <span id="busuanzi_container_site_pv">
    总访问量[<span id="busuanzi_value_site_pv"></span>]
</span> | <span id="busuanzi_container_site_uv">
  总访客数[<span id="busuanzi_value_site_uv"></span>]
</span>
                        </div>
                    </div>
                </div>
            </div>

        </el-main>
    </el-container>
    <div id="page-component-up" @click="scrollTop" v-show="showTopButton"><i
            class="el-icon-caret-top"></i></div>
</div>
</body>
<script>
    function onVueCreated(vue) {
        vue._data.config = ${config};
        vue._data.sourceSites = ${source_sites};
        vue._data.current = ${current};
        vue._data.sortBy = ${sort_by};

        vue.handlePageChanged = function (page) {
            if (page <= 0) {
                return
            }
            this.current.page = page;
            this.requestMagnetList(true)
        };

        /************重写的回调************/


        /**
         * 弹出消息提示
         * @param message
         * @param type
         */
        vue.onToastMessage = function (message, type) {
            vue.$message({
                message: message,
                type: type
            });
        };

        //请求失败的回调
        vue.onRequestError = function (message) {
            if (vue._data.list == null || vue._data.list.length <= 0) {
                vue._data.message = message;
            } else {
                vue.$message({
                    message: message,
                    type: "error"
                });
            }
        };

        //请求成功的回调
        vue.onRequestSuccess = function (data) {
            if (data.results.length > 0) {
                vue._data.list = data.results;
            } else {
                vue._data.message = "什么也没搜到"
            }
        };
    }
</script>
<script src="resources/js/index.js"></script>
</html>