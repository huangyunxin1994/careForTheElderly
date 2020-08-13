<template>
  <nav class="nav">
  	<div class="titleSwarp">
  		<i class="iconfont icon-caidan titleIcon"></i><span class="title">关爱老人平台</span>
  	</div>
  	<div class="contentSwarp">
  		<router-link to='/home'>首页</router-link>
  		<router-link to='/peopleList'>人员列表</router-link>
  		<router-link to='/warnCenter'>预警中心</router-link>
  		<router-link to='/railDeploy'>电子围栏配置</router-link>
  		<router-link to='/organizationAdmin'>组织管理</router-link>
  		<router-link to='/equipment'>设备管理</router-link>
  	</div>
  	<div class="userSwarp">
  		<span class="map">
        <el-tooltip effect="dark" content="前往看板">
          <router-link tag="i" class="iconfont icon-ditu" to="/bulletinboard"></router-link>
        </el-tooltip>
      </span>
  		<span class="mess" @click="getSound">
        <el-tooltip v-if="sound" effect="dark" content="静音">
          <!-- <router-link tag="i" class="iconfont icon-lingsheng-jingyin"  ></router-link> -->
          <i class="iconfont icon-lingsheng-jingyin"></i>
        </el-tooltip>
        <el-tooltip v-else effect="dark" content="响铃">
          <!-- <router-link tag="i" class="iconfont icon-lingsheng" ></router-link> -->
          <i class="iconfont icon-lingsheng"></i>
        </el-tooltip>
      </span>
  		<span class="name">

        <el-dropdown class="avatar-container" trigger="click">
          <!-- <router-link tag="i" class=""></router-link> -->
          <div>
            <i class="iconfont icon-wo"></i>
            <span class="user-name">你好,小李</span>
          </div>
          <el-dropdown-menu slot="dropdown" class="user-dropdown">
            <el-dropdown-item  @click.native="changePass">
                修改密码
            </el-dropdown-item>
            <el-dropdown-item divided @click.native="logout">
              <span style="display:block;">退出登录</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <!-- <span>你好,小李</span> -->
      </span>
  	</div>
    <change-pass ref="changePass"></change-pass>
  </nav>
</template>

<script>
  import ChangePass from '@/components/changePass/index.vue'
  export default{
    components:{
      ChangePass
    },
    data(){
      return{
        sound:false
      }
    },
    methods:{
      getSound(){
        this.sound = !this.sound
        this.$emit('getSound',this.sound)
      },
      //退出登录
      logout(){
        this.$router.push('/login')
      },
      // async logout() {
      //   // await this.$store.dispatch('user/logout')
      //   this.$router.push('/login')
      // },
      //修改密码
      changePass(){
        this.$refs.changePass.dialogPassVisible = true
      }
    },
    mounted(){

    }
  }
</script>

<style scoped="scoped" lang="scss">
  a{
  	color: #dad5d5;
    display: block;
    height: 100%;
    text-decoration: none;
  }
  .router-link-active{
    color: #fff;
  }
  .nav{
  	width: 100%;
  	height: 65px;
  	background-color: #4b97eb;
  	display: flex;
  	justify-content: space-between;
    align-items: center;
  }
  .titleSwarp{
  	width: 20%;
  	box-sizing: border-box;
  	padding-left: 3vw;
  	font-size: 1.3vw;
  	font-weight: 600;
  	color: white;
  }
  .titleSwarp .iconfont{
  	font-size: 1.8vw;
  }
  .titleSwarp  .title{
  	margin-left: 2px;
    position: relative;
    bottom: 0.2vw;
  }
  /* 中间部分 */
  .contentSwarp{
  	width: 60%;
  	display: flex;
  	justify-content: space-around;
  	font-size: 1vw;
    box-sizing: border-box;
    padding: 0px 1vw;
  	color: #dad5d5;
  	font-weight: 600;
  }

  /*右边部分*/
  .userSwarp{
  	width: 20%;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    box-sizing: border-box;
    padding-right: 3vw;
  	font-size: 0.7vw;
  	color: white;
  }
  .userSwarp>span{
    cursor: pointer;
  }
  .userSwarp .iconfont{
  	font-size: 1.2vw;
  }
  .userSwarp>span{
  	// padding-left: 30px;
    padding: 0px 0.5vw 0px 0.5vw;
  }
  .name i{
    color: #fff;
  }
  .user-name{
    color: white;
  }
</style>
