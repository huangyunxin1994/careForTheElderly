<template>
    <el-dialog title="编辑电子围栏" :visible.sync="formVisible" :before-close="handleClose" :close-on-click-modal="false" top="5vh" width="70vw">
        <el-form :inline="true" :model="form" :rules="formRule" ref="form" class="demo-form-inline">
            <el-form-item label="电子围栏名称" prop="name" required>
                <el-input v-model="form.name" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="围栏中心位置" prop="center" required>
                <get-adress ref="getAdress" :map="map" @getItem="getItem"></get-adress>
            </el-form-item>
            <el-form-item label="电子围栏范围" prop="radius" required class="deployRange">
                <el-input v-model="form.radius"  @change="changeRound" placeholder="请输入"></el-input>km
            </el-form-item>
        </el-form>
        <div class="dialog-map">
            <i class="dialog-map-icon iconicon-test-copy"></i>
            <div id="allmap" ref="allmap" class="dialog-map">

            </div>
        </div>
    <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click.native="handleClose">取消</el-button>
            <el-button type="primary" @click.native="addSubmit" :loading="loading">提交</el-button>
            <el-button type="primary" @click.native="removeSubmit" :loading="loadingD">删除</el-button>
        </div>
    </el-dialog>
</template>
<script>
import { parseTime } from '@/utils/index.js'
import GetAdress from '@/components/getAdress/getAdress.vue'
// import { addElectronicFence,deleteElectronicFence,selectElectronicFenceQuery,updateElectronicFenceMsg } from  "@/api/table"
// import "@/assets/icon/iconfont.css"
import {updateRailDeploy,deleteRailDeploy} from '@/api/api.js'
export default {
    name: 'Map',
    components:{
      GetAdress
    },
    data(){
        return{
            formRule:{
                name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
                radius: [{ required: true, message: '请输入范围', trigger: 'blur' }],
				center:[{ required: true, message: '请输入中心位置', trigger: 'blur' }]
            },
            formVisible:false,
            loading:false,
            loadingD:false,
            mainMap:"",
            infoWindowArr:[],
            point:"",
            longitude:"",
            latitude:"",
            form:{
                name:"",
                radius: '0.1',
                longitude: "108.386207",
                latitude: "22.830839"
            },
            map:null,
            marker:"",
            circle:"",
			id:'',
            }
			
    },
    methods:{
        getMapData(){
        },
        getmap () {
            this.map = new BMap.Map(this.$refs.allmap, {enableMapClick:false}) // 创建Map实例
            this.map.centerAndZoom(new BMap.Point(this.form.longitude,this.form.latitude), 16) // 初始化地图,设置中心点坐标和地图级别
            this.map.setCurrentCity('北京') // 设置地图显示的城市 此项是必须设置的
            this.map.enableScrollWheelZoom(true)// 开启鼠标滚轮缩放
            this.longitude = this.map.getCenter().lng
            this.latitude = this.map.getCenter().lat
            let point  = new BMap.Point(this.longitude,this.latitude)
            // // 向地图添加标注
            // console.log(this.map.getCenter().lng)
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
        changeRound(val){
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
        handleShow(val){
            this.formVisible=true
			this.form = val
			console.log('******************')
			console.log(val)
			this.id = val.id
            this.$nextTick(() => {
                this.getmap();
            })
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
        },
        addSubmit(){
          // this.formVisible=false
            this.$refs.form.validate((valid) => {
                if (valid) {
                    this.$confirm('确认提交吗？', '提示', {}).then(() => {
                        this.loading = true;
                        //NProgress.start();
                        let para = Object.assign({}, this.form);
						let user = JSON.parse(sessionStorage.getItem('user'))
						let electronicFence = {}
                        console.log(para)
                        electronicFence.name = para.name
                        electronicFence.longitude = this.longitude
                        electronicFence.latitude = this.latitude
                        electronicFence.radius = para.radius
                        electronicFence.createUserid = user.userId
						updateRailDeploy(electronicFence).then((res)=>{
							if(res.code==0){
							       this.$message({
							            message: '修改成功',
							            type: 'success'
							        });
							        this.form={
							            name:"",
							            radius: '0.1',
							            longitude: "108.386207",
							            latitude: "22.830839"
							        };
							        this.formVisible=false
							        this.loading=false
							        this.$emit("selectElec")
							    }else{
							        this.$message({
							            message: '修改失败',
							            type: 'error'
							        });
							    }
							}).catch(err=>{
							    this.$message({
							        message: '修改失败',
							        type: 'error'
							    });
						})
                    });
                }
            });
        },
        removeSubmit(){
          this.formVisible=false
            let id = this.id
            this.$confirm('确认删除吗？', '提示', {}).then(() => {
                deleteRailDeploy({eid:id}).then((res)=>{
					console.log(res)
                    if(res.code==0){
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        this.form={
                            name:"",
                            radius: '100',
                            longitude: "108.386207",
                            latitude: "22.830839"
                        };
                        this.formVisible=false
                        this.loadingD=false
                        this.$emit("selectElec")
                    }else{
                        this.$message({
                            message: '删除失败',
                            type: 'error'
                        });
                    }
                }).catch(err=>{
                    this.$message({
                        message: '删除成功',
                        type: 'error'
                    });
                })
            });
        }
    },
    mounted(){


    }
}
</script>
<style lang="scss" scoped>
  .el-dialog__wrapper /deep/.el-dialog{
    min-width: 680px;
  }
  /deep/ .el-dialog__header{
    text-align: center;
  }
  .deployRange /deep/ .el-input{
    width: 85%;
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
