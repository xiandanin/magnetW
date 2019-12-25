<template>
  <div class="pager-footer">
    <span class="header-disclaimer-text">{{$config.footerText}}</span>
  </div>
</template>

<script>
  export default {
    props: ['text'],
    methods: {},
    mounted () {
    }
  }
</script>

<style lang="scss" scoped>
  .pager-footer {
    position: absolute;
    width: 100%;
    z-index: 2000;
    bottom: 0;
    padding: 15px;
    min-height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    background-color: cornsilk;
  }

  .header-disclaimer-text {
    color: $color-text-gray;
    font-size: 12px;
  }

</style>
