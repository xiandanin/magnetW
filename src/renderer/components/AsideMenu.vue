<template>
    <el-menu v-if="ruleArray" :default-active="active" @select="handleSourceChanged">
        <el-menu-item v-for="it in ruleArray" :key="it.id" :index="it.id">
            <div slot="title" class="menu-item-title">
                <span class="menu-item-title-text">
                    <el-image :src="it.icon?it.icon:it.url+'/favicon.ico'" class="favicon">
                        <i slot="placeholder"></i>
                        <i slot="error"></i>
                    </el-image>
                    <span class="source-name">{{it.name}}</span>
                </span>
                <el-tooltip v-if="it.proxy" effect="dark" content="此源站需要设置代理" placement="right">
                    <i class="el-icon-connection"></i>
                </el-tooltip>
            </div>
        </el-menu-item>
    </el-menu>
</template>

<script>
  export default {
    props: {ruleArray: Array, active: String},
    data () {
      return {
        loading: false
      }
    },
    methods: {
      handleSourceChanged (index) {
        const list = this.ruleArray
        for (let i = 0; i < list.length; i++) {
          const item = list[i]
          if (item.id === index) {
            this.global.active = item
            this.$emit('change', item)
            break
          }
        }
      }
    },
    mounted () {
    }
  }
</script>

<style lang="scss">

    .el-scrollbar__view {
        height: 100%;
    }

    .el-scrollbar {
        border-right: solid 1px $color-border;
    }

    .el-menu {
        border: none !important;
    }

    .el-menu-item:active {
        cursor: pointer;
    }

    .el-menu-item.is-active {
        background-color: $--color-primary-light-9;
    }

    .menu-item-title {
        display: flex;
        align-items: center;

        .menu-item-title-text {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            flex: 1;
        }

        .el-icon-connection {
            font-size: 18px !important;
        }
    }

    .favicon {
        margin-right: 8px;
        width: 18px;
        height: 18px;
    }

</style>
