<template>
    <div class="login_container">
        <div class="login_box">
            <!-- 头像 -->
            <div class="avatar_box">
                <img src="../assets/logo.png" alt="">
            </div>
            <!-- 登陆表单 -->
            <el-form class="login_form" :model="LoginForm" :rules="LoginFormRules" ref="LoginFormRef">
                <!-- 用户名 -->
                <el-form-item prop="username">
                  <el-input prefix-icon="iconfont icon-user" v-model="LoginForm.username"></el-input>
                </el-form-item>
                <!-- 密码 -->
                <el-form-item prop="password">
                  <el-input  prefix-icon="iconfont icon-3702mima" type="password" v-model="LoginForm.password"></el-input>
                </el-form-item>
                <!-- 按钮 -->
                <el-form-item class="btns">
                   <el-button type="primary" @click='Login'>登陆</el-button>
                   <el-button type="info" @click="resetLoginForm">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
export default {
  data(){
      return{
          LoginForm:{
              username:'',
              password:''
          },
        //   验证表单内容
          LoginFormRules:{
              username:[
                   { required: true, message: '请输入登陆名称', trigger: 'blur' },
                   { min: 3, max: 12, message: '名称长度在 3 到 12个字符', trigger: 'blur' }
              ],
              password:[
                  { min: 6, max: 12, message: '密码长度在 6 到 12 个字符', trigger: 'blur' }
              ]
          }
      }
  },
  methods:{
    //   重置表单内容
      resetLoginForm(){
          this.$refs.LoginFormRef.resetFields();
      },
    //   表单预验证
      Login(){
          this.$refs.LoginFormRef.validate(async(valid)=>{
            // console.log(valid)
            if(!valid) {return};
            const {data:res}=await this.$http.post('login',this.LoginForm);
            if(res.meta.status!==200){
              return this.$message.error('登陆失败'+res.meta.msg)
            }
              this.$message.success('登录成功');
              // 保存token
              window.sessionStorage.setItem('token', res.data.token)
              // 导航至/home
              this.$router.push('/home')
          })
      }
  }
}
</script>

<style lang="less" scoped>
.login_container {
  background-color: #2b5b6b;
  height: 100%;
}
.login_box {
  width: 450px;
  height: 300px;
  background: #fff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  .avatar_box{
      width: 130px;
      height: 130px;
      padding: 10px;
      position: absolute;
      left: 50%;
      transform: translate(-50%,-50%);
      border: 1px solid #eee;
      border-radius: 50%;
      box-shadow: 0 0 10px #ddd;
       background-color: #fff;
      img{
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background-color: #eee;
      }
  }
  }
  .login_form {
      position: absolute;
      bottom: 0;
      width: 100%;
      padding:0 20px;
      box-sizing: border-box;
      .btns {
        display: flex;
        justify-content: flex-end;
    }
  }
</style>