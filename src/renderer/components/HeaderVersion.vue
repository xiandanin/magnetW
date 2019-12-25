<template>
  <browser-link href="/" target="_self">
    <div class="header-version align-items-center">
      <img src="../assets/logo.png" width="36" height="36"/>
      <div>
        <div class="header-version-text">{{ appName }}</div>
        <div class="header-version-text">v{{ version }}</div>
      </div>
    </div>
  </browser-link>
</template>

<script>
  import BrowserLink from './BrowserLink'

  export default {
    components: {BrowserLink},
    data () {
      return {
        version: this.$app.version,
        appName: this.$app.appName
      }
    },
    created () {

    }

  }
</script>
<style lang="scss" scoped>
  .header-version {

  }

  .header-version-text {
    margin-left: 10px;
    color: $color-title;
    line-height: 1.3;
    font-size: 16px;
  }

  .el-main {
    padding: 0 !important;
  }

  .el-header {
    height: 80px !important;

    .header {
      height: 100%;
    }
  }

  .title {
    font-size: 18px;
    color: $color-title;
  }

  .align-items-center {
    display: flex;
    align-items: center;
  }

  .el-checkbox {
    font-weight: normal !important;
  }

  .el-header {
    border-bottom: 1px solid $color-border;
  }

  .scroll-container {
    height: 100%;

    .el-scrollbar {
      height: 100%;
    }

    .el-scrollbar__wrap {
      overflow-x: hidden !important;
    }

    .el-scrollbar__view {
      height: auto !important;
    }
  }

  .el-dialog__header {
    padding-bottom: 0;
  }
</style>
