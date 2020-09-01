<template>
  <div class="wrap">
    <nav-bar></nav-bar>
        <div class="enroll-manage-main">
            <div class="enroll-manage-container" ref="container">
                <div class="enroll-manage-container-handle" >
                    <div class="handleItem">
                      <el-input v-model="inputValue" placeholder="请输入要搜索内容" style="width: 20vw" @input="searchInput"></el-input>
                      <div class="selectItem">
                        <label for="" class="enroll-manage-container-handle-label">设备状态</label>
                        <el-select v-model="valueEqState" style="width: 10vw;" filterable placeholder="请选择" @change="changeData">
                            <el-option
                            v-for="item in eqState"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                      </div>
                      <div class="selectItem">
                        <label for="" class="enroll-manage-container-handle-label">所属组织</label>
                        <el-cascader
                        	v-model="platformName" 
                        	:props="{ label: 'name',value:'id',checkStrictly:'true',emitPath:false }" 
                        	:options="options" 
                        	:show-all-levels="false"
                        	@change="handleChange">
                        </el-cascader>
                      </div>
                      <div class="selectItem">
                        <label for="" class="enroll-manage-container-handle-label">是否可用</label>
                        <el-select v-model="valueUse" style="width: 10vw;" filterable placeholder="请选择" @change="isUseW">
                            <el-option
                            v-for="item in isUse"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                      </div>
                    </div>
                    <div class="handleItem">
                      <el-button type="primary" @click="relevance" :disabled="this.isUseArr.length === 0">关联组织</el-button>
                      <el-button type="danger" @click="deletePlatform" :disabled="this.noUseArr.length===0">批量删除</el-button>
                    </div>
                </div>
                <div class="newTime">数据最新同步时间： XX年XX月XX日 XX时XX分XX秒</div>
                <el-table
                    :data="tables"
                    border stripe highlight-current-row
                    size="mini" v-loading="listLoading"
                    @selection-change="selsChange"
                    class="myTable" ref="table"
                    height="calc(100% - 130px)"
                    :row-key="getRowKeys">
                     <el-table-column type="selection" width="55" :reserve-selection="true" :selectable="selectTable">
                     </el-table-column>
                     <el-table-column type="index" width="60" label="序号">
                     </el-table-column>
                     <el-table-column v-for="(item,index) in tableTitle" :key="index" :prop="item.name" :label="item.title" :width="item.width" :min-width="item.minwidth" :sortable="item.type!='button'&&item.type!='handle'?true:false">
                         <template slot-scope="scope">
                             <div v-if="item.type=='handle'" align="center">
                               <el-button  type="primary" icon="el-icon-edit" size="small" round @click="changeSMI(scope.$index, scope.row)">修改</el-button>

                             </div>
                             <p v-else :formatter="formatSex" v-html="arrFormatter(scope.row[item.name],item.name)"></p>
                         </template>
                     </el-table-column>

                 </el-table>
                 <div class="foot">
                   <div class="enroll-check-container-tools">
                       <span class="enroll-check-container-tools-span"></span>
                       <el-pagination
                   						background
                   						layout="total, sizes, prev, pager, next, jumper"
                   						@current-change="handleCurrentChange"
                   						@size-change="handleSizeChange"
                   						:current-page="page"
                   						:page-sizes="[10, 15, 20, 25]"
                   						:page-size="pageSize"
                   						:total="count" >
                        </el-pagination>
                   </div>
                 </div>
            </div>
        </div>
        <dialog-equipment ref="equipment" @updateMess="updateMess"></dialog-equipment>
  </div>
</template>

<script>
  // import WtInput from '../../components/input.vue'
  import NavBar from '@/components/navBar/navBar.vue'
  import DialogEquipment from '@/components/dialogEquipment/dialogEquipment.vue'
  import {getEquipment,removeEquipment,getOrgList} from "@/api/api"
  import {Throttle} from '@/utils/index.js'
  export default {
    name:'home',
    components:{
      NavBar,
      DialogEquipment
    },
    data(){
      return{
        listLoading:false,
        sels:[],
            inputValue:"",
            page:1,//当前页
            pageSize:10,//页数大小
			organizationId:'',//组织id
			equipmentState:'',//设备状态
			isUseful:'',//是否可用
			parameter:'',//模糊搜索
			count:0,
            tableTitle:[
                { title : "设备编号", name : "code", type:"input",minwidth:'100'},
                { title : "设备状态", name : "equipmentState", type:"input",width:'100'},
                { title : "是否可用", name : "isUseful", type:"input",width:'100'},
                { title : "人员姓名", name : "elderlyName", type:"input",minwidth:'100'},
                { title : "所属组织", name : "organizationName", type:"input",minwidth:'200'},
                { title : "注册时间", name : "addTime", type:"input",minwidth:'100'},
                { title : "SIM卡号", name : "sim", type:"input",width:'150'}
            ],
            //0正常 1异常
            tableData:[],
            tableAllData: [],
            clientHeight:'',
            valueEqState:'',
            valueOrg:'',
            valueUse:'',
            //设备状态
            eqState:[
              {
                value: '',
                label: '全部'
              },
              {
                value: '1',
                label: '在线'
              },
              {
                value: '2',
                label: '离线'
              },
              {
                value: '3',
                label: '低电量'
              }
            ],
            //是否可用
            isUse:[
              {
                value: '',
                label: '全部'
              },
              {
                value: '1',
                label: '是'
              },
              {
                value: '2',
                label: '否'
              }
            ],
            //是否关联
            haveRelevance:[
              {
                value: '',
                label: '全部'
              },
              {
                value: '1',
                label: '是'
              },
              {
                value: '0',
                label: '否'
              }
            ],
            //所属组织
            options:[],
            valueW:"",
            platformName:'sss',
            isUseArr:[],
            noUseArr:[],
			baseOrg:'',
      }
    },
    methods:{
      //性别显示转换
      formatSex: function (row, column) {
                //console.log(column.property)
                if(column.property=="sex")
                return row.sex == 1 ? '男' : row.sex == 0 ? '女' : '';
                else
                return row[column.property]
      },
      arrFormatter (value,name) {
           if(name=='sex')
           return value == 1 ? '男' : value == 0 ? '女' : '';
          else if(name=='equipmentState')
           return value == 1 ? '在线' : value == 2 ? '离线' : '';
          else if(name=='haveRelevance')
           return value == 1 ? '<span style="color:rgb(112, 182, 3);font-weight:bold">是</span>' :( value == 2 ? '<span style="color:#909399;font-weight:bold">否</span>' : ( value == 3 ? '<span style="color:#67C23A;font-weight:bold">进行中</span>' : ( value == 4 ? '<span style="color:#909399;font-weight:bold">已结束</span>' : '')));
          else if(name == 'isUseful')
            return value == 2 ? '<span style="color:#f79898;font-weight:bold">否</span>' :( value == 1 ? '<span style="color:rgb(112, 182, 3);font-weight:bold">是</span>' : '');
          else
           return value;
      },
      handleCurrentChange(val){
         this.page = val;
		 let param = {
			 currentPage:this.page,
			 pageSize:this.pageSize
		 }
		 getEquipment(param).then(res=>{
		 	// console.log(res)
		     if(res.code==0)
		 	  this.tableData = res.data.data
		 	  this.tableAllData = this.tableData
		 	  this.count = res.data.count
		 	}).catch(err=>{
		 
		 	})
      },
	  //
	  searchInput: Throttle(function(e){
		this.parameter = e
		let param = {
			currentPage:this.page,
			pageSize:this.pageSize,
			organizationId:this.organizationId,
			isUseful:this.isUseful,
			equipmentState:this.equipmentState,
			parameter:this.parameter
		}
	  	this.getSearchData(param)
	  },1000),
	  //筛选接口
	  getSearchData(param){
		getEquipment(param).then(res=>{
		    if(res.code==0)
			  this.tableData = res.data.data
			  this.tableAllData = this.tableData
			  this.count = res.data.count
			}).catch(err=>{
		
			}) 
	  },
	  //当前页
      handleSizeChange(val){
      	this.pageSize = val
		let param = {
			currentPage:this.page,
			pageSize:this.pageSize,
			organizationId:this.organizationId,
			isUseful:this.isUseful,
			equipmentState:this.equipmentState,
			parameter:this.parameter
		}
		this.getSearchData(param)
      },
	  //设备状态
      changeData(val){
		  this.equipmentState = val
		  let param = {
			 currentPage:this.page,
			 pageSize:this.pageSize,
			 organizationId:this.organizationId,
			 isUseful:this.isUseful,
			 equipmentState:this.equipmentState,
			 parameter:this.parameter
		  }
		  this.getSearchData(param)
      },
	  //是否可用
      isUseW(val){
		this.isUseful = val
		let param = {
			currentPage:this.page,
			pageSize:this.pageSize,
			organizationId:this.organizationId,
			isUseful:this.isUseful,
			equipmentState:this.equipmentState,
			parameter:this.parameter
		}
		this.getSearchData(param)
      },
      //修改
      handleEdit(index,row){
      	this.$refs.userData.setShow(row)
      },
      // 批量选中
      selsChange(sels){
        let useData = []
        let noUseData = []
          for(let i in sels){
            if(sels[i].isUseful == '1'){
              useData.push(sels[i])
            }else if(sels[i].isUseful == '2'){
              noUseData.push(sels[i])
            }
          }
          this.sels = sels
          this.isUseArr = useData
          this.noUseArr = noUseData
      },
      //判断是否可以点击
      selectTable(row,index){
        // if(row.isUse == 1){
        //   //可用，不可点击，需禁用
        //   return false
        // }else{
        //   return true
        // }
        return true
      },
      getRowKeys(row) {
          return row.code;
      },
      relevance(){
        // this.$refs.equipment.dialogVisible = true
        let arr = this.sels
        for(let i in arr){
          if(arr[i].isUseful == 2){
            this.$message.error('您所选择的选项中存在不可用设备,不能关联组织,请重新选择!');
            return
          }
        }
		console.log(this.isUseArr)
        this.$refs.equipment.relevance(this.isUseArr)
      },
      //删除
      handleCheck(index,row){
      	let param = {
      		id : row.id
      	}
      	//console.log(param)
      	this.$confirm('此操作将永久删除该平台, 是否继续?', '提示', {
      	  confirmButtonText: '确定',
      	  cancelButtonText: '取消',
      	  type: 'warning'
      	}).then(() => {
      	  deleteUser(param).then((res)=>{
      		  if(res.code == 0){
      			  this.$message({
      				type: 'success',
      				message: '删除成功!'
      			  });
      			  this.getEnrollData()
      		  }else{
      			  this.$message.error('删除失败');
      		  }
      	  }).catch((res)=>{
      		  this.$message.error('删除失败');
      	  })

      	}).catch(() => {
      	});
      },
      deletePlatform(){
        let arr = this.sels
        for(let i in arr){
          if(arr[i].isUseful == 1){
            this.$message.error('您所选择的选项中存在可用设备,不能删除,请重新选择!');
            return
          }
        }
         this.$confirm('确认删除所选设备吗?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
              let str = ""
              arr.forEach(i => {
                str+= i.code+","
              });
              str = str.substring(0,str.lastIndexOf(","))
              console.log(str)
              removeEquipment({equipmentCode:str}).then(res=>{
                if(res.code == 0){
                  this.$message({
                    message: '删除成功',
                    type: 'success'
                  });
                  this.updateMess()
                }else{
                  this.$message({
                    message: '删除失败',
                    type: 'error'
                  });
                }
              }).catch(err=>{
                  this.$message({
                    message: '删除失败',
                    type: 'error'
                  })
               })
              
          }).catch(() => {
                  
          });
        
      },
      // 更新页面
      updateMess(){
      	this.getTableAllData()
      },
      //将tabledata的值传给tableAllData(到真正对接时就不用)
      getTableAllData(){
        getEquipment().then(res=>{
			console.log(res)
            if(res.code==0)
			  this.tableData = res.data.data
			  this.tableAllData = this.tableData
			  this.count = res.data.count
			}).catch(err=>{

			})
      },
	  //获取组织列表
	  getOrgList(){
	  		getOrgList().then((res)=>{
	  			let arr=[]
	  			if(res.code == 0){
	  				let treeData = res.data.data
	  				const data = this.toTree(treeData)
	  				this.data = data
	  				treeData.forEach((item)=>{
	  					if(!item.hasOwnProperty('parentId')){
							// this.options = item
							this.options.push(item)
	  					}
	  				})
	  			}
	  		})
	  },
	  //递归
	  toTree(data) {
	  		  let _this = this
	  		  // 删除 所有 children,以防止多次调用
	  		  data.forEach(function (item) {
	  			  delete item.children;
	  		  });
	  		  // 将数据存储为 以 id 为 KEY 的 map 索引数据列
	  		  var map = {};
	  		  data.forEach(function (item) {
	  			  map[item.id] = item;
	  		  });
	  		  var val = [];
	  		  data.forEach(function (item) {
	  			  // 以当前遍历项，的pid,去map对象中找到索引的id
	  			  
	  			  var parent = map[item.parentId];
	  			  // 如果找到索引，那么说明此项不在顶级当中,那么需要把此项添加到，他对应的父级中
	  			  if (parent) {
	  				  (parent.children || ( parent.children = [] )).push(item);
	  			  } else {
	  				  //如果没有在map中找到对应的索引ID,那么直接把 当前的item添加到 val结果集中，作为顶级
	  				  val.push(item);
	  				  _this.treeId = item.id
	  			  }
	  		  });
	  		  return val;
	  },
	  //级联下拉框选中
	  handleChange(val){
			this.organizationId = val
			let param = {
				currentPage:this.page,
				pageSize:this.pageSize,
				organizationId:this.organizationId,
				isUseful:this.isUseful,
				equipmentState:this.equipmentState,
				parameter:this.parameter
			}
			this.getSearchData(param)
	  },
    },
    mounted(){
      this.getTableAllData()
	  this.getOrgList()
    },
    computed:{
      tables:function(){
        var search=this.inputValue;
        if(search){
             let arr = []
            this.tableTitle.forEach(e => {
                if(e.name)
                arr.push(e.name)
            });
          return  this.tableAllData.filter(function(dataNews){
            return Object.keys(dataNews).some(function(key){
                    return String(arr).indexOf(key)>-1&&String(dataNews[key]).toLowerCase().indexOf(search) > -1
            })
          })
        }
        return this.tableData
      }
    },
  }
</script>

<style lang="scss" scoped>
    /deep/.el-table--mini td{
      padding: 0px;
    }
  .wrap{
    background-color: rgb(244, 244, 245);
    height: 100vh;
  }
  .newTime{

    height: 20px;
    font-size: 12px;
  }
  .enroll-manage-main {
      width: 100vw;
      height: calc(100vh - 65px);
      box-sizing: border-box;
      padding: 20px;

      .enroll-manage-container{
          padding: 20px;
          background: #fff;
		  height: calc(100% - 40px);
		  // height: calc(100vh - 105px);
          &-handle{
              display: flex;
              margin-bottom: 20px;
              justify-content: space-between;
              align-items: center;
              .handleItem{
                display: flex;
                justify-content: flex-start;
                align-items: center;
              }
              &-label{
                  margin-left: 20px;
                  font-size: 0.8vw;
                  color: #606266;
                  font-weight: 700;
                  margin-right: 5px;
              }
              .selectItem{
                display: flex;
                align-items: center;
                justify-content: flex-start;
              }
          }
          &-tools{
              display: flex;
              justify-content: space-between;
              align-items: center;
              &-span{
                 font-size: 14px;
                  color: #606266;
                  font-weight: 700;
              }
          }
      }
  	.myTable{
  		th{
  			padding: 0 !important;
  			height: 15px;
  			line-height: 15px;
  		}
  		td{
  			padding: 0 !important;
  			height: 15px;
  			line-height: 15px;
  		}
  		tr{
  			height: 15px !important;
  		}
  	}
  }
  .enroll-manage-footer{
      position: fixed;
      bottom: 0;
      width: 100%;
          height: 80px;
          background: #fff;
      }

  .foot{
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
</style>
