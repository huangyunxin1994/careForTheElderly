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
  import MyMap from '@/components/map/qqmap.vue'
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
        let user = JSON.parse(sessionStorage.getItem('user'))
        getEquipmentAlert({organizationId:user.organizationId,processingResult:1}).then(res=>{
          this.dashboardContext = res.data.data
        }).catch(err=>{

        })
      },
      goPeopleDetails(id){
		  console.log(id)
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
		 let user = JSON.parse(sessionStorage.getItem('user'))
		 let param = {
			 organizationId:user.organizationId,
			 oid:val.id
		 }
        getElderList(param).then(res=>{
          if(res.code==0){
            if(res.data.data.length>0){
              res.data.data.forEach(i => {
                let content =  `<div style='overflow-x: hidden;width: 250px;padding:10px;'>
						<p class='mymap-item'>
						  <span">家庭地址：${i.address}</span>
						<p/>
						<p>联系方式: ${i.sim}</p>
						<div style='display: flex;justify-content: space-between;align-items: center;'>
							<div>姓名:${i.name}</div>
						    <input class='mymap-button'
						           style='background:rgba(29,164,255,1);
						           color:#fff; border:1px solid rgba(29,164,255,1);
						           border-radius:2px; font-size:14px; padding:5px;'
						           type='button' value='查看详情' id='gotDetail'>
						</div>	
					  </div>`
                if(i.fenceWarning == 1){
				  // 1 正常
				  let para =  {
					isIndex:'1',
					id:i.id,
					content:content,
					warning:i.fenceWarning,
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
					content:content,
					warning:i.fenceWarning,
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
               console.log(this.markers)
              
            }
      // console.log(this.markers)
      this.$refs.myMap.reloadMarkers()
            this.$refs.myMap.moveDeploy(val.longitude,val.latitude)
          }
        }).catch(err=>{

        })
      },
      //显示全部人员
     async allPeople(){
	
        let para = JSON.parse(sessionStorage.getItem('user'))
       await getElderList({organizationId:para.organizationId}).then(res=>{
          if(res.code==0){
			  
            if(res.data.data.length>0){
              res.data.data.forEach(i => {
                let content =  `<div style='overflow-x: hidden;width: 250px;padding:10px;'>
						<p class='mymap-item'>
						  <span">家庭地址：${i.address}</span>
						<p/>
						<p>联系方式: ${i.sim}</p>
						<div style='display: flex;justify-content: space-between;align-items: center;'>
							<div>姓名:${i.name}</div>
						    <input class='mymap-button'
						           style='background:rgba(29,164,255,1);
						           color:#fff; border:1px solid rgba(29,164,255,1);
						           border-radius:2px; font-size:14px; padding:5px;'
						           type='button' value='查看详情' id='gotDetail'>
						</div>	
					  </div>`
				  if(i.fenceWarning == 1){
					  console.log(i)
            // 1 正常
           
					  let para =  {
						isIndex:'1',
              id:i.id,
              content:content,
					    warning:i.fenceWarning,
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
					    content:content,
					    warning:i.fenceWarning,
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
                console.log(this.markers)
              });
              this.$refs.myMap.showAllPeople(0)
            }
          }
        }).catch(err=>{

        })
        // let myMarkers = []
        // this.markers = myMarkers
        await this.$refs.myMap.getMap()
      },
      //显示全部人员
      reloadPeople(){
        this.markers.length=0
        let para = JSON.parse(sessionStorage.getItem('user'))
        getElderList({organizationId:para.organizationId}).then(res=>{
          if(res.code==0){
            if(res.data.data.length>0){
              res.data.data.forEach(i => {
                let content =  `<div style='overflow-x: hidden;width: 250px;padding:10px;'>
						<p class='mymap-item'>
						  <span">家庭地址：${i.address}</span>
						<p/>
						<p>联系方式: ${i.sim}</p>
						<div style='display: flex;justify-content: space-between;align-items: center;'>
							<div>姓名:${i.name}</div>
						    <input class='mymap-button'
						           style='background:rgba(29,164,255,1);
						           color:#fff; border:1px solid rgba(29,164,255,1);
						           border-radius:2px; font-size:14px; padding:5px;'
						           type='button' value='查看详情' id='gotDetail'>
						</div>	
					  </div>`
                if(i.fenceWarning == 1){
                  console.log(i)
                  // 1 正常
                  let para =  {
                  isIndex:'1',
                    id:i.id,
                   content:content,
                    warning:i.fenceWarning,
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
                   content:content,
                    warning:i.fenceWarning,
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
                console.log(this.markers)
              });
              this.$refs.myMap.reloadMarkers()
            }
          }
        }).catch(err=>{

        })
        
      },
      baseOrgPos(val){
        let params ={
          longitude:val.longitude,
          latitude:val.latitude
        }
        this.center = {}
        this.center = params
        this.allPeople()
      },
      //显示预警人员
      warnPeople(){
        this.$refs.myMap.showWarnPeople(1)
		this.markers = []
		let para = JSON.parse(sessionStorage.getItem('user'))
		getElderList({organizationId:para.organizationId}).then(res=>{
			console.log(res)
			if(res.code == 0){
				if(res.data.data.length>0){
					res.data.data.forEach((item)=>{
						if(item.fenceWarning == 2){
							let para =  {
							  isIndex:'1',
							  id:item.id,
							  name:item.name,
							  phone:item.sim,
							  address:item.address,
							  warning:item.fenceWarning,
							  longitude:item.longitude,
							  latitude:item.latitude,
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
		  console.log(x)
		  console.log(y)
        this.$refs.myMap.moveDeploy(y,x)
      },
      stop(){
        this.$emit("stop") 
      },
      getSound(val){
        this.$emit("changPlaying",val) 
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
      	top: 7px;
      	right: 7px;
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
