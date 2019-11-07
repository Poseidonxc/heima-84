<template>
  <el-container class="container">
    <el-aside :width="isOpen?'200px':'64px'">
      <!-- 导航菜单 -->
      <div class="logo" :class="{smallLogo:!isOpen}"></div>
      <!-- 导航菜单 -->
      <el-menu
        :default-active="$route.path"
        background-color="#002033"
        text-color="#fff"
        active-text-color="#ffd04b"
        style="border-right:none"
        router:true当有这个类型是为true没得话自动为flash
        router
      >
        <el-menu
          :default-active="$route.path"
          background-color="#002033"
          text-color="#fff"
          active-text-color="#ffd04b"
          :collapse="!isOpen"
          :collapse-transition="false"
          style="border-right:none"
          router
        >
          <el-menu-item index="/">
            <i class="el-icon-s-home"></i>
            <span slot="title">首页</span>
          </el-menu-item>
          <el-menu-item index="/article">
            <i class="el-icon-document"></i>
            <span slot="title">内容管理</span>
          </el-menu-item>
          <el-menu-item index="/image">
            <i class="el-icon-picture"></i>
            <span slot="title">素材管理</span>
          </el-menu-item>
          <el-menu-item index="/publish">
            <i class="el-icon-s-promotion"></i>
            <span slot="title">发布文章</span>
          </el-menu-item>
          <el-menu-item index="/comment">
            <i class="el-icon-chat-dot-round"></i>
            <span slot="title">评论管理</span>
          </el-menu-item>
          <el-menu-item index="/fans">
            <i class="el-icon-present"></i>
            <span slot="title">粉丝管理</span>
          </el-menu-item>
          <el-menu-item index="/setting">
            <i class="el-icon-setting"></i>
            <span slot="title">个人设置</span>
          </el-menu-item>
        </el-menu>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header>
        <!-- 图标 -->
        <span class="el-icon-s-fold icon" @click="toggleMenu"></span>
        <!-- 文字 -->
        <span class="text">江苏传智播客科技教育有限公司</span>
        <!-- 下拉菜单组件 -->
        <el-dropdown class="dropdown" @command="aaa">
          <span class="el-dropdown-link">
            <img class="headIcon" :src="userInfo.photo" alt />
            <span class="userName">{{userInfo.name}}</span>
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown" >
            <!-- <el-dropdown-item icon="el-icon-setting" @click.native="setting">个人设置</el-dropdown-item>
            <el-dropdown-item icon="el-icon-unlock" @click.native="logout">退出登录</el-dropdown-item> -->
            <el-dropdown-item icon="el-icon-setting" command="setting">个人设置</el-dropdown-item>
            <el-dropdown-item icon="el-icon-unlock" command="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-header>
      <el-main>
        <!-- 二级路由的渲染位置 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
import local from '@/utils/local'
import eventBus from '@/eventBus'
// - 用户的信息存储本地
//   - 获取 local.getUser()
// - 申明数据
// - 在模版中使用
export default {
  data () {
    return {
      isOpen: true,
      // 如果想要响应式的数据建议先声明
      userInfo: {
        name: '',
        photo: ''
      }
    }
  },
  created () {
    // 设置用户信息
    const user = local.getUser() || {}
    this.userInfo.name = user.name
    this.userInfo.photo = user.photo
    // 绑定事件去接受咱们修改name后的设置(记得导入eventBus)
    eventBus.$on('updataName', (name) => {
      this.userInfo.name = name
    })
    // 绑定事件去接受咱们修改photo后的设置(记得导入eventBus)
    eventBus.$on('updataPhoto', (photo) => {
      this.userInfo.photo = photo
    })
  },
  methods: {
    toggleMenu () {
      // 切换左菜单展开与收起
      this.isOpen = !this.isOpen
    },
    // 给组件绑定时间，如果组件不支持，事件就不会被触发
    // 你应该把事件绑定到组件解析后的原生dom上利用native
    setting () {
      this.$router.push('/setting')
    },
    logout () {
      local.delUser()
      this.$router.push('/login')
    },
    aaa (command) {
      this[command]()
    }
  }
}
</script>
<style>
.container {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
}
.el-aside {
  background: #002033;
}
.logo {
  width: 100%;
  height: 60px;
  background: #002244 url(../../assets/logo_admin.png) no-repeat center / 140px
    auto;
}
.el-header {
  line-height: 60px;
  border-bottom: 1px solid #ddd;
}
.icon {
  font-size: 30px;
  vertical-align: middle;
  /* 以基线对齐 */
}
.text {
  margin-left: 10px;
  vertical-align: middle;
}
.dropdown {
  float: right;
}
.headIcon {
  width: 30px;
  height: 30px;
  vertical-align: middle;
}
.userName {
  font-weight: bold;
  vertical-align: middle;
  margin-left: 5px;
}
.smallLogo {
  background-image: url(../../assets/logo_admin_01.png);
  background-size: 36px auto;
}
</style>
