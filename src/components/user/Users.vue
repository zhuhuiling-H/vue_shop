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
            <el-table-column label="操作" width="180px">
                 <template slot-scope="scope">
                    <el-button type="primary" icon="el-icon-edit" size='mini' @click="showEditDialog(scope.row.id)"></el-button>
                    <el-button type="danger" icon="el-icon-delete" size='mini' @click="removeUserById(scope.row.id)"></el-button>
                    <el-button type="warning" icon="el-icon-setting" size='mini' @click="setRole(scope.row)"></el-button>
                 </template>
            </el-table-column>
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
<!-- 修改用户 -->
<el-dialog title="修改用户" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
<!-- 修改用户对话框主体区域 -->
    <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
        <el-form-item label="用户名" prop="username">
            <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
            <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
            <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
    </el-form>
<!-- 对话框底部区域 -->
    <span slot="footer" class="dialog-footer">
        <el-button  @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
    </span>
</el-dialog>
<!-- 分配角色对话框 -->
<el-dialog title="分配角色" :visible.sync="setRoleDialogVisible" width="50%">
    <div>
    <p>当前的用户:{{userInfo.username}}</p>
    <p>当前的角色:{{userInfo.role_name}}</p>
    <p>分配新角色:
        <el-select v-model="selectedRoleId" placeholder="请选择角色">
        <el-option v-for="item in rolesList" :key="item.id" :label="item.roleName" :value="item.id">
        </el-option>
        </el-select>
    </p>
    </div>
    <span slot="footer" class="dialog-footer">
    <el-button @click="setRoleDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="saveRoleInfo ">确 定</el-button>
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
           // 控制修改用户表单的显示与隐藏
           editDialogVisible:false,
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
           },
           //修改用户表单的数据
           editForm:{
               username: '',
               email: '',
               mobile: ''
           },
           //修改用户表单的验证规则
           editFormRules:{
                email: [
                    { required: true, message: '请输入邮箱', trigger: 'blur' },
                    { validator:checkEmail, message: '邮箱格式不正确，请重新输入', trigger: 'blur'}
                ],
                mobile: [
                    { required: true, message: '请输入手机号码', trigger: 'blur' },
                    { validator:checkMobile, message: '手机号码不正确，请重新输入', trigger: 'blur'}
                ]
           },
           //控制显示分配角色对话框
           setRoleDialogVisible:false,
           //保存所有用户的信息
           userInfo:{},
           //保存所有的角色信息
           rolesList:[],
           //保存用户选中的角色id
           selectedRoleId:''
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
            // console.log(userinfo)
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
     },
      //修改用户---获取用户信息
     async showEditDialog(id){
         const{data:res}=await this.$http.get('/users/'+id)
          if (res.meta.status !== 200) return this.$message.error('获取用户信息失败')
          this.$message.success("获取用户信息成功")
          this.editForm = res.data
          this.editDialogVisible = true
          console.log(this.editForm)
     },
        //重置添加用户表单
         editDialogClosed(){
           this.$refs.editFormRef.resetFields();
        },
        //点击确定按钮，修改用户
        editUser() {
           this.$refs.editFormRef.validate(async valid => {
           if (!valid) return this.$message.error('请填写完整用户信息')
           const { data: res } = await this.$http.put(
               'users/' + this.editForm.id,
               this.editForm
           )
           if (res.meta.status !== 200) return this.$message.error('修改用户失败')
           this.$message.success('修改用户成功')
           this.editDialogVisible = false
           this.getUserList()
         })
        },
        // 根据id删除用户
        async removeUserById(id){
            console.log(id)
          const confirmResult = await this.$confirm('请问是否要永久删除该用户','删除提示',{
            confirmButtonText:'确认删除',
            cancelButtonText:'取消',
            type:'warning'
            }).catch(err=>err)
          if(confirmResult!=='confirm') {
                return this.$message.info("已经取消删除")
            }
          const {data:res} = await this.$http.delete('users/'+id)
          if (res.meta.status !== 200) return this.$message.error('删除用户失败')
          this.$message.success('删除用户成功')
          this.getUserList()
        } ,
        // 更改用户角色
        async setRole(userInfo){
            this.userInfo = userInfo;
            const { data: res } = await this.$http.get('roles')
            if (res.meta.status !== 200) return this.$message.error('获取角色列表失败')
            this.rolesList = res.data;
            this.setRoleDialogVisible = true;

        },
        //当用户点击确定按钮之后判断用户是否选择了需要分配的角色
        async saveRoleInfo(){
            if(!this.selectedRoleId){
              return this.$message.error('请选择需要分配的角色')
            }
            //发送请求完成分配角色的操作
            const {data:res} = await this.$http.put(`users/${this.userInfo.id}/role`,{rid:this.selectedRoleId})
            if (res.meta.status !== 200) return this.$message.error('分配角色失败')
            this.$message.success('分配角色成功')
            this.getUserList();
            //关闭对话框
            this.setRoleDialogVisible = false
          },
           //当关闭对话框的时候，重置下拉框中的内容
          setRoleDialogClosed(){
            this.selectedRoleId = ''
            this.userInfo = {}
          }
        }
}
</script>

<style lang="less" scoped>

</style>