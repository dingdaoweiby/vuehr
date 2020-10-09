<template>
  <div>
    <el-container>
      <el-header class="homeHeader">
        <div class="title">V Homan Resource</div>
              <el-dropdown class="userInfo" @command="commandHandler">
                  <span class="el-dropdown-link">
                    {{user.name}}<i><img :src="user.userface" alt=""></i>
                  </span>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item command="userinfo">Personal Center</el-dropdown-item>
                        <el-dropdown-item command="settings">Settings</el-dropdown-item>
                        <el-dropdown-item command="logout" divided>Logout</el-dropdown-item>
                      </el-dropdown-menu>
              </el-dropdown>
      </el-header>
      <el-container>
        <el-aside width="200px">
          <el-menu router unique-opened>
            <el-submenu :index="index+''" v-for="(item,index) in routes" v-if="!item.hidden" :key="index">
              <template slot="title">
                <i style="color: #409eff; margin-right: 5px" :class="item.iconCls"></i>
                <span>{{item.name}}</span>
              </template>
              <el-menu-item :index="child.path" v-for="(child,indexj) in item.children" :key="indexj">{{child.name}}</el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <el-main>
            <el-breadcrumb separator-class="el-icon-arrow-right" v-if="this.$router.currentRoute.path!=='/home'">
                <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item>{{this.$router.currentRoute.name}}</el-breadcrumb-item>
            </el-breadcrumb>
            <div class="homeWelcome" v-if="this.$router.currentRoute.path==='/home'">
                Welcome to Vhr!!!
            </div>
          <router-view class="homeRouterView"/>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
    name: "Home",
    data() {
        return {
            user: JSON.parse(window.sessionStorage.getItem("user"))

        }
    },
    computed: {
        routes() {
            return this.$store.state.routes;
        }

    },
    methods:{
    commandHandler(cmd) {
      if (cmd === 'logout') {
        this.$confirm('This operation will logout, continue?', 'hit', {
          confirmButtonText: 'Confirm',
          cancelButtonText: 'cancel',
          type: 'warning'
        }).then(() => {
            this.getRequest('/logout');
            window.sessionStorage.removeItem("user");
            this.$store.commit('initRoutes', []);
            this.$router.replace("/");
        }).catch(() => {
          this.$message({
            type: 'info',
            message: 'Logout cancelled...'
          });
        });
      }
    }
  }
}
</script>

<style>
    .homeRouterView{
        margin-top: 10px;
    }

   .homeWelcome{
        text-align: center;
       font-size: 30px;
       font-family: "Times New Roman";
       color: #409eff;
       padding-top: 50px;
   }

  .homeHeader{
    background-color: #409eff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 15px;
    box-sizing: border-box;
  }

  .homeHeader .title{
    font-size: 30px;
    font-family: "Harlow Solid Italic",serif;
    color: #ffffff;
  }

  .homeHeader .userInfo{
    cursor: pointer;
  }

  .el-dropdown-link img{
    width: 48px;
    height: 48px;
    border-radius: 24px;
    margin-left: 8px;
  }

  .el-dropdown-link{
    display: flex;
    align-items: center;
  }
</style>
