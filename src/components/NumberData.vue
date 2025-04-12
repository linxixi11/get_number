<template>
  <div id="table">
    <el-table
      :data="numberDataList"
      highlight-current-row
      height="100%"
      border
      style="width: 100%"
      ref="singleTable"
      >
      <el-table-column
        prop="serialNumber"
        label="图号"
        width="180">
      </el-table-column>
      <el-table-column
        prop="name"
        label="中文"
        width="180">
      </el-table-column>
      <el-table-column
        label="全名称"
        width="180">
        <template slot-scope="scope">
          {{ getRowDisplaySerial(scope.row) }}
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<style>
#table{
  height: 100vh;
}
</style>

<script>
export default {
  props: ['number'], // 接收父组件传递的 typeId
  data() {
    return {
      numberDataList: [],
    }
  }, computed: {
  },
  methods: {
    getRowDisplaySerial(row) {
      const { name, corp, type, serialNumber, router } = row;
      return router === '0'
        ? `${name || ''}${corp || ''}${type || ''}${serialNumber || ''}`
        : `${corp || ''}${type || ''}${serialNumber || ''}${name || ''}`;
    },async selectNumberDataList(){
      try{
        let query = {
          type:this.number,
        }
        console.log(query)
        this.numberDataList = await this.$db.selectNumberDataList(query)
      }catch (error){
        this.$message.error('数据查询失败' + error);
      }
    }
  },
  created() {
    this.selectNumberDataList();
  }
}
</script>
