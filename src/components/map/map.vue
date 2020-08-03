<template>
  <div id="container" ref="container"></div>
</template>

<script>
  import startMarker from '@/icons/png/startMarker.png'
  import endMarker from '@/icons/png/endMarker.png'
  import person from "@/icons/png/person.png"
  import inhome from "@/icons/png/zaijia.png"
  import outhome from "@/icons/png/lijia.png"
  import warning from "@/icons/png/yujing.png"
  export default{
    data(){
      return{

      }
    },
    methods:{
      getMap(){
        var map = new BMap.Map("container");
        // 创建地图实例
        var point = new BMap.Point(116.404, 39.915);
        // 创建点坐标

        var myIcon = new BMap.Icon(inhome, new BMap.Size(100, 100), {
            // 指定定位位置。
            // 当标注显示在地图上时，其所指向的地理位置距离图标左上
            // 角各偏移10像素和25像素。您可以看到在本例中该位置即是
            // 图标中央下端的尖角位置。
            anchor: new BMap.Size(10, 25),
            // 设置图片偏移。
            // 当您需要从一幅较大的图片中截取某部分作为标注图标时，您
            // 需要指定大图的偏移位置，此做法与css sprites技术类似。
            // imageOffset: new BMap.Size(0, 0 - 25)   // 设置图片偏移
        });
        // 创建标注对象并添加到地图
        var marker = new BMap.Marker(point, {icon: myIcon});
        // var marker = new BMap.Marker(point);
        //创建标注
        map.addOverlay(marker);
        // 将标注添加到地图中

        //折线
        // var polyline = new BMap.Polyline([
        // 		new BMap.Point(116.399, 39.910),
        // 		new BMap.Point(116.405, 39.920),
        // 		new BMap.Point(116.425, 39.900)
        // 	], {strokeColor:"blue", strokeWeight:2, strokeOpacity:0.5});
        // map.addOverlay(polyline);

        // 多边形
        // var polygon = new BMap.Polygon([
        //         new BMap.Point(116.387112,39.920977),
        //         new BMap.Point(116.385243,39.913063),
        //         new BMap.Point(116.394226,39.917988),
        //         new BMap.Point(116.401772,39.921364),
        //         new BMap.Point(116.41248,39.927893)
        //     ], {strokeColor:"blue", strokeWeight:2, strokeOpacity:0.5});
        // map.addOverlay(polygon);

        //圆
        var circle = new BMap.Circle(point,5000,{strokeColor:"blue", strokeWeight:2, strokeOpacity:0.5}); //创建圆
        map.addOverlay(circle);


        map.centerAndZoom(point, 12);
        // 初始化地图，设置中心点坐标和地图级别
        map.enableScrollWheelZoom(true);
        //开启鼠标滚轮缩放

        var opts = {
            width: 300,     // 信息窗口宽度
            height: 300,    // 信息窗口高度
            title: "Hello"  // 信息窗口标题
        }

        var infoWindow = new BMap.InfoWindow("World", opts);  // 创建信息窗口对象
        // 点击坐标,出现弹窗
        marker.addEventListener("click",function(){
          map.openInfoWindow(infoWindow, map.getCenter());        // 打开信息窗口
        })

        var scaleCtrl = new BMap.ScaleControl();  // 添加比例尺控件
        map.addControl(scaleCtrl);
        // var zoomCtrl = new BMap.ZoomControl();  // 添加比例尺控件
        // map.addControl(zoomCtrl);


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
