<template>
  <div class="container-comment">
      <el-card>
          <div slot="header">
              <my-bread>评论管理</my-bread>
          </div>
      </el-card>
      <!-- 表格 -->
      <el-table :data="articles">
        <el-table-column label="标题" width="400px" prop="title"></el-table-column>
        <el-table-column label="总评论数" prop="total_comment_count"></el-table-column>
        <el-table-column label="粉丝评论" prop="fans_comment_count"></el-table-column>
        <el-table-column label="状态">
        <!-- 当需要显示额外的状态是用插槽 -->
        <template slot-scope="scope">{{scope.row.comment_status?'正常':'关闭'}}</template>
        </el-table-column>
        <el-table-column label="操作">
        <template slot-scope="scope">
            <el-button @click="toggleStatus(scope.row.id,false)" v-if="scope.row.comment_status" type="danger" size="small">关闭评论</el-button>
            <el-button @click="toggleStatus(scope.row.id,true)" v-else type="success" size="small">打开评论</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
    <el-pagination
        style="margin-top:20px"
        background
        layout="prev, pager, next"
        :page-size="reqParams.per_page"
        :current-page="reqParams.page"
        :total="total"
        @current-change="pager"
      ></el-pagination>
  </div>
</template>

<script>
export default {
  data () {
    return {
      articles: [],
      reqParams: {
        response_type: 'comment',
        page: 1,
        per_page: 20
      },
      total: 0
    }
  },
  created () {
    this.getArticles()
  },
  methods: {
    // 获取文章列表的打开或关闭状态
    toggleStatus (id, status) {
      const text = status ? '您确认要打开评论吗？' : '您确认关闭评论吗，如果关闭用户将无法对该文章进行评论。'
      this.$confirm(text, '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        // 确认时候
        const { data: { data } } = await this.$http.put(`comments/status?article_id=${id}`, {
          allow_comment: status
        })
        // 提示
        this.$message.success(data.allow_comment ? '打开评论成功' : '关闭评论成功')
        // 更新当前列表
        this.getArticles()
      }).catch(() => {})
    },
    // 获取的是文章列表信息但是需要加上评论的相关的信息
    async getArticles () {
      const { data: { data } } = await this.$http.get('articles', { params: this.reqParams })
      //   渲染
      this.articles = data.results
      //   总条数
      this.total = data.total_count
    },
    page (newPage) {
      this.reqParams.page = newPage
      this.getArticles()
    }
  }
}
</script>

<style scoped lang='less'></style>
