<template>
    <el-container v-loading="loading.page">
        <el-aside ref="indexAside" width="200px" class="scroll-container">
            <el-scrollbar>
                <aside-menu @change="handleSourceChanged" :ruleArray="rule?rule.list:[]"
                            :active="activeRule?activeRule.id:''"></aside-menu>
            </el-scrollbar>
        </el-aside>

        <el-main class="index-main scroll-container">
            <el-scrollbar class="index-main-scrollbar">
                <guide-page ref="guidePage" v-show="showGuidePage"></guide-page>
                <div class="pager-search-header" ref="pagerSearchHeader">
                    <!--搜索框与排序菜单-->
                    <search-input v-if="activeRule" :name="activeRule.name"
                                  @search="handleSearch"
                                  class="pager-row-container"
                                  v-model="page.current.keyword"
                                  :paths="activeRule.paths"></search-input>
                    <div class="search-option">
                        <!--排序选项-->
                        <search-sort
                                class="search-option-left"
                                :url="page.current.url||activeRule.url"
                                :paths="activeRule.paths"
                                @change="handleSearch"
                                v-model="page.current.sort"></search-sort>
                        <!--页码-->
                        <search-pagination v-model="page.current.page"
                                           @change="handleSearch"></search-pagination>
                    </div>
                </div>
                <!--搜索结果-->
                <div ref="pagerSearchItems" class="pager-search-items" v-loading="loading.table">
                    <div class="index-main-content" v-if="page.items">
                        <pager-items :items="page.items"
                                     :keyword="page.current.keyword"
                                     :baseURL="activeRule.url"></pager-items>
                        <search-pagination class="footer-search-pagination"
                                           v-model="page.current.page"
                                           @change="handleSearch"></search-pagination>
                    </div>
                </div>
            </el-scrollbar>
            <el-backtop target=".index-main-scrollbar .el-scrollbar__wrap">
            </el-backtop>
        </el-main>
    </el-container>
</template>

<script>
  import AsideMenu from '../components/AsideMenu'
  import BrowserLink from '../components/BrowserLink'
  import SearchInput from '../components/SearchInput'
  import SearchSort from '../components/SearchSort'
  import SearchPagination from '../components/SearchPagination'
  import PagerItems from '../components/PagerItems'
  import GuidePage from '../components/GuidePage'
  import {ipcRenderer, remote, shell} from 'electron'

  export default {
    components: {
      AsideMenu, BrowserLink, SearchSort, SearchInput, SearchPagination, PagerItems, GuidePage
    },
    data () {
      return {
        page: {
          current: {
            keyword: null
          }
        },
        activeRule: {},
        rule: null,
        loading: {
          table: false,
          page: false
        },
        showGuidePage: true

      }
    },
    watch: {
      activeRule: function (val) {
        this.$nextTick(() => {
          this.$refs.guidePage.$el.style.marginTop = `${this.$refs.pagerSearchHeader.offsetHeight}px`
        })
        /*
        this.$nextTick(() => {
          this.$refs.pagerSearchHeader.style.left = this.$refs.indexAside.width
          this.$refs.pagerSearchItems.style.marginTop = `${this.$refs.pagerSearchHeader.offsetHeight}px`
        })
        */
      }
    },
    methods: {
      registerRendererListener () {
        /**
         * 加载规则
         *
         */
        ipcRenderer.on('on-load-rule-data', (event, rule) => {
          this.loading.page = false
          // 如果设置不限时代理源站 就过滤掉
          if (!this.global.settings.localSetting.showProxyRule) {
            rule.list = rule.list.filter(it => !it.proxy)
          }
          this.rule = rule
          // 如果设置记住上次的源站
          let lastRule
          if (this.global.settings.localSetting.rememberLastRule) {
            lastRule = JSON.parse(localStorage.getItem('last_rule'))
          }
          this.handleSourceChanged(lastRule || rule.list[0])
        })
        /**
         * 搜索结果
         */
        ipcRenderer.on('on-search-response', (event, rsp) => {
          this.loading.table = false
          if (rsp.success) {
            this.page = rsp.data
          } else {
            this.$message({
              message: rsp.message,
              type: 'error'
            })
          }
        })
      },
      formatCurrentSort (sort) {
        if (!sort) {
          const sortKeys = Object.keys(this.activeRule.paths)
          return sortKeys[sortKeys.length - 1]
        }
        return sort
      },
      /**
       * 源站切换
       * @param ruleItem
       */
      handleSourceChanged (ruleItem) {
        localStorage.setItem('last_rule', JSON.stringify(ruleItem))
        this.activeRule = ruleItem
        this.page.current.sort = this.formatCurrentSort()
        this.page.current.id = ruleItem.id
        this.page.current.page = 1
        if (this.page.current.keyword) {
          this.handleSearch()
        }
      },
      handleSearch () {
        this.showGuidePage = false
        this.loading.table = true
        console.info('搜索', JSON.stringify(this.page.current, '/t', 2))
        // ipcRenderer.send('search', this.page.current, this.global.settings.localSetting)
      },
      handleLoadRuleData () {
        this.loading.page = true
        const ruleData = ipcRenderer.sendSync('load-rule-data', this.global.settings.localSetting.ruleUrl)
        this.loading.page = false
        // 如果设置不限时代理源站 就过滤掉
        if (!this.global.settings.localSetting.showProxyRule) {
          ruleData.list = ruleData.list.filter(it => !it.proxy)
        }
        this.rule = ruleData
        // 如果设置记住上次的源站
        let lastRule
        if (this.global.settings.localSetting.rememberLastRule) {
          lastRule = JSON.parse(localStorage.getItem('last_rule'))
        }
        this.handleSourceChanged(lastRule || ruleData.list[0])
      }
    },
    created () {
      this.registerRendererListener()

      this.handleLoadRuleData()
    },
    mounted () {
    }
  }
</script>

<style lang="scss" scoped>

    .pager-search-header {
        padding: 20px;
        background-color: white;
        /*
        position: fixed;
        right: 0;
        z-index: 1000;
        box-shadow: 1px 1px 1px rgba(0, 0, 0, 0.12);
        */
    }

    .pager-search-items {
        padding: 0 20px 20px 20px;
        margin-top: 0;
    }

    .index-main {
        padding: 0 !important;
    }

    .index-main-scrollbar {
        border-right: none;
    }

    .guide-page {
        padding: 0 20px 20px 20px;
        position: absolute;
        z-index: 2000;
    }

    .page-search-content {

        .el-loading-spinner {
            top: 150px !important;
        }
    }

    .pager-row-container {
        margin-bottom: 15px;
    }

    .footer-search-option {
        margin-top: 20px;
    }


    .search-option {
        display: flex;
        align-items: center;

        .search-option-left {
            flex: 1;

        }
    }

    .footer-search-pagination {
        text-align: right;
    }

</style>
