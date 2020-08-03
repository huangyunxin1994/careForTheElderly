<template>
  <div>
    <nav-bar></nav-bar>
    <div class="main">
      <div class="mainLeft">
        <!-- <el-scrollbar class="dashboard-scrollbar"> -->
          <tree></tree>
        <!-- </el-scrollbar> -->
      </div>
      <div class="mainRight">
                <div class="enroll-manage-container" ref="container">
                    <div class="enroll-manage-container-handle" >
                            <el-input v-model="inputValue" placeholder="请输入要搜索内容" style="width: 20vw"></el-input>
                            <div>
                              <label for="" class="enroll-manage-container-handle-label">活动状态</label>
                              <el-select v-model="valueW" filterable placeholder="请选择" @change="changeResult" class="seclect"  style="width:10vw">
                                  <el-option
                                  v-for="item in activeOptions"
                                  :key="item.value"
                                  :label="item.label"
                                 
                                  :value="item.value">
                                  </el-option>
                              </el-select>
                            </div>
                            <div>
                              <label for="" class="enroll-manage-container-handle-label">设备状态</label>
                              <el-select v-model="valueW" filterable placeholder="请选择" @change="changeResultW" class="seclect"  style="width:10vw">
                                  <el-option
                                  v-for="item in equipmentOptions"
                                  :key="item.value"
                                  :label="item.label"
                                 
                                  :value="item.value">
                                  </el-option>
                              </el-select>
                            </div>
                    </div>
                    <el-table
                        :data="tables.slice((page-1)*pageSize,page*pageSize)"
                        border stripe highlight-current-row
                        size="mini" v-loading="listLoading"
                        class="myTable" ref="table"
                        height="calc(100% - 110px)"
                        :row-key="getRowKeys">
                         <!-- <el-table-column type="selection" width="55" :reserve-selection="true">
                         </el-table-column> -->
                         <el-table-column type="index" width="60" label="序号">
                         </el-table-column>
                         <el-table-column v-for="(item,index) in tableTitle" :key="index" :prop="item.name" :label="item.title" :width="item.width" :min-width="item.minwidth" :sortable="item.type!='button'&&item.type!='handle'?true:false">
                             <template slot-scope="scope">
                                 <el-link type="primary" v-if="item.type=='link'" @click="userDetails(scope.$index, scope.row)" v-html="arrFormatter(scope.row[item.name],item.name)"></el-link>
                                 <div v-else-if="item.type=='handle'">
                                   <el-button  type="primary" icon="el-icon-search" content="查看"  size="small" round @click="handleSearch(scope.$index, scope.row)">监护人</el-button>
                                   <!-- <el-button  type="primary" icon="el-icon-edit" size="small" round @click="stateDetails(scope.$index, scope.row)">状态详情</el-button> -->
                                   <el-button  type="primary" icon="el-icon-search" size="small" round @click="peopleAndEquiment(scope.$index, scope.row)">人员与设备信息</el-button>
                                 </div>
                                 <div v-else-if="item.name=='guardianMess'">

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
                       						:total="tables.length" >
                            </el-pagination>
                       </div>
                     </div>
            </div>
      </div>
    </div>
    <guardian-mess ref='guardianMess'></guardian-mess>
    <dialog-people-mess ref='peopleMess'></dialog-people-mess>
  </div>
</template>

<script>
  import NavBar from '@/components/navBar/navBar.vue'
  import Tree from '@/components/tree/tree_.vue'
  import GuardianMess from '@/components/dialogGuardianMess/dialogGuardianMess.vue'
  import DialogPeopleMess from '@/components/dialogPeopleMess/dialogPeopleMess.vue'
  export default{
    components:{
      NavBar,
      Tree,
      GuardianMess,
      DialogPeopleMess
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
            { title : "姓名", name : "name", type:"link",width:"120"},
            { title : "活动状态", name : "activeState", type:"input",width:'120'},
            { title : "设备状态", name : "equState", type:"input",width:'120'},
            { title : "所属组织", name : "belongPlatform", type:"input",minwidth:'300'},
            { title : "设备编号", name : "equAccount", type:"input",minwidth:'200'},
            // { title : "监护人信息",type : "input", name:"guardianMess",button:[],width:'120'},
            { title : "操作", type : "handle",button:[],width:'255'}
        ],
        tableData:[
          {
            name:'王',
            activeState:'正常',
            equState:1,
            belongPlatform:'南宁总局',
            equAccount:'001',
          },
          {
            name:'李',
            activeState:'异常',
            equState:1,
            belongPlatform:'南宁总局',
            equAccount:'002',
          },
          {
            name:'李',
            activeState:'异常',
            equState:1,
            belongPlatform:'南宁总局',
            equAccount:'003',
          },
          {
            name:'李',
            activeState:'异常',
            equState:0,
            belongPlatform:'南宁总局',
            equAccount:'004',
          },
          {
            name:'李',
            activeState:'正常',
            equState:2,
            belongPlatform:'南宁总局',
            equAccount:'005',
          },
          {
            name:'李',
            activeState:'异常',
            equState:1,
            belongPlatform:'南宁总局',
            equAccount:'006',
          },
          {
            name:'李',
            activeState:'正常',
            equState:1,
            belongPlatform:'南宁总局',
            equAccount:'007',
          },
          {
            name:'李',
            activeState:'异常',
            equState:0,
            belongPlatform:'南宁总局',
            equAccount:'008',
          },
          {
            name:'李',
            activeState:'正常',
            equState:2,
            belongPlatform:'南宁总局',
            equAccount:'009',
          },
          {
            name:'李',
            activeState:'正常',
            equState:1,
            belongPlatform:'南宁总局',
            equAccount:'010',
          },
          {
            name:'李',
            activeState:'正常',
            equState:1,
            belongPlatform:'南宁总局',
            equAccount:'011',
          },
          {
            name:'李',
            activeState:'正常',
            equState:0,
            belongPlatform:'南宁总局',
            equAccount:'012',
          },
          {
            name:'李',
            activeState:'正常',
            equState:1,
            belongPlatform:'南宁总局',
            equAccount:'013',
          },
          {
            name:'李',
            activeState:'正常',
            equState:2,
            belongPlatform:'南宁总局',
            equAccount:'014',
          },
          {
            name:'李',
            activeState:'正常',
            equState:1,
            belongPlatform:'南宁总局',
            equAccount:'015',
          },
          {
            name:'李',
            activeState:'正常',
            equState:1,
            belongPlatform:'南宁总局',
            equAccount:'016',
          },
          {
            name:'李',
            activeState:'正常',
            equState:1,
            belongPlatform:'南宁总局',
            equAccount:'017',
          },
          {
            name:'李',
            activeState:'正常',
            equState:1,
            belongPlatform:'南宁总局',
            equAccount:'018',
          },
          {
            name:'李',
            activeState:'正常',
            equState:1,
            belongPlatform:'南宁总局',
            equAccount:'019',
          },
          {
            name:'李',
            activeState:'正常',
            equState:1,
            belongPlatform:'南宁总局',
            equAccount:'020',
          },
          {
            name:'李',
            activeState:'正常',
            equState:1,
            belongPlatform:'南宁总局',
            equAccount:'021',
          },
          {
            name:'李',
            activeState:'正常',
            equState:1,
            belongPlatform:'南宁总局',
            equAccount:'022',
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
              label: '异常'
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
                if(column.property=="sex")
                return row.sex == 1 ? '男' : row.sex == 0 ? '女' : '';
                else
                return row[column.property]
      },
      arrFormatter (value,name) {
          if(name=='name')
            return '<span style="color:#409EFF;font-weight:bold">'+value+'</span>';
          else if(name=='sex')
           return value == 1 ? '男' : value == 0 ? '女' : '';
          else if(name=='multiplexMark')
           return value == 1 ? '是' : value == 0 ? '否' : '';
          else if(name=='activeState')
           return value == '正常' ? '<span style="color:rgb(112, 182, 3)">正常</span>' :'<span style="color:#e6a23c">异常</span>';
          else if(name=='equState')
           return value == 0 ? '<span style="color:#909399">离线</span>' :( value == 1 ? '<span style="color:rgb(112, 182, 3)">在线</span>' : ( value == 2 ? '<span style="color:#e6a23c">低电量</span>' : '' ));
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
      //查看监护人信息
      handleSearch(index,val){
        this.$refs.guardianMess.dialogVisible = true
      },
      //人员与设备信息
      peopleAndEquiment(index,val){
        this.$refs.peopleMess.dialogVisible = true
      },
      userDetails(){
        this.$router.push(
        {
            path: '/peopleDetails'
            // query: {
            //   id: val.keyUserid,
            //   type:'2'
            // }
        })
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
      height: calc(100vh - 125px);
      box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
      box-sizing: border-box;
      padding: 0.5vw;
      margin-right: 20px;
      overflow: hidden;

      .dashboard-scrollbar{
        height: 85vh;
      }
    }
    .mainRight{
      height: calc(100vh - 125px);
      width: calc(100vw - 260px);
      box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
      box-sizing: border-box;

        .enroll-manage-container{
            box-sizing: border-box;
            padding: 20px;
            height: 100%;
            box-shadow: border-box;
            background: #fff;
            &-handle{
                display: flex;
                margin-bottom: 20px;
                justify-content: flex-start;
                align-items: center;
                &-label{
                  margin-left: 20px;
                    font-size: 0.8vw;
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
     }
     .foot{
       margin-top: 20px;
       display: flex;
       justify-content: flex-end;
       align-items: center;
     }
  }
</style>
