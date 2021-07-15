<template>
  <div class="home_component">
    <el-container>
      <el-header>
        <div>
          <img src="../assets/heima.png" />
          <p>电商后台管理系统</p>
        </div>
        <el-button type="info" @click="loginout">退出</el-button>
      </el-header>
      <el-container>
        <!-- 左侧菜单栏 -->
        <el-aside :width="isCollapse ? '64px' : '200px'">
          <!-- 伸缩侧边导航栏按钮 -->
          <div class="collapse-button" @click="toggleCollapse">|||</div>
          <el-menu
            class="el-menu-vertical-demo"
            background-color="#545c64"
            text-color="#fff"
            active-text-color="#409EFF"
            unique-opened
            :collapse="isCollapse"
            :collapse-transition="false"
            router
            :default-active="activePath"
          >
            <!-- 一级菜单 -->
            <!-- index只接受字符串形式 -->
            <el-submenu :index="item.id+''" v-for="item in menuList" :key="item.id">
              <template slot="title">
                <!-- 图标 -->
                <i :class="iconObjs[item.id]"></i>
                <!-- 文本 -->
                <span>{{item.authName}}</span>
              </template>
              <!-- 二级菜单 -->
              <el-menu-item
                :index="'/'+it.path"
                v-for="it in item.children"
                :key="it.id"
                style="font-size:12px;"
                @click="saveNavState(it.path)"
              >
                <template>
                  <i class="el-icon-menu"></i>
                  <span>{{it.authName}}</span>
                </template>
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      menuList: [],
      iconObjs: {
        125: 'iconfont icon-user',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao'
      },
      isCollapse: !1,
      // 被激活的链接地址
      activePath: ''
    }
  },
  created() {
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    loginout() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    async getMenuList() {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) {
        this.$message.error(res.meta.msg)
      } else {
        this.menuList = res.data
      }
    },
    toggleCollapse() {
      this.isCollapse = !this.isCollapse
    },
    saveNavState(path) {
      window.sessionStorage.setItem('activePath', '/' + path)
    }
  }
}
</script>

<style lang="less" scoped>
.el-container {
  height: 100vh;
}
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  align-items: center;
  button {
    align-items: center;
  }
  > div {
    display: flex;
    align-items: center;
    & p {
      font-size: 20px;
      color: #fff;
      padding-left: 20px;
    }
  }
}
.el-aside {
  background-color: #333744;
  .el-menu {
    border-right: 0;
  }
}
.el-main {
  background-color: #eaedf1;
}
.iconfont {
  margin-right: 10px;
}
.collapse-button {
  text-align: center;
  background: #757373;
  padding: 5px;
  font-size: 14px;
  color: #fff;
  letter-spacing: 2px;
  &:hover {
    cursor: pointer;
  }
}
</style>
