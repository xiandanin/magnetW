<template>
    <el-container v-loading="loading.page">
        <el-aside ref="indexAside" width="200px" class="scroll-container">
            <el-scrollbar>
                <aside-menu :active="page.current.id"
                            @active-rule="handleActiveRule"
                            @change="handleRuleChanged"></aside-menu>
            </el-scrollbar>
        </el-aside>

        <el-main class="index-main scroll-container" v-if="activeRule">
            <el-scrollbar class="index-main-scrollbar">
                <guide-page ref="guidePage" v-show="showGuidePage"></guide-page>
                <div class="pager-search-header" ref="pagerSearchHeader">
                    <!--搜索框与排序菜单-->
                    <search-input :name="activeRule.name"
                                  @search="handleSearch"
                                  class="pager-row-container"
                                  v-model="page.current.keyword"></search-input>
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
                                           v-show="page.items"
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
        rule: null,
        activeRule: null,
        loading: {
          table: false,
          page: false
        },
        showGuidePage: true

      }
    },
    methods: {
      registerRendererListener () {
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
      handleRuleChanged (item) {
        this.handleActiveRule(item)
        this.handleSearch()
      },
      handleSearch () {
        if (this.page.current.keyword) {
          this.showGuidePage = false
          this.loading.table = true
          console.info('搜索', JSON.stringify(this.page.current, '/t', 2))
          ipcRenderer.send('search', this.page.current, this.settings.local)
        }
      },
      handleActiveRule (active) {
        // 如果当前规则没有此排序 就默认选择一个排序
        let keys = Object.keys(active.paths)
        if (keys.indexOf(this.page.current.sort) === -1) {
          this.page.current.sort = keys[0]
        }
        this.activeRule = active
        this.page.current.id = active.id
        this.page.current.page = 1
        this.page.current.url = active.url
        localStorage.setItem('last_rule_id', active.id)
      },
      /**
       * 检查更新
       */
      checkUpdate () {
        this.$http.get(this.project.checkUpdateURL)
          .then(response => {
            let newVerArray = response.data.version.split('.')
            let currentVerArray = remote.app.getVersion().split('.')
            for (let i = 0; i < newVerArray.length; i++) {
              if (parseInt(newVerArray[i]) > parseInt(currentVerArray[i])) {
                this.$confirm(response.data.content, `有新版本 v${response.data.version}`, {
                  confirmButtonText: '去更新',
                  cancelButtonText: '取消',
                  dangerouslyUseHTMLString: true
                }).then(() => {
                  shell.openExternal(response.data.url)
                }).catch(() => {
                })
                break
              }
            }
          })
          .catch(error => {
            console.error('检查更新失败', error)
          })
      }
    },
    created () {
      this.registerRendererListener()
    },
    mounted () {
      this.checkUpdate()
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
        margin-top: 150px;
        padding: 0 20px 20px 20px;
        position: absolute;
        z-index: 2000;
    }

    .pager-search-items {

        /deep/ .el-loading-spinner {
            top: 230px !important;
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
        margin-top: 15px;
        text-align: right;
    }

</style>
