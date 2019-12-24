<template>
  <div class="aside-menu">
    <div class="menu-setting">
      <div class="menu-setting-checkbox">
        <el-checkbox v-model='localSetting.memoryLastRule'
                     @change='handleApplySetting' label="记住上次使用的源站" border
                     size="mini"></el-checkbox>
      </div>
    </div>
    <el-menu :default-active="active" @select="emitRuleChangeByID">
      <el-menu-item v-for="it in ruleList" :key="it.id" :index="it.id">
        <div slot="title" class="menu-item-title">
          <span class="menu-item-title-text">
            <el-image :src="it.icon||formatDefaultIcon(it.id)" class="favicon">
              <i slot="placeholder"></i>
              <i slot="error"></i>
            </el-image>
            <span class="source-name">{{it.name}}</span>
          </span>
          <el-tooltip v-if="it.proxy" effect="dark" placement="right">
            <template v-if="localSetting.proxy">
              <div slot="content">此源站需要设置代理，已开启代理</div>
              <i class="el-icon-connection el-icon-connection-success"></i>
            </template>
            <template v-else>
              <div slot="content">此源站需要设置代理，<span class="tooltip-content-proxy"
                                                  @click="handleClickProxyDoc">查看详情</span>
              </div>
              <i class="el-icon-connection"></i>
            </template>
          </el-tooltip>
        </div>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script>
  import ruleList from '~/rule'
  import axios from '@/plugins/axios'

  export default {
    props: {
      active: String
    },
    data () {
      return {
        ruleList: ruleList,
        localSetting: {
          memoryLastRule: false
        }
      }
    },
    watch: {
      active (id) {
        this.emitRuleChangeByID(id)
      }
    },
    methods: {
      emitRuleChangeByID (id) {
        const rules = this.ruleList
        let active = rules[0]
        for (let i = 0; i < rules.length; i++) {
          if (id === rules[i].id) {
            active = rules[i]
            break
          }
        }
        this.$emit('change', active)
      },
      handleClickProxyDoc () {
        window.open(this.$config.proxyDocURL)
      },
      formatDefaultIcon (id) {
        return `${this.$config.icons.baseUrl}/${id}.${this.$config.icons.extension}`
      },
      handleApplySetting () {
        this.$localSetting.save(this.localSetting)
      },
      handleReloadRules () {
        axios.get('/rule').then((rsp) => {
          this.$localSetting.saveValue('rule_list', rsp.data)
          this.ruleList = rsp.data
          this.$emit('rule-refresh-finished', rsp.data)
        }).catch((err) => {
          this.$emit('rule-refresh-finished', null, err)
        })
      }
    },
    computed: {},
    created () {
    },
    mounted () {
      const localSetting = this.$localSetting.get()
      if (Object.keys(localSetting).length > 0) {
        this.localSetting = localSetting
      }
      let active = this.active
      if (localSetting.memoryLastRule && localSetting.last_rule_id) {
        active = localSetting.last_rule_id
      }

      this.emitRuleChangeByID(active)
      this.handleReloadRules()
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

    .el-link {
      justify-content: left;
    }

    .el-icon-connection {
      font-size: 16px !important;
      color: $--color-info !important;
    }

    .el-icon-connection-success {
      color: $--color-primary !important;
    }

  }

  .tooltip-content-proxy {
    cursor: pointer;
    color: $--color-primary;
  }

  .favicon {
    margin-right: 8px;
    width: 18px;
    height: 18px;
  }

  .menu-setting {
    text-align: center;

    .menu-setting-checkbox {
      margin-top: 12px;
    }

    .menu-setting-checkbox:last-child {
      margin-bottom: 12px;
    }

    .menu-setting-update {
      display: flex;
      justify-content: center;

      .el-button {
        padding: 7px 12px;
        margin-left: 10px;
      }
    }
  }

</style>
