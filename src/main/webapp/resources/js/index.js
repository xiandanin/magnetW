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

        filter: {
            message: "如果你发现有违规的搜索结果，可以在此处提交，提交后将会禁止搜索此关键词",
            dialogVisible: false,
            placeholder: "输入关键词",
            keyword: null,
            loading: false
        },

        status: {
            clicks: []
        }

    },
    created: function () {
        onVueCreated(this)
    },
    mounted: function () {
        this.delayLoadBusuanzi();

        window.addEventListener('scroll', this.onScrollTopButtonState);

        if (this.current.keyword != null && this.current.keyword.length > 0) {
            this.requestMagnetList()
        }
    },
    methods: {
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
        handleCopy() {
            this.onToastMessage('复制成功', 'success');
        },
        /**
         * 延迟显示不蒜子信息
         */
        delayLoadBusuanzi() {
            if (this.config.busuanziEnabled && this.config.busuanziShow) {
                var busuanzi = document.getElementById("busuanzi");
                if (busuanzi != null && busuanzi !== undefined) {
                    setTimeout(function () {
                        busuanzi.style.display = "block"
                    }, 400);
                }
            }
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
                    console.log("callback - onRequestSuccess");
                    this.onRequestSuccess(data)
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
        showFilterDialog() {
            this.filter.dialogVisible = true
        },
        /**
         * 提交屏蔽
         */
        requestSubmitFilter() {
            if (this.filter.keyword != null && this.filter.keyword.length > 0) {
                this.filter.loading = true;
                this.$http.post("api/filter", {
                    input: this.filter.keyword
                }, {emulateJSON: true})
                    .then(function (response) {
                        //请求成功
                        this.filter.loading = false;
                        this.filter.dialogVisible = false;
                        if (response.body.success) {
                            this.filter.keyword = null;
                            this.onToastMessage(response.body.message, "success");
                        } else {
                            this.onToastMessage(response.body.message, "error");
                        }
                    }).catch(function (error) {
                    //请求失败
                    this.filter.loading = false;
                    this.onToastMessage("添加失败", "error")
                });
            }
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