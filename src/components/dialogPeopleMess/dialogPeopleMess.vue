<template>
  <el-dialog title="人员信息"  :visible.sync="dialogVisible" center :append-to-body='true' :before-close="handleClose" :lock-scroll="false" :close-on-click-modal="false" width="600px">
    <div class="baseMess" v-show="isBaseMess">
      <el-form ref="form" :model="form" label-position="left" class="form" label-width="80px" >
          <div class="swrap">
        <el-form-item label="姓名">
          <el-input v-model="form.name" readonly></el-input>
        </el-form-item>
        
        <el-form-item label="身份证号" style="text-align: left !important;">
          <el-input v-model="form.idCard" readonly></el-input>
        </el-form-item>
         </div>
         <el-form-item label="所属组织">
          <el-input v-model="form.organization" readonly></el-input>
        </el-form-item>
        <div class="swrap">
          <el-form-item label="设备编号">
            <el-input v-model="form.equipmentCode" readonly></el-input>
          </el-form-item>
          <el-form-item label="SIM卡号">
            <el-input v-model="form.sim" readonly></el-input>
          </el-form-item>
        </div>
        <el-form-item label="详细地址">
          <el-input v-model="form.address" readonly></el-input>
        </el-form-item>
      </el-form>
      <div class="map" >
        <p class="title">家庭住址坐标</p>
        <div class="mapContent">
          <my-map ref='mymap'  :dragging="true" :zooming="true" :markers="markers" :center="center" ></my-map>
        </div>
      </div>
    </div>
    <div class="addressList" v-show="!isBaseMess">
      <el-form ref="form" :model="form" label-position="right" class="form" label-width="130px" >
        <div v-for="(item,index) in sosNumbers" :key="item.id">
          <el-form-item :label="'紧急联系人号码'+parseInt(index+1)">
            <el-input v-model="item.number" readonly></el-input>
          </el-form-item>
        </div>
        <div class="swrap" v-for="item in usualNumbers" :key="item.id">
          <el-form-item label="姓名">
            <el-input v-model="item.name" readonly></el-input>
          </el-form-item>
          <el-form-item label="号码">
            <el-input v-model="item.number" readonly></el-input>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <div class="btnWrap">
      <el-button type="primary" v-show="!isBaseMess" class="btn" @click="getBaseMess">上一页</el-button>
      <el-button type="primary" v-show="isBaseMess" class="btn" @click="getaddressList">查看通讯录</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import MyMap from '@/components/map/qqmap.vue'
  import home from '@/icons/png/jia.png'
  export default {
    components:{
      MyMap
    },
    data(){
      return{
        center:{
         
        },
        markers:[
         ],
        dialogVisible:false,
        isBaseMess:true,//判断是否是基本信息，是，则显示基本信息，否则显示紧急联系人
        sosNumbers:[],
        usualNumbers:[],
        form: {
          name: '',
          organization: '',
          IDCard: '',
          equipmentNum: '',
          SIMNum: '',
          address: '',
        },
        phoneNumbers:[]
      }
    },
    methods:{
      getBaseMess() {
        this.isBaseMess = true
      },
      getaddressList(){
        this.isBaseMess = false
      },
      handleClose(){
        this.dialogVisible = false
        this.isBaseMess = true
      },
      initData(data,val){
		this.dialogVisible = true
        this.form = data.elderly
        this.sosNumbers = data.phoneNumbers.filter(i=>i.type==2)
        this.usualNumbers = data.phoneNumbers.filter(i=>i.type==4)
        this.form.organization = val
		let param = {
			longitude:this.form.longitude,
			latitude:this.form.latitude
		}
		this.center = param
        let para = {
            longitude:this.form.longitude,
            latitude:this.form.latitude, 
            icon:{
              name:home,
              size:[48, 48],
              anchor:[24, 48]
            }
          }
        this.markers.push(para)
		this.$nextTick(_=>{
			this.$refs.mymap.getMap()
		})
		
		console.log(this.$refs.mymap)
      }
    },
    mounted() {
      
      console.log(this.center)
    }
  }
</script>

<style lang="scss" scoped>
.baseMess{
  position: relative;
}
  .baseMess:after{
    content: "";
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 1;
  }
  
  .addressList{
    position: relative;
  }
  .addressList:after{
    content: "";
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 1;
  }
  .el-form-item .el-form-item__label{
    text-align: right !important;
  }
  .swrap{
    // width: 100vw;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
  }
  .map{
    font-size: 14px;
    .mapContent{
      border: 1px solid #ccc;
      width: 100%;
      height: 25vh;
      margin: 0px auto;
    }
  }
  .btnWrap{
    margin-top: 20px;
      display: flex;
      justify-content: flex-end;
    
  }
</style>
