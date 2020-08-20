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
        <get-adress ref="getAdress" :map="map" @getItem="getItem"></get-adress>
      </el-form-item>
    </el-form>
    <div class="map">
      <my-map ref="myMap" @getMap="getMap" :center="mycenter" :markers="markers"></my-map>
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
  export default{
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
		isDisabled:false,
		mycenter:{
			latitude:'',
			longitude:''
		},
		markers:[
		  {
		    longitude:"",
		    latitude:"",
		    icon:{
		      name:adress,
		      size:[48, 48],
		      anchor:[24, 48]
		    }
		  }
		],
		addmitType:1,//用来判断是修改还是新增   1新增  2修改
		nowMess:{},//编辑时,用来存放本条消息
      }
    },
    methods:{
      sureBtn() {

        this.$refs.form.validate((valid) => {
          if(valid){
            if(this.addmitType == 1){
            	//新增
				if(this.mycenter.latitude == '' || this.mycenter.longitude == ''){
					this.$message.error('请输入地图的初始中心位置');
				}else{
					let param = {
						name:this.form.organization,
						parentId:this.form.superiorOrganization,
						latitude:this.mycenter.latitude,
						longitude:this.mycenter.longitude,
						level:1
					}
					newOrg(param).then((res)=>{
						if(res.code == 0){
							this.dialogVisible = false
							this.$message({
							  message: '添加成功',
							  type: 'success'
							});
							this.$emit('getOrg',1)
						}else{
							this.dialogVisible = false
							this.$message.error('添加失败');
						}
					})
				}
            	
            }else{
            	//修改
				if(this.mycenter.latitude == '' || this.mycenter.longitude == ''){
					this.$message.error('请输入地图的初始中心位置');
				}else{
					let param = {
						id:this.nowMess.id,
						name:this.form.organization,
						parentId:this.form.superiorOrganization,
						latitude:this.mycenter.latitude,
						longitude:this.mycenter.longitude,
						level:1
					}
					changeOrg(param).then((res)=>{
						if(res.code == 0){
							this.dialogVisible = false
							this.$message({
							  message: '修改成功',
							  type: 'success'
							});
							this.$emit('getOrg',1)
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
        this.$nextTick(()=>{
//                     this.$refs.form.clearValidate();
                })
      },
      //新建组织
	  newOrganization(val){
		this.dialogVisible = true
		this.addBtn = true
		this.removeBtn = false
		this.form.superiorOrganization = val.id
		this.addmitType = 1
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
		
		if(val.hasOwnProperty('children')){
			this.isDisabled = true
		}else{
			this.isDisabled = false
		}
		
		if(val.hasOwnProperty('parentId')){
			this.form.superiorOrganization = val.parentId
		}else{
			this.form.superiorOrganization = val.id
		}
		this.mycenter = {
			latitude : val.latitude,
			longitude : val.longitude
		}
		// console.log(this.mycenter)
		this.markers[0].latitude = val.latitude
		this.markers[0].longitude = val.longitude
		console.log(this.markers)
		//  this.$nextTick(()=>{
		// this.$refs.myMap.setCenter(this.mycenter)
		// })
      },
	  //编辑组织时，要获取到组织树结构
	  getOrgTree(val){
		  this.options = val
	  },
      //获取到map对象
      getMap(val){
        this.map = val
      },
	  //级联下拉框选中
	  handleChange(val){
		console.log(this.form.superiorOrganization)
	  },
      //点击选中建议项时触发的方法
      getItem(val){
        this.mycenter = {
          longitude:val.point.lng,
          latitude:val.point.lat
        }
		this.markers[0].latitude = val.point.lat
		this.markers[0].longitude = val.point.lng
        // this.$refs.myMap.setCenter(this.item)
      }
    },
    mounted() {

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
  }
  .foot{
    display: flex;
    justify-content: flex-end;
  }
</style>
