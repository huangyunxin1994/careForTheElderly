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
        default:"12"
      },
      //是否获取最佳视野
      view:{
        type:Boolean,
        default:false
      }
    },
	watch:{
		deep: true,  // 深度监听
		center(newVal,oldVal) {
			// console.log(newVal) 
			var point = new BMap.Point(newVal.longitude, newVal.latitude);
			this.map.centerAndZoom(point, this.zoomLevel); // 初始化地图,设置中心点坐标和地图级别
			this.map.enableScrollWheelZoom(true); //开启鼠标滚轮缩放
		},
		markers(newVal,oldVal) {
			console.log(newVal)
			console.log(this.markers)
			this.map.clearOverlays()
			this.markers.forEach((item)=>{
				let pointArray = []
				let homeMarkerItem = this.homeMarkerItem //用来存放房屋覆盖物的中间变量
				let lineMarkerItem = this.lineMarkerItem //用来存放折线覆盖物的中间变量
				let zoom = this.zoomLevel
				let markerArr = []
				var point = new BMap.Point(item.longitude, item.latitude);
				var myIcon = new BMap.Icon(item.icon.name, new BMap.Size(item.icon.size[0],item.icon.size[1]), {
				    anchor: new BMap.Size(item.icon.anchor[0], item.icon.anchor[1]),
				});
				var marker = new BMap.Marker(point, {icon: myIcon});
				this.map.addOverlay(marker);
				let _this1 = this
				if(item.hasOwnProperty('isIndex')){
					marker.addEventListener("click",function(e){
						_this1.setMarker(item,e)
					})
				}
			})
			
		},
		// polyLineOpt
		// circleOpt
		circles(newVal,oldVal) {
			this.circles.forEach(i => {
			  var point = new BMap.Point(i.longitude,i.latitude);
			  var circle = new BMap.Circle(point,i.radius*1000,this.circleOpt);
			  this.map.addOverlay(circle);
			})
		},
		zoomLevel(newVal,oldVal) {
			
		}
	},
    data(){
      return{
        marker:[],
        map:'',
        homeMarkerItem1:'', //用来存放房屋覆盖物的中间变量
        lineMarkerItem1:'', //用来存放折线覆盖物的中间变量
        item:'',
      }
    },
    methods:{
      getMap(){
         // 创建地图实例
        this.map = new BMap.Map("container",{enableMapClick:false});//构造底图时，关闭底图可点功能

        BMap.Icon.prototype.name = "";
        BMap.Icon.prototype.setName = function(name){
            this.name = name;
        }
        let pointArray = []
        let homeMarkerItem = this.homeMarkerItem //用来存放房屋覆盖物的中间变量
        let lineMarkerItem = this.lineMarkerItem //用来存放折线覆盖物的中间变量
        let zoom = this.zoomLevel
        let markerArr = []
       //创建标注
        if(this.markers.length>0){
          this.markers.forEach( i => {
             var point = new BMap.Point(i.longitude, i.latitude);
             pointArray.push(point)
            // 创建点坐标
            var myIcon = new BMap.Icon(i.icon.name, new BMap.Size(i.icon.size[0],i.icon.size[1]), {
                anchor: new BMap.Size(i.icon.anchor[0], i.icon.anchor[1]),
            });
            if(i.warning == 1){
              myIcon.setName("0");
            }else if(i.warning == 2){
              myIcon.setName("1");
            }
            // 创建标注对象并添加到地图
            var marker = new BMap.Marker(point, {icon: myIcon});
            this.map.addOverlay(marker);
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
            this.map.addOverlay(polyline);
          })
        }

        //创建圆
         if(this.circles.length>0){
            this.circles.forEach(i => {
              var point = new BMap.Point(i.longitude,i.latitude);
              var circle = new BMap.Circle(point,i.radius,this.circleOpt);
              this.map.addOverlay(circle);
            })
         }

         //获取最佳视野
         if(this.view == true){
           const view = this.map.getViewport(pointArray)//获取最佳视野

           if(view.center.lng != 0 && view.center.lat != 0 && view.zoom != 3){
             point = view.center
             zoom = view.zoom
           }
         }

        // 创建地图中心
        var point = new BMap.Point(this.center.longitude, this.center.latitude);


        this.map.centerAndZoom(point, zoom); // 初始化地图,设置中心点坐标和地图级别
        this.map.enableScrollWheelZoom(true); //开启鼠标滚轮缩放
		let that = this
		this.map.addEventListener("dragend",function(e){
			// console.log(e)
			that.getCenter1()
		})
        this.$emit('getMap',this.map)
      },
	  getCenter1(){
		  // console.log(225)
		  let nowcenter =  this.map.getCenter()
		   
		  let point = new BMap.Point(nowcenter.lng,nowcenter.lat);
		  		  var geoc = new BMap.Geocoder();
		  		  let that = this
		  		  geoc.getLocation(point,  (rs)=> {
					  // console.log(rs)
		  			var addComp = rs.addressComponents;
		  			let address = addComp.province + addComp.city + addComp.district + addComp.street + addComp.streetNumber
		  			this.$emit('getAdressName',address,nowcenter.lng,nowcenter.lat)
		  	　　//对应的省市区、县街道，街道号address
		  		  });
	  },
      //显示所有的预警人员
      showWarnPeople(val){
        let allOverlay = this.map.getOverlays()
        for(let i in allOverlay){
          if(allOverlay[i].toString() == "[object Marker]"){
            if(allOverlay[i].getIcon().name == val){
              allOverlay[i].show()
            }else{
              allOverlay[i].hide()
            }
            if(this.homeMarkerItem1 != ''){
              this.map.removeOverlay(homeMarkerItem)
            }
            if(this.lineMarkerItem1 != ''){
              this.map.removeOverlay(lineMarkerItem)
            }
          }
        }
      },
      //显示所有人员
      showAllPeople(val){
        let allOverlay = this.map.getOverlays()

        for(let i in allOverlay){
          if(allOverlay[i].toString() == "[object Marker]"){
            allOverlay[i].show()
          }
          if(this.homeMarkerItem1 != ''){
            this.map.removeOverlay(homeMarkerItem)
          }
          if(this.lineMarkerItem1 != ''){
            this.map.removeOverlay(lineMarkerItem)
          }
        }
      },
      //定位
      movePosBypoint(x,y){
        let that = this
        let point = new BMap.Point(x,y);
        this.map.panTo(point);
      },
      //绑定人员点击显示新窗口
      addClikPeople(marker){
        let opts = {
          width:250,  //信息窗口
          height: 100,    // 信息窗口高度
          enableMessage:true//设置允许信息窗发送短息
        }
        for(let i in markerArr){

        }
      },
      //获取电子围栏中心坐标，并且定位
      moveDeploy(x,y){
        let that = this
        let point = new BMap.Point(x,y);
        this.map.panTo(point);
      },
      getPersonData(id){
        this.$router.push({
          path:'/peopleDetails',
          query: {
              id: id
            }
        })
      },
      // 重新定位中心点
      setCenter(val){
        
      },
      //点击marker图标
    setMarker(item,e){
		let that = this
		let pointArray = []
		let homeMarkerItem = this.homeMarkerItem //用来存放房屋覆盖物的中间变量
		let lineMarkerItem = this.lineMarkerItem //用来存放折线覆盖物的中间变量
		let zoom = this.zoomLevel
		let markerArr = []
		var content= `<div style='overflow-x: hidden;overflow-y: scroll;width: 250px;height: 130px;padding:10px;'>
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
					  </div>`;
		let opts = {
		  width:250,  //信息窗口
		  height: 150,    // 信息窗口高度
		  enableMessage:true//设置允许信息窗发送短息
		}
		
		var infoWindow = new BMap.InfoWindow(content,opts);  // 创建信息窗口对象
		
		if(homeMarkerItem != ''){
		    this.map.removeOverlay(homeMarkerItem)
		  }
		  if(lineMarkerItem != ''){
		    this.map.removeOverlay(lineMarkerItem)
		  }
		  // let _this = this
		  let p = e.target;
		  var point = new BMap.Point(p.getPosition().lng, p.getPosition().lat);
		  this.map.panTo(point);
		
		 
		    this.map.openInfoWindow(infoWindow,point); //开启信息窗口
        var btn = document.getElementById("gotDetail")
        console.log(btn)
		        setTimeout(() => {
		          btn.onclick = (e) =>{
		            that.getPersonData(item.id)
		          }
		        },500)
		
		  //添加房屋图标
		//   let homePoint = new BMap.Point(item.home.longitude, item.home.latitude);
		//   let homeIcon = new BMap.Icon(item.home.icon.name, new BMap.Size(item.home.icon.size[0],item.icon.size[1]), {
		//       anchor: new BMap.Size(item.home.icon.anchor[0], item.home.icon.anchor[1]),
		//   });
		//   let homemarker = new BMap.Marker(homePoint, {icon: homeIcon});
		//   homeMarkerItem = homemarker
		//   this.homeMarkerItem1 = homemarker
		//   this.map.addOverlay(homemarker);
		
		//   //添加折线
		//   let polyline = new BMap.Polyline([point,homePoint], {strokeColor:"blue", strokeWeight:2,strokeStyle:"dashed", strokeOpacity:0.5});
		//   lineMarkerItem = polyline
		//   this.lineMarkerItem1 = polyline
		//   this.map.addOverlay(polyline);
      }
    },
    mounted() {
		this.$nextTick(_=>{
			// setTimeout(()=>{})
			this.getMap()
		})
    },
	updated() {
		
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
  .btnSwrap{
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
</style>
