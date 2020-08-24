<template>
	<div>
		<el-dialog title="修改密码" :visible.sync="dialogPassVisible" center :append-to-body='true' :before-close="handleClose" :lock-scroll="false" :close-on-click-modal="false" width="500px">
			<div class="passList">
				<el-form :model="ruleForm2" :rules="rules2" ref="ruleForm2" label-position="left" label-width="120px">
					<!-- <el-form-item  label="原密码" prop="account">
					<el-input type="text" v-model="ruleForm2.account" auto-complete="off" placeholder="请输入原密码" :disabled="flag"></el-input>
					</el-form-item> -->
					<el-form-item  label="输入新密码" prop="newPassword">
					<el-input type="password" v-model="ruleForm2.newPassword" auto-complete="off" placeholder="请输入密码" show-password></el-input>
					</el-form-item>
					<el-form-item  label="再次输入密码" prop="again">
					<el-input type="password" v-model="ruleForm2.again" auto-complete="off" placeholder="请再次密码" show-password></el-input>
					</el-form-item>

					<el-button type="primary" style="width:100%;" @click.native.prevent="onSubmit" :loading="loading" >确定</el-button>

				</el-form>
			</div>
		</el-dialog>
	</div>
</template>

<script>
import {changeUser} from '@/api/api.js'
import {Debounce} from '@/utils/index.js'
export default {
	data(){
		var validatePass = (rule, value, callback) => {
			if (value === '') {
			callback(new Error('请输入新密码'));
			} else {
				if (this.ruleForm2.again !== '') {
					if (value !== this.ruleForm2.again) {
						callback(new Error('两次输入密码不一致!'));
					}else{
						callback();
					}
				}else{
					callback();
				}

			}
		};
		var validatePass2 = (rule, value, callback) => {
			if (value === '') {
			callback(new Error('请再次输入密码'));
			} else if (value !== this.ruleForm2.newPassword) {
			callback(new Error('两次输入密码不一致!'));
			} else {
			callback();
			}
		};
		return{
			loading:false,
			flag:false,
			dialogPassVisible:false,
			ruleForm2:{
				account:'',
				newPassword:'',
				again:'',
				idCard:''
			},
			rules2: {
				newPassword: [
					{ required: true,validator: validatePass, trigger: 'change' },
					{ required: true,validator: validatePass, trigger: 'blur' }
				],
				again: [
					{ required: true,validator: validatePass2, trigger: 'change' },
					{ required: true,validator: validatePass2, trigger: 'blur' }
				]
			},
			// account:'',
		}
	},
	methods:{
		onSubmit:Debounce (function(){
			// console.log("修改密码")
			this.loading=true
			 this.$refs.ruleForm2.validate((valid) => {

					if (valid) {
						// this.$message({
						//   message: '密码修改成功,3秒后退出系统，请重新登录',
						//   type: 'success'
						// });
						// this.$router.replace('/login')
						let user = JSON.parse(sessionStorage.getItem('user'))
						let para = Object.assign({}, this.ruleForm2);
						let param = {
							password:this.ruleForm2.newPassword,
							userId:user.userId
						}
						changeUser(param).then((res)=>{
							//console.log(res)
							if(res.code == 0){
								this.$message({
									message: '密码修改成功,3秒后退出系统，请重新登录',
									type: 'success'
								});
								this.ruleForm2={
									newPassword:'',
									again:'',
									idCard:''
								},
								this.dialogPassVisible = false
								this.loading=false
								setTimeout(_=>{
									this.$router.push({path:"/login"})
								},3000)

							}else{
								this.$message.error('密码修改失败');
								this.loading=false
							}
						}).catch((res)=>{
							this.$message.error('密码修改失败');
							this.loading=false
						})

					}else{
						this.loading=false
					}
			 })

		},300),
		handleClose(){
			this.ruleForm2={
				account:'',
				newPassword:'',
				again:'',
				idCard:''
			},
			this.dialogPassVisible = false
			this.$nextTick(()=>{
                    this.$refs.ruleForm2.clearValidate();
                })
		},
		setShow(val,flag){
			this.flag =flag
			this.ruleForm2.account = val
			this.dialogPassVisible = true
		}
	}
}
</script>

<style>
</style>
