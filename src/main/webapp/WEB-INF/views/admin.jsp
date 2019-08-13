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
        margin-top: 1%;
        color: #777;
        background-color: #f5f7fa;
        border: 1px solid #e4e7ed;
        border-radius: 5px;
        white-space: pre-wrap;
        font-size: 14px;
    }
</style>
<body>
<div id="app">
    <div><h5>解析规则</h5>
        <div>
            <button type="button" class="btn btn-outline-dark"
                    @click="requestAdminApi('api/reload')">重载规则
            </button>
            <button type="button" class="btn btn-outline-dark"
                    @click="requestAdminApi('api/source')">查看规则
            </button>
            <button type="button" class="btn btn-outline-dark">清除缓存</button>
        </div>
    </div>
    <div class="message" v-show="message">
        {{message}}
    </div>
</div>
<script>
    new Vue({
        el: '#app',
        data: {
            message: null
        },
        methods: {
            requestAdminApi(path) {
                this.message = "正在请求...";
                let params = {p: "d"};
                this.$http.get(path, {params: params}, {emulateJSON: true}).then(function (response) {
                    if (response.body.success) {
                        this.message = JSON.stringify(response.body, null, "\t");
                    } else {
                        this.message = response.body.message;
                    }
                }).catch(function (error) {
                    this.message = "请求失败";
                });
            }
        }
    })
</script>
</body>
</html>