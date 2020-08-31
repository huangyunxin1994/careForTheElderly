<template>
  <div>
    <nav-bar @getSound="getSound"></nav-bar>
    <div class="main">
      <div class="mainLeft">
        <tree :people='true'  @allPeople="allPeople" @warnPeople="warnPeople" @baseOrgPos="baseOrgPos" @handleOrg="handleOrg"></tree>
      </div>
      <div class="mainCenter">
        <my-map ref="myMap" :dragging="true" :zooming="true" :markers="markers"  :zoomLevel="zoomLevel" :center="center"></my-map>
      </div>
      <div class="mainRight">
        <transition name="el-zoom-in-center">
            <div class="warnSwarp" v-show="dashboardContext.length!=0">
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
                <el-scrollbar class="dashboard-scrollbar">
                  <div class="warnContent" v-for="(item,index) in dashboardContext" :key="index">
                    <div class="warnContentList">
                      <div class="contentList name">
                        <div>{{item.elderlyName}}</div>
                        <div>{{item.alertTime}}</div>
                      </div>
                      <div class="contentList type"><p>已外出{{item.fenceName}}</p></div>
                    </div>
                    <div class="warnBtn">
                      <el-button type="danger" size="mini" @click="getLocation(item.actual,item.triggeres)">定位</el-button>
                      <el-button type="danger" size="mini" @click="goPeopleDetails(item.elderlyId)">详情</el-button>
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
  import { getElderList, getEquipmentAlert } from "@/api/api"
  export default {
    components:{
      NavBar,
      MyMap,
      Tree
    },
    data(){
      return{
        dashboardContext:[
          
        ],
        websock:null,
        warnList:false,
        isPlaying:true,//默认播放

        allpeople:{
          name:'wang',
          age:22
        },
        center:{
        },
        markers:[],
        zoomLevel:14
      }
    },
    methods:{
      getWarnList(){
        getEquipmentAlert({processingResult:1}).then(res=>{
          this.dashboardContext = res.data.data
        }).catch(err=>{

        })
        if(this.dashboardContext.length > 0){
          this.warnList = true
          
        }
      },
      goPeopleDetails(id){
        this.$router.push({
            path:'/peopleDetails',
            query: {
              id: id
            }
        })
      },
      getWarnData(){
        this.warnList = !this.warnList
      },
      handleOrg(val){
         this.markers = []
      
      
        getElderList({organizationId:val.id}).then(res=>{
          if(res.code==0){
           
            if(res.data.data.length>0){
              res.data.data.forEach(i => {
                if(i.warning == 1){
				  // 1 正常
				  let para =  {
					isIndex:'1',
					id:i.id,
					name:i.name,
					phone:i.phone,
					address:i.address,
					warning:i.warning,
					longitude:i.longitude,
					latitude:i.latitude,
					icon:{
					  name:normal,
					  size:[48, 48],
					  anchor:[24, 48]
					},
					type:'1',
					// home:{
					//   longitude:i.homeLongitude,
					//   latitude:i.homeLatitude,
					//   icon:{
					// 	name:home,
					// 	size:[48, 48],
					// 	anchor:[24, 48]
					//   },
					//   type:'2'
					// }
				  }
				  this.markers.push(para)
                }else{
				  // 2 是预警
				  let para =  {
					isIndex:'1',
					id:i.id,
					name:i.name,
					phone:i.phone,
					address:i.address,
					warning:i.warning,
					longitude:i.longitude,
					latitude:i.latitude,
					icon:{
					  name:warn,
					  size:[48, 48],
					  anchor:[24, 48]
					},
					type:'1',
					// home:{
					//   longitude:i.homeLongitude,
					//   latitude:i.homeLatitude,
					//   icon:{
					// 	name:home,
					// 	size:[48, 48],
					// 	anchor:[24, 48]
					//   },
					//   type:'2'
					// }
				  }
				  this.markers.push(para)
                }
                
              });
               
              this.$refs.myMap.showAllPeople(0)
            }
			console.log(this.markers)
            this.$refs.myMap.movePosBypoint(val.longitude,val.latitude)
          }
        }).catch(err=>{

        })
      },
      //显示全部人员
      allPeople(){
	
        let para = JSON.parse(sessionStorage.getItem('user'))
        getElderList({organizationId:para.organizationId}).then(res=>{
          if(res.code==0){
			  
            if(res.data.data.length>0){
              res.data.data.forEach(i => {
				  if(i.warning == 1){
					  // 1 正常
					  let para =  {
						isIndex:'1',
					    id:i.id,
					    name:i.name,
					    phone:i.phone,
					    address:i.address,
					    warning:i.warning,
					    longitude:i.longitude,
					    latitude:i.latitude,
					    icon:{
					      name:normal,
					      size:[48, 48],
					      anchor:[24, 48]
					    },
					    type:'1'
					    // home:{
					    //   longitude:i.homeLongitude,
					    //   latitude:i.homeLatitude,
					    //   icon:{
					    //     name:home,
					    //     size:[48, 48],
					    //     anchor:[24, 48]
					    //   },
					    //   type:'2'
					    // }
					  }
					  this.markers.push(para)
				  }else{
					  // 2 是预警
					  let para =  {
						isIndex:'1',
					    id:i.id,
					    name:i.name,
					    phone:i.phone,
					    address:i.address,
					    warning:i.warning,
					    longitude:i.longitude,
					    latitude:i.latitude,
					    icon:{
					      name:warn,
					      size:[48, 48],
					      anchor:[24, 48]
					    },
					    type:'1'
					    // home:{
					    //   longitude:i.homeLongitude,
					    //   latitude:i.homeLatitude,
					    //   icon:{
					    //     name:home,
					    //     size:[48, 48],
					    //     anchor:[24, 48]
					    //   },
					    //   type:'2'
					    // }
					  }
					  this.markers.push(para)
				  }
                
              });
              this.$refs.myMap.showAllPeople(0)
            }
          }
        }).catch(err=>{

        })
        // let myMarkers = []
        // this.markers = myMarkers
        
      },
      baseOrgPos(val){
        let params ={
          longitude:val.longitude,
          latitude:val.latitude
        }
        this.center = {}
        this.center = params
      },
      //显示预警人员
      warnPeople(){
        this.$refs.myMap.showWarnPeople(1)
		this.markers = []
		let para = JSON.parse(sessionStorage.getItem('user'))
		getElderList({organizationId:para.organizationId}).then(res=>{
			if(res.code == 0){
				if(res.data.data.length>0){
					res.data.data.forEach((item)=>{
						if(item.warning == 2){
							let para =  {
													isIndex:'1',
							  id:i.id,
							  name:i.name,
							  phone:i.phone,
							  address:i.address,
							  warning:i.warning,
							  longitude:i.longitude,
							  latitude:i.latitude,
							  icon:{
							    name:warn,
							    size:[48, 48],
							    anchor:[24, 48]
							  },
							  type:'1'
							}
							this.markers.push(para)
						}
					})
				}
			}
		})
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
      },
      initWebSocket(){ //初始化weosocket
      console.log(251)
        const wsuri = "ws://192.168.9:8085";
        this.websock = new WebSocket(wsuri);
        this.websock.onmessage = this.websocketonmessage;
        this.websock.onopen = this.websocketonopen;
        this.websock.onerror = this.websocketonerror;
        this.websock.onclose = this.websocketclose;
      },
      websocketonopen(){ //连接建立之后执行send方法发送数据
       console.log('发送');
        let actions = {"test":"12345"};
        // this.websocketsend(JSON.stringify(actions));
      },
      websocketonerror(){//连接建立失败重连
      console.log('断开连接');
        // this.initWebSocket();
      },
      websocketonmessage(e){ //数据接收
        const redata = JSON.parse(e.data);
      },
      websocketsend(Data){//数据发送
       console.log('发送1');
        this.websock.send(Data);
      },
      websocketclose(e){  //关闭
        console.log('断开连接',e);
      },
    },
     created() {
      // this.initWebSocket();
    },
    destroyed() {
      this.websock.close() //离开路由之后断开websocket连接
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
