<template>
  <div>
    <nav-bar @getSound="getSound"></nav-bar>
    <div class="main">
      <div class="mainLeft">
        <tree :people='true'  @allPeople="allPeople" @warnPeople="warnPeople"></tree>
      </div>
      <div class="mainCenter">
        <my-map ref="myMap" :dragging="true" :zooming="true" :markers="markers" :view="true"></my-map>
      </div>
      <div class="mainRight">
        <transition name="el-zoom-in-center">
            <div class="warnSwarp" v-show="warnList">
              <div class="newWarnTitle" >
                <i class="iconfont icon-deng"></i>最新预警信息
              </div>
              <div class="clock">
                <audio id="audio" loop ref="music" >
                  <source src="../../assets/mp3/dididi.mp3" type="audio/mpeg" />
                </audio>
                <el-tooltip content="停止本次报警音效" placement="top">
                   <el-button  class="iconfont icon-zanting warnClock" size="mini" circle @click="stop"></el-button>
                </el-tooltip>
              </div>
              <div class="warnContentSwarp">
                <el-scrollbar class="dashboard-scrollbar" v-if="dashboardContext.length!=0">
                  <div class="warnContent" v-for="(item,index) in dashboardContext" :key="index">
                    <div class="warnContentList">
                      <div class="contentList name">
                        <div>{{item.name}}</div>
                        <div>{{item.time}}</div>
                      </div>
                      <div class="contentList type"><p>{{item.type}}</p></div>
                    </div>
                    <div class="warnBtn">
                      <el-button type="danger" size="mini" @click="getLocation(116.310,39.90)">定位</el-button>
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

  // 图标
  import normal from '@/icons/png/personn.png'
  import warn from '@/icons/png/personw.png'
  // import home from '@/icons/png/jiating.png'
  import home from '@/icons/png/jia.png'
  import { PersonnelStatus } from "@/api/api"
  export default {
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
            time:'2020-06-02 13:00:56',
            type:'外出xxx围栏'
          },
          {
            name:"张三",
            time:'2020-06-02 13:00:56',
            type:'外出ssss围栏'
          },
          {
            name:"张三",
            time:'2020-06-02 13:00:56',
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
        warnList:false,
        isPlaying:true,//默认播放

        allpeople:{
          name:'wang',
          age:22
        },
        markers:[
          {
            longitude:"115.304",
            latitude:"39.945",
            icon:{
              name:normal,
              size:[48, 48],
              anchor:[24, 48]
            },
            type:'0',
            home:{
              longitude:"116.468",
              latitude:"39.902",
              icon:{
                name:home,
                size:[48, 48],
                anchor:[24, 48]
              },
              type:'2'
            }
          },
          {
            longitude:"116.300",
            latitude:"39.955",
            icon:{
              name:normal,
              size:[48, 48],
              anchor:[24, 48]
            },
            type:'0',
            home:{
              longitude:"116.560",
              latitude:"39.902",
              icon:{
                name:home,
                size:[48, 48],
                anchor:[24, 48]
              },
              type:'2'
            }
          },
          {
            longitude:"116.310",
            latitude:"39.90",
            icon:{
              name:warn,
              size:[48, 48],
              anchor:[24, 48]
            },
            type:'1',
            home:{
              longitude:"116.480",
              latitude:"39.902",
              icon:{
                name:home,
                size:[48, 48],
                anchor:[24, 48]
              },
              type:'2'
            }
          },
          {
            longitude:"116.360",
            latitude:"39.922",
            icon:{
              name:warn,
               size:[48, 48],
              anchor:[24, 48]
            },
            type:'1',
            home:{
              longitude:"116.460",
              latitude:"39.902",
              icon:{
                name:home,
                size:[48, 48],
                anchor:[24, 48]
              },
              type:'2'
            }
          }
        ]
      }
    },
    methods:{
      getWarnList(){
        if(this.dashboardContext.length > 0){
          this.warnList = true
          // this.play()
        }
      },
      goPeopleDetails(){
        this.$router.push('/peopleDetails')
      },
      getWarnData(){
        this.warnList = !this.warnList
      },
      //显示全部人员
      allPeople(){

        let para = JSON.parse(sessionStorage.getItem('user'))
        console.log(para)
        PersonnelStatus({organizationId:para.organizationId}).then(res=>{
          if(res.code==0){
            console.log(res)
          }
        }).catch(err=>{

        })
        // let myMarkers = []
        // this.markers = myMarkers
        this.$refs.myMap.showAllPeople(0)
      },
      //显示预警人员
      warnPeople(){
        this.$refs.myMap.showWarnPeople(1)
      },
      //定位
      getLocation(x,y){
        this.$refs.myMap.movePosBypoint(x,y)
      },
      //播放音频
      play(){
        let audio1 = document.getElementById('audio')
        if(this.isPlaying == true){
          audio1.play()
        }else{
          audio1.pause()
        }
      },
      //停止音频
      stop(){
       let audio1 = document.getElementById('audio')
        audio1.pause()
      },
      getSound(val){
        if(val == false){
          this.isPlaying = true
          this.play()
        }else{
          this.isPlaying = false
          this.play()
        }
      }
    },
    created() {
      
    },
    mounted() {
      this.allPeople()
      
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
      // min-height: 80vh;
      height: calc(100vh - 150px);
      box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
      padding: 0.5vw;
      z-index: 100;
      background-color: #fff;
    }
    .mainCenter{
      width: 100vw;
      height: calc(100vh - 65px);
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
      	font-size: 1vw;
      	color: rgba(236, 128, 141, 1);
      	padding: 10px;
      	font-weight: 600;

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
        	padding: 14px 0px;
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
        	padding:0px 10px;
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
