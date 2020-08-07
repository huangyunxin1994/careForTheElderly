<template>
  <div>
    <div class="main">
      <div class="mainRight">
        <el-scrollbar>
            <div class="enroll-manage-main">
                <div class="enroll-manage-container" ref="container">
                    <div class="enroll-manage-container-handle" >
                        <div class="selectItem">
                            <el-input v-model="inputValue" placeholder="请输入要搜索内容" style="width: 20vw;"></el-input>
                        </div>
                        <div class="selectItem">
                            <label for="" class="enroll-manage-container-handle-label">处理状态</label>
                            <el-select v-model="valueW" filterable placeholder="请选择" @change="changeResult">
                                <el-option
                                v-for="item in activeOptions"
                                :key="item.value"
                                :label="item.label"
                                class="seclect"
                                style="width: 20vw;"
                                :value="item.value">
                                </el-option>
                            </el-select>
                        </div>
                        <div class="selectItem">
                          <label for="" class="enroll-manage-container-handle-label">预警时间</label>
                          <el-date-picker
                            v-model="time"
                            type="daterange"
                            class="seclectTime"
                            style="width:10vw"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期">
                          </el-date-picker>
                        </div>
                        <div class="selectItem">
                            <label for="" class="enroll-manage-container-handle-label">预警类型</label>
                            <el-select v-model="valueW" filterable placeholder="请选择" @change="changeResult">
                                <el-option
                                v-for="item in activeOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                                </el-option>
                            </el-select>
                        </div>
                        <!-- <div>
                          <el-button  type="primary" @click="handleSearch" :disabled="this.sels.length===0">忽略</el-button>
                          <el-button  type="primary" @click="peopleAndEquiment" :disabled="this.sels.length===0">填写处理结果</el-button>
                        </div> -->
                    </div>
                    <el-table
                        :data="tables.slice((page-1)*pageSize,page*pageSize)"
                        border stripe highlight-current-row
                        size="mini" v-loading="listLoading"
                        class="myTable" ref="table"
                        height="calc(100vh - 220px)"
                        :row-key="getRowKeys">
                         <!-- <el-table-column type="selection" width="55" :reserve-selection="true">
                         </el-table-column> -->
                         <el-table-column type="index" width="60" label="序号">
                         </el-table-column>
                         <el-table-column v-for="(item,index) in tableTitle" :key="index" :prop="item.name" :label="item.title" :width="item.width" :min-width="item.minwidth" :sortable="item.type!='button'&&item.type!='handle'?true:false" show-overflow-tooltip>
                             <template slot-scope="scope">
                                 <el-link type="primary" v-if="item.type=='link'" @click="userDetails(scope.$index, scope.row)" v-html="arrFormatter(scope.row[item.name],item.name)"></el-link>
                                 <div v-else-if="item.type=='handle'" align="center">
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
        </el-scrollbar>
      </div>
    </div>
    <dialog-handle-result ref='DialogHandleResult'></dialog-handle-result>
  </div>
</template>

<script>
  import DialogHandleResult from '@/components/dialogHandleResult/dialogHandleResult.vue'
  export default{
    components:{
      DialogHandleResult
    },
    data(){
      return{
        equipmentSearch:'',
        listLoading:false,
        asels:"",//用来存放选中的值
        inputValue:"",
        page:1,
        sels:[],
        disableda:true,
        pageSize:20,
        time:'',
        tableTitle:[
            { title : "姓名", name : "name", type:"link",width:"120"},
            { title : "预警类型", name : "activeState", type:"input",width:"150"},
            { title : "详情", name : "warnDetails", type:"input",minwidth:'150'},
            { title : "所属组织", name : "belongPlatform", type:"input",minwidth:'150'},
            { title : "预警时间", name : "warnTime", type:"input",width:"150"},
            { title : "处理状态", name : "handleState", type:"input",width:"100"},
            { title : "处理时间", name : "handleTime", type:"input",width:"150"},
            { title : "处理人", name : "handleName", type:"input",width:"150"},
            // { title : "监护人信息",type : "input", name:"guardianMess",button:[],width:'120'},
        ],
        tableData:[
          {
            account:'001',
            name:'王',
            activeState:'1',
            equState:1,
            warnDetails:'心率过快',
            belongPlatform:'南宁总局',
            warnTime:'2020-06-02',
            handleState:'1',
            handleTime:'2020-08-12',
            handleName:'赵二',
          },
          {
            account:'002',
            name:'王',
            activeState:'2',
            equState:1,
            warnDetails:'血压低',
            belongPlatform:'南宁总局',
            warnTime:'2020-06-02',
            handleState:'2',
            handleTime:'2020-08-12',
            handleName:'赵二',
          },
          {
            account:'003',
            name:'王',
            activeState:'3',
            equState:1,
            warnDetails:'',
            belongPlatform:'南宁总局',
            warnTime:'2020-06-02',
            handleState:'1',
            handleTime:'2020-08-12',
            handleName:'赵二',
          },
          {
            account:'004',
            name:'王',
            activeState:'4',
            equState:1,
            warnDetails:'',
            belongPlatform:'南宁总局',
            warnTime:'2020-06-02',
            handleState:'1',
            handleTime:'2020-08-12',
            handleName:'赵二',
          },
          {
            account:'005',
            name:'王',
            activeState:'2',
            equState:1,
            warnDetails:'血压低',
            belongPlatform:'南宁总局',
            warnTime:'2020-06-02',
            handleState:'2',
            handleTime:'2020-08-12',
            handleName:'赵二',
          },
          {
            account:'006',
            name:'王',
            activeState:'2',
            equState:1,
            warnDetails:'血压高',
            belongPlatform:'南宁总局',
            warnTime:'2020-06-02',
            handleState:'2',
            handleTime:'2020-08-12',
            handleName:'赵二',
          },
          {
            account:'007',
            name:'王',
            activeState:'3',
            equState:1,
            warnDetails:'',
            belongPlatform:'南宁总局',
            warnTime:'2020-06-02',
            handleState:'1',
            handleTime:'2020-08-12',
            handleName:'赵二',
          },
          {
            account:'008',
            name:'王',
            activeState:'4',
            equState:1,
            warnDetails:'',
            belongPlatform:'南宁总局',
            warnTime:'2020-06-02',
            handleState:'2',
            handleTime:'2020-08-12',
            handleName:'赵二',
          },
          {
            account:'009',
            name:'王',
            activeState:'1',
            equState:1,
            warnDetails:'心率过高',
            belongPlatform:'南宁总局',
            warnTime:'2020-06-02',
            handleState:'2',
            handleTime:'2020-08-12',
            handleName:'赵二',
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
              label: '已处理'
            },
            {
              value: '0',
              label: '未处理'
            },
            {
              value: '2',
              label: '已忽略'
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
          if(name == 'name'){
           return '<span style="color:#409EFF;font-weight:bold">'+value+'</span>';
          }
          else if(name=='sex')
           return value == 1 ? '男' : value == 0 ? '女' : '';
          else if(name=='multiplexMark')
           return value == 1 ? '是' : value == 0 ? '否' : '';
          else if(name=='handleState')
           return value == 1 ? '<span style="color:rgb(112, 182, 3);font-weight:bold">已处理</span>' :( value == 2 ? '<span style="color:#f79898;font-weight:bold">未处理</span>' : '');
          else if(name=='activeState')
           return value == 1 ? '<span style="color:#606266;">心率异常</span>' :( value == 2 ? '<span style="color:#606266;">血压异常</span>' : ( value == 3 ? '<span style="color:#606266;">离家异常</span>' : ( value == 4 ? '<span style="color:#606266;">SOS</span>' : '' ) ));
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
      // 批量选中
      selsChange(sels){
          this.sels = sels
      },
      getRowKeys(row) {
          return row.account;
      },
      //忽略
      handleSearch(index,val){
        // this.$refs.guardianMess.dialogVisible = true
        this.$confirm('是否忽略本次预警?', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(() => {
                  this.$message({
                    type: 'success',
                    message: '忽略成功!'
                  });
                }).catch(() => {
                  this.$message({
                    type: 'info',
                    message: '已取消忽略'
                  });
                });
      },
      //填写处理结果
      peopleAndEquiment(index,val){

        this.$refs.DialogHandleResult.dialogHandleResult = true
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
 /* /deep/.el-table th > .cell {
  	  text-align: center;
  	}
  	/deep/.el-table .cell {
  	  text-align: center;
  	} */
    /deep/.el-table--mini td{
      padding: 0px;
    }
  .main{
    .mainRight{
      box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);

        .enroll-manage-container{
            min-height: calc(88% - 119px);
            padding: 20px;
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
                justify-content: flex-start;
                align-items: center;
                &-label{
                   margin-left: 20px;
                    font-size: 0.8vw;
                    color: #606266;
                    font-weight: 700;
                }
                .selectItem{
                  /* margin-bottom: 20px; */
                  display: flex;
                  align-items: center;
                  justify-content: flex-start;
                }
                .seclect{
                  width: 20vw;
                  max-width: 150px;
                }
                .seclectTime{
                  width: 20vw;
                  max-width: 300px;
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
       justify-content: space-between;
       align-items: center;
     }
  }
</style>
