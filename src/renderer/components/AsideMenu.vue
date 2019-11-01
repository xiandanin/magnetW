<template>
    <el-menu v-if="ruleArray" :default-active="active" @select="handleSourceChanged">
        <el-menu-item v-for="it in ruleArray" :key="it.id" :index="it.id">
            <template slot="title">
                <el-image :src="it.url+'/favicon.ico'" class="favicon">
                    <i slot="placeholder"></i>
                    <i slot="error"></i>
                </el-image>
                <span class="source-name">{{it.name}}</span>
            </template>

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
