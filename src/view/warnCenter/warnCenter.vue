<template>
  <div>
    <nav-bar></nav-bar>
    <el-container class="warningcenter-container">
                <el-row>
                  <el-col :span="3">
                    <el-scrollbar style="height:calc(100vh - 85px);background-color: rgb(244, 244, 245)">
                      <el-menu
                        default-active="1"
                        class="el-menu-vertical-demo"
                        @open="handleOpen"
                        @close="handleClose"
                        background-color="#e6e6e6">

                          <router-link to="/warnCenter/fenceWarn">

                            <el-menu-item index="1"  class="warningcenter-level1">
                              <!-- <el-badge :value="warnNum.pCount" class="item" v-if="warnNum.pCount>0">
                                围栏预警信息
                              </el-badge> -->
                            <span  class="item">
                              围栏预警信息
                            </span>
                            </el-menu-item>

                            </router-link>


                          <router-link to="/warnCenter/otherData">

                            <el-menu-item index="2"  class="warningcenter-level1">
                              <!-- <el-badge :value="warnNum.eCount" class="item" v-if="warnNum.eCount>0">
                                其他重点数据
                                </el-badge> -->
                                <span  class="item">
                                  其他重点数据
                                </span>
                            </el-menu-item>

                           </router-link>

                      </el-menu>
                    </el-scrollbar>
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
  .el-scrollbar__view/deep/.is-active{
    background-color: red;
  }
  a{
    text-decoration:none;
    color: #fff;
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
</style>
