<template>
    <div class="search-option">
        <div class="search-option-left">
            <!--源站按钮-->
            <el-button size="mini" class="link-button">
                <browser-link :href="url">去源站</browser-link>
            </el-button>

            <!--排序方式-->
            <el-radio-group @change="emitSortChanged" size="mini" v-model="checkedLabel">
                <el-radio-button v-for="(value, key, i) in paths" :key="key"
                                 :label="getLabelByKey(key)"></el-radio-button>
            </el-radio-group>
        </div>

        <!--页码-->
        <el-pagination
                @current-change="emitPageChanged"
                :current-page="page"
                class="pager-items-pagination"
                background
                layout="prev, pager, next"
                :pager-count="5"
                :page-count="50">
        </el-pagination>
    </div>
</template>

<script>
  import BrowserLink from './BrowserLink'

  export default {
    props: ['url', 'paths', 'page'],
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
        this.$emit('change', this.getLabelByKey(label))
      },
      emitPageChanged (page) {
        this.$emit('page-change', page)
      },
      /**
       * 根据显示文字返回key
       * @param label
       * @returns {*}
       */
      getKeyByLabel (label) {
        for (let key in this.labels) {
          if (label === this.labels[key]) {
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
    .search-option {
        display: flex;
        align-items: center;

        .search-option-left {
            flex: 1;
        }

        .el-pagination {
            padding-right: 0 !important;

            .number:last-child {
                display: none;
            }

            /deep/ .btn-next {
                margin-right: 0 !important;
            }
        }
    }

    .link-button {
        height: 28px;
        margin-right: 10px;
        vertical-align: middle;

        .el-link {
            font-weight: 500;
            font-size: inherit;
        }
    }

    .pager-items-pagination {
        text-align: right;
    }

</style>
