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
                  @change="handleSortChanged"
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
  import axios from '@/plugins/axios'

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
          current: null,
          items: null
        },
        activeRule: null,
        loading: {
          table: false,
          page: false
        },
        guidePage: {
          show: true,
          type: 'success',
          message: null
        },
        detailDialog: {
          show: false
        },
        windowKey: 'normal'
      }
    },
    watch: {
      '$route.query' (to, from) {
        console.log(to)
        if (to.k) this.page.current.keyword = to.k
        if (to.s) this.page.current.sort = to.s
        if (to.p) this.page.current.page = to.p
        this.handleRequestSearch()
      }
    },
    methods: {
      handleRuleRefreshFinished (rules, err) {
        const message = err ? err.message : `成功刷新${rules.length}个规则`
        this.guidePage.message = message
        this.guidePage.type = err ? 'error' : 'success'
        console.info(message)
      },
      handleRuleChanged (active) {
        this.activeRule = active
        this.$localSetting.saveValue('last_rule_id', active.id)

        const keys = Object.keys(active.paths)
        this.page.items = null
        this.page.current.id = active.id
        this.page.current.sort = keys[0]
        this.page.current.page = 1
        this.page.current.url = active.url
      },
      handleClickSearch (keyword) {
        this.page.current.keyword = keyword
        this.page.current.page = 1

        this.redirectSearch()
      },
      handlePageChanged (page) {
        this.page.current.page = page
        this.redirectSearch()
      },
      handleSortChanged (sortKey) {
        this.page.current.sort = sortKey
        this.page.current.page = 1
        this.redirectSearch()
      },
      redirectSearch () {
        const cur = this.page.current
        const query = this.$route.query
        if (cur.id === this.$route.params.id && cur.sort === query.s && cur.keyword === query.k && cur.page === query.p) {
          this.handleRequestSearch()
        } else {
          const query = {s: cur.sort, k: cur.keyword, p: cur.page}
          this.$router.push({
            name: 'index',
            params: {id: cur.id},
            query: cur.keyword ? query : null
          })
        }
      },
      handleRequestSearch () {
        // 发起请求
        const params = this.page.current
        if (params.keyword) {
          this.guidePage.show = false
          this.loading.table = true
          console.info('搜索', JSON.stringify(params, '/t', 2))

          axios.get('/search', {
            params: params
          }).then((rsp) => {
            this.page = rsp.data
          }).catch((err) => {
            this.$message({
              message: err.message,
              type: 'error'
            })
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
      const params = this.$route.params
      const query = this.$route.query
      this.page.current = {
        id: params.id,
        keyword: query.k,
        sort: query.s,
        page: parseInt(query.p)
      }
    },
    mounted () {
      this.handleRequestSearch()
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
  }

  .guide-page {
    margin-top: 55px;
    padding: 0 20px 20px 20px;
    position: absolute;
    z-index: 2000;
    left: 0;
    right: 0;
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
