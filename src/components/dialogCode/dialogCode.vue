<template>
  <el-dialog title="查看所属小程序码"  :visible.sync="dialogVisible" center :append-to-body='true' :before-close="handleClose" :lock-scroll="false" :close-on-click-modal="false" width="700px">
    <div class="swrap">
		<div class="mainLeft">
			<div class="picIcon">
				<img src="../../icons/png/xiao.jpg" alt="">
			</div>
			<p class="tishi">B端小程序码</p>
		</div>
		<div class="mainRight">
			<div class="picIcon">
				<img src="../../icons/png/xiao.jpg" alt="">
			</div>
			<p class="tishi">C端小程序码</p>
		</div>
	</div>
    <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click.native="handleClose">关闭</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import {} from '@/api/api.js'
  export default{
    data(){
      
      return{
        dialogVisible:false,
        
      }
    },
    methods:{
      getData(){
		  this.dialogVisible = true
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
	.swrap{
		padding: 0px 10px;
		display: flex;
		justify-content: space-between;
	}
	.tishi{
		text-align: center;
	}
	.picIcon{
		width: 300px;
		height: 300px;
	}
	.picIcon img{
		width: 100%;
		height: 100%;
	}
	.dialog-footer{
		display: flex;
		justify-content: flex-end;
	}
  
</style>
