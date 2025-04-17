<template>
  <div id="table">
 <!-- 新增：按钮容器 -->
 <div class="table-header">
      <el-button 
        type="primary" 
        plain 
        @click.native="openFormDialog"
      >新增</el-button>
    </div>


    <el-table
      :data="numberTypeList"
      highlight-current-row
      @current-change="handleTableCurrentChange" 
      height="calc(100% - 52px)%"
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
      <el-table-column
        prop="initSerialNumber"
        label="初始值">
      </el-table-column>
      <!-- 新增：如果需要显示创建时间，可添加此列 -->
      <el-table-column
          prop="created"
          label="创建时间"
          width="200">
        </el-table-column>
<!-- 新增操作列，放置三个按钮 -->
    <el-table-column label="操作" width="240">
        <template slot-scope="scope">
          <div style="display: flex; align-items: center; gap: 12px"> <!-- 使用flex布局统一间距 -->
            <el-button 
              type="primary" 
              plain 
              @click.native="openEditDialog(scope.row)"
              class="mr-4"
            >修改</el-button>

            <el-popover
              placement="top"
              width="160"
              v-model="scope.row.visible"
            >
              <p>确认删除？</p>
              <div style="text-align: right; margin: 0">
                <el-button size="mini" type="text" @click="scope.row.visible = false">取消</el-button>  
                <el-button type="primary" size="mini" @click.native="deleteSelected(scope.row)">确定</el-button>
              </div>
              <el-button 
                type="primary" 
                plain 
                slot="reference" 
              >删除</el-button>
            </el-popover>
          </div>
        </template>
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
      <el-form :model="newNumberType" :rules="rules" ref="newNumberType">
        <el-form-item label="序号" required prop="number">
          <el-input v-model="newNumberType.number"></el-input>
        </el-form-item>
        <el-form-item label="名称" required prop="name">
          <el-input v-model="newNumberType.name"></el-input>
        </el-form-item>
        <el-form-item label="初始值" required prop="initSerialNumber">
          <el-input v-model="newNumberType.initSerialNumber"></el-input>
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
  display: flex;
  flex-direction: column;
}
.table-header {
  margin-bottom: 12px;
  display: flex;
  justify-content: flex-start;
}
</style>

<script>
export default {
data() {
  return {
    visible: false,
    numberTypeList: [],
    formDialogVisible: false,
    newNumberType: {
      id: null,
      number: '',
      name: '',
      initSerialNumber:null
    },
    rules: {
        number: [
          { required: true, message: '序号为必填项', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '名称为必填项', trigger: 'blur' }
        ],
        initSerialNumber: [
          { required: true, message: '初始值为必填项', trigger: 'blur' }
        ]
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
  // 打开编辑对话框
  openEditDialog(row) {
    this.newNumberType = { ...row }; // 直接使用传递的row数据
    this.formDialogVisible = true;
  },
  // 删除选中数据
  async deleteSelected(row) {
    try {
      const response = await this.$http.post('/api/number/type/delete',row)
      if (response && response.data.code === 0) {
        this.$message.success('删除成功');
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
    this.newNumberType = {
      id: null,
      number: '',
      name: ''
    };
    this.currentRow = null
    this.formDialogVisible = true
  },

  // 获取带分页的列表数据（修复：响应解析和参数问题）
  async getNumberTypeList() {
    try {
      // 构造分页参数（假设后端参数为currPage和pageSize）
      const params = {
        page: this.page.currPage +'',
        limit: this.page.size+''
      };

      const response = await this.$http.post('/api/number/type/list', params);
      
      // 修复：使用response.data获取数据，避免未定义的data变量
      if (response.data && response.data.code === 0) {
        const { currPage, pageSize, totalCount, totalPage, list } = response.data.page;
        this.page.currPage = currPage;
        this.page.size = pageSize;
        this.page.total = totalCount;
        this.numberTypeList = list;
        visible: false // 初始化visible属性
      }
    } catch (error) {
      this.$message.error(`数据查询失败：${error.message}`);
    }
  },
  async addNumberType() {
    try {
      this.newNumberType.id = null;
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
      const response = await this.$http.post('/api/number/type/update', this.newNumberType);
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
   // 关键：先执行表单校验
   this.$refs.newNumberType.validate(valid => {
        if (valid) { // 校验通过再提交
          if (this.currentRow === null || this.currentRow.id === null) {
            this.addNumberType();
          } else {
            this.updateNumberType();
          }
        }
      });
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
