<template>
  <el-dialog title="组织管理"  :visible.sync="dialogVisible" center :append-to-body='true' :before-close="handleClose" :lock-scroll="false" :close-on-click-modal="false" width="600px">
    <el-form ref="form" :model="form" :rules="formRule"  class="form" label-width="150px" >

      <el-form-item label="组织名称" prop="name" required>
        <el-input v-model="form.organization" placeholder="请输入组织名称"></el-input>
      </el-form-item>
      <el-form-item label="上级组织" prop="superiorOrganization" required>
        <el-select v-model="form.superiorOrganization" placeholder="请选择上级组织">
          <el-option label="南宁总局" value="shanghai"></el-option>
          <el-option label="青秀分局" value="beijing"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="首页地图初始经纬度" prop="address" required>
        <el-input v-model="form.address" placeholder="请输入经纬度"></el-input>
      </el-form-item>
    </el-form>
    <div class="map">
      <my-map></my-map>
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
  export default{
    components:{
      MyMap
    },
    data(){
      return{
        formRule:{
            name: [{ required: true, message: '请输入组织名称', trigger: 'blur' }],
            superiorOrganization: [{ required: true, message: '请选择上级组织', trigger: 'blur' }],
            address:[{ required: true, message: '请输入初始经纬度', trigger: 'blur' }]
        },
        dialogVisible:false,
        form: {
          organization: '',
          superiorOrganization:'',
          address: '',
        },
        addBtn:false,
        removeBtn:false
      }
    },
    methods:{
      sureBtn() {
        
        this.$refs.form.validate((valid) => {
          if(valid){
            this.dialogVisible = false
          }
        })
      },
      deleteBtn(){
        this.dialogVisible = false
      },
      cancelBtn(){
        this.dialogVisible = false
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
