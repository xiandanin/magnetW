<template>
    <div v-if="rule">
        <el-menu :default-active="global.active?global.active.id:''">
            <el-menu-item v-for="it in rule.list" :key="it.id" :index="it.id">
                <template slot="title">
                    <i class="el-icon-link" title="去源站看看"></i>
                    <el-image :src="it.url+'/favicon.ico'" class="favicon">
                        <i slot="placeholder"></i>
                        <i slot="error"></i>
                    </el-image>
                    <span class="source-name">{{it.name}}</span>
                </template>

            </el-menu-item>
        </el-menu>
    </div>
</template>

<script>
  import {ipcRenderer} from 'electron'

  export default {
    name: 'aside-menu',
    data () {
      return {
        rule: null
      }
    },
    methods: {
      registerIPCEvent () {
        ipcRenderer.on('on-get-all-source', (event, rule) => {
          this.rule = rule
          this.global.active = rule.list[0]
        })
      }
    },
    mounted () {
      this.registerIPCEvent()

      ipcRenderer.send('get-all-source')
    }
  }
</script>

<style lang="scss">
    @import '../styles/app';

    .el-menu {
        height: 100%;
    }

    .el-menu-item:active {
        cursor: pointer;
    }

    .el-menu-item.is-active {
        background-color: $--color-primary-light-9;
    }

    .favicon {
        margin-right: 10px;
        width: 18px;
        height: 18px;
    }

</style>
