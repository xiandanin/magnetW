<template>
  <el-container>
    <el-aside ref="indexAside" width="200px">
      <aside-menu
        :active="page.current.id"
        @rule-refresh-finished="handleRuleRefreshFinished"
        @change="handleRuleChanged"></aside-menu>
    </el-aside>
    <el-main>
      <el-scrollbar class="index-main">
        <guide-page ref="guidePage" v-show="guidePage.show"
                    :title="guidePage.title"
                    :message="guidePage.message" :type="guidePage.type"></guide-page>
        <div v-if="activeRule">
          <div class="pager-content">
            <div ref="pagerSearchHeader">
              <div class="search-option">
                <!--排序选项-->
                <search-sort
                  class="search-option-left"
                  :url="page.current.url||activeRule.url"
                  :paths="activeRule.paths"
                  :window-key="windowKey"
                  @sort-change="handleSortChanged"
                  @window-change="handleWindowChanged"
                  :sortKey="page.current.sort"></search-sort>
                <!--页码-->
                <search-pagination :page="page.current.page"
                                   v-if="page.items"
                                   @change="handlePageChanged"></search-pagination>
              </div>
            </div>
            <!--搜索结果-->
            <div ref="pagerSearchItems" class="pager-search-items" v-loading="loading.table">
              <div class="index-main-content" v-if="page.items">
                <pager-items :items="page.items"
                             :emptyMessage="page.emptyMessage"
                             :keyword="page.current.keyword"
                             :baseURL="activeRule.url"
                             @show-detail="handleShowDetailDialog"></pager-items>
                <search-pagination class="footer-search-pagination"
                                   :page="page.current.page"
                                   @change="handlePageChanged"></search-pagination>
              </div>
            </div>
          </div>
          <el-backtop target=".index-main .el-scrollbar__wrap" ref="backtop">
          </el-backtop>
          <detail-dialog v-if="detailDialog"
                         :dialog="detailDialog"></detail-dialog>
        </div>
      </el-scrollbar>
    </el-main>
  </el-container>
</template>

<script>
  import AsideMenu from '../components/AsideMenu'
  import SearchInput from '../components/SearchInput'
  import SearchSort from '../components/SearchSort'
  import SearchPagination from '../components/SearchPagination'
  import PagerItems from '../components/PagerItems'
  import GuidePage from '../components/GuidePage'
  import PagerHeader from '../components/PagerHeader'
  import DetailDialog from '../components/DetailDialog'

  export default {
    components: {
      DetailDialog,
      AsideMenu,
      SearchSort,
      SearchInput,
      SearchPagination,
      PagerItems,
      GuidePage,
      PagerHeader
    },
    data () {
      return {
        rule: null,
        page: {
          current: {},
          items: null,
          emptyMessage: null
        },
        activeRule: null,
        loading: {
          table: false,
          page: false
        },
        guidePage: {
          show: true,
          type: 'success',
          title: null,
          message: null
        },
        detailDialog: {
          show: false
        },
        windowKey: 'normal'
      }
    },
    watch: {
    },
    methods: {
      handleRuleRefreshFinished (type, title, message) {
        this.guidePage.title = title
        this.guidePage.message = message
        this.guidePage.type = type
        console.info(title, message)
      },
      handleRuleChanged (active) {
        if (this.activeRule && this.activeRule.id === active.id) {
          return
        }
        this.activeRule = active
        this.$localSetting.saveValue('last_rule_id', active.id)

        const keys = Object.keys(active.paths)
        this.page.current.id = active.id
        this.page.current.sort = keys[0]
        this.page.current.page = 1
        this.page.current.url = active.url
        this.handleRequestSearch()
      },
      handleClickSearch (keyword) {
        this.page.current.keyword = keyword
        this.page.current.page = 1

        this.handleRequestSearch()
      },
      handlePageChanged (page) {
        this.page.current.page = page
        this.handleRequestSearch()
      },
      handleSortChanged (sortKey) {
        this.page.current.sort = sortKey
        this.page.current.page = 1
        this.handleRequestSearch()
      },
      handleRequestSearch () {
        // 发起请求
        const params = this.page.current
        if (params.keyword) {
          console.info('搜索', JSON.stringify(params, '\t', 2))
          this.guidePage.show = false
          this.loading.table = true
          this.$http.get('search', {
            params: params
          }).then((rsp) => {
            this.page = rsp.data
          }).catch((err) => {
            this.page.emptyMessage = err.message
            this.page.items = []

            /*
            this.$message({
              message: err.message,
              type: 'error'
            })
            */
          }).finally(() => {
            this.loading.table = false
          })
        }
      },
      handleShowDetailDialog ({name, path}) {
        this.detailDialog = {
          show: true,
          id: this.page.current.id,
          name: name,
          path: path
        }
      },
      handleWindowChanged (key) {
        this.windowKey = key
      }
    },
    created () {
    },
    mounted () {
      // this.handleRequestSearch()
    },
    head: {
      title: function () {
        const cur = this.page.current
        return cur.keyword ? {
          inner: cur.keyword ? `${cur.keyword} - ${cur.page}` : null,
          complement: this.$app.appName
        } : null
      }
    }
  }
</script>

<style lang="scss" scoped>

  .container {
    max-width: 960px;
    margin: auto;
  }

  .container-full {
    max-width: inherit;
    margin: auto;
  }

  .el-main {
    position: relative;
    padding: 0;
  }

  .pager-search-items {
    margin-top: 20px;
  }

  .index-main {
    padding: 0 !important;
    position: relative;

    .el-backtop {
      position: absolute;
    }

    /deep/ .el-scrollbar__view {
      position: relative;
    }
  }

  .pager-search-items {

    /deep/ .el-loading-spinner {
      top: 230px !important;
    }
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

  .pager-content {
    padding: 20px;
  }

  .footer-search-pagination {
    margin-top: 15px;
    text-align: right;
  }

</style>
