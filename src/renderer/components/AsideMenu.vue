<template>
    <div v-loading="loading">
        <div class="menu-setting">
            <div class="menu-setting-checkbox">
                <el-checkbox v-model='localSetting.memoryLastRule'
                             @change='handleApplySetting' label="记住上次使用的源站" border
                             size="mini"></el-checkbox>
            </div>
            <div class="menu-setting-checkbox menu-setting-update">
                <el-checkbox v-model='localSetting.showProxyRule'
                             @change='handleApplySetting' label="显示全部" border
                             size="mini"></el-checkbox>
                <el-button size="mini" @click="handleUpdateRule">刷新</el-button>
            </div>
        </div>
        <el-menu :default-active="active" @select="emitRuleChanged">
            <el-menu-item v-for="it in filterRule" :key="it.id" :index="it.id">
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
  import {ipcRenderer, remote, shell} from 'electron'
  import BrowserLink from './BrowserLink'

  export default {
    components: {BrowserLink},
    props: {
      active: String
    },
    data () {
      return {
        rule: null,
        localSetting: null,
        loading: false
      }
    },
    computed: {
      filterRule () {
        return this.localSetting.showProxyRule ? this.rule : this.rule.filter((it) => !it.proxy)
      }
    },
    methods: {
      registerRendererListener () {
        /**
         * 加载规则完成
         */
        ipcRenderer.on('on-load-rule-data', (event, rule) => {
          let mapRule = this.mapRule(rule)
          localStorage.setItem('rule_json', JSON.stringify(mapRule))
          console.info('刷新规则数据', mapRule)
        })
        /**
         * 刷新规则完成
         */
        ipcRenderer.on('on-reload-rule-data', (event, rule) => {
          this.loading = false
          if (rule) {
            let mapRule = this.mapRule(rule)
            localStorage.setItem('rule_json', JSON.stringify(mapRule))
            this.rule = mapRule

            // 默认选择一个源站
            this.emitActiveRule()

            this.$message({
              message: '刷新完成',
              type: 'success'
            })
            console.info('加载规则完成', mapRule)
          } else {
            this.$message({
              message: '刷新失败，请检查URL',
              type: 'error'
            })
          }
        })
      },
      mapRule (rule) {
        const sort = ['preset', 'time', 'size', 'hot']
        rule.forEach((it, index) => {
          const newPaths = {}
          Object.keys(it.paths).sort((o1, o2) => sort.indexOf(o1) - sort.indexOf(o2))
            .forEach(key => {
              newPaths[key] = it.paths[key]
            })
          it.paths = newPaths
        })
        return rule
      },
      emitActiveRule () {
        const id = this.localSetting.memoryLastRule ? localStorage.getItem('last_rule_id') : null
        let active = this.getRuleByID(id)
        this.$emit('active-rule', active || this.rule[0])
      },
      emitRuleChanged (index) {
        this.$emit('change', this.getRuleByID(index))
      },
      getRuleByID (id) {
        for (let i = 0; i < this.rule.length; i++) {
          if (this.rule[i].id === id) {
            return this.rule[i]
          }
        }
      },
      handleClickProxyDoc () {
        shell.openExternal(this.project.proxyDocURL)
      },
      formatDefaultIcon (id) {
        return `${this.project.icons.baseUrl}/${id}.${this.project.icons.extension}`
      },
      handleApplySetting () {
        this.settings.saveSetting(this.localSetting)
      },
      handleUpdateRule () {
        this.loading = true
        ipcRenderer.send('reload-rule-data', this.localSetting.ruleUrl)
      }
    },
    created () {
      this.registerRendererListener()
      this.localSetting = this.settings.createLocal()

      this.rule = this.mapRule(ipcRenderer.sendSync('get-rule'))
      this.emitActiveRule()

      // 更新缓存
      ipcRenderer.send('load-rule-data', this.localSetting.ruleUrl)
    },
    mounted () {
    },
    activated () {
      this.localSetting = this.settings.getLocal()
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
