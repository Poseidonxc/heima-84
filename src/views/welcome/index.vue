<template>
  <div class="container-welcome">
    <img src="../../assets/welcome.jpg" alt class="bbb" />
  </div>
</template>

<script>
export default {
  created () {
    // 测试
    this.$http
      .get('http://ttapi.research.itcast.cn/mp/v1_0/articles')
      .then(res => {
        console.log(res.data)
      })
      .catch(() => {
        console.log('error')
      })
  }
}
</script>

<style lang="less">
.bbb {
  display: block;
  margin: 0 auto;
}
</style>
