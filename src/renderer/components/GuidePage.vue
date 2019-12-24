<template>
  <div class="guide-page">
    <el-alert
      class="guide-page-alert"
      :style="message?'visibility: inherit;':'visibility: hidden;'"
      :type="type"
      :closable="false"
      show-icon>
      <span slot="title">{{message}}</span>
    </el-alert>
    <div class="guide-page-content">
      <div v-for="it in $config.guide.content" class="guide-content">
        <span class="guide-title">{{it.title}}</span>
        <div class="guide-content-item" v-for="item in it.items">
          <browser-link v-if="item.link" :href="item.link" type="primary">{{item.text}}</browser-link>
          <span v-else class="guide-content-item-text">{{item.text}}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import BrowserLink from './BrowserLink'

  export default {
    props: ['message', 'type'],
    components: {
      BrowserLink
    },
    data () {
      return {}
    },
    computed: {},
    methods: {},
    created () {
    }
  }
</script>

<style scoped lang="scss">

  .guide-page-alert {
    min-height: 36px;
  }

  .guide-page-content {
    margin-top: 20px;
  }

  .guide-content {
    margin: 10px 0 20px 0;
  }

  .guide-title {
    display: block;
    font-size: 1.3em;
    margin: 10px 0;
    font-weight: bold;
    color: $--color-text-primary;
  }

  .guide-content-item {
    margin-bottom: 5px;
    margin-left: 20px;
    font-size: 16px;

    .el-link {
      font-size: 16px;
    }
  }

  .guide-content-item-text {
    margin-right: 10px;
  }

  .footerText {
    color: $color-text-gray;
    font-size: $font-size;
  }
</style>
