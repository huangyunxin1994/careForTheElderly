<template>
  <div>
    <nav-bar></nav-bar>
    <div class="main">
      <el-link class="enroll-details-nav" :underline="false" @click="backpage"><i class="el-icon-arrow-left"></i> 返回上一级 </el-link>
      <div class="userMess">
        <div class="user">
          <div class="userLeft">
            <p class="userName">张三</p>
            <div class="state">
              <div class="onLine">
                <div v-if="state == 1" class="onLineContent">
                  <i class="iconfont icon-electricquantity2dianchidianliang" style="color: #f8b62e;;"></i><span>低电</span>
                </div>
                <div v-else-if="state == 2">
                  <i class="iconfont icon-electricquantitydianchidianliang" style="color: green"></i><span>在线</span>
                </div>
                <div v-else>
                  <i class="iconfont icon-electricquantity3dianchidianliang" style="color: green;"></i><span>离线</span>
                </div>
              </div>
              <div class="stepNumber">
                <i class="iconfont icon-bushu"></i><span>800步</span>
              </div>
            </div>
          </div>
          <div class="userRight">
            <div class="baseMess">
              <i class="iconfont icon-dizhi" style="color: #f8b62e;"></i><span>南宁市青秀区东葛路长</span>
            </div>
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
        </div>
        <div class="guardian">
          <div class="guardianBase">
            <p class="guardianName">张小二</p>
            <p class="relation">父子</p>
          </div>
          <div class="guardianPhone">
            <i class="iconfont icon-dianhua" style="color: #f8b62e;"></i><span>15685458569</span>
          </div>
          <div class="btn">
            <el-button type="primary">其他监护人信息</el-button>
          </div>
        </div>
      </div>
      <div class="picWrap">
        <div class="selectTime">
          <el-date-picker
                v-model="time"
                type="date"
                placeholder="选择日期">
              </el-date-picker>
          <el-button type="primary">确定</el-button>
        </div>
        <div class="picContent">
          <div id="heartrate" class="echartItem" :class="{'echartItemAlert':heartrate==1}"/>
          <div id="bloodpress" class="echartItem" :class="{'echartItemAlert':bloodpress==1}"/>
        </div>
      </div>
      <div class="mapWrap">
        <div class="selectTime">
          <span class="demonstration">选择时间段</span>
          <el-date-picker
            v-model="time1"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </div>
        <div class="mapContent">
          <div class="mapContentLeft">
            <div class="getNewAdress">
              <p>最新地址获取时间：XX年XX月XX日    XX时XX分</p>
              <p><el-button type="primary">当前位置</el-button></p>
            </div>
            <div class="mapPictrue">
              <my-map></my-map>
            </div>
          </div>
          <div class="mapContentRight">
            <div class="warnList">
              <p>预警列表</p>
              <div class="warnContent">
                <p class="warnTime">2020-3-23 13:13:00</p>
                <div class="warnContentItem">
                  <div class="warnType">围栏预警</div>
                  <div class="warnName">围栏名称  XXXX围栏</div>
                </div>
                <div class="warnBtn">
                  <p>定位</p>
                  <p @click="writeResult">填写处理结果</p>
                  <p>忽略</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <write-result ref="WriteResult"></write-result>
  </div>
</template>

<script>
  import echarts from 'echarts'
  import NavBar from '@/components/navBar/navBar.vue'
  import MyMap from '@/components/map/map.vue'
  import WriteResult from '@/components/dialogHandleResult/dialogHandleResult'
  export default{
    components:{
      NavBar,
      MyMap,
      WriteResult
    },
    data(){
      return{
        state:1,
        time:'',
        time1:'',//选择时间段
        heartrate:'2',
        bloodpress:'2',
        time:["00:00","01:00","02:00","03:00","04:00","05:00","06:00","07:00","08:00","09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00","19:00","20:00","21:00","22:00","23:00"],
      }
    },
    methods:{
      //返回上一页
      backpage(){
        this.$router.go(-1);
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
  .main{
    width: 90vw;
    height: 80vh;
    margin: 0 auto;
    // min-width: 1250px;

    .enroll-details-nav{
        height: 50px;
        line-height: 50px;
    }
    .userMess{
      height: 12vh;
      display: flex;
      min-width: 1250px;
      align-items: center;
      justify-content: space-between;

      .user{
        width: 42vw;
        height: 12vh;
        border: 1px solid #ccc;
        display: flex;
        align-items: center;

        .userLeft{
          width: 14vw;
          background-color: #e1f1f8;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;

          .userName{
            width: 7vw;
            text-align: center;
            font-size: 1.5vw;
          }
          .state{
            width: 7vw;

            .onLine{
              .onLineContent{
                display: flex;
                align-items: center;

                .iconfont{
                  font-size: 2.5vw;
                }
              }

            }
            .stepNumber{
              display: flex;
              align-items: center;
                .iconfont{
                  color: #656060;
                  font-size: 2.5vw;
                }
            }
          }
        }
        .userRight{
          width: 28vw;
          display: flex;
          flex-wrap:wrap;
          align-items: center;
          .baseMess{
            display: flex;
            align-items: center;
            justify-content: flex-start;
            width: 14vw;
            height: 6vh;
            box-sizing: border-box;
            padding: 5px;

            .iconfont{
              font-size: 1.5vw;
              width: 2vw;
            }
          }
        }
      }
      .guardian{
        width: 42vw;
        height: 12vh;
        border: 1px solid #ccc;
        display: flex;
        align-items: center;
        justify-content: space-around;

        .guardianPhone{
          display: flex;
          align-items: center;
          .iconfont{
            font-size: 1.5vw;
            width: 2vw;
          }
        }
      }
    }
    .picWrap{
      padding: 40px 0px 20px 0px;

      .selectTime{
        width: 18vw;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .picContent{
        display: flex;
        justify-content: space-between;

        .echartItem{
          width: 50%;
          height: 40vh;
          padding:20px;
          margin:20px;
          border-radius: 0.8vw;
        }
        .echartItemAlert{
          background: rgb(254, 240, 240)
        }
      }
    }
    .mapWrap{
      .mapContent{
        display: flex;
        justify-content: space-between;
        width: 90vw;
        .mapContentLeft{
          width: 68vw;

          .getNewAdress{
            display: flex;
            width: 30vw;
            align-items: center;
            justify-content: space-between;
          }
          .mapPictrue{
            width: 68vw;
            height: 600px;
            border: 1px solid #ccc;
          }
        }
        .mapContentRight{
          width: 20vw;
          height: 700px;
          border: 1px solid #ccc;
          min-width: 287px;

          .warnList{
            padding: 10px;

            .warnContent{
              border: 1px solid #ccc;
              border-radius: 10px;
              box-sizing: border-box;
              padding: 10px;
              min-width: 270px;

              .warnContentItem{
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
      }

    }
  }
</style>
