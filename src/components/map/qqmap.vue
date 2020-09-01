<template>
    <div :id="mapId" class="map-content"></div>
</template>
<script>
/**
 * @property {String} mapId 地图中心点 (默认{longitude:116.399,latitude:39.910})
 * @property {Object} center 地图中心点 (默认{longitude:116.399,latitude:39.910})
 * @property {Array} markers 地图上自定义的覆盖物
 * @property {Array} polylines 地图上自定义的线
 * @property {Array} circles 地图上自定义的圆
 * @property {Object} polyLineOpt 地图线的样式 (默认{strokeColor:"blue", strokeWeight:2, strokeOpacity:0.5})
 * @property {Object} circleOpt 地图圆的样式 (默认{strokeColor:"#F56C6C", strokeWeight:6, strokeOpacity:0.8})
 * @property {Boolean} dragging 地图是否禁止拖动（默认false）
 * @property {Boolean} zomming 地图是否禁止缩放（默认false）
 * @property {Number} zoomLevel 地图初始缩放等级（默认12）
 * @property {Boolean} view 是否获取最佳视野（默认false）
 * @property {Boolean} infoWindow 是否添加提示窗口（默认false）
 * @property {Boolean} geocoder 是否允许拖曳转换地址（默认false）
 */
export default {
    props:{
      //地图中心
      mapId:{
          type: String,
          default: "container"
      },
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
      //是否允许拖动
      dragging:{
        type: Boolean,
        default: true
      },
      //是否允许拖动
      zooming:{
        type: Boolean,
        default: true
      },
      //默认缩放等级
      zoomLevel:{
        type:Number,
        default:12
      },
      //是否获取最佳视野
      view:{
        type:Boolean,
        default:false
      },
      //是否添加提示窗口
      infoWindow:{
        type:Boolean,
        default:false
      },
      //是否允许拖曳转换地址
      geocoder:{
        type:Boolean,
        default:false
      },
    },
    data(){
        return{
            // 地图         
            mapView: '',
            // 信息提示框
            mapInfoWindow: '',
            // 标注点数组
            markersArray: [],
            //线数组
            lineArray:[],
            //圆数组
            circleArray:[],
            // 地图数据
            mapData: [],
            //
            markerArr:[],
           
        }
    },
    methods:{
        getMap(){
            console.log(89)
            console.log(this.center.latitude, this.center.longitude)
             let center = new qq.maps.LatLng(this.center.latitude, this.center.longitude)
            if (this.mapView) {
                console.log(this.mapView)
                this.mapView.setCenter(center)
            } else {
                console.log(center)
                this.mapView = new qq.maps.Map(
                    document.getElementById(this.mapId),
                    {
                        center: center,
                        zoom: this.zoomLevel,
                        draggable: this.dragging,               //设置是否可以拖拽
                        scrollwheel: this.zooming,             //设置是否可以滚动
                        disableDefaultUI: true    //禁止所有控件
                    }
                )
            }
            if(this.markers.length>0){
                     this.markers.map(item => {
                        var anchor = new qq.maps.Point(item.icon.anchor[0], item.icon.anchor[1]),
                            size = new qq.maps.Size(item.icon.size[0], item.icon.size[1]),
                            origin = new qq.maps.Point(0, 0),
                            icon = new qq.maps.MarkerImage(item.icon.name, size, origin, anchor);
                        // 创建标记
                        let position = new qq.maps.LatLng(item.latitude, item.longitude)
                        this.markerArr.push(position)
                        let marker = new qq.maps.Marker({
                            position: position,
                            map: this.mapView,
                            icon:icon,
                            // 将数据信息赋值给marker的data属性，用做点击显示与跳转
                            data: item
                        })
                        if(item.warning){
                            if(item.warning==1)
                            marker.setTitle("1")
                            else
                            marker.setTitle("2")
                        }
                       console.log( marker.getTitle())
                        // 获取标记的点击事件
                        if(item.hasOwnProperty('isIndex')){
                            this.showInfeWindow(marker,item)
                        }
                        // 存放所有marker
                        this.markersArray.push(marker)
                        
                        
                    })
                    
            }
            if(this.polylines.length>0){
                 this.polylines.forEach( i => {
                    let polyLineArr = []
                    i.forEach( n => {
                    let polyLinePoint =  new qq.maps.LatLng(n.latitude, n.longitude)
                        polyLineArr.push(polyLinePoint)
                        this.lineArray.push(polyLinePoint)
                    })
                    var polyline = new qq.maps.Polyline({
                        path: polyLineArr,
                        strokeColor: '#000000',
                        strokeWeight: 10,
                        map:this.mapView
                    });
                })
            }
            //创建圆
            if(this.circles.length>0){
                this.circles.forEach(i => {
                    var point = new qq.maps.LatLng(i.latitude,i.longitude);
                    var circle = new qq.maps.Circle({
                        map: this.mapView,
                        center: point,
                        radius: i.radius*1000,
                        fillColor: "#00f",
                        strokeWeight: 5
                    });
                    this.circleArray.push(circle)
                })
            }
            if(this.view){
                this.getViewPoint()
            }
            if(this.geocoder){
                qq.maps.event.addListener(this.mapView, 'dragend', (e)=> {
                    this.getCenterMsg()
                });
            }
        },
        //显示最佳视野
        getViewPoint(){
                        //假设您有一组坐标点
            //创建LatLngBounds实例
            var latlngBounds = new qq.maps.LatLngBounds();
            //将坐标逐一做为参数传入extend方法，latlngBounds会根据传入坐标自动扩展生成
            for(var i = 0;i<this.markerArr.length; i++){
                latlngBounds.extend(this.markerArr[i]);  
            }
            //调用fitBounds自动调整地图显示范围
            this.mapView.fitBounds(latlngBounds);
        },
        // 创建地图标记弹出框信息
        createInfoWindowContent (item) {    
                // + '&orderType=' + item.orderType  (拼接其他参数)
             
            return `<div style='overflow-x: hidden;width: 250px;padding:10px;'>
						<p class='mymap-item'>
						  <span">家庭地址：${item.address}</span>
						<p/>
						<p>联系方式: ${item.phone}</p>
						<div style='display: flex;justify-content: space-between;align-items: center;'>
							<div>姓名:${item.name}</div>
						    <input class='mymap-button'
						           style='background:rgba(29,164,255,1);
						           color:#fff; border:1px solid rgba(29,164,255,1);
						           border-radius:2px; font-size:14px; padding:5px;'
						           type='button' value='查看详情' id='gotDetail'>
						</div>	
					  </div>`
        }, 
        //显示所有的预警人员
        showWarnPeople(val){
            if (this.markersArray) {
                for (let i in this.markersArray) {
                if(this.markersArray[i].getTitle()=="1")
                   this.markersArray[i].setMap(null);
                }
            }
        },
        //显示所有人员
        showAllPeople(val){
            if (this.markersArray) {
                for (let i in this.markersArray) {
                   this.markersArray[i].setMap(this.mapView);
                }
            }
        }, 
        //重新加载中心点
        reloadCenter() {
            // console.log(newVal) 
            let center = new qq.maps.LatLng(this.center.latitude, this.center.longitude)
			this.mapView.setCenter(center)
        },
        //获取电子围栏中心坐标，并且定位
        moveDeploy(x,y){
            let point = new qq.maps.LatLng(y, x)
            console.log(point)
            this.mapView.panTo(point)
        },
        //重新加载标注
		reloadMarkers() {
			if (this.markersArray) {
                for (let i in this.markersArray) {
                   this.markersArray[i].setMap(null);
                }
               this.markersArray.length = 0;
            }
			if(this.markers.length>0){
                this.markers.map(item => {
                var anchor = new qq.maps.Point(item.icon.anchor[0], item.icon.anchor[1]),
                    size = new qq.maps.Size(item.icon.size[0], item.icon.size[1]),
                    origin = new qq.maps.Point(0, 0),
                    icon = new qq.maps.MarkerImage(item.icon.name, size, origin, anchor);
                // 创建标记
                let position = new qq.maps.LatLng(item.latitude, item.longitude)
                this.markerArr.push(position)
                let marker = new qq.maps.Marker({
                    position: position,
                    map: this.mapView,
                    icon:icon,
                    // 将数据信息赋值给marker的data属性，用做点击显示与跳转
                    data: item
                })
                if(item.warning){
                    if(item.warning==1)
                    marker.setTitle("1")
                    else
                    marker.setTitle("2")
                }
                // 获取标记的点击事件
                if(item.hasOwnProperty('isIndex')){
                    this.showInfeWindow(marker,item)
               }
                // 存放所有marker
                this.markersArray.push(marker)
                
                
            })
                    
            }
			
		},
        // 重新加载线
        reloadPolylines() {
            if (this.lineArray) {
                for (i in this.lineArray) {
                   this.lineArray[i].setVisible(false);
                }
               this.lineArray.length = 0;
            }
			this.polylines.forEach( i => {
                    let polyLineArr = []
                    i.forEach( n => {
                        let polyLinePoint =  new qq.maps.LatLng(n.latitude, n.longitude)
                        polyLineArr.push(polyLinePoint)
                    })
                    var polyline = new qq.maps.Polyline({
                        path: polyLineArr,
                        strokeColor: '#000000',
                        strokeWeight: 10,
                        map:this.mapView
                    });
                     this.lineArray.push(polyline)
                })
        },
		// 重新加载圆
		reloadCircles() {
            if (this.circleArray) {
                for (let i in this.circleArray) {
                   this.circleArray[i].setVisible(false);
                }
               this.circleArray.length = 0;
            }
            console.log(this.circles)
			this.circles.forEach(i => {
                var point = new qq.maps.LatLng(i.latitude,i.longitude);
                var circle = new qq.maps.Circle({
                    map: this.mapView,
                    center: point,
                    radius: i.radius*1000,
                    fillColor: "#00f",
                    strokeWeight: 5
                });
                this.circleArray.push(circle)
            })
        },
       // 创建信息提示窗
        showInfeWindow(marker,item){
            this.mapInfoWindow = new qq.maps.InfoWindow({
                map: this.mapView
            })
            qq.maps.event.addListener(marker, 'click', (e) => {
                let center = new qq.maps.LatLng(item.latitude, item.longitude)
                this.mapView.panTo(center)
                this.mapInfoWindow.open()
                this.mapInfoWindow.setContent(this.createInfoWindowContent(e.target.data))
                this.mapInfoWindow.setPosition(e.latLng)  //提示窗位置
            })
                qq.maps.event.addListener(this.mapInfoWindow , 'domready', ()=> {
                var btn = document.getElementById("gotDetail")
                    console.log(btn)
                    setTimeout(() => {
                    btn.onclick = (e) =>{
                        console.log(item.id)
                        this.getPersonData(item.id)
                    }
                },500)
            })
        },
        //点击查看跳转详情
        getPersonData(id){
            this.$router.push({
            path:'/peopleDetails',
            query: {
                id: id
                }
            })
        },
        //获取中心点信息
         getCenterMsg(){
		  // console.log(225)
          let nowcenter =  this.mapView.getCenter()
          console.log(nowcenter)
          let center = new qq.maps.LatLng(nowcenter.lat, nowcenter.lng)
          
          this.geocoderChange(center,(result)=>{
              this.$emit("getAddress",result)
          })
          
		  	// 	  var geoc = new BMap.Geocoder();
		  	// 	  let that = this
		  	// 	  geoc.getLocation(point,  (rs)=> {
			// 		  // console.log(rs)
		  	// 		var addComp = rs.addressComponents;
		  	// 		let address = addComp.province + addComp.city + addComp.district + addComp.street + addComp.streetNumber
		  	// 		this.$emit('getAdressName',address,nowcenter.lng,nowcenter.lat)
		  	// 　　//对应的省市区、县街道，街道号address
		  	// 	  });
	    },
        //地址解析&逆地址解析
        geocoderChange(val,callback){
            console.log(typeof(val))
           let goec = new qq.maps.Geocoder()
            
            //设置服务请求成功的回调函数
            goec.setComplete(function(result) {
                console.log(result)
                callback(result) 
            });
            //若服务请求失败，则运行以下函数
            goec.setError(function(err) {
                console.log(err)
                callback(err) 
            });
            if(typeof(val) == 'object')
                goec.getAddress(val)
            else
                goec.getLocation(val);
        }
        
    },
    mounted(){
        // this.$nextTick(_=>{
        //     this.getMap()
        // })
    },
}
</script>
<style lang="scss" scoped>
 .map-content{
    width: 100%;
    height: 100%;
}
</style>