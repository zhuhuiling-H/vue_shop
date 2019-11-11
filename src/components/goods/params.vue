<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card> <!-- 卡片 -->
      <!-- 警告提示框 -->
     <el-alert show-icon title="注意：只允许为第三级分类设置相关参数" type="warning" :closable='false'></el-alert>
     <!-- 选择商品分类区域 -->
        <el-row class="cat_opt">
            <el-col>
                <span>选择商品分类：</span>
                <!-- 选择商品分类的级联选择框 -->
                 <el-cascader
                        expandTrigger='hover'
                        v-model="selectedCateKeys"
                        :options="cateList"
                        :props="cateProps"
                        @change="handleChange">
                 </el-cascader>
            </el-col>
            <el-col>
        <el-tabs v-model="activeName" @tab-click="handleTabClick">
            <el-tab-pane label="动态参数" name="many">
                <el-button size="mini" type="primary" :disabled="isButtonDisabled"  @click="addDialogVisible = true">添加参数</el-button>
            <!-- 动态参数表格 -->
                <el-table :data="manyTableData" border stripe>
                  <!-- 展开行 -->
                  <el-table-column type="expand">
                    <template slot-scope="scope">
                    <!-- {{scope.row}} -->
                    <el-tag v-for="(item,i) in scope.row.attr_vals" :key="i"   closable @close='handleClose(i,scope.row)'>
                        {{item}}
                    </el-tag>
                    <!-- 输入框 -->
                    <el-input class="input-new-tag" v-if="scope.row.inputVisible" v-model="scope.row.inputValue" 
                    ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm(scope.row)" 
                    @blur="handleInputConfirm(scope.row)">
                    </el-input>
                    <!-- 添加按钮 -->
                    <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">
                      + New Tag</el-button>
                  </template>
                  </el-table-column>
                  <!-- 索引列 -->
                  <el-table-column type="index"></el-table-column>
                  <el-table-column label="参数名称" prop="attr_name"></el-table-column>
                  <el-table-column label="操作">
                    <template slot-scope="scope">
                      <el-button size="mini" type="primary" icon="el-icon-edit" @click='showEditDialog(scope.row.attr_id)'>编辑</el-button>
                      <el-button size="mini" type="danger" icon="el-icon-delete"  @click="removeParams(scope.row.attr_id)">删除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
            </el-tab-pane>
            <el-tab-pane label="静态属性" name="only">
                 <el-button size="mini" type="primary" 
                    :disabled="isButtonDisabled" @click="addDialogVisible = true">添加属性</el-button>
            <!-- 静态参数表格 -->
                <el-table :data="onlyTableData" border stripe>
                <!-- 展开行 -->
                <el-table-column type="expand">
                  <template slot-scope="scope">
                    <!-- {{scope.row}} -->
                    <el-tag v-for="(item,i) in scope.row.attr_vals" :key="i" closable @close='handleClose(i,scope.row)'>
                        {{item}}
                    </el-tag>
                    <!-- 输入框 -->
                    <el-input class="input-new-tag" v-if="scope.row.inputVisible" v-model="scope.row.inputValue" 
                    ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm(scope.row)" 
                    @blur="handleInputConfirm(scope.row)">
                    </el-input>
                    <!-- 添加按钮 -->
                    <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">
                      + New Tag</el-button>
                  </template>
                </el-table-column>
                <!-- 索引列 -->
                    <el-table-column type="index"></el-table-column>
                    <el-table-column label="属性名称" prop="attr_name"></el-table-column>
                    <el-table-column label="操作">
                      <template slot-scope="scope">
                        <el-button size="mini" type="primary" icon="el-icon-edit"  @click='showEditDialog(scope.row.attr_id)'>编辑</el-button>
                        <el-button size="mini" type="danger" icon="el-icon-delete" @click="removeParams(scope.row.attr_id)">删除</el-button>
                      </template>
                    </el-table-column>
                </el-table>
            </el-tab-pane>
                </el-tabs>
            </el-col>
        </el-row>
    </el-card>
    <!-- 添加属性或添加参数弹框 -->
        <el-dialog :title="'添加'+titleText" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
        <!-- 添加表单 -->
        <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
          <el-form-item :label="titleText" prop="attr_name">
            <el-input v-model="addForm.attr_name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addParams">确 定</el-button>
        </span>
    </el-dialog>
    <!-- 修改参数或属性对话框 -->
        <el-dialog :title="'修改'+titleText" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
            <!-- 添加表单 -->
            <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
              <el-form-item :label="titleText" prop="attr_name">
                <el-input v-model="editForm.attr_name"></el-input>
              </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
              <el-button @click="editDialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="editParams">确 定</el-button>
            </span>
        </el-dialog>
  </div>
</template>

<script>
export default {
    data(){
        return{
            // 所有商品分类列表
            cateList:[],
            //用户在级联下拉菜单中选中的分类id
            selectedCateKeys:[],
            // 级联选择框的配置对象
            cateProps:{
                value: 'cat_id',
                label: 'cat_name',
                children: 'children'
            },
            activeName:'many',
            //用来保存动态参数数据
            manyTableData: [],
            //用来保存静态属性数据
            onlyTableData: [],
            // 弹框
            addDialogVisible:false,
            //添加参数的表单数据对象
            addForm:{
                attr_name:''
            },
            //添加表单验证规则
            addFormRules:{
              attr_name:[
                { required: true, message: '请输入名称', trigger: 'blur' }]
            },
            // 修改弹框
            editDialogVisible:false,
            editForm:{},
             //修改表单的验证规则
            editFormRules:{
                attr_name:[
                    { required: true, message: '请输入名称', trigger: 'blur' }
                ]
            },

        }
    },
    created() {
      this.getCateList()
    },
    methods:{
        // 获取所有商品分类列表
        async getCateList(){
            const {data:res}=await this.$http.get('categories')
            if (res.meta.status !== 200) {
                return this.$message.error('获取分类数据失败')
            }
            this.cateList = res.data
            // console.log(res.data)
        },
         //当用户在级联菜单中选择内容改变时触发 获取动态参数
         async handleChange(){
            if(this.selectedCateKeys.length!==3) {
                this.selectedCateKeys=[]
                this.manyTableData=[]
                this.onlyTableData=[]
                return
            }
            // console.log(this.selectedCateKeys)
            //发送请求，根据用户选择的三级分类和面板获取参数数据
            const {data:res}=await this.$http.get(`categories/${this.cateId}/attributes`,{
               params: { sel: this.activeName } 
            })
            console.log(res.data)
            if(res.meta.status!==200){
               return this.$message.error('获取参数列表数据失败') 
            }
            //将获取到的数据中的attr_vals字符串转换为数组
            res.data.forEach(item=>{
              item.attr_vals=item.attr_vals?item.attr_vals.split(' '):[];
              //控制文本框的显示或者隐藏
              item.inputVisible = false
              //保存文本框值
              item.inputValue = ''
            })
            if(this.activeName==='many'){
                this.manyTableData=res.data
            }
                this.onlyTableData=res.data
        },
        // 用户切换参数列表获取数据
        handleTabClick(){
            this.handleChange()
        },
        //添加分类 点击确定按钮触发该事件
        addParams(){
            this.$refs.addFormRef.validate(async valid => {
                console.log(valid)
            if (!valid) return
            const { data: res } =  await this.$http.post(`categories/${this.cateId}/attributes`,
              { 
                attr_name: this.addForm.attr_name, 
                attr_sel: this.activeName,
                attr_vals: "" 
              }
            )
          console.log(res)
            if (res.meta.status !== 201) {
              return this.$message.error('添加' + this.titleText + '数据失败')
            }
            this.$message.success('添加' + this.titleText + '数据成功')
            this.addDialogVisible = false
            this.getCateList()
         })
        },
        // 监听弹框 重置表单
        addDialogClosed(){
            this.$refs.addFormRef.resetFields();
        },
        // 监听修改弹框 重置表单
        editDialogClosed(){
            this.$refs.editFormRef.resetFields();
        },
        //发起请求获取需要修改的那个参数数据
        async showEditDialog(attr_id){
            const {data:res} = await this.$http.get(`categories/${this.cateId}/attributes/${attr_id}`,
                {params:{ attr_sel:this.activeName }})
                if (res.meta.status !== 200) {
                  return this.$message.error('获取参数数据失败')
                }
                this.editForm = res.data;
                //显示修改参数.属性对话框
                this.editDialogVisible = true;
        },
        // 修改
        editParams(){
            //验证表单
            this.$refs.editFormRef.validate(async valid => {
              if(!valid) return;
              //发送请求完成修改
              const {data:res} = await this.$http.put(`categories/${this.cateId}/attributes/${this.editForm.attr_id}`,
              {attr_name:this.editForm.attr_name,attr_sel:this.activeName})
              if (res.meta.status !== 200) {
                return this.$message.error('获取参数数据失败')
              }
              this.$message.success('修改' + this.titleText + '数据成功')
              this.editDialogVisible = false
              this.handleChange();
              })
         },
          //根据id删除对应的参数或属性
         async removeParams(attr_id){
            //弹窗提示用户是否要删除
            const confirmResult = await this.$confirm(
              '请问是否要删除该'+this.titleText,
              '删除提示',
              {
                confirmButtonText: '确认删除',
                cancelButtonText: '取消',
                type: 'warning'
              }
            ).catch(err => err)
            if (confirmResult != 'confirm') {
              return this.$message.info('已经取消删除')
            }
            const {data:res} = await this.$http.delete(`categories/${this.cateId}/attributes/${attr_id}`)
            if (res.meta.status !== 200) {
              return this.$message.error('删除参数数据失败')
            }
            this.$message.success('删除' + this.titleText + '数据成功')
            this.handleChange()
        },
        //当用户在文本框中按下enter键或者焦点离开时都会触发执行
        handleInputConfirm(row){
          console.log(row)
          if(row.inputValue.trim().length==0){
            row.inputValue=''
            row.inputVisible=false
            return
          }
          //如果用户输入了真实合法的数据，需要保存起来
          row.attr_vals.push(row.inputValue.trim())
          this.$message.success('添加参数项成功')
          row.inputValue=''
          row.inputVisible=false
          this.saveAttrVals(row)
        },
        //用户点击添加按钮时触发
        showInput(row){
          row.inputVisible=true;
          //$nextTick:在页面上元素被重新渲染之后，调用回调函数的代码
          this.$nextTick(_ => {
            console.log(_)
            // 让文本框自动获取焦点
            this.$refs.saveTagInput.$refs.input.focus();
          });
        },
         //封装函数，完成保存可选项的操作 发起请求，保存参数选项
        async saveAttrVals(row){
            const {data:res}=await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`,{
                attr_name:row.attr_name,
                attr_sel:row.attr_sel,
                attr_vals:row.attr_vals.join(' ')
            })
            console.log(res)
            if(res.meta.status!==200) return this.$message.error('修改参数项失败')
        },
        //删除对应索引的参数可选项
        handleClose(index,row){
          row.attr_vals.splice(index,1)
          this.saveAttrVals(row)
          this.$message.success('删除参数项成功')
        }
    },
    computed:{
        //获取按钮禁用与否
        isButtonDisabled(){
            return this.selectedCateKeys.length!==3
        },
        // 获取选中的三级分类id
        cateId(){
            if(this.selectedCateKeys.length===3){
                return this.selectedCateKeys[this.selectedCateKeys.length-1]
            }
            return null
        },
        titleText(){
            if(this.activeName=='many'){
                return '动态参数'
            }
            return '静态属性'
        }
    }
}
</script>

<style lang="less" scoped>
.cat_opt{
    margin: 20px 0;
}
.el-tabs{
    margin-top: 20px;
    font-size: 14px;
}
.el-tag{
  margin: 10px;
}
.input-new-tag{
  width: 120px;
}
</style>