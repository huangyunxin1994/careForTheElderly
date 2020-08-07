<template>
  <div>
    <nav-bar></nav-bar>
      <el-container class="contain">
        <el-header height="90px" class="contain-head"> 
          <el-avatar :size="70" :src="circleUrl"></el-avatar>
          <div class="contain-head-mes">
            <span class="contain-head-mes-name">张三</span>
            <div class="contain-head-mes-state">
              <div class="contain-head-mes-state-item" style="margin:0 10px"><i class="iconfont icon-bushu" style="color: #f8b62e;;"></i><span>800步</span></div>
              <div class="contain-head-mes-state-item"><i class="iconfont icon-electricquantity2dianchidianliang" style="color: #f8b62e;;"></i><span>低电</span></div>
            </div>
          </div>
          <div class="contain-head-detais">
            <div class="top-detais">
                <div class="baseMess">
                <i class="iconfont icon-shoubiao" style="color: #f8b62e;"></i><span>465467984546456</span>
              </div>
              <div class="baseMess">
                <i class="iconfont icon-shenfenzhenghao" style="color: #f8b62e;"></i><span>524512563256235698</span>
              </div>
              <div class="baseMess">
                <i class="iconfont icon-dianhua" style="color: #f8b62e;"></i><span>15685458569</span>
              </div>
            </div>
            <div class="baseMess">
              <i class="iconfont icon-dizhi" style="color: #f8b62e;"></i><span>南宁市青秀区东葛路长</span>
            </div>
          </div>
            <div class="contain-head-phone">
              <div class="top-phone">
                <div style="margin-bottom:20px">主监护人：张小二</div> 
                <div class="phone"><i class="iconfont icon-dianhua" style="color: #f8b62e;"></i><span>15685458569</span></div> 
              </div>
             
             <el-button type="primary" size="small">所有监护人信息</el-button>
           </div>
        </el-header>
        <el-main class="main">
          <div class="picWrap">
        <div class="selectTime">
          <!-- <el-date-picker
                v-model="time"
                type="date"
                placeholder="选择日期"
                size="small"
                >
              </el-date-picker> -->
              <my-date @getData="setDateTime" :size="'small'"></my-date>
          <el-button type="primary" size="small">确定</el-button>
        </div>
          <div id="heartrate" class="echartItem" :class="{'echartItemAlert':heartrate==1}" style="margin-bottom:20px"/>
          <div id="bloodpress" class="echartItem" :class="{'echartItemAlert':bloodpress==1}"/>
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
                end-placeholder="结束日期"  size="small" @change="searchLocus">
              </el-date-picker>
            </div>
            <div class="mapPictrue">
              <div class="map-location">
               <el-tag type="primary" >最新地址获取时间:2020年7月18日 18时54分</el-tag>
              </div>
               <div class="mapPictrue-icon" style="">
                  <i class="el-icon-aim" ></i>
                </div>
              <my-map ref="map" :center="center" :markers="markers" :polylines="polylines"></my-map>
            </div>
          </div>
          <div class="mapContentRight">
            <div class="warnList">
              <div class="warnListTitle">预警列表</div>
              <el-scrollbar style="height:calc(100% - 30px)">
                <div class="warnContent">
                  <div class="warnContent-top">
                    <span class="warnTime">2020-3-23 13:13:00 </span>
                    <div>
                      <i class="el-icon-s-promotion location" ></i>
                    </div>
                  </div>
                  <div class="warnName">XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX围栏</div>
                  <div class="warnBtn">
                    <el-button type="info" size="mini">忽略</el-button>
                    <el-button type="primary" size="mini" @click="writeResult">填写处理结果</el-button>
                  </div>
                </div>
                 <div class="warnContent">
                  <div class="warnContent-top">
                    <span class="warnTime">2020-3-23 13:13:00 </span>
                    <div>
                      <i class="el-icon-s-promotion location" style="color:"></i>
                    </div>
                  </div>
                  <div class="warnName">XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX围栏</div>
                  <div class="warnBtn">
                    <el-button type="info" size="mini">忽略</el-button>
                    <el-button type="primary" size="mini" @click="writeResult">填写处理结果</el-button>
                  </div>
                </div>
                 <div class="warnContent">
                  <div class="warnContent-top">
                    <span class="warnTime">2020-3-23 13:13:00 </span>
                    <div>
                      <i class="el-icon-s-promotion location" style="color:"></i>
                    </div>
                  </div>
                  <div class="warnName">XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX围栏</div>
                  <div class="warnBtn">
                    <el-button type="info" size="mini">忽略</el-button>
                    <el-button type="primary" size="mini" @click="writeResult">填写处理结果</el-button>
                  </div>
                </div>
               </el-scrollbar>
            </div>
          </div>
        </div>
      </div>
        </el-main>
      </el-container>
    <write-result ref="WriteResult"></write-result>
  </div>
</template>

<script>
  import echarts from 'echarts'
  import NavBar from '@/components/navBar/navBar.vue'
  import MyMap from '@/components/map/map.vue'
  import myDate from "@/components/date/index"
  import WriteResult from '@/components/dialogHandleResult/dialogHandleResult'
  import home from '@/icons/png/jia.png'
  import dian from '@/icons/png/dian.png'
  import startMarker from '@/icons/png/startMarker.png'
  import endMarker from '@/icons/png/endMarker.png'
  import person from '@/icons/png/person.png'
  export default {
    components:{
      NavBar,
      MyMap,
      WriteResult,
      myDate
    },
    data(){
      return{
        center:{
          longitude:"116.408",
          latitude:"39.919", 
        },
        markers:[
          {
          longitude:"116.404",
          latitude:"39.915", 
          icon:{
            name:home,
            size:[48, 48],
            anchor:[24, 48]
          }
        },{
          longitude:"116.414",
          latitude:"39.923", 
          icon:{
            name:person,
            size:[48, 48],
            anchor:[24, 48]
          }
        }],
        polylines:[
          
        ],
        circleUrl: "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png",
        state:1,
        time:'',
        time1:'',//选择时间段
        heartrate:'1',
        bloodpress:'1',
        time:["00:00","01:00","02:00","03:00","04:00","05:00","06:00","07:00","08:00","09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00","19:00","20:00","21:00","22:00","23:00"],
      }
    },
    methods:{
       setDateTime(val){
        if(val)
          this.dateTime=val.getTime();
        else
          this.dateTime=""

      },
      drawChart(){
        let heartrate = echarts.init(document.getElementById('heartrate'));
        let bloodpress = echarts.init(document.getElementById('bloodpress'));
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
                data:[80,90,62,77,55,40,66,55,89,142,163,123,144,123,144,22,14,88,46,23],
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
                data:[80,90,62,77,55,40,66,55,89,142,163,123,144,123,144,22,14,88,46,23],
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
                data: this.diastolicPressureT,
                type: 'line',
                itemStyle: {     //此属性的颜色和下面areaStyle属性的颜色都设置成相同色即可实现
                    color: '#409EFF',
                    borderColor: '#409EFF',
                }
            }
            ]
        }
        heartrate.setOption(option3);
        bloodpress.setOption(option4);
        window.onresize =function(){
            heartrate.resize()
            bloodpress.resize()
        }
      },
      //填写处理结果
      writeResult(){
        this.$refs.WriteResult.dialogHandleResult = true
      },
      //轨迹查询
      searchLocus(val){
       
        let points = [
            {longitude:"116.387112",latitude:"39.920977"},
            {longitude:"116.385243",latitude:"39.913063"},
            {longitude:"116.394226",latitude:"39.917988"},
            {longitude:"116.401772",latitude:"39.921364"},
            {longitude:"116.41248",latitude:"39.927893"}
          ]
          this.polylines.splice(0,this.polylines.length)
          this.polylines.push(points)
          this.markers.splice(0,this.markers.length)
        
          points.forEach( (i,key) => {
            console.log(key)
            let para = {
              longitude:i.longitude,
              latitude:i.latitude, 
              icon:{
                name:key==0 ? startMarker :( key== points.length-1 ? endMarker : dian) ,
                size:[32, 32],
                anchor:[16, 16]
              }
            }
            this.markers.push(para)
          })
           console.log( this.markers)
            console.log( this.polylines)
            this.$refs.map.getMap()
      }
    },
    mounted() {
      this.drawChart()
    }
  }
</script>

<style lang="scss" scoped>
  ul>li{
    list-style: none;
  }
  .contain{
     width: calc(100% - 40px);
      height: calc(100vh - 105px);
    box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
    margin: 20px;
    &-head{
      display: flex;
      justify-content: center;
      align-items: center;
      border-bottom: 1px solid #DCDFE6;
      &-mes{
         display: flex;
         flex-direction: column;
        justify-content: space-around;
        align-items: flex-start;
        &-name{
          font-size: 1.5vw;
          margin-bottom: 20px;
          margin-left: 10px;
        }
        &-state{
          display: flex;
          justify-content: flex-start;
          align-items: center;
          
          &-item{
             display: flex;
            justify-content: flex-start;
            align-items: center;
            font-size: 0.8vw;
            color: #606266;
          }
          .iconfont{
            font-size: 1.2vw;
          }
        }
      }
      &-detais{
        margin-left: 40px;
         display: flex;
         flex-direction: column;
          justify-content: space-around;
          align-items: flex-start;
          font-size: 0.8vw;
          color:#909399 ;
          .top-detais{
            margin-bottom: 20px;
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
        margin-left: 40px;
         display: flex;
         justify-content: space-around;
         align-items: center;
         font-size: 0.8vw;
          color: #909399;
         .top-phone{
           margin-right: 20px;
           display: flex;
           flex-direction: column;
          justify-content: space-around;
          align-items: flex-start;
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
              font-weight: 700;
              height: 30px;
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
              }
              .warnContentItem{
                display: flex;
                align-items: center;
                justify-content: space-between;
              }
              .warnName{
                margin: 10px 0 20px;
                overflow: hidden;
text-overflow:ellipsis;
white-space: nowrap;
              }
              .warnBtn{
              	display: flex;
              	justify-content: flex-end;
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
