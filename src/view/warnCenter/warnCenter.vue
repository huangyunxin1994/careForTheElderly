<template>
  <div>
    <nav-bar></nav-bar>
    <el-container class="warningcenter-container">
                <el-row>
                  <el-col :span="3">
                    <!-- <div class="menu">
                      <div class="menu-item">
                        <router-link to="/warnCenter/fenceWarn">围栏预警信息</router-link>
                      </div>
                      <div class="menu-item">
                        <router-link to="/warnCenter/otherData">其他重点数据</router-link>
                      </div>
                    </div> -->
                    <div class="menuWrap">
                      <el-menu
                        default-active="1"
                        class="el-menu-vertical-demo"
                        @open="handleOpen"
                        @close="handleClose"
                        >

                          <router-link to="/warnCenter/fenceWarn">

                            <el-menu-item index="1"  class="warningcenter-level1">
                            <!-- <span class="borderLeft"></span> -->
                            <span  class="item">
                              围栏预警信息
                            </span>
                            </el-menu-item>

                            </router-link>


                          <router-link to="/warnCenter/otherData">

                            <el-menu-item index="2"  class="warningcenter-level1">
                              <!-- <span class="borderLeft"></span> -->
                                <span  class="item">
                                  其他重点数据
                                </span>
                            </el-menu-item>

                           </router-link>

                      </el-menu>
                    </div>
                  </el-col>
                  <el-col :span="21">
                    <transition name="fade-transform" mode="out-in">
                        <router-view></router-view>
                    </transition>
                    </el-col>
                </el-row>
    </el-container>
  </div>

</template>

<script>
// import { mapGetters } from 'vuex'
import NavBar from '@/components/navBar/navBar.vue'
export default {
  // computed: {
  //   ...mapGetters([
  //     'warnNum',
  //   ])
  // },
  components:{
    NavBar
  },
  data(){
    return{
      pCount:0,
      eCount:0
    }
  },
    methods: {
      handleOpen(key, keyPath) {
        console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        console.log(key, keyPath);
      }
    },
    mounted(){
    }
}
</script>
<style lang="scss">
.warningcenter-level1{
  .el-badge__content--undefined{
      top:15px;
      right: 0;
    }
}
</style>
<style lang="scss" scoped>
  .warningcenter-level1{
    border-left: 5px solid transparent;
    margin: 10px;
    height: 30px;
    line-height: 30px;
    font-size: 0.9vw !important;
    text-align: left !important;
  }
  .is-active {
      // color: #303133;
      // background-color: #a5a2a2 !important;
      border-left: 5px solid #409EFF !important;
  }
  a{
    text-decoration:none;
    color: #606266;
  }
  .el-menu {
    border-right: none;
  }
  .borderLeft{
    display: inline-block;
    width: 10px;
    height: 60%;
    margin-right: 10px;
    background-color: #409EFF;
  }
  .el-menu-vertical-demo{
    width: 100%;
    height: 100%;
    // background-color: #fff;
    // box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
  }
.warningcenter {
  &-container{
    width: 100%;
    height: 100%;
    .el-row {
    width: 100%;
    height: 100% ;
    overflow: hidden;
      .el-col {
      height: 100%;
      overflow: hidden;
      }
    }
  }
  &-level1{
    font-size: 0.9vw;
    font-weight: bold;
    text-align: center;
  }

}
.menuWrap{
  height:calc(100vh - 65px);
  padding:20px;
  box-sizing: border-box;
  background-color: rgb(244, 244, 245);
}
// .menu{
//   height:calc(100vh - 65px);
//   background-color: rgb(244, 244, 245);
//   box-sizing: border-box;
//   padding: 20px;
//   &-item{
//     width: 100%;
//     height: 50px;
//     line-height: 50px;
//     text-align: center;

//   }
//   &-item:hover{
//     background-color: #a5a2a2;
//   }
// }
</style>
