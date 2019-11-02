<template>
    <div class="header-version align-items-center">
        <img src="../assets/images/logo.png" width="45"/>
        <div>
            <div class="header-version-text">{{ appName }}</div>
            <div class="header-version-text">v{{ version }}-{{ platform }}</div>
        </div>
    </div>
</template>

<script>
  import os from 'os'
  import {remote} from 'electron'

  export default {
    data () {
      return {
        platform: os.platform(),
        version: remote.app.getVersion(),
        appName: remote.app.getName()
      }
    }
  }
</script>
<style lang="scss">
    .header-version {
        width: 180px;
    }

    .header-version-text {
        margin-left: 10px;
        color: $color-title;
        line-height: 1.3;
    }
</style>
