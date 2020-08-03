<template>
  <el-dialog title="人员信息"  :visible.sync="dialogVisible" center :append-to-body='true' :before-close="handleClose" :lock-scroll="false" :close-on-click-modal="false" width="600px">
    <div class="baseMess" v-show="isBaseMess">
      <el-form ref="form" :model="form" label-position="left" class="form" label-width="80px" >
          <div class="swrap">
        <el-form-item label="姓名">
          <el-input v-model="form.name" readonly></el-input>
        </el-form-item>
        
        <el-form-item label="身份证号" style="text-align: left !important;">
          <el-input v-model="form.IDCard" readonly></el-input>
        </el-form-item>
         </div>
         <el-form-item label="所属组织">
          <el-input v-model="form.organization" readonly></el-input>
        </el-form-item>
        <div class="swrap">
          <el-form-item label="设备编号">
            <el-input v-model="form.equipmentNum" readonly></el-input>
          </el-form-item>
          <el-form-item label="SIM卡号">
            <el-input v-model="form.SIMNum" readonly></el-input>
          </el-form-item>
        </div>
        <el-form-item label="详细地址">
          <el-input v-model="form.address" readonly></el-input>
        </el-form-item>
      </el-form>
      <div class="map" >
        <p class="title">家庭住址坐标</p>
        <div class="mapContent">
          <my-map :icon="icon" :dragging="true" :zooming="true" :markers="markers" :polylines="polylines"></my-map>
        </div>
      </div>
    </div>
    <div class="addressList" v-show="!isBaseMess">
      <el-form ref="form" :model="form" label-position="right" class="form" label-width="130px" >
        <el-form-item label="紧急联系人号码1">
          <el-input v-model="form.name" readonly></el-input>
        </el-form-item>
        <el-form-item label="紧急联系人号码2" readonly>
          <el-input v-model="form.organization"></el-input>
        </el-form-item>
        <el-form-item label="紧急联系人号码3" style="text-align: left !important;">
          <el-input v-model="form.IDCard" readonly></el-input>
        </el-form-item>
        <div class="swrap">
          <el-form-item label="姓名">
            <el-input v-model="form.equipmentNum" readonly></el-input>
          </el-form-item>
          <el-form-item label="号码">
            <el-input v-model="form.SIMNum" readonly></el-input>
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
  import MyMap from '@/components/map/map.vue'
  import home from '@/icons/png/jia.png'
  export default {
    components:{
      MyMap
    },
    data(){
      return{
        icon:home,
        markers:[{
          longitude:"116.404",
          latitude:"39.915", 
          icon:{
            name:home,
            size:[48, 48],
            anchor:[24, 48]
          }
        }],
        polylines:[
          [
            {longitude:"116.399",latitude:"39.910"},
            {longitude:"116.405",latitude:"39.920"},
            {longitude:"116.425",latitude:"39.900"}
          ],
          [
            {longitude:"116.387112",latitude:"39.920977"},
            {longitude:"116.385243",latitude:"39.913063"},
            {longitude:"116.394226",latitude:"39.917988"},
            {longitude:"116.401772",latitude:"39.921364"},
            {longitude:"116.41248",latitude:"39.927893"}
          ],
        ],
        dialogVisible:false,
        isBaseMess:true,//判断是否是基本信息，是，则显示基本信息，否则显示紧急联系人
        form: {
          name: '',
          organization: '',
          IDCard: '',
          equipmentNum: '',
          SIMNum: '',
          address: '',
        }
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
      }
    },
    mounted() {

    }
  }
</script>

<style lang="scss" scoped>
  .enroll-manage-container-title{
    margin-bottom: 20px;
    padding: 2px 0;
    border-left: 4px solid #409EFF;
    text-indent: 20px;
    font-size: 18px;
    font-weight: 700;
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
