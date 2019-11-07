<template>
  <div>
    <el-card>
      <div slot="header">
        <my-bread>素材管理</my-bread>
      </div>
      <div class="btn_box">
        <!-- 按钮组 -->
        <!-- 统一设置尺寸size="small" -->
        <el-radio-group @change="toggleLise" v-model="reqParams.collect" size="small">
          <!-- label的值就是值 -->
          <el-radio-button :label="false">全部</el-radio-button>
          <el-radio-button :label="true">收藏</el-radio-button>
        </el-radio-group>
        <!-- 按钮 -->
        <el-button @click="open" style="float:right" type="success" size="small">添加素材</el-button>
        <!-- 素材列表 -->
        <div class="img_list">
          <div class="img_item" v-for="item in images" :key="item.id">
            <img :src="item.url" />
            <div class="footer" v-if="!reqParams.collect">
              <span
                @click="toggleStatus(item)"
                class="el-icon-star-off"
                :class="{red:item.is_collected}"
              ></span>
              <span @click="deleteImage(item.id)" class="el-icon-delete"></span>
            </div>
          </div>
        </div>
        <!-- 分页 -->
        <el-pagination
          background
          layout="prev, pager, next"
          :total="total"
          :page-size="reqParams.per_page"
          :current-page="reqParams.page"
          @current-change="pager"
        ></el-pagination>
      </div>
    </el-card>
    <!-- 对话框 -->
    <el-dialog title="添加素材" :visible.sync="dialogVisible" width="300px">
      <el-upload
        class="avatar-uploader"
        action="http://ttapi.research.itcast.cn/mp/v1_0/user/images"
        :headers="headers"
        name="image"
        :show-file-list="false"
        :on-success="chengGong"
      >
        <img v-if="imageUrl" :src="imageUrl" class="avatar" />
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
    </el-dialog>
  </div>
</template>
<script>
import local from '@/utils/local'
export default {
  data () {
    return {
      reqParams: {
        // false:全部 true:收藏
        collect: false,
        page: 1,
        per_page: 10
      },
      // 素材列表
      images: [],
      // 总条数
      total: 0,
      // 对话框显示与隐藏
      dialogVisible: false,
      // 上传成功后的图片地址
      imageUrl: null,

      // 上传头部
      headers: {
        Authorization: `Bearer ${local.getUser().token}`
      }
    }
  },
  created () {
    this.getImages()
  },
  methods: {
    open () {
      this.dialogVisible = true
      this.imageUrl = null
    },
    // 获取素材列表数据
    async getImages () {
      const {
        data: { data }
      } = await this.$http.get('user/images', { params: this.reqParams })
      this.images = data.results
      // 赋值总条数
      this.total = data.total_count
    },
    // 分页效果
    pager (newPage) {
      this.reqParams.page = newPage
      this.getImages()
    },
    // 切换列表
    toggleLise () {
      this.reqParams.page = 1
      this.getImages()
    },
    // 切换收藏功能
    async toggleStatus (item) {
      const {
        data: { data }
      } = await this.$http.put(`user/images/${item.id}`, {
        collect: !item.is_collected
      })
      // 成功后
      item.is_collected = data.collect
      // 提示
      this.$message.success(data.collect ? '添加收藏' : '取消收藏' + '完成')
    },
    // 删除功能
    deleteImage (id) {
      this.$confirm('此操作将永久删除该图片, 是否继续?', '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          // 点击了确认
          await this.$http.delete(`user/images/${id}`)
          // 删除成功
          this.$message.success('删除成功')
          // 更新列表
          this.getImages()
        })
        .catch(() => {
          // 点击了取消
        })
    },
    // 上传图片功能
    // 上传图片成功但是要加上字段名image,res就是响应主体
    // 获取图片地址res.data.url
    // 给image的url赋值就可以预览了res.data.url
    chengGong (res) {
      this.imageUrl = res.data.url
      // 提示上传成功
      this.$message.success('上传成功')
      // 两秒钟后收起对话框定时器
      window.setTimeout(() => {
        this.dialogVisible = false
        this.getImages()
      }, 2000)
    }
  }
}
</script>
<style scoped lang='less'>
.img_list {
  padding-top: 20px;
  .img_item {
    width: 150px;
    height: 150px;
    position: relative;
    border: 1px dashed #ddd;
    display: inline-block;
    margin-right: 50px;
    margin-bottom: 20px;
    img {
      width: 100%;
      height: 100%;
    }
    .footer {
      position: absolute;
      left: 0;
      bottom: 0;
      height: 30px;
      line-height: 30px;
      background: rgba(0, 0, 0, 0.3);
      width: 100%;
      text-align: center;
      color: #fff;
      span {
        margin: 0 20px;
        &.red {
          color: red;
        }
      }
    }
  }
}
// 上传组件的样式
.avatar-uploader {
  text-align: center;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
