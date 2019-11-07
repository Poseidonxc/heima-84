<template>
  <div class='container-setting'>
    <el-card>
      <div slot="header">
        <my-bread>个人设置</my-bread>
      </div>
      <!-- 栅格 -->
      <!-- 行 -->
      <el-row>
          <!-- 列 -->
        <el-col :span="12">
          <!-- 表单 -->
          <el-form label-width="120px">
            <el-form-item label="编号：">{{userInfo.id}}</el-form-item>
            <el-form-item label="手机：">{{userInfo.mobile}} </el-form-item>
            <el-form-item label="媒体名称：">
              <el-input v-model="userInfo.name"></el-input>
            </el-form-item>
            <el-form-item label="媒体介绍：">
              <el-input v-model="userInfo.intro" type="textarea" :rows="3"></el-input>
            </el-form-item>
            <el-form-item label="邮箱：">
              <el-input v-model="userInfo.email"></el-input>
            </el-form-item>
            <el-form-item >
              <el-button type="primary" @click="saveInfo">保存设置</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="12">
          <!-- 上传 -->
          <!-- el-upload的默认上传请求方式是post -->
           <!-- 覆盖默认上传行为 :http-request="" -->
        <el-upload
        class="avatar-uploader"
        action=""
        :http-request="uploadPhoto"
        :show-file-list="false"
      >
        <img v-if="userInfo.photo" :src="userInfo.photo" class="avatar" />
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
          <p style="text-align:center">修改头像</p>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import eventBus from '@/eventBus'
import local from '@/utils/local'
export default {
  data () {
    return {
      userInfo: {
        name: '',
        intro: '',
        email: '',
        photo: null
      }
    }
  },
  created () {
    this.getUserInfo()
  },
  methods: {
    //   修改用户头像
    async uploadPhoto ({ file }) {
      // result是一个默认传参result.file是你选择图片后的结果提前进行结构就是获取（{file}）
      // 获取文件对象file (文章没有写可能忘写了)
      const formData = new FormData()
      formData.append('photo', file)
      const { data: { data } } = await this.$http.patch('user/photo', formData)
      this.$message.success('修改头像成功')
      // 预览
      this.userInfo.photo = data.photo
      // 更新home组件头像
      eventBus.$emit('updataPhoto', data.photo)
      // 更新本地存储的头像
      // 把存储信息先给拿出来（记得引入本地存储组件）
      const user = local.getUser()
      // 改本地存储
      user.photo = data.photo
      // 把本次存储放回去
      local.setUser(user)
    },
    // 保存用户信息（除头像）
    async saveInfo () {
      const { name, email, intro } = this.userInfo
      await this.$http.patch('user/profile', {
        name,
        email,
        intro
      })
      // 提示信息
      this.$message.success('设置成功')
      // 改home组件
      eventBus.$emit('updataName', name)
      // 改本地存储
      // 把存储信息先给拿出来（记得引入本地存储组件）
      const user = local.getUser()
      // 改本地存储
      user.name = name
      // 把本次存储放回去
      local.setUser(user)
    },
    // 获取用户信息
    async getUserInfo () {
      const { data: { data } } = await this.$http.get('user/profile')
      this.userInfo = data
    }
  }
}
</script>

<style scoped lang='less'></style>
