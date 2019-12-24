<template>
  <div class="search-sort">
    <!--源站按钮-->
    <browser-link v-show="false" :button="true" size="mini" :href="url|formatURL" :_blank="true" class="link-button">去源站</browser-link>

    <!--排序方式-->
    <el-dropdown>
      <el-button size="mini">{{getLabelByKey(checkedSortKey)||'选择排序'}}<i class="el-icon-arrow-down el-icon--right"></i>
      </el-button>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item v-for="(value, key) in paths" :key="key"
                          :command="key" class="dropdown-sort">
          <router :query="{ s: key ,p:1}" class="dropdown-sort-item">{{getLabelByKey(key)}}</router>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>

    <!--调整窗口-->
    <el-dropdown @command="emitWindowChanged">
      <el-button size="mini">{{windowName||'调整窗口'}}<i class="el-icon-arrow-down el-icon--right"></i>
      </el-button>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item v-for="(name, key) in window" :key="key"
                          :command="key">{{name}}
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
  import BrowserLink from './BrowserLink'
  import Router from './Router'

  export default {
    props: {
      'url': String, 'paths': Object, 'sortKey': String, 'windowKey': String
    },
    data () {
      return {
        checkedSortKey: null,
        presetLabels: {
          'preset': '默认排序',
          'time': '收录时间',
          'size': '文件大小',
          'hot': '下载人气'
        },
        window: {
          'normal': '标准大小',
          'max': '填满窗口'
        }
      }
    },
    watch: {
      sortKey (val) {
        this.checkedSortKey = val
      }
    },
    computed: {
      windowName () {
        return this.window[this.windowKey]
      }
    },
    components: {
      BrowserLink, Router
    },
    methods: {
      emitWindowChanged (key) {
        this.$emit('window-change', key)
      },
      /**
       * 根据key返回显示文字
       * @param key
       * @returns {*}
       */
      getLabelByKey (key) {
        return key in this.presetLabels ? this.presetLabels[key] : key
      }
    },
    created () {
      this.checkedSortKey = this.sortKey
    }
  }
</script>

<style lang="scss" scoped>

  .el-button, .el-radio-group {
    margin-top: 2px;
    margin-bottom: 2px;
  }

  .pager-items-pagination {
    text-align: right;
  }

  .link-button {
    vertical-align: middle;
    margin-right: 15px;
  }

  .dropdown-sort {
    padding: 0;

    .dropdown-sort-item {
      padding: 0 20px;
    }
  }
</style>
