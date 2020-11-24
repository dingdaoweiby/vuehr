<template>
  <div>
    <el-form
        :rules="rules"
        ref="loginForm"
        v-loading="loading"
        element-loading-text="Login In, Please wait..."
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
        :model="loginForm"
        class="loginContainer">
      <h3 class="loginTitle">System Login</h3>
      <el-form-item prop="username">
        <el-input size="normal" type="text" v-model="loginForm.username" auto-complete="off" placeholder="please enter username"></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input size="normal" type="password" v-model="loginForm.password" auto-complete="off" placeholder="please enter password" @keydown.enter.native="sumbitLogin"></el-input>
      </el-form-item>
      <el-checkbox size="normal" class="loginRem" v-model="checked"></el-checkbox>
      <el-button size="normal" type="primary" style="width: 100%" @click="sumbitLogin">Login</el-button>
    </el-form>
  </div>
</template>

<script>

  export default {
    name: "Login",
    data() {
      return {
          loading:false,
          loginForm: {
            username: 'admin',
            password: '123'
          },
          checked: true,
          rules:{
             username:[{required:true, message:"please enter username", trigger:"blur"}],
             password:[{required:true, message:"please enter password", trigger:"blur"}]
         }
      }
    },
    methods: {
      sumbitLogin() {
          this.$refs.loginForm.validate((valid) => {
          if (valid) {
              this.loading= true;
              this.postKeyValueRequest('/doLogin',this.loginForm).then(resp=>{
                  this.loading=false;
                  if (resp) {
                      this.$store.commit('INIT_CURRENTHR', resp.obj);
                    window.sessionStorage.setItem("user",JSON.stringify(resp.obj));
                    let path = this.$route.query.redirect;
                    this.$router.replace((path === '/' || path === undefined) ? '/home' : path);
                  }
              })
          } else {
            this.$message.error('Please enter all info')
            return false;
          }
        });
      }
    }

  }
</script>

<style>
  .loginContainer {
    border-radius: 15px;
    background-clip: padding-box;
    margin: 180px auto;
    width: 350px;
    padding: 15px 35px 15px 35px;
    background: #ffffff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
  }
  .loginTitle {
    margin: 15px auto 15px auto;
    text-align: center;
    color: #505458;
  }
  .loginRem {
    text-align: left;
    margin: 0 0 15px 0;
  }
</style>
