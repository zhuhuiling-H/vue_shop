<template>
      <el-container class="home-container">
          <!-- 头部 -->
          <el-header>
           <div>
             <img src='../assets/heima.png' alt="">
             <span>电商后台管理系统</span>
           </div>
           <el-button type="info" @click="logout"> 退出 </el-button>
          </el-header>
          <!-- 侧边栏 -->
          <el-container>
            <el-aside :width="isCollapse ? '64px':'200px'">
              <div class="toggle-button" @click='toggleCollapse'>|||</div>
              <el-menu background-color="#333744" text-color="#fff" active-text-color="#ffd04b" 
              unique-opened :collapse="isCollapse" :collapse-transition="false" router
              :default-active='activePath'>
                <!-- 一级菜单 -->
                  <el-submenu :index="item.id+''"  v-for="item in menulist" :key='item.id'>
                    <template slot="title">
                      <i :class='iconsObj[item.id]'></i>
                      <span>{{item.authName}}</span>
                    </template>
                    <!-- 二级菜单 -->
                      <el-menu-item :index="'/'+subItem.path"  v-for="subItem in item.children" :key="subItem.id"
                      @click="saveNavState('/'+subItem.path)">
                         <template slot="title">
                            <i class="el-icon-menu"></i>
                            <span>{{subItem.authName}}</span>
                          </template>
                      </el-menu-item>
                  </el-submenu>
              </el-menu>
            </el-aside>
            <!-- 内容部分 -->
            <el-main>
              <router-view></router-view>
            </el-main>
          </el-container>
      </el-container>
</template>

<script>
export default {
  data(){
    return {
      menulist:[],
      iconsObj: {
        '125':'iconfont icon-user',
        '103':'iconfont icon-tijikongjian',
        '101':'iconfont icon-shangpin',
        '102':'iconfont icon-danju',
        '145':'iconfont icon-baobiao'
      },
      isCollapse:false,
      activePath:''
    }
  },
  created(){
    this.getMenuList()
    this.activePath=window.sessionStorage.getItem('activePath')
  },
  methods: {
    // 退出功能
    logout() {
      window.sessionStorage.clear();
      this.$router.push('/login');
    },
      // 发送请求获取左侧菜单数据
    async getMenuList(){
      const {data:res}=await this.$http.get('menus')
       console.log(res)
      if(res.meta.status!==200) {
         return this.$message.error(res.meta.msg);
      }
      this.menulist = res.data;
    },
    // 折叠侧边栏
    toggleCollapse(){
      this.isCollapse=!this.isCollapse
    },
    // 二级菜单高亮显示
    saveNavState(path){
      window.sessionStorage.setItem('activePath',path);
      this.activePath=path;
    }
  }
}
</script>

<style lang='less' scoped>
.home-container {
  height: 100%;
}
.el-header{
  background-color:#373D41;
  display: flex;
  // 用于设置或检索弹性盒子元素在主轴（横轴）方向上的对齐方式
  // space-between	项目位于各行之间留有空白的容器内。
  justify-content: space-between;
  padding-left: 5px;
  align-items: center;
  color: #fff;
  font-size: 20px;
  div{
    display: flex;
    align-items: center;
    span{
      margin-left: 20px;
    }
  }
}
.el-aside{
  background-color:#333744;
  .el-menu{
    border-right:none;
  };
  .toggle-button{
    background-color: #4a5064;
    text-align: center;
    color: #fff;
    font-size: 10px;
    line-height: 24px;
    letter-spacing: 0.2em;
  }
}
.el-main{
  background-color:#eaedf1;
}
.iconfont{
  padding-right: 10px;
}
</style>