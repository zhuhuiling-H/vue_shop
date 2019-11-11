<template>
    <div>
         <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card> <!-- 卡片 -->
        <el-button type="primary" @click="showAddCateDialog" class="btn">添加分类</el-button>
    <!-- 分类表格  -->
        <tree-table :data='cateList' :columns="columns" :selection-type="false"
        :expand-type="false" show-index index-text="#" border :show-row-hover="false">
        <!-- 是否有效区域， 设置对应的模板列： slot="isok"(与columns中设置的template一致) -->
            <template slot="isok" slot-scope="scope">
              <i class="el-icon-success" v-if="scope.row.cat_deleted === false" style="color:lightgreen"></i>
              <i class="el-icon-error" v-else style="color:red"></i>
            </template>
            <!-- 排序 -->
            <template slot="order" slot-scope="scope">
              <el-tag size="mini" v-if="scope.row.cat_level===0">一级</el-tag>
              <el-tag size="mini" type="success" v-else-if="scope.row.cat_level===1">二级</el-tag>
              <el-tag size="mini" type="warning" v-else>三级</el-tag>
            </template>
            <!-- 操作 -->
            <template slot="opt">
              <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
              <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button> 
            </template>
        </tree-table>
        <!-- 分页 -->
        <el-pagination 
            @size-change="handleSizeChange" 
            @current-change="handleCurrentChange" 
            :current-page="queryInfo.pagenum" 
            :page-sizes="[3, 5, 10, 15]" 
            :page-size="queryInfo.pagesize" 
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
        </el-pagination>
    </el-card>
    <!-- 添加分类弹框 -->
    <el-dialog title="添加分类" :visible.sync="addCateDialogVisible" width="50%" @close='addCateDialogClosed'>
            <el-form :model="addCateForm" :rules="addCateFormRules" ref="addCateFormRef" label-width="100px">
                <el-form-item label="分类名称:" prop="cat_name">
                  <el-input v-model="addCateForm.cat_name"></el-input>
                </el-form-item>
                <el-form-item label="父级分类:">
                    <!-- options 级联菜单数据源 -->
                    <el-cascader
                        v-model="selectedKeys"
                        :options="parentCateList" 
                        :props="cascaderProps"
                        @change="parentCateChange"
                        clearable></el-cascader>
                </el-form-item>
            </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="addCateDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="addCate">确 定</el-button>
        </span>
    </el-dialog>
    </div>
</template>

<script>
export default {
    data(){
        return{
            cateList:[
                 {label:'分类名称',prop:'cat_name'}
            ],
            queryInfo: {
                type: 3,
                pagenum: 1,
                pagesize: 5
             },
             total:0,
            //  自定义列
             columns: [
                {label:'分类名称',prop:'cat_name'},
                {label:'是否有效',prop:'',type:'template',template:'isok'},
                {label:'排序',prop:'',type:'template',template:'order'},
                {label:'操作',prop:'',type:'template',template:'opt'}
            ],
            // 添加分类弹框
            addCateDialogVisible:false,
            //添加分类的表单数据对象
            addCateForm:{
                  cat_name:'',
                  cat_pid:0,
                  cat_level:0
            },
            //添加分类校验规则
            addCateFormRules:{
                 cat_name:[ {required:true , message:'请输入分类名称',trigger:'blur'} ]
            },
            // 父级分类数据的列表
            parentCateList:[],
            // 级联数据列表绑定的数据
            selectedKeys:[],
            //配置级联菜单中数据如何展示
            cascaderProps:{
              value:'cat_id',
              label:'cat_name',
              children:'children',
              expandTrigger:'hover'
            }
        }
    },
    created() {
        this.getCateList()
    },
    methods:{
        // 获取商品分类列表
        async getCateList(){
            const {data:res}=await this.$http.get('categories',{
                params: this.queryInfo
            })
            if(res.meta.status!==200) return this.$message.error('获取商品分类列表失败')
            this.cateList = res.data.result
            this.total = res.data.total
            // console.log(res.data)
        },
        //分页————当pagesize发生改变时触发
        handleSizeChange(newSize){
            this.queryInfo.pagesize = newSize;
            this.getCateList();
        },
         //分页————当pagenum发生改变时触发
        handleCurrentChange(newPage){
            this.queryInfo.pagenum = newPage;
            this.getCateList();
        },
        // 添加分类按钮点击事件
        showAddCateDialog() {
            this.getParentCateList()
            this.addCateDialogVisible = true
        },
        // 获取父级分类数据列表
        async getParentCateList(){
            const {data:res}=await this.$http.get('categories',{
                params:{type:2}
            })
            if(res.meta.status!==200) return this.$message.error('获取分类数据列表失败')
            // console.log(res.data) 
            this.parentCateList=res.data       
        },
        // 级联菜单中选择项发生变化时触发
        parentCateChange(){
            console.log(this.selectedKeys)
            if(this.selectedKeys.length > 0){
                // 将数组中的最后一项设置为父级分类
                this.addCateForm.cat_pid=this.selectedKeys[this.selectedKeys.length-1];
                this.addCateForm.cat_level = this.selectedKeys.length
                return
            }else{
                this.addCateForm.cat_pid=0;
                this.addCateForm.cat_level=0;
                return
            }
        },
        // 点击确定完成添加分类
        addCate(){
            console.log(this.addCateForm)
            this.$refs.addCateFormRef.validate(async valid=>{
                if(!valid) return;
                const {data:res}=await this.$http.post('categories',this.addCateForm)
                if(res.meta.status!==201) return this.$message.error('添加分类失败');
                this.getCateList();
                this.addCateDialogVisible = false
            })
        },
        //监听添加分类对话框事件，关闭时重置表单
         addCateDialogClosed(){
             this.$refs.addCateFormRef.resetFields();
             this.selectedKeys=[];
             this.addCateForm.cat_pid=0;
             this.addCateForm.cat_level=0;
         }
    },
      // 表格序列
        // computed:{
        //     index(){
        //         return(this.queryInfo.pagenum-1)*(this.queryInfo.pagesize+1)+1;
        //     }
        // }
}
</script>

<style lang="less" scoped>
.btn{
    margin-bottom: 10px;
}
.el-cascader{
    width: 100%;
}
</style>