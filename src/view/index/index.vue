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
        <div class="warnPeopleBtn"><el-button type="danger">预警人员</el-button></div>
        <div class="warnSwarp">
        	<p class="newWarnTitle">
        		<i class="iconfont icon-deng"></i>最新预警信息
        	</p>
        	<div class="clock"><i class="iconfont icon-tingzhi"></i></div>
        	<div class="warnContentSwarp">
            <el-scrollbar class="dashboard-scrollbar" v-if="dashboardContext.length!=0">
              <div class="warnContent" v-for="(item,index) in dashboardContext" :key="index">
              	<div class="warnContentList">
              		<p>预警人:{{item.name}}</p>
              		<p>预警时间:{{item.time}}</p>
              		<p>预警类型:{{item.type}}</p>
              	</div>
              	<div class="warnBtn">
              		<p>定位</p>
              		<p>详情</p>
              	</div>
              </div>
            </el-scrollbar>
        	</div>
        </div>
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
            type:'外出围栏'
          },
          {
            name:"张三",
            time:'2020-06-02',
            type:'外出围栏'
          },
          {
            name:"张三",
            time:'2020-06-02',
            type:'外出围栏'
          },
          {
            name:"张三",
            time:'2020-06-02',
            type:'外出围栏'
          }
        ]
      }
    },
    methods:{

    },
    mounted() {

    }
  }
</script>

<style lang="scss" scoped>
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
      min-height: 80vh;
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
      	top: 10px;
      	right: 15px;
      }
      .clock i{
      	font-size: 25px;
      	color: rgba(236, 128, 141, 1);
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
      	padding: 15px 10px;
      	/* border-radius: 10px; */
      	margin-bottom: 20px;
        font-size: 14px;

        .warnContentList>p{
        	padding: 10px;
          margin: 0px;
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
