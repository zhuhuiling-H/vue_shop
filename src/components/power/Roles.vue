<template>
    <div>
        <!-- 面包屑导航条 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>权限列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片 -->
        <el-card class="box-card">
            <el-button type="primary">添加角色</el-button>
            <el-table :data="roleList" border stripe>
                <el-table-column type="expand">
                    <template slot-scope="scope">
                        <!-- {{scope.row.children}} -->
                        <el-row :class="['bdbottom',i1===0?'bdtop':'']" v-for="(item1,i1) in scope.row.children" :key="item1.id">
                            <!-- 渲染一级权限 -->
                            <el-col :span="5">
                                <el-tag closable @close="removeRightById(scope.row,item1.id)">
                                    {{item1.authName}}
                                </el-tag>
                                <i class="el-icon-caret-right"></i>
                            </el-col>
                            <!-- 渲染二，三级权限 -->
                            <el-col :span="19">
                                <!-- 通过for循环嵌套渲染二级权限  -->
                                <el-row  v-for="(item2) in item1.children" :key="item2.id">
                                    <el-col :span="6">
                                        <el-tag type="success" closable @close="removeRightById(scope.row,item2.id)">{{item2.authName}}</el-tag>
                                        <i class="el-icon-caret-right"></i>
                                    </el-col>
                                    <el-col :span="18">
                                        <el-tag type="warning" v-for="(item3) in item2.children" :key="item3.id" closable style="margin: 3px"
                                        @close="removeRightById(scope.row,item3.id)">
                                            {{item3.authName}}
                                        </el-tag>
                                    </el-col>
                                </el-row>
                            </el-col>
                        </el-row>
                    </template>
                </el-table-column>
                <el-table-column type="index"></el-table-column>
                <el-table-column label="角色名称" prop="roleName"></el-table-column>
                <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
                <el-table-column label="操作">
                 <template slot-scope="scope">
                    <el-button type="primary" icon="el-icon-edit" size='mini'>编辑</el-button>
                    <el-button type="danger" icon="el-icon-delete" size='mini' @click="removeUserById(scope.row.id)">删除</el-button>
                    <el-button type="warning" icon="el-icon-setting" size='mini' @click="showSetRightDialog(scope.row)">分配权限</el-button>
                 </template>
                </el-table-column>
            </el-table>
        </el-card>
         <!-- 权限分配弹框 -->
        <el-dialog title="分配权限" :visible.sync="setRightDialogVisible" width="50%" @close="setRightDialogClose">              
            <el-tree :data="rightsList" :props="treeProps" show-checkbox node-key="id" 
            default-expand-all :default-checked-keys="defKeys" ref="treeRef"></el-tree>
            <span slot="footer" class="dialog-footer">
                <el-button @click="setRightDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="allotRights">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
 data(){
     return{
         roleList:[],
        //  权限分配弹框
         setRightDialogVisible:false,
        //  权限树数据
         rightsList:[],
        //  树形控件属性绑定的对象
         treeProps: {
            label: 'authName',
            children: 'children'
        },
        //设置树形控件中默认选中的内容
        defKeys:[],
        //保存正在操作的角色id
        roleId:''
     }
 },
 created(){
    //  获取权限列表数据
     this.getRoleList();
 },
 methods:{
    //  获取权限列表数据
     async getRoleList(){
         const {data:res} = await this.$http.get('roles')
            if (res.meta.status !== 200) return this.$message.error('获取角色列表失败')
            this.roleList = res.data
            // console.log(this.rightsList)
     },
    //  添加权限删除功能
     async removeRightById(role,rightId){
        const confirmResult = await this.$confirm('请问是否要删除该权限','删除提示',{
        confirmButtonText:'确认删除',
        cancelButtonText:'取消',
        type:'warning'
        }).catch(err=>err)
        // console.log(confirmResult)
        if(confirmResult!='confirm') return this.$message.info("已经取消删除")
        const {data:res}=await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
         if (res.meta.status !== 200) return this.$message.error('删除角色权限失败') 
        role.children = res.data
     },
    //  权限分配功能---获取所有权限数据
     async showSetRightDialog(role){
         this.roleId = role.id
        //   权限分配弹框
         this.setRightDialogVisible=true;
         const {data:res} = await this.$http.get('rights/tree');
         if (res.meta.status !== 200) return this.$message.error('获取权限树失败')
         this.rightsList = res.data;
         this.getLeafKeys(role,this.defKeys)
    },
     //当用户关闭树形权限对话框的时候，清除掉所有选中状态
     setRightDialogClose(){
          this.defKeys = []
     },
    //  获取到当前角色的所有三级权限id并添加到defKeys中
     getLeafKeys(node,arr){
        //  console.log(node,arr)
         if(!node.children){
              return arr.push(node.id)
         }
         node.children.forEach(item => this.getLeafKeys(item, arr))
     },
    //  分配权限
     async allotRights(){
         const keys=[
             ...this.$refs.treeRef.getCheckedKeys(),
             ...this.$refs.treeRef.getHalfCheckedKeys()
            ]
        const idStr=keys.join(',')
        // console.log(idStr)
        const {data:res}=await this.$http.post(`roles/${this.roleId}/rights`,{
            rids:idStr
        });
        if (res.meta.status !== 200)
        return this.$message.error('分配权限失败')
        this.$message.success("分配权限成功")
        this.getRoleList();
        //关闭对话框
        this.setRightDialogVisible = false;
     }
 }
}
</script>

<style lang="less" scoped>
.el-row{
    display:flex;
    align-items:center;
    margin: 7px;    
}
.bdbottom{
    border-bottom: 1px solid #eee;
}
.bdtop{
    border-top: 1px solid #eee;
}
</style>