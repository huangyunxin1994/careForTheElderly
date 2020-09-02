<template>
    <el-dialog title="编辑电子围栏" :visible.sync="formVisible" center :before-close="handleClose" :close-on-click-modal="false" top="5vh" width="70vw">
        <el-form :inline="true" :model="form" :rules="formRule" ref="form" class="demo-form-inline">
            <el-form-item label="电子围栏名称" prop="name" required>
                <el-input v-model="form.name" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="围栏中心位置"  required>
                <get-adress ref="getAdress" :map="map" @getItem="getItem"></get-adress>
            </el-form-item>
            <el-form-item label="电子围栏范围" prop="radius" required class="deployRange">
                <el-input v-model="form.radius"  @change="changeRound" placeholder="请输入"></el-input>km
            </el-form-item>
        </el-form>
        <div class="dialog-map">
            <i class="dialog-map-icon iconicon-test-copy"></i>
            <my-map ref="mymap1" mapId="container2" :dragging="true" :zooming="true" :circles="circles" :center="center" :zoomLevel="16" @getAddress="getAddress" :geocoder="true"></my-map>
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
import myMap from '@/components/map/qqmap.vue'
// import { addElectronicFence,deleteElectronicFence,selectElectronicFenceQuery,updateElectronicFenceMsg } from  "@/api/table"
// import "@/assets/icon/iconfont.css"
import {updateRailDeploy,deleteRailDeploy} from '@/api/api.js'
export default {
    name: 'Map',
    components:{
      GetAdress,
      myMap
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
			address:'',
            latitude:"",
            markers:[],
            center:{},
            circles:[],
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
        changeRound(val){
            let para ={}
            para.longitude = this.longitude
            para.latitude = this.latitude
            para.radius = this.form.radius
            this.circles.length = 0
            this.circles.push(para)
            console.log(this.circles)
            this.$refs.mymap1.reloadCircles()
        },
        getItem(item) {
          this.form.center = item.address + item.name; //记录详细地址，含建筑物名
            this.address = item.address + item.name||"";
            this.longitude = item.latLng.lng
            this.latitude = item.latLng.lat
            let para ={}
            para.longitude = item.latLng.lng
            para.latitude = item.latLng.lat
            para.radius = this.form.radius
            this.circles.length = 0
            this.circles.push(para)
            console.log(this.circles)
            this.$refs.mymap1.reloadCircles()
             this.$refs.mymap1.moveDeploy(item.latLng.lng,item.latLng.lat)
        },
         getAddress(item){
            console.log(item)
            this.form.center = item.detail.address + item.detail.nearPois[0].name; //记录详细地址，含建筑物名
            this.address = item.detail.address + item.detail.nearPois[0].name; //记录详细地址，含建筑物名
            this.$refs.getAdress.address = this.form.center
            this.longitude = item.detail.location.lng
            this.latitude = item.detail.location.lat
            let para ={}
            para.longitude = item.detail.location.lng
            para.latitude = item.detail.location.lat
            para.radius = this.form.radius
            this.circles.length = 0
            this.circles.push(para)
            console.log(this.circles)
            this.$refs.mymap1.reloadCircles()
        },
        handleShow(val){
            this.formVisible=true
			this.form = val
            this.id = val.id
            this.longitude=val.longitude
            this.latitude=val.latitude
            let para = {}
             para.longitude=val.longitude
            para.latitude=val.latitude
            para.radius=val.radius
            this.center = para
            this.circles.push(para)
            this.$nextTick(() => {
                 this.$refs.mymap1.getMap();
				this.$refs.getAdress.address = val.address
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
            console.log(this.address)
          // this.formVisible=false
            this.$refs.form.validate((valid) => {
                if (valid) {
                    this.$confirm('确认提交吗？', '提示', {}).then(() => {
                        this.loading = true;
                        //NProgress.start();
                        let para = Object.assign({}, this.form);
						let user = JSON.parse(sessionStorage.getItem('user'))
						let electronicFence = {}
                        electronicFence.name = para.name
                        electronicFence.longitude = this.longitude
                        electronicFence.latitude = this.latitude
                        electronicFence.radius = para.radius
                        electronicFence.createUserid = user.userId
						electronicFence.address = this.address
						electronicFence.id = this.id
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
.dialog-footer{
	display: flex;
	align-items: center;
	justify-content: flex-end;
}

</style>
