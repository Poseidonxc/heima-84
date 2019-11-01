<template>
  <div>
    <p>top</p>
    <div>
      <!-- slot就是坑 -->
      <slot name="content" :abc="pageName">备用内容</slot>
    </div>
    <p>
      <slot name="footer">bottom</slot>
    </p>
  </div>
</template>

<script>
export default {
  data () {
    return {
      pageName: '组建的内部数据'
    }
  }
}
</script>

<style>
</style>
