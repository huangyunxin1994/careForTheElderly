<template>
  <el-dialog title="填写处理结果" :visible.sync="dialogHandleResult" center :append-to-body='true' :before-close="handleClose" :lock-scroll="false" width="30%">
  <div class="warnList">

    <div class="warnResultRight">
      <el-input
        type="textarea"
        placeholder="请输入内容"
        :autosize="{ minRows: 6, maxRows: 4}"
        v-model="textarea">
      </el-input>
    </div>
  </div>
  <el-row class="cancelSwrap">
    <div class="cancel">
      <el-button type="primary" @click="cancel">取消</el-button>
      <el-button type="primary" @click="sureBtn">确定</el-button>
    </div>
  </el-row>
  </el-dialog>
</template>

<script>
import {changeAlert} from "@/api/api"
import {parseTime} from '@/utils/index.js'
  export default {
    data() {
      return {
        dialogHandleResult:false,
        changeDataResult:'',
        textarea: '',
        id:"",
		    sels:[]
      }
    },
    methods:{
	  getData(val){
		  this.sels = val
		  this.dialogHandleResult = true
	  },
      cancel(){
        this.dialogHandleResult = false
		this.textarea = ""
      },
	  handleClose() {
	      this.dialogHandleResult = false
	      this.textarea = ""
	  },
      sureBtn(){
        if(this.textarea!=""){
          let user = JSON.parse(sessionStorage.getItem("user"))
		  let time = parseTime(new Date(),`{y}-{m}-{d} {h}:{i}:{s}`)
		  let arr = this.sels
		  let array = []
		  for(let i in arr){
				 let obj = {}
				 obj.processingResult = 2
				 obj.id = arr[i].id
				 obj.handleRecord = this.textarea
				 obj.handleUsername = user.name
				 obj.handleUserid = user.userId
				 obj.handleTime = time
				 obj.code = arr[i].code
				 array.push(obj)
		  }
		  console.log(array)
          this.$confirm('确认提交处理结果?', '提示', {
			confirmButtonText: '确定',
			cancelButtonText: '取消',
			type: 'warning'
		  }).then(() => {
					 changeAlert(array).then((res)=>{
						 console.log(res)
						 if(res.code == 0){
							this.$message({
							  message: '处理成功',
							  type: 'success'
							});
							this.$emit('getData',1)
							this.dialogHandleResult=false
						 }else{
							this.$message.error('处理失败');
						 }
					 })
		  }).catch(() => {
			this.$message({
			  type: 'info',
			  message: '已取消忽略'
			});
		  });
        }else{
          this.$message({
            message: '请填写处理结果',
            type: 'error'
          });
        }
      },
    }
  }
</script>

<style>
  .warnList /deep/ .el-textarea__inner{
    min-height: 200px !important;
  }
</style>
<style lang="scss" scoped>

  .warnList{
    display: flex;
    justify-content: space-around;
  }

  .warnResultLeft{
    width: 15vw;
  }
  .warnResultRight{
    width: 85vw;
  }



  .cancelSwrap{
    width: 100%;
  }
  .cancel{
    display: flex;
    justify-content: flex-end;
    margin: 20px auto 0px;
  }
  .sureBtn{
    background: rgba(0, 153, 255, 1);
    color: white;
    width: 110px;
    height: 40px;
    border-radius: 3px;
    border: 1px solid transparent;
    outline: none;
  }
  .cancelBtn{
    width: 110px;
    height: 40px;
    border: 1px solid rgb(204, 204, 204);
    color: rgb(153, 153, 153);
    border-radius: 3px;
    background-color: white;
  }
</style>
