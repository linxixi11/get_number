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
      fetch('/api/numberType/list', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
      }).then((response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json(); // 返回解析 Promise
      })).then(data => {
        console.log('接口返回数据:', data);
        this.numberTypeList = data; // 在下一个 then 中处理数据
      })
        .catch(error => {
          console.error('获取数据失败:', error);
        });
    }
  }, created() {
    this.getNumberTypeList();
  }
}
</script>
