<template>
  <div>
    <nav-bar></nav-bar>
    <div class="main">
      <div class="mainLeft">
        <tree></tree>
      </div>
      <div class="mainCenter">
        <my-map></my-map>
      </div>
      <div class="mainRight">
        <transition name="warnList"
                    enter-active-class="animated animate__backInRight"
                    leave-active-class="animated animate__backOutRight">
            <div class="warnSwarp" v-if="warnList == true">
              <p class="newWarnTitle">
                <i class="iconfont icon-deng"></i>最新预警信息
              </p>
              <div class="clock">
                <!-- <i class="iconfont icon-tingzhi"></i> -->
                <el-tooltip content="停止本次报警音效" placement="top">
                   <el-button  class="iconfont icon-zanting warnClock" size="mini" circle ></el-button>
                </el-tooltip>
              </div>
              <div class="warnContentSwarp">
                <el-scrollbar class="dashboard-scrollbar" v-if="dashboardContext.length!=0">
                  <div class="warnContent" v-for="(item,index) in dashboardContext" :key="index">
                    <div class="warnContentList">
                      <div class="contentList name">
                        <p>{{item.name}}</p>
                        <p>{{item.time}}</p>
                      </div>
                      <div class="contentList type"><p>{{item.type}}</p></div>
                    </div>
                    <div class="warnBtn">
                      <el-button type="danger" size="mini">定位</el-button>
                      <el-button type="danger" size="mini" @click="goPeopleDetails">详情</el-button>
                    </div>
                  </div>
                </el-scrollbar>
              </div>
            </div>
          </transition>
      </div>
    </div>
  </div>
</template>

<script>
  import NavBar from '@/components/navBar/navBar.vue'
  import MyMap from '@/components/map/map.vue'
  import Tree from '@/components/tree/tree_.vue'
  export default{
    components:{
      NavBar,
      MyMap,
      Tree
    },
    data(){
      return{
        dashboardContext:[
          {
            name:"张三",
            time:'2020-06-02',
            type:'外出xxx围栏'
          },
          {
            name:"张三",
            time:'2020-06-02',
            type:'外出ssss围栏'
          },
          {
            name:"张三",
            time:'2020-06-02',
            type:'外出sdsfs围栏'
          },
          {
            name:"王者荣耀",
            time:'2020-06-02 13:00:56',
            type:'外出rtyu拉圣诞节福利卡三等奖偶发rt围栏'
          },
          {
            name:"王者荣耀",
            time:'2020-06-02 13:00:56',
            type:'外出rtyu拉圣诞节福利卡三等奖偶发rt围栏'
          },
          {
            name:"王者荣耀",
            time:'2020-06-02 13:00:56',
            type:'外出rtyu拉圣诞节福利卡三等奖偶发rt围栏'
          },
          {
            name:"王者荣耀",
            time:'2020-06-02 13:00:56',
            type:'外出rtyu拉圣诞节福利卡三等奖偶发rt围栏'
          }
        ],
        warnList:false
      }
    },
    methods:{
      getWarnList(){
        this.warnList = true
      },
      goPeopleDetails(){
        this.$router.push('/peopleDetails')
      }
    },
    mounted() {
      this.getWarnList()
    }
  }
</script>

<style lang="scss" scoped>
  /deep/.el-button--mini.is-circle{
    padding: 0px;
  }
  .BMap_cpyCtrl {
      display: none;
  }
  .anchorBL {
      display: none;
  }

  .main{
    position: relative;
    // min-width: 1250px;
    .mainLeft{
      position: absolute;
      min-width: 200px;
      top: 2vh;
      left: 2vw;
      width: 10vw;
      min-height: 80vh;
      box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
      padding: 0.5vw;
      z-index: 100;
      background-color: #fff;
    }
    .mainCenter{
      width: 100vw;
      height: calc(100vh - 85px);
    }
    .mainRight{
      position: absolute;
      bottom: 0px;
      right: 0px;
      width: 15vw;
      min-width: 250px;
      // box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
      padding: 0.5vw;

      .warnSwarp{
      	width: 15vw;
      	min-width: 250px;
        max-height: 70vh;
      	clear: both;
      	margin-top: 10vh;
      	background-color: white;
      	position: relative;
      	box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
      }
      .newWarnTitle{
      	font-size: 1.2vw;
      	color: rgba(236, 128, 141, 1);
      	padding: 10px;
      	font-weight: 600;
      	margin-bottom: 20px;

        .iconfont{
        	font-size: 1.3vw;
        }
      }
      /* 停止图标 */
      .clock{
      	position: absolute;
      	top: 13px;
      	right: 13px;
      }
      .clock .iconfont{
      	font-size: 1.5vw;
      	color: rgba(236, 128, 141, 1);
      }
      .clock .warnClock{
        border: 1px solid transparent;
      }

      /* 预警列表 */
      .dashboard-scrollbar{
        height: 55vh;
      }
      .warnContentSwarp{
      	box-sizing: border-box;
      	padding: 10px;
      }
      .warnContent{
      	background-color: #f2f2f2;
      	padding: 10px;
      	/* border-radius: 10px; */
      	margin-bottom: 20px;
        font-size: 14px;
        // .warnContentList{
        //   display: flex;
        //   align-items: center;
        //   justify-content: space-between;
        // }
        .contentList>p{
        	padding: 10px 0px;
          margin: 0px;
        }
        .warnContentList .name{
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .warnBtn{
        	display: flex;
        	justify-content: space-between;
        	padding: 10px;
        }
        .warnBtn>p{
        	padding: 5px 10px;
        	color: white;
        	background-color: rgba(236, 128, 141, 1);
        	border-radius: 5px;
          cursor: pointer;
        }
      }
    }
  }
</style>
