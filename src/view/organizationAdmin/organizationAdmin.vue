<template>
  <div>
    <nav-bar></nav-bar>
    <div class="main">
      <div class="mainLeft">
        <tree @newOrganization="newOrganization" @adminOrganization="adminOrganization" :organization="true"></tree>
      </div>
      <div class="mainRight">
        <el-scrollbar>
            <div class="enroll-manage-main">
                <div class="enroll-manage-container" ref="container">
                    <div class="enroll-manage-container-handle" >
                        <el-input v-model="inputValue" placeholder="请输入要搜索内容" style="width: 20vw"></el-input>
                        <div class="btnWrap selectItem">
                          <el-button type="primary"  class="btn" @click="newUser">新建用户</el-button>
                        </div>
                    </div>
                    <el-table
                        :data="tables.slice((page-1)*pageSize,page*pageSize)"
                        border stripe highlight-current-row
                        size="mini" v-loading="listLoading"
                        class="myTable" ref="table"
                        height="calc(100vh - 260px)"
                        :row-key="getRowKeys">
                         <!-- <el-table-column type="selection" width="55" :reserve-selection="true">
                         </el-table-column> -->
                         <el-table-column type="index" width="60" label="序号">
                         </el-table-column>
                         <el-table-column v-for="(item,index) in tableTitle" :key="index" :prop="item.name" :label="item.title" :width="item.width" :min-width="item.minwidth" :sortable="item.type!='button'&&item.type!='handle'?true:false">
                             <template slot-scope="scope">
                                 <el-link type="primary" v-if="item.type=='link'" @click="userDetails(scope.$index, scope.row)" v-html="arrFormatter(scope.row[item.name],item.name)"></el-link>
                                 <div v-else-if="item.type=='handle' && scope.row['identity'] ==1" align="center">
                                   <el-tooltip content="修改密码" placement="top">
                                      <el-button circle type="primary" icon="el-icon-edit" size="small" @click="changePass(scope.$index, scope.row)"></el-button>
                                   </el-tooltip>
                                 </div>
                                 <div v-else-if="item.type=='handle' && scope.row['identity'] ==2" align="center">
                                   <el-tooltip content="编辑" placement="top">
                                     <el-button circle type="primary" icon="el-icon-edit"   size="small"  @click="adminMess(scope.$index, scope.row)"></el-button>
                                   </el-tooltip>
                                 </div>
                                 <p v-else :formatter="formatSex" v-html="arrFormatter(scope.row[item.name],item.name)"></p>
                             </template>
                         </el-table-column>

                     </el-table>
                     <div class="foot">
                       <!-- <el-button type="danger"  :disabled="this.asels.length===0">批量删除</el-button> -->
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
                    <!-- <el-button type="danger" @click="deleteFileOrDirectory" :disabled="this.asels.length===0">批量删除</el-button> -->
                    <!-- <user-edit ref="userData" @updateMess = "updateMess"></user-edit> -->
                </div>
            </div>
        </el-scrollbar>
      </div>
    </div>
    <dialog-organization ref='organization' ></dialog-organization>
    <dialog-change-pass ref="changePass"></dialog-change-pass>
    <editedit-mess ref="editeditMess"></editedit-mess>
  </div>
</template>

<script>
  import NavBar from '@/components/navBar/navBar.vue'
  import Tree from '@/components/tree/tree_.vue'
  import GuardianMess from '@/components/dialogGuardianMess/dialogGuardianMess.vue'
  import DialogOrganization from '@/components/dialogOrganizationAdmin/organizationAdmin.vue'
  import DialogChangePass from '@/components/dialogOrganizationAdmin/changePass.vue'
  import EditeditMess from '@/components/dialogOrganizationAdmin/editeditMess.vue'
  export default{
    components:{
      NavBar,
      Tree,
      GuardianMess,
      DialogOrganization,
      DialogChangePass,
      EditeditMess
    },
    data(){
      return{
        equipmentSearch:'',
        listLoading:false,
        asels:"",//用来存放选中的值
        inputValue:"",
        page:1,
        disableda:true,
        pageSize:20,
        tableTitle:[
            { title : "账号", name : "account", type:"input",width:"200"},
            { title : "用户名", name : "name", type:"input",width:"200"},
            { title : "所属组织", name : "belongPlatform", type:"input"},
            { title : "操作", type : "handle",button:[],width:'100'}
        ],
        tableData:[
          {
            account:'123456',
            name:'admin',
            belongPlatform:'广西总局',
            identity:1,
          },
          {
            account:'123457',
            name:'王',
            belongPlatform:'南宁总局',
            identity:1,
          },
          {
            account:'123458',
            name:'王',
            belongPlatform:'南宁总局',
            identity:2,
          },
          {
            account:'123459',
            name:'王',
            belongPlatform:'南宁总局',
            identity:2,
          },
          {
            account:'1234510',
            name:'王',
            belongPlatform:'南宁总局',
            identity:2,
          },
          {
            account:'1234511',
            name:'王',
            belongPlatform:'南宁总局',
            identity:2,
          },
          {
            account:'1234512',
            name:'王',
            belongPlatform:'南宁总局',
            identity:2,
          },
          {
            account:'1234513',
            name:'王',
            belongPlatform:'南宁总局',
            identity:2,
          },
          {
            account:'1234514',
            name:'王',
            belongPlatform:'南宁总局',
            identity:1,
          },
          {
             account:'1234515',
             name:'王',
             belongPlatform:'南宁总局',
             identity:2,
          },
          {
            account:'1234516',
            name:'王',
            belongPlatform:'南宁总局',
            identity:2,
          },
          {
            account:'11',
            name:'王',
            belongPlatform:'南宁总局',
            identity:2,
          },
          {
            account:'10',
            name:'王',
            belongPlatform:'南宁总局',
            identity:2,
          },
          {
            account:'9',
            name:'王',
            belongPlatform:'南宁总局',
            identity:2,
          },
          {
            account:'8',
            name:'王',
            belongPlatform:'南宁总局',
            identity:2,
          },
          {
            account:'7',
            name:'王',
            belongPlatform:'南宁总局',
            identity:2,
          },
          {
            account:'6',
            name:'王',
            belongPlatform:'南宁总局',
            identity:2,
          },
          {
            account:'5',
            name:'王',
            belongPlatform:'南宁总局',
            identity:2,
          },
          {
            account:'4',
            name:'王',
            belongPlatform:'南宁总局',
            identity:2,
          },
          {
            account:'3',
            name:'王',
            belongPlatform:'南宁总局',
            identity:2,
          },
          {
            account:'2',
            name:'王',
            belongPlatform:'南宁总局',
            identity:2,
          },
          {
            account:'1',
            name:'王',
            belongPlatform:'南宁总局',
            identity:2,
          }
        ],
        tableAllData: [],
        clientHeight:'',
        activeOptions:[
            {
              value: '',
              label: '全部'
            },
            {
              value: '1',
              label: '正常'
            },
            {
              value: '0',
              label: '预警'
            },
        ],
        equipmentOptions:[
          {
            value: '',
            label: '全部'
          },
          {
            value: '1',
            label: '在线'
          },
          {
            value: '0',
            label: '离线'
          },
          {
            value: '2',
            label: '低电量'
          },
        ],
        valueW:"",
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
          else if(name=='multiplexMark')
           return value == 1 ? '是' : value == 0 ? '否' : '';
          else if(name=='isEnable')
           return value == 1 ? '<span style="color:rgb(112, 182, 3);font-weight:bold">是</span>' :( value == 2 ? '<span style="color:#909399;font-weight:bold">否</span>' : ( value == 3 ? '<span style="color:#67C23A;font-weight:bold">进行中</span>' : ( value == 4 ? '<span style="color:#909399;font-weight:bold">已结束</span>' : '')));
          else if(name=='equState')
           return value == 0 ? '<span style="color:#f79898;font-weight:bold">离线</span>' :( value == 1 ? '<span style="color:rgb(112, 182, 3);font-weight:bold">在线</span>' : ( value == 2 ? '<span style="color:#e6a23c;font-weight:bold">低电量</span>' : '' ));
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
      changeResultW(val){
          this.tableData = this.tableAllData.filter(item=>{
              return String(item.equState).indexOf(val) > -1
          })
      },
      changeResult(val){
        this.tableData = this.tableAllData.filter(item=>{
            return String(item.activeState).indexOf(val) > -1
        })
      },
      // 更新页面
      updateMess(val){
      	this.getEnrollData()
      },
      getRowKeys(row) {
          return row.account;
      },
      //新建组织
      newOrganization(val){
        this.$refs.organization.dialogVisible = true
        this.$refs.organization.addBtn = true
        this.$refs.organization.removeBtn = false
      },
      //编辑组织
      adminOrganization(val){
        this.$refs.organization.dialogVisible = true
        this.$refs.organization.addBtn = true
        this.$refs.organization.removeBtn = true
      },
      // 新建用户
      newUser(){
        this.$refs.editeditMess.dialogVisible = true
        this.$refs.editeditMess.superiorOrg = true
        this.$refs.editeditMess.removeBtn = false
      },
      //编辑用户
      adminMess(){
        this.$refs.editeditMess.dialogVisible = true
        this.$refs.editeditMess.superiorOrg = false
        this.$refs.editeditMess.removeBtn = true
      },
      //修改密码
      changePass(){
        this.$refs.changePass.dialogVisible = true
      },
      //将tabledata的值传给tableAllData(到真正对接时就不用)
      getTableAllData(){
        this.tableAllData = this.tableData
      }
    },
    mounted() {
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

<style lang='scss' scoped>
  /deep/.el-table--mini td{
    padding: 0px;
  }
  .main{
    display: flex;
    align-items: flex-start;
    margin: 20px;
    .mainLeft{
      width: 200px;
      min-width: 200px;
      height: calc(100vh - 105px);
      box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
      box-sizing: border-box;
      padding: 0.5vw;
      margin-right: 20px;
      overflow: hidden;
    }
    .mainRight{
      width: calc(100vw - 260px);
      min-height: calc(100vh - 125px);
      box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
      box-sizing: border-box;

        .enroll-manage-container{
            min-height: calc(88% - 119px);
            padding: 20px;
            /* margin-bottom: 2%; */
            background: #fff;
            &-title{
                margin-bottom: 20px;
                padding: 2px 0;
                border-left: 4px solid #409EFF;
                text-indent: 20px;
                font-size: 18px;
                font-weight: 700;
            }
            &-handle{
                margin-bottom:20px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                &-label{
                    font-size: 14px;
                    color: #606266;
                    font-weight: 700;
                }
                .seclect{
                  width: 20vw;
                  max-width: 150px;
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
     }
     .foot{
       margin-top: 20px;
       display: flex;
       justify-content: flex-end;
       align-items: center;
     }
  }
</style>
