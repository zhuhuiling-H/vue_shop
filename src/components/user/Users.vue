<template>
  <div>
      <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>活动管理</el-breadcrumb-item>
        <el-breadcrumb-item>活动列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card> <!-- 卡片 -->
        <el-row :gutter="20">
            <el-col :span="8">
                    <el-input placeholder="请输入内容"  class="input-with-select"
                    v-model="queryInfo.query" clearable @clear="getUserList">
                        <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
                    </el-input>
            </el-col>
            <el-col :span="4">
                <el-button type="primary" @click="addDialogVisible=true">添加用户</el-button>
            </el-col>
        </el-row>
        <!-- 用户列表(表格)区域 -->
        <el-table :data="userList" border stripe>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="姓名" prop="username"></el-table-column>
            <el-table-column label="邮箱" prop="email"></el-table-column>
            <el-table-column label="电话" prop="mobile"></el-table-column>
            <el-table-column label="角色" prop="role_name"></el-table-column>
            <el-table-column label="状态">
                <!-- 利用作用域插槽来进行渲染 -->
                <template slot-scope="scope">
                    <el-switch v-model="scope.row.mg_state" @change="userStateChanged(scope.row)"></el-switch>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="180px"></el-table-column>
        </el-table>
        <!-- 分页 -->
        <el-pagination
         @size-change="handleSizeChange"
         @current-change="handleCurrentChange"
         :current-page="queryInfo.pagenum"
         :page-sizes="[1, 2, 5, 10]"
         :page-size="queryInfo.pagesize"
         layout="total, sizes, prev, pager, next, jumper"
         :total="total">
        </el-pagination>
    <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
         <!-- 添加用户对话框主体区域 -->
    <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
         <el-form-item label="用户名" prop="username">
             <el-input v-model="addForm.username"></el-input>
         </el-form-item>
         <el-form-item label="密码" prop="password">
             <el-input v-model="addForm.password" show-password></el-input>
         </el-form-item>
         <el-form-item label="邮箱" prop="email">
             <el-input v-model="addForm.email"></el-input>
         </el-form-item>
         <el-form-item label="电话" prop="mobile">
             <el-input v-model="addForm.mobile"></el-input>
         </el-form-item>
    </el-form>
    <!-- 对话框底部区域 -->
    <span slot="footer" class="dialog-footer">
        <el-button  @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
    </span>
</el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
    data(){
         //添加用户表单的自定义验证规则
         var checkEmail = (rule, value, cb) => {
         const regEmail = /^\w+@\w+(\.\w+)+$/
         if (regEmail.test(value)) {
           return cb()
         }
         //返回一个错误提示
         cb(new Error('请输入合法的邮箱'))
        };
        //验证手机号码的规则
        var checkMobile = (rule, value, cb) => {
          const regMobile = /^1[34578]\d{9}$/
          if (regMobile.test(value)) {
            return cb()
          }
          //返回一个错误提示
          cb(new Error('请输入合法的手机号码'))
            }
        return{
           //获取查询用户信息的参数
           queryInfo:{
               query:'',
               pagenum:1,
               pagesize:2
           },
           //保存请求回来的用户列表数据
           userList:[],
           total:0,
           // 控制添加用户表单的显示与隐藏
           addDialogVisible:false,
           //添加用户表单的数据
           addForm:{
               username: '',
               password: '',
               email: '',
               mobile: ''
           },
           //添加用户表单的验证规则
           addFormRules:{
                username: [
                     { required: true, message: '请输入用户名称', trigger: 'blur' },
                         {
                          min: 3,
                          max: 10,
                          message: '用户名在3~10个字符之间',
                          trigger: 'blur'
                        }
                    ],
                password: [
                  { required: true, message: '请输入密码', trigger: 'blur' },
                  {
                    min: 6,
                    max: 15,
                    message: '用户名在6~15个字符之间',
                    trigger: 'blur'
                  }
                ],
                email: [
                    { required: true, message: '请输入邮箱', trigger: 'blur' },
                    { validator:checkEmail, message: '邮箱格式不正确，请重新输入', trigger: 'blur'}
                ],
                mobile: [
                    { required: true, message: '请输入手机号码', trigger: 'blur' },
                    { validator:checkMobile, message: '手机号码不正确，请重新输入', trigger: 'blur'}
                ]
           }
        }
    },
    created(){
        this.getUserList();
    },
    methods:{
      //获取用户列表信息
      async getUserList(){
        const { data: res } = await this.$http.get('users', {
            params: this.queryInfo
        })
        // console.log(res);
        if (res.meta.status !== 200)
        return this.$message.error('获取用户列表失败')
         //如果返回状态正常，将请求的数据保存在data中
        this.userList = res.data.users;
        this.total = res.data.total;
        },
        // 监听每页显示多少条数据的改变状态
        handleSizeChange(newSize){
            this.queryInfo.pagesize=newSize;
            this.getUserList();  
        },
        // 监听页码值改变的状态
        handleCurrentChange(current){
            this.queryInfo.pagenum = current;
            this.getUserList(); 
        },
        // 监听switch开关的变化
        async userStateChanged(userinfo){
            console.log(userinfo)
            const {data:res}=await this.$http.put( `users/${userinfo.id}/state/${userinfo.mg_state}`)
            if(res.meta.status!==200){
                userinfo.mg_state=!userinfo.mg_state;
                return this.$message.error('修改状态失败')
            }
            this.$message.success('更新状态成功')
        },
        // 重置添加用户表单
        addDialogClosed(){
           this.$refs.addFormRef.resetFields();
        },
        //点击确定按钮，添加新用户
        addUser(){
          this.$refs.addFormRef.validate( async valid => {
          if(!valid) return this.$message.error("请填写完整用户信息");
          //发送请求完成添加用户的操作
          const {data:res} = await this.$http.post("users",this.addForm)
          console.log(res);
          //判断如果添加失败，就做提示
          if (res.meta.status !== 201) return this.$message.error('添加用户失败')
          this.$message.success("添加用户成功")
          this.addDialogVisible = false
          this.getUserList()
        })
     }
    }
}
</script>

<style lang="less" scoped>

</style>