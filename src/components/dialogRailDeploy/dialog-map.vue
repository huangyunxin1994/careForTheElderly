<template>
    <el-dialog title="添加电子围栏" :visible.sync="formVisible" center :before-close="handleClose" :close-on-click-modal="false" top="5vh" width="70vw">
        <el-form :inline="true" :model="form" :rules="formRule" ref="form" class="demo-form-inline">
            <el-form-item label="电子围栏名称" prop="name" required>
                <el-input v-model="form.name" placeholder="请输入" style="width:10vw"></el-input>
            </el-form-item>
            <el-form-item label="围栏中心位置"  required>
                <get-adress ref="getAdress" :map="map" @getItem="getItem"></get-adress>
            </el-form-item>
            <el-form-item label="电子围栏范围" prop="radius" required class="deployRange">
                <el-input v-model="form.radius"  @change="changeRound" placeholder="请输入" style="width:10vw"></el-input>km
            </el-form-item>
        </el-form>
        <div class="dialog-map">
            <i class="dialog-map-icon iconicon-test-copy"></i>
            <div id="allmap" ref="allmap" class="dialog-map">

            </div>
        </div>
    <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click.native="handleClose">取消</el-button>
            <el-button type="primary" @click.native="addSubmit" :loading="loading">添加</el-button>
        </div>
    </el-dialog>
</template>
<script>
import { parseTime } from '@/utils/index.js'
import { addRailDeploy } from '@/api/api.js'
import MyMap from '@/components/map/map.vue'
import axios from 'axios'
// import { addElectronicFence,deleteElectronicFence,selectElectronicFenceQuery,updateElectronicFence,selectPosition } from  "@/api/table"
// import "@/assets/icon/iconfont.css"
import GetAdress from '@/components/getAdress/getAdress.vue'
export default {
    name: 'Map',
    components:{
      MyMap,
      GetAdress
    },
    data(){
        return{
            formRule:{
                name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
                radius: [{ required: true, message: '请输入范围', trigger: 'blur' }],
                center:[{ required: true, message: '请输入围栏中心位置', trigger: 'blur' }]
            },
            formVisible:false,
            loading:false,
            mainMap:"",
            infoWindowArr:[],
            point:"",
            longitude:"",
            latitude:"",
            restaurants: [],
            form:{
                name:"",
                radius: '0.1',
                addrPoint:'',
                center:'',
                longitude: "108.386207",
                latitude: "22.830839"
            },
            map:null,
            marker:"",
            circle:"",

            ac:{}
            }

    },
    methods:{
        getmap () {
            this.map = new BMap.Map(this.$refs.allmap, {enableMapClick:false}) // 创建Map实例
            this.map.centerAndZoom(new BMap.Point(this.form.longitude,this.form.latitude), 16) // 初始化地图,设置中心点坐标和地图级别
            this.map.setCurrentCity('北京') // 设置地图显示的城市 此项是必须设置的
            this.map.enableScrollWheelZoom(true)// 开启鼠标滚轮缩放

            this.longitude = this.map.getCenter().lng
            this.latitude = this.map.getCenter().lat
            let point  = new BMap.Point(this.longitude,this.latitude)

            var navigationControl = new BMap.NavigationControl({ //创建一个特定样式的地图平移缩放控件
                anchor: BMAP_ANCHOR_TOP_RIGHT, //靠右上角位置
                type: BMAP_NAVIGATION_CONTROL_SMALL //SMALL控件类型
            })
            this.map.addControl(navigationControl ) //将控件添加到地图

            var geolocationControl = new BMap.GeolocationControl({anchor: BMAP_ANCHOR_BOTTOM_LEFT}) //创建一个地图定位控件
            geolocationControl.addEventListener("locationSuccess", function(e){ //绑定定位成功后事件
              that.getAddrByPoint(e.point) //定位成功后调用逆地址解析函数
            });
            geolocationControl.addEventListener("locationError",function(e){ //绑定定位失败后事件
              alert(e.message);
            });
            this.map.addControl(geolocationControl) //将控件添加到地图

            //  向地图添加标注
            this.circle = new BMap.Circle(point,this.form.radius*1000,{strokeColor:"#F56C6C", strokeWeight:6, strokeOpacity:0.8}); //创建圆
            this.map.addOverlay(this.circle);
            let that = this
            this.map.addEventListener("moveend",function(){
                    that.longitude = that.map.getCenter().lng
                    that.latitude = that.map.getCenter().lat
                    let point  = new BMap.Point(that.longitude,that.latitude)
                    that.circle = new BMap.Circle(point,that.form.radius*1000,{strokeColor:"#F56C6C", strokeWeight:6, strokeOpacity:0.8}); //创建圆
                    that.map.clearOverlays()
                    that.map.addOverlay(that.circle);
            });
            this.map.addEventListener("zoomend",function(){
                    that.longitude = that.map.getCenter().lng
                    that.latitude = that.map.getCenter().lat
                    let point  = new BMap.Point(that.longitude,that.latitude)
                    that.circle = new BMap.Circle(point,that.form.radius*1000,{strokeColor:"#F56C6C", strokeWeight:6, strokeOpacity:0.8}); //创建圆
                    that.map.clearOverlays()
                    that.map.addOverlay(that.circle);
            });
        },
        changeRound(){
            this.longitude = this.map.getCenter().lng
            this.latitude = this.map.getCenter().lat
            let point  = new BMap.Point(this.longitude,this.latitude)
            this.circle = new BMap.Circle(point,this.form.radius*1000,{strokeColor:"#F56C6C", strokeWeight:6, strokeOpacity:0.8}); //创建圆
            this.map.clearOverlays()
            this.map.addOverlay(this.circle);
        },
        getItem(item) {
          this.form.center = item.address + item.title; //记录详细地址，含建筑物名
          this.longitude = item.point.lng
          this.latitude = item.point.lat
          let point  = new BMap.Point(this.longitude,this.latitude)
          this.circle = new BMap.Circle(point,this.form.radius*1000,{strokeColor:"#F56C6C", strokeWeight:6, strokeOpacity:0.8}); //创建圆
          this.map.centerAndZoom(new BMap.Point(this.longitude,this.latitude), 16) // 初始化地图,设置中心点坐标和地图级别
          this.map.clearOverlays()
          this.map.addOverlay(this.circle);
        },


        handleShow(){
            this.formVisible=true
            this.$nextTick(() => {
                this.getmap();
            })
            // selectPosition().then(res=>{
            //     if(res.code==0){
            //         console.log(res.data.data)
            //         this.form.longitude = res.data.data[0].longitude
            //         this.form.latitude = res.data.data[0].latitude
            //         this.$nextTick(() => {
            //             this.getmap();
            //         })
            //     }
            // }).catch(err=>{

            // })

        },
        handleClose(){
            this.form={
                name:"",
                radius: '0.1',
                longitude: "108.386207",
                latitude: "22.830839"
            };
            this.formVisible=false
            this.loading=false
			this.$nextTick(()=>{
                    this.$refs.form.clearValidate();
                })
			this.$refs.getAdress.closeHandle()
        },
        addSubmit(){
            this.$refs.form.validate((valid) => {
                if (valid) {
					if(this.longitude == '' || this.latitude == ''){
						this.$message.error('请输入地图中心位置');
					}else{
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
						    this.loading = true;
						    let para = Object.assign({}, this.form);
							let user = JSON.parse(sessionStorage.getItem('user'))
							let electronicFence = {}
						    electronicFence.name = para.name
						    electronicFence.longitude = this.longitude
						    electronicFence.latitude = this.latitude
						    electronicFence.radius = para.radius
							electronicFence.createUserid = user.userId
						    addRailDeploy(electronicFence).then((res)=>{
						        if(res.code==0){
						           this.$message({
						                message: '添加成功',
						                type: 'success'
						            });
						            this.form={
						                name:"",
						                radius: '100',
						                longitude: "108.386207",
						                latitude: "22.830839"
						            };
						            this.formVisible=false
						            this.loading=false
						            this.$emit("addselectElec")
						        }else{
						            this.$message({
						                message: '添加失败',
						                type: 'error'
						            });
						        }
						    }).catch(err=>{
						        this.$message({
						            message: '添加失败',
						            type: 'error'
						        });
						    })
						});
					}
                }
            });
        },

    },
    mounted(){


    }
}
</script>
<style>
  .el-autocomplete-suggestion li{
    line-height: 25px !important;
  }
  .deployRange /deep/ .el-input{
    width: 85%;
  }
</style>
<style lang="scss" scoped>
  .el-dialog__wrapper /deep/.el-dialog{
    min-width: 680px;
  }
  /deep/ .el-dialog__header{
    text-align: center !important;
  }
.dialog-map{
    width: 100%;
    height: 60vh;
    position: relative;
    &-icon{
        position:absolute;
        top:calc(50% - 40px);
        left:calc(50% - 20px);
        z-index: 2;
        color: #409EFF;
        font-size: 40px;
    }
}

</style>
