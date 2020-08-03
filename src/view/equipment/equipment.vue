<template>
  <div class="wrap">
    <nav-bar></nav-bar>
        <div class="newTime">数据最新同步时间： XX年XX月XX日 XX时XX分XX秒</div>
        <div class="enroll-manage-main">
            <div class="enroll-manage-container" ref="container">
                <div class="enroll-manage-container-handle" >
                        <el-input v-model="inputValue" placeholder="请输入要搜索内容" style="width: 20vw"></el-input>

                        <label for="" class="enroll-manage-container-handle-label">设备状态</label>
                        <el-select v-model="valueW" filterable placeholder="请选择" @change="eqstateW">
                            <el-option
                            v-for="item in eqState"
                            :key="item.value"
                            style="width:10vw"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                        <label for="" class="enroll-manage-container-handle-label">是否关联人员</label>
                        <el-select v-model="valueW" filterable placeholder="请选择" @change="haveRelevanceW">
                            <el-option
                            v-for="item in haveRelevance"
                            :key="item.value"
                            style="width:10vw"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                        <label for="" class="enroll-manage-container-handle-label">所属组织</label>
                        <el-select v-model="valueW" filterable placeholder="请选择" @change="changeResultW">
                            <el-option
                            v-for="item in options"
                            :key="item.value"
                            style="width:20vw"
                            :label="item.label"
                            :value="item.value">

                            </el-option>
                        </el-select>
                        <label for="" class="enroll-manage-container-handle-label">是否可用</label>
                        <el-select v-model="valueW" filterable placeholder="请选择" @change="isUseW">
                            <el-option
                            v-for="item in isUse"
                            :key="item.value"
                            style="width:10vw"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                      <el-button type="primary" @click="relevance">关联组织</el-button>
                      <el-button type="danger" @click="deletePlatform" :disabled="this.sels.length===0">批量删除</el-button>

                </div>
                <el-table
                    :data="tables.slice((page-1)*pageSize,page*pageSize)"
                    border stripe highlight-current-row
                    size="mini" v-loading="listLoading"
                    @selection-change="selsChange"
                    class="myTable" ref="table"
                    height="calc(100vh - 320px)"
                    :row-key="getRowKeys">
                     <el-table-column type="selection" width="55" :reserve-selection="true">
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
                   <div></div>
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
                   						:total="tables.length" >
                        </el-pagination>
                   </div>
                 </div>
            </div>
        </div>
        <dialog-equipment ref="equipment"></dialog-equipment>
  </div>
</template>

<script>
  // import WtInput from '../../components/input.vue'
  import NavBar from '@/components/navBar/navBar.vue'
  import DialogEquipment from '@/components/dialogEquipment/dialogEquipment.vue'
  export default{
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
            page:1,
            pageSize:20,
            tableTitle:[
                { title : "设备编号", name : "account", type:"input",width:'100'},
                { title : "设备状态", name : "eqstate", type:"input",width:'100'},
                { title : "是否可用", name : "isUse", type:"input",width:'100'},
                { title : "人员姓名", name : "name", type:"input",minwidth:'100'},
                { title : "所属组织", name : "organization", type:"input",minwidth:'200'},
                { title : "注册时间", name : "time", type:"input",minwidth:'100'},
                { title : "SIM卡号", name : "phone", type:"input",width:'150'}
            ],
            //0正常 1异常
            tableData:[
              {
                account:'001',
                eqstate:1,
                isUse:1,
                name:'张三',
                organization:'南宁总局',
                time:'2020-06-02',
                phone:'18045265325'
              },
              {
                account:'002',
                eqstate:2,
                isUse:2,
                name:'李二',
                organization:'南宁总局',
                time:'2020-06-02',
                phone:'18045265325'
              },
              {
                account:'003',
                eqstate:2,
                isUse:2,
                name:'王五',
                organization:'南宁总局',
                time:'2020-06-02',
                phone:'18045265325'
              }
            ],
            tableAllData: [],
            clientHeight:'',
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
                value: '2',
                label: '否'
              }
            ],
            //所属组织
            options:[
                {
                value: '',
                label: '全部'
                },
                {
                value: '1',
                label: '南宁总局'
                },
                {
                value: '0',
                label: '邕宁分局'
                },
                {
                value: '2',
                label: '青秀分局'
                },
            ],
            valueW:"",
            platformName:'sss',
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
          else if(name=='eqstate')
           return value == 1 ? '在线' : value == 2 ? '离线' : '';
          else if(name=='haveRelevance')
           return value == 1 ? '<span style="color:rgb(112, 182, 3);font-weight:bold">是</span>' :( value == 2 ? '<span style="color:#909399;font-weight:bold">否</span>' : ( value == 3 ? '<span style="color:#67C23A;font-weight:bold">进行中</span>' : ( value == 4 ? '<span style="color:#909399;font-weight:bold">已结束</span>' : '')));
          else if(name == 'isUse')
            return value == 2 ? '<span style="color:#f79898;font-weight:bold">否</span>' :( value == 1 ? '<span style="color:rgb(112, 182, 3);font-weight:bold">是</span>' : '');
          else
           return value;
      },
      handleCurrentChange(val){
         this.page = val;
      },
      handleSizeChange(val){
      	this.pageSize = val
      },
      getEnrollData(){
          this.listLoading=true
          getUserList().then(res=>{
              if(res.code==0){
                  this.listLoading=false
                  //console.log(res)
                  this.tableAllData=res.data.data
                  this.tableData=this.tableAllData
              }else{
                  this.listLoading=false
                 this.$notify({
                      title: '错误',
                      message: res.msg,
                      type: 'error'
                  });
              }
          }).catch(err=>{
              this.listLoading=false
              this.$notify({
                      title: '错误',
                      message: err.msg,
                      type: 'error'
                  });
          })
          //this.tableData = JSON.parse(JSON.stringify(this.tableAllData))
      },
      eqstateW(val){
          //console.log(this.valueW)
          this.tableData = this.tableAllData.filter(item=>{
              return String(item.eqstate).indexOf(val) > -1
          })
      },
      haveRelevanceW(val){
        this.tableData = this.tableAllData.filter(item=>{
            return String(item.haveRelevance).indexOf(val) > -1
        })
      },
      isUseW(val){
        this.tableData = this.tableAllData.filter(item=>{
            return String(item.isUse).indexOf(val) > -1
        })
      },
      changeResultW(val){
        this.tableData = this.tableAllData.filter(item=>{
            return String(item.isUse).indexOf(val) > -1
        })
      },
      //修改
      handleEdit(index,row){
      	this.$refs.userData.setShow(row)
      },
      // 批量选中
      selsChange(sels){
          this.sels = sels
      },
      getRowKeys(row) {
          return row.account;
      },
      relevance(){
        this.$refs.equipment.dialogVisible = true
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
        const h = this.$createElement;
          this.$msgbox({
            title: '警告',
            message: h('p', null, [
              h('span', null, '删除平台'),
            ]),
            showCancelButton: true,
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            beforeClose: (action, instance, done) => {
              if (action === 'confirm') {
                instance.confirmButtonLoading = true;
                instance.confirmButtonText = '删除中...';
                setTimeout(() => {
                  done();
                  setTimeout(() => {
                    instance.confirmButtonLoading = false;
                  }, 300);
                }, 3000);
              } else {
                done();
              }
            }
          }).then(action => {
            this.$message({
              type: 'info',
              message: 'action: ' + action
            });
          });
      },
      // 更新页面
      updateMess(val){
      	this.getEnrollData()
      },
      //将tabledata的值传给tableAllData(到真正对接时就不用)
      getTableAllData(){
        this.tableAllData = this.tableData
      },
    },
    mounted(){
      this.getTableAllData()
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
          return  this.tableData.filter(function(dataNews){
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
  .newTime{
    width: calc(100vw - 80px);
    height: 20px;
    margin: 20px auto 20px;
  }
  .enroll-manage-main {
      width: calc(100vw - 80px);
      height: calc(100vh - 165px);
      box-sizing: border-box;
      box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
      margin: 0 auto;

      .enroll-manage-container{
          padding: 20px;
          background: #fff;
          &-title{
              padding: 2px 0;
              border-left: 4px solid #409EFF;
              text-indent: 20px;
              font-size: 18px;
              font-weight: 700;
          }
          &-handle{
              display: flex;
              margin-bottom: 20px;
              justify-content: space-between;
              align-items: center;
              &-label{
                  font-size: 14px;
                  color: #606266;
                  font-weight: 700;
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
    justify-content: space-between;
    align-items: center;
  }
</style>
