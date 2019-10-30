<template>
    <div class="container">
        <p class="title">设置</p>
        <p class="sub-title">规则</p>
    </div>
</template>

<script>
  import configMixin from '../mixins/config.js'

  export default {
    mixins: [configMixin],
    data () {
      return {
        config: null
      }
    },
    methods: {
      handleConfigInfo (config) {
        this.config = config
        console.info(config)
      }
    },
    mounted () {
      this.loadConfigInfo()
    }
  }
</script>

<style lang="scss">
    @import '../styles/app';


    .sub-title{
        padding-bottom: 16px;
        color: $color-sub-title;
        border-bottom: 1px solid $color-border;
    }

</style>
