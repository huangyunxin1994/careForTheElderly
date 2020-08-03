<template>
  <el-dialog title="组织管理"  :visible.sync="dialogVisible" center :append-to-body='true' :before-close="handleClose" :lock-scroll="false" :close-on-click-modal="false" width="600px">
    <el-form ref="form" :model="form" label-position="left" class="form" label-width="150px" >

      <el-form-item label="组织名称">
        <el-input v-model="form.organization"></el-input>
      </el-form-item>
      <el-form-item label="上级组织">
        <el-select v-model="form.superiorOrganization" placeholder="请选择上级组织">
          <el-option label="南宁总局" value="shanghai"></el-option>
          <el-option label="青秀分局" value="beijing"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="首页地图初始经纬度">
        <el-input v-model="form.address"></el-input>
      </el-form-item>
    </el-form>
    <div class="map">
      <my-map></my-map>
    </div>
    <div class="foot">
      <el-button   class="btn" @click="cancelBtn">取消</el-button>
      <el-button type="primary"  class="btn" @click="sureBtn">确定</el-button>
      <el-button type="danger"  class="btn" @click="sureBtn">删除</el-button>
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
        dialogVisible:false,
        form: {
          organization: '',
          superiorOrganization:'',
          address: '',
        }
      }
    },
    methods:{
      sureBtn() {
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
