<template>
  <div class="login_container">
    <div class="login_box">
      <!-- logo -->
      <div class="avator_box">
        <img src="../assets/logo.png" />
      </div>
      <!-- 表单 -->
      <el-form
        :model="loginForm"
        :rules="rules"
        ref="loginForm"
        label-width="0px"
        class="login_form"
      >
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" prefix-icon="iconfont icon-denglu"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" prefix-icon="iconfont icon-14"></el-input>
        </el-form-item>
        <el-form-item class="login_btns">
          <el-button type="primary" @click="submitForm('loginForm')">登录</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', tigger: 'blur' },
          { min: 3, max: 10, message: '长度在3到10个字符', tigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', tigger: 'blur' },
          { min: 3, max: 6, message: '长度在3到6个字符', tigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    submitForm (formName) {
      this.$refs.loginForm.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('login', this.loginForm)
        if (res.meta.status === 200) {
          // 登录成功
          this.$message.success('登录成功！')
          // 登录成功之后需要将token保存在客户端的session中
          // console.log(res)
          window.sessionStorage.setItem('login', res.data.token)
          this.$router.push('/home')
        } else {
          // 登录失败
          //
          this.$message.error('登录失败！')
          // 测试2f
        }
      })
    },
    resetForm (formName) {
      console.log(this)
      this.$refs.loginForm.resetFields()
    }
  }
}
</script>

<style lang="less" scoped>
.login_container {
  background-color: #2b4b6b;
  height: 100vh;
}
.login_box {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  border-radius: 5px;
  background: #fff;
  height: 300px;
  width: 450px;

  .avator_box {
    width: 130px;
    height: 130px;
    border: 1px solid #eeeeee;
    border-radius: 50%;
    padding: 10px;
    background-color: #fff;
    overflow: hidden;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    // outline: ;
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background: #eeeeee;
    }
  }
}
.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
  .login_btns {
    display: flex;
    justify-content: flex-end;
  }
}
</style>
