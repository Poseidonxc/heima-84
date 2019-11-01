<template>
  <div class="container">
    <el-card>
      <img src="../../assets/logo_index.png" width="200px" alt />
      <el-form ref="loginForm" status-icon :model="loginForm" :rules="loginRules">
        <el-form-item prop="mobile">
          <el-input v-model="loginForm.mobile" placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item prop="code">
          <el-input
            v-model="loginForm.code"
            style="width:235px;margin-right:10px;"
            placeholder="请输入验证码"
          ></el-input>
          <el-button>发送验证码</el-button>
        </el-form-item>
        <el-form-item></el-form-item>
        <el-checkbox :value="true" class="aaa">我已阅读并同意用户协议和隐私条款</el-checkbox>
        <el-form-item>
          <el-button type="primary" @click="login" style="width:100%">立即登录</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>
<script>
import local from '@/utils/local'
export default {
  data () {
    // 定义一个校验手机号的函数
    const checkMobile = (rule, value, callback) => {
      // 通过逻辑来判断成功还是失败（手机号的格式先约定好）
      if (/^1[3-9]\d{9}$/.test(value)) {
        callback()
      } else {
        callback(new Error('手机号码格式不对'))
      }
    }
    return {
      loginForm: {
        mobile: '13131313131',
        code: '246810'
      },
      // 校验规则
      loginRules: {
        mobile: [
          {
            required: true,
            message: '请输入手机号',
            // 失去焦点是触发
            trigger: 'blur'
          },
          { validator: checkMobile, trigger: 'blur' }
        ],
        code: [
          {
            required: true,
            message: '请输入验证码',
            trigger: 'blur'
          },
          { len: 6, message: '请输入正确的六位字符验证码', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // login () {
    //   // 获取表单的实例
    //   this.$refs['loginForm'].validate(valid => {
    //     if (valid) {
    //       // this.$http
    //       //   .post('authorizations', this.loginForm)
    //       //   .then(res => {
    //       //     // 请求成功
    //       //     // 保存用户信息
    //       //     local.setUser(res.data.data)
    //       //     this.$router.push('/')
    //       //   })
    //       //   .catch(() => {
    //       //     // 请求失败
    //       //     this.$message.error('手机号或验证码错误')
    //       //   })
    //       const res =awa
    //     }
    //   })
    // }
    login () {
      // 获取表单组件实例 ---> 调用校验函数
      this.$refs['loginForm'].validate(async valid => {
        if (valid) {
          // 当一段代码不能保证一定没有报错  try {} catch (e) {} 捕获异常处理异常
          try {
            const {
              data: { data }
            } = await this.$http.post('authorizations', this.loginForm)
            local.setUser(data)
            this.$router.push('/')
          } catch (e) {
            this.$message.error('手机号或验证码错误')
          }
        }
      })
    }
  }
}
</script>

<style scoped='less'>
.container {
  width: 100%;
  height: 100%;
  background: pink;
  position: absolute;
  left: 0;
  top: 0;
  background: url(../../assets/login_bg.jpg) no-repeat center / cover;
}
.el-card {
  width: 400px;
  height: 350px;
  position: absolute;
  left: 50%;
  top: 20%;
  transform: translate(-50%);
}
img {
  width: 200px;
  display: block;
  margin: 0 auto 30px;
}
.aaa {
  margin-bottom: 25px;
}
</style>
