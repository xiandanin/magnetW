<template>
  <el-table
    border
    default-expand-all=""
    :data="items"
    :empty-text="emptyMessage||'什么也没搜到'"
    style="width: 100%">
    <el-table-column
      type="index"
      width="40"
      align="center"
      label="#">
    </el-table-column>
    <el-table-column
      label="名称">
      <template slot-scope="scope">
        <highlight-name :keyword="keyword" :url="scope.row.magnet"
                        :resolution="scope.row.resolution" :value="scope.row.name">
        </highlight-name>
      </template>
    </el-table-column>
    <el-table-column
      label="大小"
      align="right"
      :sort-by="['size','hot','date']"
      sortable
      width="100">
      <template slot-scope="scope">
        <span>{{scope.row.size| size}}</span>
      </template>
    </el-table-column>
    <el-table-column type="expand">
      <div class="page-column-expand" slot-scope="scope">
        <div>
          <span class="page-item-expand">
            <span class="page-item-expand-label">时间</span>
            <span>{{scope.row.date|date}}</span>
          </span>
          <span class="page-item-expand" v-show="typeof scope.row.hot=='number'">
            <span class="page-item-expand-label">人气</span>
            <span>{{scope.row.hot}}</span>
          </span>
        </div>
        <div class="page-column-expand-action">
          <item-button-group :baseURL="baseURL"
                             :item="scope.row"
                             :list="getButtons(scope.row)"
                             @show-detail="handleShowDetail">
          </item-button-group>
        </div>
      </div>
    </el-table-column>
  </el-table>
</template>

<script>
  import HighlightName from '../components/HighlightName'
  import ItemButtonGroup from './ItemButtonGroup'

  export default {
    props: {'items': Array, 'keyword': String, 'baseURL': String, 'emptyMessage': String},
    components: {HighlightName, ItemButtonGroup},
    methods: {
      handleShowDetail (item) {
        this.$emit('show-detail', {name: item.name, path: item.detailUrl})
      },
      getButtons (item) {
        return item.magnet ? ['qrcode', item.detailUrl ? 'detail' : null, 'miwifi', 'copy'] : ['detail', 'detail-dialog']
      }
    },
    mounted () {
    }
  }
</script>

<style lang="scss" scoped>

  /deep/ .el-table__expanded-cell[class*=cell] {
    padding: 10px;
  }

  .page-column-expand {
    display: flex;
    align-items: center;
    // margin-left: 40px;
  }

  .page-column-expand-action {
    text-align: right;
    flex: 1;
  }

  .page-item-expand-label {
    color: #99a9bf;
    margin-right: 8px;
  }

  .page-item-expand {
    color: #606266;
    margin-right: 15px;
  }

  .el-table th {
    padding-top: 7px !important;
    padding-bottom: 7px !important;
  }

</style>
