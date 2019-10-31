<template>
  <span>v{{ version }}-{{ platform }}
  </span>
</template>

<script>
  import os from 'os'
  import {remote} from 'electron'

  export default {
    data () {
      return {
        platform: os.platform(),
        version: remote.app.getVersion()
      }
    }
  }
</script>
