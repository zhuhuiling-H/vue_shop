<template>
    <div>
        <!-- 面包屑 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>{{ one }}</el-breadcrumb-item>
            <el-breadcrumb-item>{{ two }}</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- carl视图 -->
        <el-card>
           <slot></slot>      
        </el-card>
    </div>
</template>

<script>
export default {

}
</script>

<style lang="less" scoped>

</style>