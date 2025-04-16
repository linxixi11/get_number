<template>
  <div id="table">
    <el-button type="primary" plain @click.native="openFormDialog">新增</el-button>
    <el-button type="primary" plain @click.native="deleteSelected">删除</el-button>
    <el-button type="primary" plain @click.native="openEditDialog">修改</el-button>


    <el-table
      :data="numberTypeList"
      highlight-current-row
      @current-change="handleTableCurrentChange" 
      height="100%"
      border
      style="width: 100%"
      ref="singleTable"
      >
      <el-table-column
        prop="number"
        label="序号"
        width="180">
      </el-table-column>
      <el-table-column
        prop="name"
        label="名称">
      </el-table-column>
      <!-- 新增：如果需要显示创建时间，可添加此列 -->
      <el-table-column
          prop="created"
          label="创建时间"
          width="200">
        </el-table-column>
    </el-table>
    
    <!-- 分页组件 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentPageChange"
      :current-page="page.currPage"
      :page-sizes="[10, 20, 30, 50]"
      :page-size="page.size"
      layout="total, sizes, prev, pager, next, jumper"
      :total="page.totalCount"
    ></el-pagination>

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
        <el-button type="primary" @click="save">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<style>
#table{
height: 80vh;
}
</style>

<script>
export default {
data() {
  return {
    numberTypeList: [],
    formDialogVisible: false,
    newNumberType: {
      id: null,
      number: '',
      name: ''
    },
    currentRow: null,  // 新增：专门存储选中的行数据
    page: {
      currPage: 1,
      size: 10,
      total: 0
    }
  }
},
methods: {
  // 打开编辑对话框（修复：检查currentRow而非page.currPage）
  openEditDialog() {
    if (!this.currentRow) {
      this.$message.warning('请先选择要修改的数据');
      return;
    }
    this.newNumberType = { ...this.currentRow };
    this.formDialogVisible = true;
    this.save()
  },

  // 删除选中数据（修复：使用currentRow）
  async deleteSelected() {
    if (!this.currentRow) return;
    try {
      const response = await this.$http.post('/api/number/type/delete',this.currentRow)
      if (response && response.data.code === 0) {
        this.$message.success('删除成功');
        this.currentRow = null;
        await this.getNumberTypeList();
      }
    } catch (error) {
      this.$message.error(`删除失败：${error.message}`);
    }
  },

  // 表格行选中事件（修复：更新currentRow而非page.currPage）
  handleTableCurrentChange(row) {
    this.currentRow = row; 
  },

  openFormDialog() {
    this.formDialogVisible = true
  },

  // 获取带分页的列表数据（修复：响应解析和参数问题）
  async getNumberTypeList() {
    try {
      // 构造分页参数（假设后端参数为currPage和pageSize）
      const params = {
        currPage: this.page.currPage,
        pageSize: this.page.size
      };

      const response = await this.$http.post('/api/number/type/list', params);
      
      // 修复：使用response.data获取数据，避免未定义的data变量
      if (response.data && response.data.code === 0) {
        const { currPage, pageSize, totalCount, totalPage, list } = response.data.page;
        this.page.currPage = currPage;
        this.page.size = pageSize;
        this.page.total = totalCount;
        this.numberTypeList = list;
      }
    } catch (error) {
      this.$message.error(`数据查询失败：${error.message}`);
    }
  },
  async addNumberType() {
    try {
      const response = await this.$http.post('/api/number/type/save', this.newNumberType);
      if (response.data && response.data.code === 0) {
        this.$message.success('数据添加成功');
        this.formDialogVisible = false;
        this.getNumberTypeList();
      }
    } catch (error) {
      this.$message.error(`数据添加失败：${error.message}`);
    }
  },async updateNumberType() {
    try {
      const response = await this.$http.post('/api/number/type/update', this.currentRow);
      if (response.data && response.data.code === 0) {
        this.$message.success('数据添加成功');
        this.formDialogVisible = false;
        this.getNumberTypeList();
      }
    } catch (error) {
      this.$message.error(`数据添加失败：${error.message}`);
    }
  },
  async save(){
    console.log(this.currentRow)
    if (this.currentRow.id === null) {
      addNumberType()
    }else{
      updateNumberType()
    }
  },
  // 分页尺寸变化处理（修复：使用page.size而非独立变量）
  handleSizeChange(size) {
    this.page.size = size;
    this.page.currPage = 1; // 切换页大小后重置到第一页
    this.getNumberTypeList();
  },

  // 页码变化处理
  handleCurrentPageChange(page) {
    this.page.currPage = page;
    this.getNumberTypeList();
  }
},
created() {
  this.getNumberTypeList();
}
}
</script>
