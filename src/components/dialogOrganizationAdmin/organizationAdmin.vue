<template>
  <el-dialog title="组织管理"  :visible.sync="dialogVisible" center :append-to-body='true' :before-close="handleClose" :lock-scroll="false" :close-on-click-modal="false" width="600px">
    <el-form ref="form" :model="form" :rules="formRule"  class="form" label-width="150px" >

      <el-form-item label="组织名称" prop="organization" required>
        <el-input v-model="form.organization" placeholder="请输入组织名称"></el-input>
      </el-form-item>
      <el-form-item label="上级组织" prop="superiorOrganization" required>
		<el-cascader 
			v-model="form.superiorOrganization" 
			:props="{ label: 'name',value:'id',checkStrictly:'true',emitPath:false }" 
			:options="options" 
			:show-all-levels="false"
			:disabled="isDisabled"
			@change="handleChange">
		</el-cascader>
      </el-form-item>
      <el-form-item label="首页地图初始经纬度" >
        <get-adress ref="getAdress" :map="map" @getItem="getItem" ></get-adress>
      </el-form-item>
    </el-form>
    <div class="map">
      <my-map ref="myMap" @getAdressName="getAdressName" @getMap="getMap" @getcenter="getcenter" :zoomLevel="zoomLevel" :center="mycenter" :markers="markers"></my-map>
	  <div class="mapIcon">
		  <img class="iconImg" src="../../icons/png/dingwei.png" alt="">
	  </div>
    </div>
    <div class="foot">
      <el-button type="primary"  class="btn" @click="cancelBtn">取消</el-button>
      <el-button type="primary" v-if="addBtn" class="btn" @click="sureBtn">确定</el-button>
      <el-button type="primary" v-if="removeBtn" class="btn" @click="deleteBtn">删除</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import MyMap from '@/components/map/map.vue'
  import GetAdress from '@/components/getAdress/getAdress.vue'
  import {newOrg,changeOrg,deleteOrg} from '@/api/api.js'
  
  // 图标
  import adress from '@/icons/png/dingwei.png'
  import warn from '@/icons/png/personw.png'
  export default {
    components:{
      MyMap,
      GetAdress
    },
    data(){
      return{
        formRule:{
            organization: [{ required: true, message: '请输入组织名称', trigger: 'blur' }],
            superiorOrganization: [{ required: true, message: '请选择上级组织', trigger: 'blur' }],
            address:[{ required: true, message: '请输入初始经纬度', trigger: 'blur' }]
        },
        dialogVisible:false,
        form: {
          organization: '',
          superiorOrganization:'xsxsxs112',
          address: '',
        },
        addBtn:false,
        removeBtn:false,
        map:{},
        item:'',//用来记录坐标点
		options:[],
		nowCenter:'',//当前地图的中心点
		isDisabled:false,
		mycenter:{
			longitude:116.399,
			latitude:39.910
		},
		mycenter1:{},
		markers:[],
		zoomLevel:16, //缩放等级
		addmitType:1,//用来判断是修改还是新增   1新增  2修改
		nowMess:{},//编辑时,用来存放本条消息
		adressName:'',
      }
    },
    methods:{
      sureBtn() {

        this.$refs.form.validate((valid) => {
          if(valid){
            if(this.addmitType == 1){
            	//新增
				if(this.mycenter1.latitude == '' || this.mycenter1.longitude == ''){
					this.$message.error('请输入地图的初始中心位置');
				}else{
					let param = {
						name:this.form.organization,
						parentId:this.form.superiorOrganization,
						latitude:this.mycenter1.latitude,
						longitude:this.mycenter1.longitude,
						address:this.adressName,
						level:1
					}
					// console.log(param)
					newOrg(param).then((res)=>{
						if(res.code == 0){
							this.dialogVisible = false
							this.$message({
							  message: '添加成功',
							  type: 'success'
							});
							this.$emit('getOrg',1)
							this.$refs.getAdress.address = ''
							this.isDisabled=false
							this.$nextTick(()=>{
								this.$refs.form.resetFields();
							})
							this.form = {
							  organization: '',
							  superiorOrganization:'xsxsxs112',
							  address: '',
							}
						}else{
							this.dialogVisible = false
							this.$message.error('添加失败');
						}
					})
				}
            	
            }else{
            	//修改
				if(this.mycenter1.latitude == '' || this.mycenter1.longitude == ''){
					this.$message.error('请输入地图的初始中心位置');
				}else{
					let param = {
						id:this.nowMess.id,
						name:this.form.organization,
						parentId:this.form.superiorOrganization,
						latitude:this.mycenter1.latitude,
						longitude:this.mycenter1.longitude,
						address:this.adressName,
						level:1
					}
					// console.log(param)
					changeOrg(param).then((res)=>{
						if(res.code == 0){
							this.dialogVisible = false
							this.$message({
							  message: '修改成功',
							  type: 'success'
							});
							this.$emit('getOrg',1)
							this.$refs.getAdress.address = ''
							this.isDisabled=false
							this.form = {
							  organization: '',
							  superiorOrganization:'xsxsxs112',
							  address: '',
							}
							this.$nextTick(()=>{
								this.$refs.form.resetFields();
							})
						}else{
							this.dialogVisible = false
							this.$message.error('修改失败');
						}
					})
				}
            }
          }
        })
		
      },
      deleteBtn(){
		let param = {
			id:this.nowMess.id
		}
		deleteOrg(param).then((res)=>{
			if(res.code == 0){
				this.dialogVisible = false
				this.$message({
				  message: '删除成功',
				  type: 'success'
				});
				this.$emit('getOrg',1)
				this.$refs.getAdress.address = ''
				this.isDisabled=false
				this.$nextTick(()=>{
					this.$refs.form.resetFields();
				})
			}else{
				this.dialogVisible = false
				this.$message.error('删除失败');
			}
		})
      },
      cancelBtn(){
        this.dialogVisible = false
      },
      handleClose(){
        this.dialogVisible = false
        this.form = {
          organization: '',
          superiorOrganization:'',
          address: '',
        }
        this.$refs.getAdress.address = ''
		this.isDisabled=false
        this.$nextTick(()=>{
			this.$refs.form.resetFields();
		})
      },
      //新建组织
	  newOrganization(val){
		this.dialogVisible = true
		this.addBtn = true
		this.removeBtn = false
		this.form.superiorOrganization = val.id
		// this.form.superiorOrganization = val.parentId
		this.isDisabled = false
		this.addmitType = 1
		let para = {
			latitude : val.latitude,
			longitude : val.longitude
		}
		this.mycenter={}
		this.mycenter = para
	  },
      //编辑组织
      editOrganization(val){
		  console.log(val)
        this.dialogVisible = true
        this.addBtn = true
        this.removeBtn = true
        this.form.organization = val.name
		this.addmitType = 2
		this.nowMess = val
		
		// if(val.hasOwnProperty('children')){
		// 	this.isDisabled = true
		// }else{
		// 	this.isDisabled = false
		// }
		if(val.hasOwnProperty('parentId')){
			this.form.superiorOrganization = val.parentId
		}else{
			this.form.superiorOrganization = val.id
		}
		let para = {
			latitude : val.latitude,
			longitude : val.longitude
		}
		this.mycenter = para
		this.$nextTick(_=>{
			
			this.$refs.myMap.getMap();
		})
		this.isDisabled = true
		
		
		
		
		// this.markers=[]
		// let para2 = {
		//   longitude:val.latitude,
		//   latitude:val.longitude,
		//   icon:{
		//     name:adress,
		//     size:[48, 48],
		//     anchor:[24, 48]
		//   }
		// }
		// this.markers.push(para2)
      },
	  //获取到地址名称
	  getAdressName(val,lng,lat){
		  this.adressName = val
		  this.$refs.getAdress.address = val
		  this.mycenter1 = {
		  	latitude : lat,
		  	longitude : lng
		  }
	  },
	  //编辑组织时，要获取到组织树结构
	  getOrgTree(val){
		  this.options = val
	  },
      //获取到map对象
      getMap(val){
        this.map = val
      },
	  //随着地图的移动  获取到当前地图的中心点
	  getcenter(val){
		this.nowCenter = val
		this.mycenter = {
		  longitude:val.lng,
		  latitude:val.lat
		}
		this.$refs.getAdress.getNowAdress(val)
		// console.log(this.mycenter)
	  },
	  //级联下拉框选中
	  handleChange(val){
		console.log(this.form.superiorOrganization)
	  },
      //点击选中建议项时触发的方法
      getItem(val){
        this.mycenter = {
          longitude:val.latLng.lng,
          latitude:val.latLng.lat
        }
		this.adressName = val.address + val.name;
		this.markers=[]
		let para = {
		  longitude:val.latLng.lng,
		  latitude:val.latLng.lat,
		  icon:{
		    name:adress,
		    size:[48, 48],
		    anchor:[24, 48]
		  }
		}
		this.markers.push(para)
      }
    },
    mounted() {
		console.log(319)
    }
  }
</script>

<style lang="scss" scoped>
  .el-dialog__body /deep/ .el-form--label-left .el-form-item__label{
    text-align: right;
  }
  .map{
    width: 100%;
    height: 300px;
    border: 1px solid #ccc;
    margin-bottom: 22px;
	position: relative;
  }
  .mapIcon{
	  position: absolute;
	  display: block;
	  width: 48px;
	  height: 48px;
	  top:50%;
	  left:50%; 
	  transform: translate(-50%,-50%);
	  z-index: 100;
  }
  .mapIcon .iconImg{
	width: 100%;
	height: 100%;
  }
  
  .foot{
    display: flex;
    justify-content: flex-end;
  }
</style>
