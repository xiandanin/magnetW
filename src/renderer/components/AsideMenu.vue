<template>
  <el-scrollbar>
    <div class="aside-menu">
      <div class="menu-setting">
        <div class="menu-setting-checkbox">
          <el-checkbox v-model='localSetting.memoryLastRule'
                       @change='handleApplySetting' label="记住选择" border
                       size="mini"></el-checkbox>
          <el-button size="mini" class="menu-setting-button-right" @click="handleReloadRules(true)">刷新</el-button>
        </div>
      </div>
      <el-menu :default-active="active" v-loading="loading" @select="emitRuleChangeByID">
        <el-menu-item v-for="it in filterRules" :key="it.id" :index="it.id">
          <div slot="title" class="menu-item-title">
          <span class="menu-item-title-text">
            <el-image :src="it.icon||formatDefaultIcon(it.id)" class="favicon">
              <i slot="placeholder"></i>
              <i slot="error"></i>
            </el-image>
            <span class="source-name">{{it.name}}</span>
          </span>
            <el-tooltip v-if="config.cloud&&config.cloudUrl" effect="dark" placement="right">
              <div slot="content">此源站将使用云解析</div>
              <i class="el-icon-cloudy"></i>
            </el-tooltip>
            <el-tooltip v-else-if="it.proxy" effect="dark" placement="right">
              <template v-if="config.proxy">
                <div slot="content">此源站需要设置代理，已启用代理</div>
                <i class="el-icon-connection"></i>
              </template>
              <template v-else>
                <div slot="content">此源站需要设置代理，
                  <browser-link class="tooltip-content-proxy"
                                :href="$config.proxyDocURL" type="primary">查看详情
                  </browser-link>
                </div>
                <i class=" el-icon-warning-outline"></i>
              </template>
            </el-tooltip>
          </div>
        </el-menu-item>
      </el-menu>
    </div>
  </el-scrollbar>
</template>

<script>
  import {ipcRenderer} from 'electron'
  import ruleList from '~/rule'
  import BrowserLink from './BrowserLink'

  export default {
    components: {BrowserLink},
    props: {
      active: String
    },
    data () {
      return {
        ruleList: this.$localSetting.get('rule_list') || ruleList,
        localSetting: {
          memoryLastRule: false
        },
        config: ipcRenderer.sendSync('get-server-config'),
        loading: false
      }
    },
    watch: {
      active (id) {
        // this.emitRuleChangeByID(id)
      }
    },
    computed: {
      filterRules () {
        if (this.config.showProxyRule) {
          return this.ruleList
        } else {
          return this.ruleList.filter((it) => !it.proxy)
        }
      }
    },
    methods: {
      emitRuleChangeByID (id) {
        const rules = this.filterRules
        let active = rules[0]
        for (let i = 0; i < rules.length; i++) {
          if (id === rules[i].id) {
            active = rules[i]
            break
          }
        }
        this.$emit('change', active)
      },
      handleRefreshActiveRule () {
        const localSetting = this.$localSetting.get()
        if (Object.keys(localSetting).length > 0) {
          this.localSetting = localSetting
        }
        let active = this.active
        if (localSetting.memoryLastRule && localSetting.last_rule_id) {
          active = localSetting.last_rule_id
        }

        this.emitRuleChangeByID(active)
      },
      formatDefaultIcon (id) {
        return `${this.$config.icons.baseUrl}/${id}.${this.$config.icons.extension}`
      },
      handleApplySetting () {
        this.$localSetting.save(this.localSetting)
      },
      handleReloadRules (reload) {
        if (reload) this.loading = true
        this.$http.get('load-rule').then((rsp) => {
          this.$localSetting.saveValue('rule_list', rsp.data)
          this.ruleList = rsp.data
          this.handleRefreshActiveRule()
          this.emitChangeRules()
        }).catch((err) => {
          this.emitChangeRules(err)
        }).finally(() => {
          if (reload) this.loading = false
        })
      },
      emitChangeRules (err) {
        if (err) {
          this.$emit('rule-refresh-finished', 'error', '刷新规则失败')
        } else {
          const title = `成功刷新${this.ruleList.length}个规则`
          const message = this.config.showProxyRule ? null : `其中${this.ruleList.length - this.filterRules.length}个已隐藏，如需显示请更改设置`
          this.$emit('rule-refresh-finished', 'success', title, message)
        }
      }
    },
    created () {
    },
    mounted () {
      // 接收设置刷新的通知
      this.$on('global:event-config-refreshed', (config, oldConfig) => {
        this.config = config
        // 如果修改规则url 重新加载列表
        if (config.ruleUrl !== oldConfig.ruleUrl) {
          this.handleReloadRules(false)
        } else if (config.showProxyRule !== oldConfig.showProxyRule) {
          // 如果仅修改了显示所有开关 重新检查过滤列表
          this.emitChangeRules()
        }
      })

      this.handleRefreshActiveRule()
      this.handleReloadRules()
    },
    activated () {
    }
  }
</script>

<style lang="scss" scoped>

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
      margin-bottom: 12px;
    }

    .menu-setting-button-right {
      margin-left: 5px;
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

  .el-icon-warning-outline {
    color: $--color-danger !important;
    font-size: 16px;
  }

  .el-icon-connection {
    font-size: 16px;
    color: $--color-success !important;
  }

  .el-icon-cloudy {
    font-size: 16px;
    color: $--color-primary !important;
  }

</style>
