<template>
    <div>
         <!-- 面包屑导航条 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品列表</el-breadcrumb-item>
        </el-breadcrumb>
         <el-card>
            <el-row>
                <el-col :span="8">
                    <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear='getGoodsList'>
                        <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click='goAddPage'>添加商品</el-button>
                </el-col>
            </el-row>
            <!-- 表格区域 -->
            <el-table :data="goodsList" border stripe>
                <el-table-column label='商品名称' prop='goods_name'></el-table-column>
                <el-table-column label='价格/元' prop='goods_price' width='80px'></el-table-column>
                <el-table-column label='商品重量' prop='goods_weight' width='90px'></el-table-column>
                <el-table-column label='创建时间' prop='add_time' width='160px'>
                    <!-- 时间格式化 -->
                    <template slot-scope="scope">
                        {{scope.row.add_time | dateFormat}}
                    </template>
                </el-table-column>
                <el-table-column label='操作' width='140px'>
                    <template slot-scope="scope">
                        <el-button size="mini" type="primary" icon="el-icon-edit"></el-button>
                        <el-button size="mini" type="danger" icon="el-icon-delete" @click="removeGoods(scope.row.goods_id)"></el-button>
                    </template>
                </el-table-column>
            </el-table>
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
    </div>
</template>

<script>
export default {
    data(){
        return{
           //查询参数
            queryInfo: {
                query: '',
                pagenum: 1,
                pagesize: 10
            },
            //保存商品列表信息
            goodsList: [],
            //总数据条数
            total: 0
        }
    },
    created() {
        this.getGoodsList()
    },
    methods:{
        //  获取商品列表数据
        async getGoodsList(){
            const {data:res}=await this.$http.get('goods',{
                params:this.queryInfo
            }) 
            if (res.meta.status !== 200) {
              return this.$message.error('获取商品列表失败')
            }
            console.log(res.data)
            // this.$message.success('获取商品列表成功')
            this.goodsList = res.data.goods
            this.total = res.data.total
        },
        //当页号发生改变时，更改pagesize，重新请求
         handleSizeChange(newSize){
            this.queryInfo.pagesize = newSize
            this.getGoodsList();
        },
        //当页码发生改变时，更改pagesize，重新请求
        handleCurrentChange(newPage){
            this.queryInfo.pagenum = newPage
            this.getGoodsList();
        },
        // 根据id删除商品
        async removeGoods(goods_id){
            const confirmResult = await this.$confirm(
                '请问是否要删除该商品',
                '删除提示',
                {
                  confirmButtonText: '确认删除',
                  cancelButtonText: '取消',
                  type: 'warning'
                }
            ).catch(err => err)
            if(confirmResult!='confirm') return this.$message.error('已取消删除')
            const {data:res}=await this.$http.delete(`goods/${goods_id}`)
            if (res.meta.status !== 200) {
            return this.$message.error('删除商品失败')
            }
            this.$message.success('删除商品成功')
            this.getGoodsList()
        },
        // 添加商品
        goAddPage(){
            this.$router.push('/goods/add')
        }
    }   
}
</script>

<style lang="less" scoped>
.el-button{
    margin-left: 10px;
}
</style>