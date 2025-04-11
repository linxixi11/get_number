<template>
  <el-table
    :data="numberTypeList"
    highlight-current-row
    @current-change="handleCurrentChange"
    height="250"
    border
    style="width: 100%"
    ref="singleTable"
    @row-click="setCurrent">
    <el-table-column
      prop="number"
      label="序号"
      width="180">
    </el-table-column>
    <el-table-column
      prop="name"
      label="名称">
    </el-table-column>
  </el-table>
</template>

<script>
export default {
  data() {
    return {
      numberTypeList: []
    }
  }, computed: {}, methods: {
    setCurrent(row) {
      this.$refs.singleTable.setCurrentRow(row);
    },
    handleCurrentChange(val) {
      this.currentRow = val;
    }, getNumberTypeList() {
        this.$db.selectNumberTypeList(null).then((res,error)=>{
            this.numberTypeList = res
        }).catch((error)=>{
          this.$message.error('数据查询失败'+error);
        })
      }
  }, created() {
    this.getNumberTypeList();
  }
}
</script>
