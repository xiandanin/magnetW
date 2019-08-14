<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ page isELIgnored="false" %>
<html>
<head>
    <meta charset="UTF-8">
    <title>磁力搜管理</title>
    <meta name="viewport"
          content="width=device-width,initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no"/>

    <link rel="stylesheet" href="https://cdn.bootcss.com/bootstrap/4.0.0/css/bootstrap.min.css">
    <script src="https://cdn.bootcss.com/vue/2.5.16/vue.min.js"></script>
    <script src="https://cdn.bootcss.com/vue-resource/1.5.0/vue-resource.min.js"></script>
</head>
<style>
    #app {
        padding: 5%;
    }

    .message {
        color: #777;
        background-color: #f5f7fa;
        border: 1px solid #e4e7ed;
        border-radius: 5px;
        white-space: pre-wrap;
        word-break: break-all;
        font-size: 14px;
        margin-top: 15px;
        padding: 5px 10px;
    }

    .title {
        margin-top: 15px;
    }

    .actions button {
        margin-right: 15px;
        margin-bottom: 10px;
    }
</style>
<body>
<div id="app">
    <div>
        <h5>配置相关</h5>
        <div class="actions">
            <button type="button" class="btn btn-outline-dark"
                    @click="requestAdminApi('admin/config')">查看当前配置
            </button>
        </div>
    </div>
    <div class="title">
        <h5>解析规则</h5>
        <div class="actions">
            <button type="button" class="btn btn-outline-dark"
                    @click="requestAdminApi('admin/reload')">重载规则
            </button>
            <button type="button" class="btn btn-outline-dark"
                    @click="requestAdminApi('api/source')">查看规则
            </button>
        </div>
    </div>
    <div class="title">
        <h5>数据相关</h5>
        <div class="actions">
            <button type="button" class="btn btn-outline-dark"
                    @click="requestAdminApi('admin/clear-cache')">清除缓存
            </button>
        </div>
    </div>

    <div class="title" v-if="config.reportEnabled">
        <h5>举报相关</h5>
        <div class="actions">
            <button type="button" class="btn btn-outline-dark"
                    @click="requestAdminApi('api/report-list')">举报列表
            </button>
            <button type="button" class="btn btn-outline-dark"
                    @click="requestAdminApi('admin/report-reload')">重载举报
            </button>
        </div>

        <div class="input-group">
            <input v-model="report.deleteValue" type="text" class="form-control"
                   placeholder="输入已记录的关键词或磁力链"/>
            <div class="input-group-append">
                <button class="btn btn-outline-dark" type="button"
                        @click="requestDeleteReport">
                    删除记录
                </button>
            </div>
        </div>
    </div>
    <div class="message" v-show="req.message" v-html="req.message">
    </div>
</div>
<script>
    new Vue({
        el: '#app',
        data: {
            req: {
                completed: true,
                message: null
            },
            config: ${config},
            report: {
                deleteValue: null
            }
        },
        methods: {
            requestAdminApi(options, params = {}) {
                if (!this.req.completed){
                    return
                }
                this.req.message = "正在请求...";
                let http;
                if (typeof options === 'string') {
                    http = {path: options, method: 'GET'};
                } else {
                    http = options
                }
                params.p = this.getQueryVariable('p');
                this.req.completed = false;
                this.$http({
                    url: http.path,
                    method: http.method,
                    params: params
                }, {emulateJSON: true}).then(function (response) {
                    this.req.completed = true;
                    console.log(response);
                    this.req.message = JSON.stringify(response.body, null, "\t");
                }).catch(function (error) {
                    this.req.completed = true;
                    this.req.message = "请求失败";
                });
            }, getQueryVariable(variable) {
                var query = window.location.search.substring(1);
                var vars = query.split("&");
                for (var i = 0; i < vars.length; i++) {
                    var pair = vars[i].split("=");
                    if (pair[0] == variable) {
                        return pair[1];
                    }
                }
                return (false);
            },
            requestDeleteReport() {
                if (this.report.deleteValue) {
                    this.requestAdminApi({
                        path: 'admin/report-delete',
                        method: 'delete'
                    }, {value: this.report.deleteValue})
                }
            }
        }
    })
</script>
</body>
</html>