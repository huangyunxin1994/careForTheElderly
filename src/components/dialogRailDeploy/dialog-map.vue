<template>
    <el-dialog title="添加电子围栏" :visible.sync="formVisible" :before-close="handleClose" :close-on-click-modal="false" top="5vh" width="70vw">
        <el-form :inline="true" :model="form" :rules="formRule" ref="form" class="demo-form-inline">
            <el-form-item label="电子围栏名称" prop="name" required>
                <el-input v-model="form.name" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="电子围栏范围" prop="radius" required>
                <el-select v-model="form.radius" placeholder="请选择"  @change="changeRound">
                    <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                    >
                    </el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <div class="dialog-map">
            <i class="dialog-map-icon iconicon-test-copy"></i>
            <div id="allmap" ref="allmap" class="dialog-map">

            </div>
        </div>
    <div slot="footer" class="dialog-footer">
            <el-button @click.native="handleClose">取消</el-button>
            <el-button type="primary" @click.native="addSubmit" :loading="loading">添加</el-button>
        </div>
    </el-dialog>
</template>
<script>
import { parseTime } from '@/utils/index.js'
// import { addElectronicFence,deleteElectronicFence,selectElectronicFenceQuery,updateElectronicFence,selectPosition } from  "@/api/table"
// import "@/assets/icon/iconfont.css"
export default {
    name: 'Map',
    data(){
        return{
            formRule:{
                name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
                radius: [{ required: true, message: '请选择范围', trigger: 'blur' }],
            },
            formVisible:false,
            loading:false,
            mainMap:"",
            infoWindowArr:[],
            point:"",
            longitude:"",
            latitude:"",
            options: [{
            value: '100',
            label: '100米'
            }, {
            value: '200',
            label: '200米'
            }, {
            value: '300',
            label: '300米'
            }, {
            value: '400',
            label: '400米'
            }, {
            value: '500',
            label: '500米'
            }],
            form:{
                name:"",
                radius: '100',
                longitude: "108.386207",
                latitude: "22.830839"
            },
            map:"",
            marker:"",
            circle:""
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
            this.circle = new BMap.Circle(point,this.form.radius,{strokeColor:"#F56C6C", strokeWeight:6, strokeOpacity:0.8}); //创建圆
            this.map.addOverlay(this.circle);
            let that = this
            this.map.addEventListener("moveend",function(){
                    that.longitude = that.map.getCenter().lng
                    that.latitude = that.map.getCenter().lat
                    let point  = new BMap.Point(that.longitude,that.latitude)
                    that.circle = new BMap.Circle(point,that.form.radius,{strokeColor:"#F56C6C", strokeWeight:6, strokeOpacity:0.8}); //创建圆
                    that.map.clearOverlays()
                    that.map.addOverlay(that.circle);
            });
            this.map.addEventListener("zoomend",function(){
                    that.longitude = that.map.getCenter().lng
                    that.latitude = that.map.getCenter().lat
                    let point  = new BMap.Point(that.longitude,that.latitude)
                    that.circle = new BMap.Circle(point,that.form.radius,{strokeColor:"#F56C6C", strokeWeight:6, strokeOpacity:0.8}); //创建圆
                    that.map.clearOverlays()
                    that.map.addOverlay(that.circle);
            });

        },
        changeRound(val){
            this.longitude = this.map.getCenter().lng
            this.latitude = this.map.getCenter().lat
            let point  = new BMap.Point(this.longitude,this.latitude)
            this.circle = new BMap.Circle(point,this.form.radius,{strokeColor:"#F56C6C", strokeWeight:6, strokeOpacity:0.8}); //创建圆
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
                radius: '100',
                longitude: "108.386207",
                latitude: "22.830839"
            };
            this.formVisible=false
            this.loading=false
        },
        addSubmit(){
            this.$refs.form.validate((valid) => {
                if (valid) {
                    this.$confirm('确认提交吗？', '提示', {}).then(() => {
                        this.loading = true;
                        //NProgress.start();
                        let para = Object.assign({}, this.form);
                        console.log(para)
                        let params = {}
                        params.name = para.name
                        params.createTime = parseTime(new Date())
                        params.longitude = this.longitude
                        params.latitude = this.latitude
                        params.radius = para.radius
                        console.log(params)
                        addElectronicFence(params).then((res)=>{
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
                                this.$emit("selectElec")
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
