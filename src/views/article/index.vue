<template>
  <div>
    <!-- 筛选条件布局 -->
    <el-card>
      <div slot="header">
        <my-bread>内容管理</my-bread>
      </div>
      <!-- 表单 -->
      <el-form label-width="80px" size="small">
        <el-form-item label="状态">
          <el-radio-group v-model="reqParams.status">
            <el-radio :label="null">全部</el-radio>
            <el-radio :label="0">草稿</el-radio>
            <el-radio :label="1">待审核</el-radio>
            <el-radio :label="2">审核通过</el-radio>
            <el-radio :label="3">审核失败</el-radio>
            <el-radio :label="4">已删除</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="频道">
          <!-- 频道组件 -->
          <!-- v-model的本质是绑定value属性和绑定input事件 -->
          <my-channel v-model="reqParams.channel_id"></my-channel>
        </el-form-item>
        <el-form-item label="日期">
          <!-- v-model 绑定的数组  [起始时间,结束时间] -->
          <el-date-picker
            v-model="dateArr"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="changeDate"
            value-format="yyyy-MM-dd"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">筛选</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <!-- 筛选结果布局 -->
    <el-card style="margin-top:20px">
      <div slot="header">
        <span>根据筛选条件共查询到 {{total}} 条结果</span>
      </div>
      <!-- 表格 -->
      <el-table :data="articles">
        <el-table-column label="封面">
          <template slot-scope="scope">
            <!-- 第一张封面图 -->
            <!-- prop作用是指定数组对象的每个字段名但是只是做了普通类的渲染，
            自定义（图片什么的也要显示就要用自定义类渲染）当用自定义渲染后普通类的渲染就可以不要了，同时-->
            <el-image :src="scope.row.cover.images[0]" fit="fill" style="width:150px;height:100px">
              <div slot="error">
                <img src="../../assets/error.gif" width="150" height="100" />
              </div>
            </el-image>
          </template>
        </el-table-column>
        <el-table-column label="标题" prop="title"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status===0" type="info">草稿</el-tag>
            <el-tag v-if="scope.row.status===1">待审核</el-tag>
            <el-tag v-if="scope.row.status===2" type="success">审核通过</el-tag>
            <el-tag v-if="scope.row.status===3" type="warning">审核失败</el-tag>
            <el-tag v-if="scope.row.status===4" type="danger">已删除</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="发布时间" prop="pubdate"></el-table-column>
        <el-table-column label="操作" width="120px">
          <template slot-scope="scope">
            <el-button
              @click="toEdit(scope.row.id)"
              type="primary"
              icon="el-icon-edit"
              plain
              circle
            ></el-button>
            <el-button @click="del(scope.row.id)" type="danger" icon="el-icon-delete" plain circle></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <!-- total是总条数默认是一页显示10个！-->
      <!-- :page-size="reqParams.per_page"默认每页显示10条 -->
      <!-- :current-page="reqParams.page"动态绑定当前的页码 -->
      <!-- current-change 事件：当页码改变（点击页码按钮，上一页，下一页）就执行  参数当前改变后的页码-->
      <el-pagination
        style="margin-top:20px"
        background
        layout="prev, pager, next"
        :page-size="reqParams.per_page"
        :current-page="reqParams.page"
        :total="total"
        @current-change="pager"
      ></el-pagination>
    </el-card>
  </div>
</template>
<script>
export default {
  data () {
    return {
      // 筛选参数
      // 使用axios提交数据时候  如果数据的值为null是不会提交该字段
      reqParams: {
        status: null,
        channel_id: null,
        begin_pubdate: null,
        end_pubdate: null,
        // 页数(动态设置页数)
        page: 1,
        // 每页数量
        per_page: 20
      },
      // 日期数组
      channelOptions: [],
      dateArr: [],
      // 文章列表
      articles: [],
      // 文章的总条数
      total: 0
    }
  },
  created () {
    // this.getChannelOptions()
    this.getArticles()
  },
  methods: {
    // // 获取频道选项数据
    // async getChannelOptions () {
    //   const {
    //     data: { data }
    //   } = await this.$http.get('channels')
    //   // 赋值频道下拉选项依赖数据
    //   this.channelOptions = data.channels
    // },
    // 获取文章列表数据（拿后端数据都是异步操作）
    async getArticles () {
      const {
        data: { data }
        // 在地址栏后传参有两种
        // 第一种： axios.get(url?key=value&key1=vaule1&...) get传参
        // 第二种： axios.get(url, {params:参数对象})
      } = await this.$http.get('articles', { params: this.reqParams })
      // 赋值文章列表依赖数据
      this.articles = data.results
      // 给文章总条数赋值
      this.total = data.total_count
    },
    // 分页功能
    pager (newPage) {
      // 根据新的页码和当前的筛选条件 重新查询数据即可
      this.reqParams.page = newPage
      this.getArticles()
    },
    // 选择日期触发的事件函数
    changeDate (dateArr) {
      // dateArr 的数据格式：[date,date]
      // 后端需要的是字符串格   dateArr 的数据格式：[string,string]
      // 注意：清除选择的日期后  dateArr的值 null
      if (dateArr) {
        this.reqParams.begin_pubdate = dateArr[0]
        this.reqParams.end_pubdate = dateArr[1]
      } else {
        this.reqParams.begin_pubdate = null
        this.reqParams.end_pubdate = null
      }
    },
    // 筛选查询
    search () {
      // 获取日期进行数据查询但是当你按条件筛选会默认让查询结果从第一页显示
      // 如果频道值为空应该改为null
      if (this.reqParams.channel_id === '') this.reqParams.channel_id = null
      this.reqParams.page = 1
      this.getArticles()
    },
    toEdit (id) {
      // this.$router.push('/publish?id='+id)
      this.$router.push({ path: '/publish', query: { id } })
    },
    // 删除
    async del (id) {
      await this.$http.delete(`articles/${id}`)
      // 提示下
      this.$message.success('删除成功!')
      this.getArticles()
    }
  }
}
</script>
<style>
</style>
