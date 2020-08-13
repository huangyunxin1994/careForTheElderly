<template>
  <div class="wrap">
    <nav-bar></nav-bar>
    <div class="content">
      <el-container class="contain">
        <el-header height="90px" style="margin-top: 5px;" class="contain-head">

          <div class="mainleft">
            <!-- <el-avatar :size="70" :src="circleUrl"></el-avatar> -->
            <div class="contain-head-mes">
              <div><span class="contain-head-mes-name">张三</span></div>
              <div class="contain-head-mes-state">
                <div class="contain-head-mes-state-item"><i class="iconfont icon-bushu" style="color: #f8b62e;;"></i><span>800步</span></div>
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
          </div>

          <div class="contain-head-phone">
            <div class="contain-head-mes">
              <div><span style="font-size: 1vw; color: #150000;">监护人信息</span></div>
            </div>
            <div class="contain-head-phone-detais">
              <div>
                <div class="contain-head-phone-detais-base">
                  <div class="familyName">张小二</div>
                  <div class="phone"><i class="iconfont icon-dianhua" style="color: #f8b62e;"></i><span>15685458569</span></div>
                </div>
                <div>
                  <i class="iconfont icon-dizhi" style="color: #f8b62e;"></i><span>南宁市青秀区东葛路长</span>
                </div>
              </div>

              <el-button type="primary" size="small" @click="searchRuardian">所有监护人信息</el-button>
            </div>
         </div>
        </el-header>
        <el-main class="main">
          <div class="picWrap">
          <div class="selectTime">
              <my-date @getData="setDateTime" :size="'small'"></my-date>
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
                  end-placeholder="结束日期"  size="small">
                </el-date-picker>
              </div>
              <div class="mapPictrue">
                <div class="map-location">
                 <el-tag type="primary" >最新地址获取时间:2020年7月18日 18时54分</el-tag>
                </div>
                 <div class="mapPictrue-icon" style="" @click="getNowAdress">
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
                        <el-tooltip content="定位" placement="top">
                           <i class="iconfont icon-dingwei" style="color:"></i>
                        </el-tooltip>
                      </div>
                    </div>
                    <p class="warnName">XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX围栏</p>
                    <div class="warnBtn">
                      <el-button type="danger" size="mini">忽略</el-button>
                      <el-button type="danger" size="mini" @click="writeResult">填写处理结果</el-button>
                    </div>
                  </div>
                   <div class="warnContent">
                    <div class="warnContent-top">
                      <span class="warnTime">2020-3-23 13:13:00 </span>
                      <div>
                        <el-tooltip content="定位" placement="top">
                           <i class="iconfont icon-dingwei" style="color:"></i>
                        </el-tooltip>
                      </div>
                    </div>
                    <p class="warnName">XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX围栏</p>
                    <div class="warnBtn">
                      <el-button type="danger" size="mini">忽略</el-button>
                      <el-button type="danger" size="mini" @click="writeResult">填写处理结果</el-button>
                    </div>
                  </div>
                   <div class="warnContent">
                    <div class="warnContent-top">
                      <span class="warnTime">2020-3-23 13:13:00 </span>
                      <div>
                        <el-tooltip content="定位" placement="top">
                           <i class="iconfont icon-dingwei" style="color:"></i>
                        </el-tooltip>
                      </div>
                    </div>
                    <p class="warnName">XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX围栏</p>
                    <div class="warnBtn">
                      <el-button type="danger" size="mini">忽略</el-button>
                      <el-button type="danger" size="mini" @click="writeResult">填写处理结果</el-button>
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
    <write-result ref="WriteResult"></write-result>
    <guardian-mess ref="guardianMess"></guardian-mess>
  </div>
</template>

<script>
  import echarts from 'echarts'
  import NavBar from '@/components/navBar/navBar.vue'
  import GuardianMess from '@/components/dialogGuardianMess/dialogGuardianMess.vue'
  import MyMap from '@/components/map/map.vue'
  import myDate from "@/components/date/index"
  import WriteResult from '@/components/dialogHandleResult/dialogHandleResult'
  import home from '@/icons/png/jia.png'
  import dian from '@/icons/png/dian.png'
  import person from '@/icons/png/personw.png'
  export default {
    components:{
      NavBar,
      MyMap,
      WriteResult,
      myDate,
      GuardianMess
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
            size:[62, 48],
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
     
      //查看所有监护人
      searchRuardian(){
        this.$refs.guardianMess.dialogVisible = true
      },
      //定位到当前位置
      getNowAdress(){
        let x = "116.414"
        let y = "39.923"
        this.$refs.map.movePosBypoint(x,y)
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
  .el-header{
    // padding: 0px;
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
        padding: 0px 20px;
        border-radius: 10px 0px 0px 10px;
        background-color: #e1f1f8;

        &-name{
          font-size: 1.5vw;
          margin-bottom: 20px;
          margin-left: 10px;
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
         min-width: 326px;
         font-size: 0.8vw;
         color: #909399;
         height: 74px;
         border-radius: 10px;
         border: 1px solid #ccc;
         width: 35vw;
         &-detais{
           display: flex;
           align-items: center;
           justify-content: space-around;
           // padding: 0px 20px;
           width: calc(35vw - 136px);

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
