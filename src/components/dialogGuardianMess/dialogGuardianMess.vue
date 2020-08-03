<template>
  <div class="mainSwrap">
    <el-dialog :title="title"  :visible.sync="dialogVisible" center :append-to-body='true' :before-close="handleClose" :lock-scroll="false" :close-on-click-modal="false" width="1000px">
      <!-- <el-scrollbar style="width:100%;height:55vh;"> -->
      <el-table
          :data="tableData.slice((page-1)*pageSize,page*pageSize)"
          border stripe highlight-current-row
          size="mini" v-loading="listLoading"
          class="myTable" ref="table"
          height="50vh"
          :row-key="getRowKeys">
           <!-- <el-table-column type="selection" width="55" :reserve-selection="true">
           </el-table-column> -->
           <el-table-column type="index" width="60" label="序号">
           </el-table-column>
           <el-table-column v-for="(item,index) in tableTitle" :key="index" :prop="item.name" :label="item.title" :width="item.width" :min-width="item.minwidth" :sortable="item.type!='button'&&item.type!='handle'?true:false">
               <template slot-scope="scope">
                   <div v-if="item.type=='handle'">
                     <el-button  type="primary" icon="el-icon-edit" size="small" round @click="stateDetails(scope.$index, scope.row)">状态详情</el-button>
                     <el-button  type="primary" icon="el-icon-edit" size="small" round @click="peopleAndEquiment(scope.$index, scope.row)">人员与设备信息</el-button>
                   </div>
                   <div v-else-if="item.name=='guardianMess'">
                      <el-button  type="primary" icon="el-icon-search" content="查看"  size="small" round @click="handleSearch(scope.$index, scope.row)">查看</el-button>
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
         						:total="tableData.length" >
              </el-pagination>
         </div>
       </div>
       <!-- </el-scrollbar> -->
    </el-dialog>
  </div>
</template>

<script>
  export default{
    components:{

    },
    data(){
      return{
        dialogVisible:false,
        title:'李二的家属信息',
        listLoading:false,
        page:1,
        disableda:true,
        pageSize:20,
        tableTitle:[
          {title:'姓名',name:'name',type:'input',width:'100'},
          {title:'对老人称呼',name:'relation',type:'input',width:'120'},
          {title:'联系号码',name:'ophoneNum',type:'input',width:'150'},
          {title:'身份证号码',name:'IDCardNum',type:'input',width:'200'},
          {title:'家庭住址',name:'homeAddress',type:'input',minwidth:'300'}
        ],
        tableData:[
          {
            name:'王',
            relation:'父子',
            ophoneNum:'15625478569',
            IDCardNum:'110101199003076253',
            homeAddress:'广西南宁市青秀区德利国际'
          },
          {
            name:'王',
            relation:'父子',
            ophoneNum:'15625478569',
            IDCardNum:'110101199003076253',
            homeAddress:'广西南宁市青秀区德利国际'
          },
          {
            name:'王',
            relation:'父子',
            ophoneNum:'15625478569',
            IDCardNum:'110101199003076253',
            homeAddress:'广西南宁市青秀区德利国际'
          },
          {
            name:'王',
            relation:'父子',
            ophoneNum:'15625478569',
            IDCardNum:'110101199003076253',
            homeAddress:'广西南宁市青秀区德利国际'
          },
          {
            name:'王',
            relation:'父子',
            ophoneNum:'15625478569',
            IDCardNum:'110101199003076253',
            homeAddress:'广西南宁市青秀区德利国际'
          },
          {
            name:'王',
            relation:'父子',
            ophoneNum:'15625478569',
            IDCardNum:'110101199003076253',
            homeAddress:'广西南宁市青秀区德利国际'
          },
          {
            name:'王',
            relation:'父子',
            ophoneNum:'15625478569',
            IDCardNum:'110101199003076253',
            homeAddress:'广西南宁市青秀区德利国际'
          },
          {
            name:'王',
            relation:'父子',
            ophoneNum:'15625478569',
            IDCardNum:'110101199003076253',
            homeAddress:'广西南宁市青秀区德利国际'
          },
          {
            name:'王',
            relation:'父子',
            ophoneNum:'15625478569',
            IDCardNum:'110101199003076253',
            homeAddress:'广西南宁市青秀区德利国际'
          },
          {
            name:'王',
            relation:'父子',
            ophoneNum:'15625478569',
            IDCardNum:'110101199003076253',
            homeAddress:'广西南宁市青秀区德利国际'
          },
          {
            name:'王',
            relation:'父子',
            ophoneNum:'15625478569',
            IDCardNum:'110101199003076253',
            homeAddress:'广西南宁市青秀区德利国际'
          },
          {
            name:'王',
            relation:'父子',
            ophoneNum:'15625478569',
            IDCardNum:'110101199003076253',
            homeAddress:'广西南宁市青秀区德利国际'
          }
        ],
        tables:[]
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
           return value == 0 ? '<span style="color:#f79898;font-weight:bold">离线</span>' :( value == 1 ? '<span style="color:rgb(112, 182, 3);font-weight:bold">在线</span>' : '');
          else
           return value;

      },
      handleCurrentChange(val){
         this.page = val;
      },
      handleSizeChange(val){
      	this.pageSize = val
      },
      getRowKeys(row) {
          return row.account;
      },
      handleClose() {
          this.dialogVisible=false
      },
    },
    mounted() {

    }
  }
</script>

<style lang="scss" scoped>

  .foot{
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
</style>
