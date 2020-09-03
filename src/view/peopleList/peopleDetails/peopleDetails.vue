<template>
  <div class="wrap">
    <nav-bar></nav-bar>
    <div class="content">
      <el-container class="contain">
        <el-header height="90px" style="margin-top: 5px; width: 100%;" class="contain-head">

          <div class="mainleft">
            <!-- <el-avatar :size="70" :src="circleUrl"></el-avatar> -->
            <div class="contain-head-mes">
              <div><span class="contain-head-mes-name">{{eData.name}}</span></div>
              <div class="contain-head-mes-state">
                <div class="contain-head-mes-state-item"><i class="iconfont icon-bushu" style="color: #f8b62e;;"></i><span>{{eData.stepNumber}}步</span></div>
                <div class="contain-head-mes-state-item">
                  <i class="iconfont icon-electricquantity2dianchidianliang" style="color: #f8b62e;;"></i><span>{{eData.electricQuantity}}%</span>
                  <!-- <div style="display: flex;justify-content: flex-start;align-items: center;">
                    <div style="width: 20px; height: 10px;">
                      <battery ref="battery"></battery>
                    </div>
                    <span>低电</span>
                  </div> -->
                </div>
              </div>
            </div>
            <div class="contain-head-detais">
              <div class="top-detais">
                  <div class="baseMess">
                  <i class="iconfont icon-shoubiao" style="color: #f8b62e;"></i><span>{{eData.equipmentCode}}</span>
                </div>
                <div class="baseMess">
                  <i class="iconfont icon-shenfenzhenghao" style="color: #f8b62e;"></i><span>{{eData.idCard}}</span>
                </div>
                <div class="baseMess">
                  <i class="iconfont icon-dianhua" style="color: #f8b62e;"></i><span>{{eData.sim}}</span>
                </div>
              </div>
              <div class="baseMess">
                <i class="iconfont icon-dizhi" style="color: #f8b62e;"></i><span>{{eData.address}}</span>
              </div>
            </div>
          </div>

          <div class="contain-head-phone">
            <div class="contain-head-mes">
              <div style="width: 100%; text-align: center;"><span style="font-size: 1vw; color: #606266; font-weight: 600; ">监护人信息</span></div>
            </div>
            <div class="contain-head-phone-detais">
              <div>
                <div class="contain-head-phone-detais-base">
                  <div class="familyName">{{mData.name}}</div>
                  <div class="phone"><i class="iconfont icon-dianhua" style="color: #f8b62e;"></i><span>{{mData.phone}}</span></div>
                </div>
                <div>
                  <i class="iconfont icon-dizhi" style="color: #f8b62e;"></i><span>{{mData.address}}</span>
                </div>
              </div>

              <el-button type="primary" size="small" @click="searchRuardian">所有监护人信息</el-button>
            </div>
         </div>
        </el-header>
        <el-main class="main">
          <div class="picWrap">
          <div class="selectTime">
              <my-date @getChartData="getChartData" :size="'small'"></my-date>
          </div>
            <!-- <div id="" class="echartNoData"  style="margin-bottom:20px" v-show="heart.length==0">
              <div class="echartNoData-title">心率</div>
              <div class="echartNoData-result">暂无数据</div>
            </div> -->
            <div id="heartrate" class="echartItem" :class="{'echartItemAlert':heartrate==1}" style="margin-bottom:20px" />
            <!-- <div id="" class="echartNoData"  style="margin-bottom:20px" v-show="booldH.length==0" >
              <div class="echartNoData-title">血压</div>
              <div class="echartNoData-result">暂无数据</div>
            </div> -->
            <div id="bloodpress" class="echartItem" :class="{'echartItemAlert':bloodpress==1}" />
        </div>
          <div class="mapWrap">

          <div class="mapContent">
            <div class="mapContentLeft">
              <div class="selectTime">
                <span class="demonstration">选择时间段</span>
                <el-date-picker
                  v-model="time1"
                  type="datetimerange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  value-format="yyyy-MM-dd hh:mm:ss"
                  end-placeholder="结束日期"  size="small"
                  @change="selectCoordinate">
                </el-date-picker>
              </div>
              <div class="mapPictrue">
                <div class="map-location">
                 <el-tag type="primary" >最新地址获取时间:{{pointDate}}</el-tag>
                </div>
                 <div class="mapPictrue-icon" style="" @click="getNowAdress">
                    <i class="el-icon-aim"></i>
                  </div>
                <my-map ref="map" :center="center" :markers="markers" :polylines="polylines" :view="true"></my-map>
              </div>
            </div>
            <div class="mapContentRight">
              <div class="warnList">
                <div class="warnListTitle">预警列表</div>
                <div class="warnNoList" style="height:calc(100% - 30px)" v-show="warnList.length == 0">
                  暂无预警
                </div>
                <el-scrollbar style="height:calc(100% - 30px)" v-show="warnList.length > 0">
                  <div class="warnContent" v-for="item in warnList" :key="item.id">
                    <div class="warnContent-top">
                      <span class="warnTime">{{item.alertTime}} </span>
                      <div  @click="movePos(item)">
                        <el-tooltip content="定位" placement="top">
                           <i class="iconfont icon-dingwei" style="color:"></i>
                        </el-tooltip>
                      </div>
                    </div>
                    <p class="warnName">{{item.fenceName}}</p>
                    <div class="warnBtn">
                      <el-button type="danger" size="mini" @click="ignoreResult(item.id)">忽略</el-button>
                      <el-button type="danger" size="mini" @click="writeResult(item.id)">填写处理结果</el-button>
                    </div>
                  </div>
                  
                 </el-scrollbar>
              </div>
            </div>
          </div>
          </div>
        </el-main>
      </el-container>
    </div>
    <write-result ref="WriteResult" @removeWarn="removeWarn"></write-result>
    <guardian-mess ref="guardianMess" :fData="fData"></guardian-mess>
  </div>
</template>

<script>
  import echarts from 'echarts'
  import NavBar from '@/components/navBar/navBar.vue'
  import GuardianMess from '@/components/dialogGuardianMess/dialogGuardianMess.vue'
  import MyMap from '@/components/map/qqmap.vue'
  import myDate from "@/components/date/index"
  import WriteResult from '@/components/dialogHandleResult/dialogHandleResult'
  import home from '@/icons/png/jia.png'
  import dian from '@/icons/png/dian.png'
  import person from '@/icons/png/personw.png'
  import normal from '@/icons/png/personn.png'
  import Battery from '@/components/battery/battery.vue'
  import { elderlyStatus,equipmentAlert,familymembers,locationTracking,BloodPressure,dealEquipmentAlert,selectCoordinate } from '@/api/api'
  import { parseTime } from "@/utils/index.js"
  export default {
    components:{
      NavBar,
      MyMap,
      WriteResult,
      myDate,
      GuardianMess,
      Battery
    },
    data(){
      return{
        eid:"",//老人id
        fData:[],//老人家属信息
        eData:{},//老人与设备信息
        mData:{},//主监护人信息
        warnList:"",//老人预警列表
        center:{},
        markers:[],
        polylines:[

        ],
        circleUrl: "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png",
        state:1,
        time:'',
        time1:'',//选择时间段
        heartrate:'0',
        bloodpress:'0',
        heart:[],
        booldH:[],
        booldL:[],
        time:[],
        pointDate:"",
      }
    },
    methods:{
       setDateTime(val){
        if(val)
          this.dateTime=val.getTime();
        else
          this.dateTime=""

      },
      //绘制图
      drawChart(){
        console.log(this.booldL)
        let heartrate = echarts.init(document.getElementById('heartrate'));
        let option3={
            title: {text: '心率'},
            tooltip:{trigger: 'axis',},
            legend: {
              orient: 'vertical',
              left: 'center',
              bottom:'bottom',
              data:['今日'],
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                name:"单位:小时",
                interval:4,
                // data: this.bhTime
                data:this.time
            },
            yAxis: {
                type: 'value',
                name:"单位:bpm",
            },
            series: [{
                name:"今日",
                // data: this.heartRateT,
                data:this.heart,
                type: 'line',
                itemStyle: {     //此属性的颜色和下面areaStyle属性的颜色都设置成相同色即可实现
                    color: '#E6A23C',
                    borderColor: '#E6A23C',
                },
                markLine : {
                  symbol:"none",               //去掉警戒线最后面的箭头
                  label:{
                      position:"end",         //将警示值放在哪个位置，三个值“start”,"middle","end"  开始  中点 结束
                      formatter: "警戒线"
                  },
                  data : [{
                      silent:false,             //鼠标悬停事件  true没有，false有
                      lineStyle:{               //警戒线的样式  ，虚实  颜色
                          type:"solid",
                          color:"rgba(238, 99, 99)",
                          width:2,
                      },
                      name: '警戒线',
                      yAxis: 35
                  }]
                }
            }]
        }
        let bloodpress = echarts.init(document.getElementById('bloodpress'));
         let option4={
            title: {text: '血压'},
            tooltip:{trigger: 'axis',},
            legend: {
              orient: 'vertical',
              left: 'center',
              bottom:'bottom',
              data:['高压','低压'],
            },
            xAxis: {
              type: 'category',
              boundaryGap: false,
              name:"单位:小时",
              interval:4,
              // data: this.bhTime
              data:this.time
            },
            yAxis: {
                type: 'value',
                name:"单位:mmHg",
            },
            series: [{
                name:"高压",
                // data: this.systolicPressureT,
                data:this.booldH,
                type: 'line',
                itemStyle: {     //此属性的颜色和下面areaStyle属性的颜色都设置成相同色即可实现
                    color: '#E6A23C',
                    borderColor: '#E6A23C',
                },
                markLine : {
                  symbol:"none",               //去掉警戒线最后面的箭头
                  label:{
                      position:"end",         //将警示值放在哪个位置，三个值“start”,"middle","end"  开始  中点 结束
                      formatter: "警戒线"
                  },
                  data : [{
                      silent:false,             //鼠标悬停事件  true没有，false有
                      lineStyle:{               //警戒线的样式  ，虚实  颜色
                          type:"solid",
                          color:"rgba(238, 99, 99)",
                          width:2,
                      },
                      name: '警戒线',
                      yAxis: 35
                  }]
                }
            },
            {
                name:"低压",
                data: this.booldL,
                type: 'line',
                itemStyle: {     //此属性的颜色和下面areaStyle属性的颜色都设置成相同色即可实现
                    color: '#409EFF',
                    borderColor: '#409EFF',
                }
            }
            ]
        }
        bloodpress.setOption(option4);
        heartrate.setOption(option3);
        window.onresize =function(){
            heartrate.resize()
             bloodpress.resize()
        }
      },
      //忽略
      ignoreResult(id){
          this.$confirm('确认忽略该预警信息吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let user = JSON.parse(sessionStorage.getItem("user"))
          dealEquipmentAlert({eid:id,uid:user.userId,handleRecord :'忽略'}).then(res=>{
            if(res.code == 0){
              this.$message({
                message: '忽略成功',
                type: 'success'
              });
             this.removeWarn(id)
            }else{
              this.$message({
              message: res.msg,
              type: 'error'
            });
            }
          }).catch(err=>{
             this.$message({
              message: res.msg,
              type: 'error'
            });
          })
        }).catch(() => {
                  
        });
         
      },
      //填写处理结果
      writeResult(id){
        if(id&&id!=""){
          this.$refs.WriteResult.id = id
          this.$refs.WriteResult.dialogHandleResult = true
        }else{
          this.$message({
            message: '请先选择一条预警记录',
            type: 'warning'
          });
        }
        
      },
      removeWarn(id){
         this.warnList.splice(this.warnList.findIndex(i=>i.id==id),1)
      },
      //查看所有监护人
      searchRuardian(){
        this.$refs.guardianMess.dialogVisible = true
      },
      //定位到当前位置
      getNowAdress(){
        locationTracking({eid:this.eid}).then(res=>{
        if(res.code == 0){
            console.log(res.data)
            let para = {
              longitude:res.data.coordinate.longitude,
              latitude:res.data.coordinate.latitude,
              icon:{
                name:normal,
                size:[62, 48],
                anchor:[24, 48]
              }
            }
			console.log(para)
            this.markers.length=0
            this.markers.push(para)
            this.$refs.map.moveDeploy(res.data.coordinate.longitude,res.data.coordinate.latitude)
            this.$refs.map.reloadMarkers()
            this.pointDate = res.data.coordinate.createTime
          }
      }).catch(err=>{
          console.log(err)
        })
      },
      selectCoordinate(e){
        console.log(e)
        selectCoordinate({eid:this.eid,startTime:e[0],endTime:e[1]}).then(res=>{
          if(res.code ==0){
            if(res.data.data.length>0){
               console.log(res)
              this.markers.length=0
              this.polylines.length=0
              this.polylines[0]=[]
              res.data.data.forEach(i => {
                 let para = {
                    longitude:i.longitude,
                    latitude:i.latitude,
                    icon:{
                      name:dian,
                      size:[32, 32],
                      anchor:[16, 16]
                    }
                }
                this.markers.push(para)
                 this.polylines[0].push(i)
              })
              this.$refs.map.reloadMarkers()
              this.$refs.map.reloadPolylines()
            }else{
              console.log("暂无数据")
            }
           
          }
        }).catch(err=>{
          console.log(err)
        })
      },
      //定位到预警位置
      movePos(item){
        console.log(item)
      },
      getChartData(time){
        time = parseTime(time,'{y}-{m}-{d}')
          BloodPressure({eid:this.eid,time:time }).then(res=>{
          if(res.code == 0){
			  console.log(res)
              if(res.data.data&&res.data.data.length>0){
                let heart=[],booldH=[],booldL=[],time=[]
                res.data.data.forEach(i => {
                 heart.push(i.heartRate)
                  booldH.push(i.systolicPressure)
                  booldL.push(i.diastolicPressure)
                  console.log(i.hours.substring(0,i.hours.lastIndexOf(':')))
                  time.push(i.hours.substring(0,i.hours.lastIndexOf(':')))
                });
                this.heart= heart
                this.booldL= booldL
                this.booldH= booldH
                this.time= time
                this.drawChart()
              }else{
                this.heart= []
                this.booldL= []
                this.booldH= []
                this.time= []
              }
            }
          }).catch(err=>{
            console.log(err)
        })
      }
    },
   async mounted() {
      this.eid = this.$route.query.id
      await elderlyStatus({eid:this.eid}).then(res=>{
		  console.log("获取到总的数据")
		  console.log(res)
          if(res.code == 0){
            this.eData = res.data.elderly
            this.mData = res.data.isMain
           let para = {
              longitude:res.data.elderly.longitude,
              latitude:res.data.elderly.latitude,
              icon:{
                name:home,
                size:[48, 48],
                anchor:[24, 48]
              }
            }
            this.markers.push(para)
          }
        }).catch(err=>{
          console.log(err)
        })
      let date = new Date()
      let time = parseTime(date,'{y}-{m}-{d}')
      console.log(time)
      await BloodPressure({eid:this.eid,time:time }).then(res=>{
        if(res.code == 0){
            if(res.data.data&&res.data.data.length>0){
              res.data.data.forEach(i => {
                this.heart.push(i.heartRate)
                this.booldH.push(i.systolicPressure)
                this.booldL.push(i.diastolicPressure)
                console.log(i.hours.substring(0,i.hours.lastIndexOf(':')))
                this.time.push(i.hours.substring(0,i.hours.lastIndexOf(':')))
              });
            }
          }
        }).catch(err=>{
          console.log(err)
      })
      await equipmentAlert({code:this.eData.equipmentCode}).then(res=>{
        if(res.code == 0){
            this.warnList = res.data.list
          }
      }).catch(err=>{
          console.log(err)
        })
      await familymembers({eid:this.eid}).then(res=>{
        if(res.code == 0){
             this.fData = res.data.list
          }
      }).catch(err=>{
          console.log(err)
        })
      await locationTracking({eid:this.eid}).then(res=>{
        if(res.code == 0){
			let param = {
				longitude:res.data.coordinate.longitude,
				latitude:res.data.coordinate.latitude
			}
            this.center = param
            this.pointDate = res.data.coordinate.createTime
			if(this.eData.fence_warning == 2){
				let para = {
				  longitude:res.data.coordinate.longitude,
				  latitude:res.data.coordinate.latitude,
				  icon:{
				    name:person,
				    size:[62, 48],
				    anchor:[24, 48]
				  }
				}
				this.markers.push(para)
			}else{
				let para = {
				  longitude:res.data.coordinate.longitude,
				  latitude:res.data.coordinate.latitude,
				  icon:{
				    name:normal,
				    size:[62, 48],
				    anchor:[24, 48]
				  }
				}
				this.markers.push(para)
			}
          }
      }).catch(err=>{
          console.log(err)
      })
      // if(this.heart.length>0||(this.booldH.length>0&&this.booldL.length>0))
      await this.drawChart()
      await this.$refs.map.getMap()
    },
  }
</script>

<style lang="scss" scoped>
  ul>li{
    list-style: none;
  }
  .wrap{
    background-color: rgb(244, 244, 245);
  }
  .content{
    padding: 20px;
    background-color: rgb(244, 244, 245);
    width: calc(100% - 40px);
    height: calc(100vh - 105px);
  }
  .contain{
    background-color: #fff;

    &-head{
      display: flex;
      justify-content: space-between;
      align-items: center;
      // border-bottom: 1px solid #DCDFE6;
      .mainleft{
        display: flex;
        align-items: center;
        justify-content: flex-start;
        border-radius: 10px;
        height: 74px;
        border: 1px solid #ccc;
      }
      &-mes{
        display: flex;
        justify-content: flex-start;
        align-items: center;
        height: 100%;
        padding: 0px 1vw;
        border-radius: 10px 0px 0px 10px;
        background-color: #e1f1f8;
		min-width: 135px;
		text-align: center;

        &-name{
          font-size: 1.2vw;
		  font-weight: 600;
		  color: #606266;
          margin-bottom: 20px;
        }
        &-state{
          margin:0px 10px 0px 15px;

          &-item{
            display: flex;
            justify-content: flex-start;
            align-items: center;
            font-size: 1vw;
            color: #606266;
            font-weight: 600;
          }
          .iconfont{
            font-size: 1.5vw;
            margin-right: 5px;
          }
        }
      }
      &-detais{
         display: flex;
         flex-direction: column;
          justify-content: space-around;
          align-items: flex-start;
          font-size: 0.8vw;
          color:#909399 ;
          padding: 0px 20px;
          .top-detais{
            margin-bottom: 10px;
            display: flex;
            justify-content: flex-start;
            align-items: center;

          }
          .baseMess{
              margin-right: 20px;
               display: flex;
            justify-content: flex-start;
            align-items: center;
            }
          .iconfont{
            font-size: 1.2vw;
          }
      }
      &-phone{
         display: flex;
         justify-content: flex-start;
         align-items: center;
         // min-width: 326px;
         font-size: 0.8vw;
         color: #909399;
         height: 74px;
         border-radius: 10px;
         border: 1px solid #ccc;
         width: 45%;
         &-detais{
           display: flex;
           align-items: center;
           justify-content: space-around;
           // padding: 0px 20px;
           width: calc(100% - 136px);

           &-base{
             display: flex;
             align-items: center;
             margin-bottom: 10px;
             justify-content: space-between;
             // min-width: 200px;

             .familyName{
               margin-right: 1vw;
             }
           }
         }
         .top-phone{
          display: flex;
          align-items: center;
          justify-content: space-around;
          .iconfont{
            font-size: 1.2vw;
          }
          .phone{
            display: flex;
            justify-content: flex-start;
            align-items: center;
          }
         }
      }
    }

  }
  .aside{
    padding: 20px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    &-top{
      width: 100%;
      height: calc(50% - 20px);
      box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
    }
    &-bottom{
     width: 100%;
      height: 50%;
      box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
    }
  }
  .main{
    // min-width: 1250px;
    height: calc(100vh - 195px);
    display: flex;
    justify-content: space-between;
    .picWrap{
      width: 30%;
      height: 100%;
      margin-right: 20px;
      .selectTime{
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        margin-bottom: 20px;
        .el-button{
          margin-left: 20px;
        }
      }
      .echartItem{
        width: 100%;
        height: calc(50% - 30px);
        border-radius: 0.8vw;
        padding: 20px;
        box-sizing: border-box;
        border:1px solid #E4E7ED;
      }
      .echartNoData{
         width: 100%;
        height: calc(50% - 30px);
        border-radius: 0.8vw;
        padding: 20px;
        box-sizing: border-box;
        border:1px solid #E4E7ED;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        &-title{
          font-size: 1vw;
          font-weight: 700;
          margin-bottom: 10%;

        }
        &-result{
          font-size: 0.8vw;
          color: #909399;
          
        }
      }
      .echartItemAlert{
        // background: rgb(254, 240, 240);
        border:1px solid #F56C6C;
      }
    }
    .mapWrap{
      width: calc(70% - 20px);
       height: 100%;
      .mapContent{
        display: flex;
        justify-content: space-between;
        width: 100%;
         height: 100%;
        .mapContentLeft{
          width: 75%;
           height: 100%;
           margin-right: 20px;
            .selectTime{
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        margin-bottom: 20px;
        .demonstration{
          font-size: 0.8vw;
          min-width: 55px;
          margin-right: 20px;
        }
      }
          .mapPictrue{
            width: 100%;
            height: calc(100% - 50px);
            position: relative;
            .map-location{
              position: absolute;
              top:20px;
              left:20px;
              z-index: 1;
            }
            &-icon{
              z-index: 1;
              position: absolute;
              top:20px;
              right:20px;
              width:40px;
              height:40px;
              border-radius:50%;
              color:#606266;
              font-size: 22px;
              background:#fff;
               box-shadow:  0 2px 12px 0 rgba(0, 0, 0, 0.3);
               display: flex;
              align-items: center;
              justify-content: center;
              cursor: pointer;
            }
          }
        }
        .mapContentRight{
          width: 25%;
          height: 100%;
          border: 1px solid #EBEEF5;
          min-width: 210px;
          .warnList{
            padding: 10px;
            height: 100%;
            box-sizing: border-box;
            .warnListTitle{
              font-size: 1vw;
              font-weight: 600;
              height: 30px;
              color: #ec808d;
            }
            .warnNoList{
              font-size: 1vw;
              display: flex;
                align-items: center;
                justify-content: center;
            }
            .warnContent{
              background-color: #f2f2f2;
              box-sizing: border-box;
              padding: 10px;
              font-size: 0.8vw;
              margin-bottom: 10px;
              &-top{
                display: flex;
                align-items: center;
                justify-content: space-between;
                .location{
                  color: #E6A23C;
                  font-size: 20px;
                  position: relative;
                }
                .iconfont{
                  font-size: 1.1vw;
                  color: #797a7b;
                  cursor: pointer;
                }
              }
              .warnContentItem{
                display: flex;
                align-items: center;
                justify-content: space-between;
              }
              .warnName{
                // margin: 10px 0 20px;
                overflow: hidden;
                text-overflow:ellipsis;
                white-space: nowrap;
              }
              .warnBtn{
                padding:0px 10px;
              	display: flex;
              	justify-content: space-between;
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
      }

    }
  }
</style>
