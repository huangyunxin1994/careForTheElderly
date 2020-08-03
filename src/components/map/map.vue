<template>
  <div id="container" ref="container"></div>
</template>

<script>

/**
 * @property {Object} center 地图中心点 (默认{longitude:116.399,latitude:39.910})
 * @property {Array} markers 地图上自定义的覆盖物
 * @property {Array} polylines 地图上自定义的线 
 * @property {Array} circles 地图上自定义的圆
 * @property {Object} polyLineOpt 地图线的样式 (默认{strokeColor:"blue", strokeWeight:2, strokeOpacity:0.5})
 * @property {Object} circleOpt 地图圆的样式 (默认{strokeColor:"#F56C6C", strokeWeight:6, strokeOpacity:0.8})
 * @property {Boolean} dragging 地图是否禁止拖动（默认false）
 * @property {Boolean} zomming 地图是否禁止缩放（默认false）
 */
  export default {
    props:{
      //地图中心
      center:{
        type:Object,
        default(){
          return {
            longitude:116.399,
            latitude:39.910
          } 
        }
      },
      //地图标注点
      markers:{
        type:Array,
        default(){
          return []
        }
      },
      //地图线
      polylines:{
        type:Array,
        default(){
          return []
        }
      },
      //地图线样式
      polyLineOpt:{
        type:Object,
        default(){
          return {
            strokeColor:"blue", 
            strokeWeight:2, 
            strokeOpacity:0.5
          }
          
        }
      },
      //地图圆
       circles:{
        type:Array,
        default(){
          return []
        }
      },
      //地图圆样式
      circleOpt:{
        type:Object,
        default(){
          return{
            strokeColor:"#F56C6C", 
            strokeWeight:6, 
            strokeOpacity:0.8
          }
        }
      },
      //是否禁止拖动
      dragging:{
        type: Boolean,
        default: false
      },
      //是否禁止缩放
      zooming:{
        type: Boolean,
        default: false
      },
      //默认缩放等级
      zoomLevel:{
        type:[String, Number],
        default:"16"
      }
      
    },
    data(){
      return{

      }
    },
    methods:{
      getMap(){
         // 创建地图实例
        var map = new BMap.Map("container",{enableMapClick:false});

       //创建标注
        if(this.markers.length>0){
          this.markers.forEach( i => {
            console.log(i.icon.size)
             var point = new BMap.Point(i.longitude, i.latitude);
             console.log(point)
            // 创建点坐标
            var myIcon = new BMap.Icon(i.icon.name, new BMap.Size(i.icon.size[0],i.icon.size[1]), {
                anchor: new BMap.Size(i.icon.anchor[0], i.icon.anchor[1]),
            });
            // 创建标注对象并添加到地图
            var marker = new BMap.Marker(point, {icon: myIcon});
            console.log(66)
            map.addOverlay(marker);

          })
          
        }

        //创建折线
        if(this.polylines.length>0){
          this.polylines.forEach( i => {
            let polyLineArr = [] 
            i.forEach( n => {
             let polyLinePoint =  new BMap.Point(n.longitude, n.latitude)
              polyLineArr.push(polyLinePoint)
            })
            var polyline = new BMap.Polyline(polyLineArr, this.polyLineOpt);
            map.addOverlay(polyline);
          })
        }

        //创建圆
         if(this.circles.length>0){
            this.circles.forEach(i => {
              var point = new BMap.Point(i.longitude,i.latitude);
              var circle = new BMap.Circle(point,i.radius,this.circleOpt);
              map.addOverlay(circle);
            })
         }

        // 创建地图中心
        var point = new BMap.Point(this.center.longitude, this.center.latitude);
        map.centerAndZoom(point, this.zoomLevel);

      }
    },
    mounted() {
      this.getMap()
    }
  }
</script>

<style lang="scss" scoped>
  #container{
    width: 100%;
    height: 100%;
  }
  /deep/.BMap_cpyCtrl {
      display: none;
  }
  /deep/.anchorBL {
      display: none;
  }

</style>
