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
                <guide-page></guide-page>
                <div class="pager-search-header" ref="pagerSearchHeader">
                    <!--搜索框与排序菜单-->
                    <search-input v-if="activeRule" :name="activeRule.name"
                                  @search="handleSearch"
                                  class="pager-row-container"
                                  :paths="activeRule.paths"></search-input>
                    <!--排序选项-->
                    <search-option v-if="activeRule" :url="page.current.url||activeRule.url"
                                   :paths="activeRule.paths"
                                   @change="handleSortChanged"></search-option>
                </div>
                <!--搜索结果-->
                <div ref="pagerSearchItems" class="pager-search-items">
                    <div class="index-main-content">
                        <div v-loading="loading.table">
                            <pager-items v-if="page.items" :items="page.items"
                                         :keyword="page.current.keyword"
                                         :baseURL="activeRule.url"></pager-items>
                        </div>
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
  import SearchOption from '../components/SearchOption'
  import PagerItems from '../components/PagerItems'
  import GuidePage from '../components/GuidePage'
  import {ipcRenderer, remote, shell} from 'electron'

  export default {
    components: {
      AsideMenu, BrowserLink, SearchOption, SearchInput, PagerItems, GuidePage
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
        searchHeaderStyle: {
          left: 0
        },
        placeholder: '钢铁侠'

      }
    },
    watch: {
      activeRule: function (val) {
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
       * 排序切换
       * @param sort
       */
      handleSortChanged (sort) {
        this.page.current.sort = sort
        this.handleSearch()
      },
      /**
       *页码切换
       * @param page
       */
      handlePageChanged (page) {
        this.page.current.page = page
        this.handleSearch()
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
      handleSearch (value) {
        this.loading.table = true
        this.page.current.keyword = value
        console.log('搜索', this.page.current)
        ipcRenderer.send('search', this.page.current, this.global.settings.localSetting)
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

    .page-search-content {

        .el-loading-spinner {
            top: 150px !important;
        }
    }

    .pager-row-container {
        margin-bottom: 15px;
    }


</style>
