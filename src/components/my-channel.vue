<template>
  <el-select :value="value" @change="fn" placeholder="请选择" clearable>
    <el-option v-for="item in channelOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
  </el-select>
</template>
<script>
export default {
  // 因为上面用的V-model来绑定了value的值，但是V-model是双向绑定的可以去修改value的值，
  // 但是父传子的值是不能修改只能读取的所以只能用:value来赋值
  props: ['value'],
  data () {
    return {
      // value: null,
      channelOptions: []
    }
  },
  created () {
    this.getChannelOptions()
  },
  methods: {
    // 值改变的函数
    fn (channelId) {
      // 如果channelId的值等于空，那么应该把channeId的赋值给空这样就不用在父组件里进行判断了！
      if (channelId === '') channelId = null
      // 把数据提交给父组件
      this.$emit('input', channelId)
    },
    async getChannelOptions () {
      const {
        data: { data }
      } = await this.$http.get('channels')
      // 赋值频道下拉选项依赖数据
      this.channelOptions = data.channels
    }
  }
}
</script>

<style>
</style>
