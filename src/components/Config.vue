<template>
    <div id="table">
      <el-button type="primary" plain @click.native="openFormDialog">新增</el-button>
      <el-button type="primary" plain @click.native="deleteSelected">删除</el-button>
      <el-button type="primary" plain @click.native="openEditDialog">修改</el-button>
      <el-table
        :data="numberTypeList"
        highlight-current-row
        @current-change="handleCurrentChange"
        height="100%"
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
      <el-dialog :visible.sync="formDialogVisible" title="表单填写">
        <el-form :model="newNumberType">
          <el-form-item label="序号">
            <el-input v-model="newNumberType.number"></el-input>
          </el-form-item>
          <el-form-item label="名称">
            <el-input v-model="newNumberType.name"></el-input>
          </el-form-item>
        </el-form>
        <span class="dialog-footer">
          <el-button @click="formDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="addNumberType">确定</el-button>
        </span>
      </el-dialog>
    </div>
</template>

<style>
#table{
  height: 100vh;
}
</style>

<script>
export default {
  data() {
    return {
      numberTypeList: [],
      formDialogVisible: false,
      newNumberType:{
        number:'',
        name:'',
      },
      currentRow: null, // 新增：当前选中行数据
    }
  }, computed: {},
  methods: {
    openEditDialog() {
      if (!this.currentRow) {
        this.$message.warning('请先选择要修改的数据');
        return;
      }
      this.isEdit = true;
      this.newNumberType = {...this.currentRow};
      this.formDialogVisible = true;
    },
    async deleteSelected() {
      if (!this.currentRow) return;
      try {
        await this.$db.deleteNumberTypeById(this.currentRow.id); // 假设id是表的主键
        this.$message.success('删除成功');
        await this.getNumberTypeList(); // 刷新数据
        this.currentRow = null; // 清除选中状态
        window.location.reload(); // 强制刷新当前页面
      } catch (error) {
        this.$message.error(`删除失败：${error.message}`);
      }
    },
    handleCurrentChange(row) {
      this.currentRow = row; // 选中行数据赋值给 currentRow
    },
    openFormDialog(){
      this.formDialogVisible = true
    },
    async getNumberTypeList() {
      try {
        this.$db.selectNumberTypeList(null).then((res) => {
          this.numberTypeList = res
        })
      } catch (error) {
        this.$message.error('数据查询失败' + error);
      }
    }, async addNumberType() {
      try {
        const response = this.$http.post('http://localhost:8080/metalPlate/save', data);
        console.log(response)
        this.$message.success('数据添加成功');
        await this.getNumberTypeList();
      } catch (error) {
        this.$message.error('数据添加失败' + error);
      }
      this.formDialogVisible = false;
      window.location.reload(); // 强制刷新当前页面
    }
  },
    created() {
    this.getNumberTypeList();
  }
}
</script>
