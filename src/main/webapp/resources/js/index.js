Vue.http.options.timeout = 20000;
new Vue({
    el: '#app',
    data: {
        showTopButton: false,
        message: null,
        loading: false,
        config: null,
        sourceSites: null,
        list: [],
        trackersString: null,
        current: null,
        sortBy: null,
        rule: null,
        successMessage: null,
        //举报
        filter: {
            message: "如果你发现有违规的搜索结果，可以在此处提交，提交后将会禁止搜索此关键词，也可以在更多按钮中举报资源",
            dialogVisible: false,
            loading: false,
            placeholder: "输入关键词或磁力链",
            value: null,
            name: null
        },
        //设置
        setting: {
            memoryChoice: false,
            source: ''
        },
        //列表状态
        status: {
            clicks: []
        },
        //详情
        detail: {
            loading: false,
            show: false,
            errorMessage: null,
            rsp: {}
        }
    },
    created: function () {
        onVueCreated(this);

        this.applySetting();
    },
    mounted: function () {
        window.addEventListener('scroll', this.onScrollTopButtonState);

        if (this.current.keyword != null && this.current.keyword.length > 0) {
            this.requestMagnetList()
        }
    },
    methods: {
        getParams(name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
            var r = window.location.search.substr(1).match(reg);
            if (r != null) return unescape(r[2]);
            return null;
        },
        applySetting() {
            var cookieSetting = Cookies.get('setting');
            if (cookieSetting == null) {
                return
            }
            this.setting = JSON.parse(cookieSetting);
            console.log("setting: " + JSON.stringify(this.setting));

            //如果开启了记住选择
            if (this.setting.memoryChoice) {
                var source = this.getParams("source");
                //如果没有指定源站
                if (source == null || source.length <= 0) {
                    for (let i = 0; i < this.sourceSites.length; i++) {
                        //列表也包含上次选的源站 就自动选择上次的源站
                        if (this.setting.source === this.sourceSites[i].site) {
                            this.current.site = this.setting.source;
                            break
                        }
                    }
                }
            }
        },
        getParamsString() {
            var keywordString = "";
            if (this.current.keyword != null && this.current.keyword.length > 0) {
                keywordString = "&k=" + this.current.keyword + "&s=" + this.current.sort + "&p=" + this.current.page;
            }
            return "?source=" + encodeURI(this.current.site + keywordString);
        },
        redirectCurrentURL() {
            window.location.href = "search" + this.getParamsString()
        },
        /**
         * 刷新地址栏地址
         */
        updateAddress() {
            history.replaceState(0, document.title, "search" + this.getParamsString());
        },
        handleTabClick(tab) {
            this.setting.source = this.current.site;
            this.storeSetting();

            this.current.page = 1;
            this.redirectCurrentURL()
        },
        clickSearch() {
            this.current.page = 1;
            if (this.current.keyword == null || this.current.keyword === '') {
                this.current.keyword = this.config.searchPlaceholder
            }
            this.requestMagnetList(true)
        },
        handleSortChanged(sort) {
            this.current.sort = sort;
            this.current.page = 1;
            this.requestMagnetList(true)
        },
        handleClickMagnet(url) {
            this.status.clicks.push(url)
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

                this.request(this.$http.get("api/search", {
                    params: {
                        source: this.current.site,
                        keyword: this.current.keyword,
                        page: this.current.page,
                        sort: this.current.sort
                    }
                }, {emulateJSON: true}));
            }
        },
        /**
         * 请求详情
         * @param url
         */
        handleLazyLoadDetail(item) {
            let url = item.detailUrl;

            this.detail.name = item.name;
            this.detail.errorMessage = null;
            this.detail.show = true;
            this.detail.loading = true;
            this.detail.rsp = {};

            let that = this;

            this.$http.get("api/detail", {
                params: {source: this.current.site, url: url}
            }, {emulateJSON: true}).then(function (response) {
                that.detail.loading = false;
                //请求成功
                if (response.body.success) {
                    that.detail.rsp = response.body.data;
                } else {
                    that.detail.errorMessage = response.body.message;
                }
            }).catch(function (error) {
                //请求失败
                that.detail.loading = false;
                that.detail.errorMessage = '加载失败';
            });
        },
        handleCopy() {
            this.onToastMessage('复制成功', 'success');
        },
        onScrollTopButtonState() {
            var viewHeight = document.body.clientHeight;
            var curHeight = document.body.scrollTop;
            this.showTopButton = curHeight > viewHeight / 10;
        },
        scrollTop() {
            document.body.scrollTop = 0;
        },
        /**
         * 请求模板
         */
        request(http) {
            this.loading = true;
            console.log("callback - onRequestStarted - " + JSON.stringify(this.current));
            this.onRequestStarted();
            http.then(function (response) {
                //请求成功
                this.loading = false;
                if (response.body.success) {
                    const data = response.body.data;
                    this.trackersString = data.trackersString;
                    this.rule = data.rule;
                    console.log("callback - onRequestSuccess");
                    this.onRequestSuccess(response.body)
                } else {
                    console.log("callback - onRequestError - " + response.body.message);
                    this.onRequestError(response.body.message)
                }
            }).catch(function (error) {
                //请求失败
                this.loading = false;
                console.log("callback - onRequestError");
                this.onRequestError(error.body.message)
            });
        },
        formatTrackersUrl(url) {
            return url + this.trackersString;
        },
        formatMiWifiUrl(url) {
            return "http://d.miwifi.com/d2r/?url=" + Base64.encodeURI(url);
        },
        /**
         * 屏蔽的dialog
         */
        showReportDialog(item) {
            this.filter.dialogVisible = true;
            if (item) {
                this.filter.name = item.name;
                this.filter.value = item.magnet;
            }
        },
        /**
         * 提交举报
         */
        requestReport() {
            if (this.filter.value) {
                this.filter.loading = true;
                let params = {value: this.filter.value};
                if (this.filter.name) {
                    params.name = this.filter.name
                }
                this.$http.post("api/report", params, {emulateJSON: true})
                    .then(function (response) {
                        //请求成功
                        this.filter.loading = false;
                        this.filter.dialogVisible = false;
                        if (response.body.success) {
                            this.filter.value = null;
                            this.onToastMessage(response.body.message, "success");
                        } else {
                            this.onToastMessage(response.body.message, "error");
                        }
                    }).catch(function (error) {
                    //请求失败
                    this.filter.loading = false;
                    this.onToastMessage("举报失败", "error")
                });
            }
        },
        onChangeMemoryChoice(checked) {
            if (!checked) {
                this.setting.source = null;
            }
            this.storeSetting()
        },
        storeSetting() {
            Cookies.set('setting', this.setting);
        },
        /**
         * 请求开始前的回调
         */
        onRequestStarted() {

        },
        /**
         * 请求成功的回调
         * @param data
         */
        onRequestSuccess(data) {

        },
        /**
         * 请求失败的回调
         * @param message
         */
        onRequestError(message) {

        },
        /**
         * 弹出消息提示的回调
         * @param message
         */
        onToastMessage(message, type) {

        }

    }
});