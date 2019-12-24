<template>
  <el-popover
    placement="top"
    :title="title"
    width="150"
    :close-delay="100"
    popper-class="qrcode-popover"
    trigger="hover">
    <qrcode :value="text" :options="{ width: 150, margin:0 }"></qrcode>
    <slot slot="reference"></slot>
  </el-popover>
</template>

<script>
  import VueQrcode from '@chenfengyuan/vue-qrcode'

  export default {
    props: ['title', 'text'],
    components: {
      'qrcode': VueQrcode
    },
    methods: {},
    mounted () {
    }
  }
</script>
<style>

  .qrcode-popover .el-popover__title {
    font-size: 14px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
  }

</style>
