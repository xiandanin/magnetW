<template>
    <div class="search-sort">
        <!--源站按钮-->
        <browser-link button="true" size="mini" :href="url" class="link-button">去源站</browser-link>

        <!--排序方式-->
        <el-radio-group @change="emitSortChanged" size="mini" v-model="checkedLabel">
            <el-radio-button v-for="(value, key, i) in paths" :key="key"
                             :label="getLabelByKey(key)"></el-radio-button>
        </el-radio-group>
    </div>
</template>

<script>
  import BrowserLink from './BrowserLink'

  export default {
    props: {
      'url': String, 'paths': Object, 'sortKey': String
    },
    model: {
      prop: 'sortKey',
      event: 'change'
    },
    data () {
      return {
        checkedLabel: null,
        presetLabels: {
          'preset': '默认排序',
          'time': '收录时间',
          'size': '文件大小',
          'hot': '下载人气'
        }
      }
    },
    components: {
      BrowserLink
    },
    methods: {
      emitSortChanged (label) {
        this.$emit('change', this.getKeyByLabel(label))
      },
      /**
       * 根据显示文字返回key
       * @param label
       * @returns {*}
       */
      getKeyByLabel (label) {
        for (let key in this.presetLabels) {
          if (this.presetLabels.hasOwnProperty(key) && label === this.presetLabels[key]) {
            return key
          }
        }
        return label
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
      const keys = Object.keys(this.paths)
      this.checkedLabel = keys[0]
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
        margin-right: 5px;
    }
</style>
