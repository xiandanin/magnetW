<template>
  <router-link :to="router" :tag="tag||'span'">
    <slot></slot>
  </router-link>
</template>

<script>
export default {
  props: {
    'name': String,
    'query': Object,
    'params': Object,
    'tag': String
  },
  computed: {
    router () {
      const query = {}
      Object.assign(query, this.$route.query, this.query)
      const router = {query: query}
      if (this.name) {
        router['name'] = this.name
      }
      router['params'] = this.params || this.$route.params
      return router
    }
  }
}
</script>
