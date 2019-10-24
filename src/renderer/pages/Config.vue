<template>
    <div class="container">
        <el-button type="primary">primary</el-button>
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


</style>
