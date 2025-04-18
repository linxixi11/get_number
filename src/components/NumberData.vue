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
        prop="type"
        label="类型"
        width="180">
      </el-table-column>
      <el-table-column
        prop="corp"
        label="公司"
        width="180">
      </el-table-column>
      <el-table-column
        prop="serialNumber"
        label="图号"
        width="180"
        :formatter="formatSerialNumber">
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

      <el-table-column
        prop="imageBase64"
        label="图片"
        width="180"
      >
        <template #default="scope">
          <el-image
            :src="handleBase64(scope.row.imageBase64)"
          :preview-src-list="[handleBase64(scope.row.imageBase64)]"
          style="width: 100%; height: 120px; object-fit: cover"
          />
        </template>
      </el-table-column>

      <el-table-column label="操作" width="100">
        <template slot-scope="scope">
          <div style="display: flex; align-items: center; gap: 12px"> <!-- 使用flex布局统一间距 -->
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
      class="mt-4"
      @size-change="handleSizeChange"
      @current-change="handleCurrentPageChange"
      :current-page="page.currPage"
      :page-sizes="[10, 20, 30, 50]"
      :page-size="page.size"
      layout="total, sizes, prev, pager, next, jumper"
      :total="page.total"
    ></el-pagination>

  </div>
</template>

<style>
#table{
  height: 80vh;
}
</style>

<script>

export default {
  props: ['number'], // 接收父组件传递的 typeId
  data() {
    return {
      numberDataList: [],
      currentRow: null,
      page: {
        currPage: 1,
        size: 10,
        total: 0
      },
      tableHeight: 'calc(100vh - 180px)' // 动态计算表格高度
    }
  }, computed: {
  },
  methods: {
    // 新增Base64处理方法
    handleBase64(base64Str) {
      // 空值处理
      if (!base64Str) return '';

      // 检查是否已有完整前缀
      const base64Regex = /^data:image\/(png|jpeg|jpg|gif|webp);base64,/;
      if (base64Regex.test(base64Str)) {
        return base64Str;
      }

      // 自动识别图片类型（示例以png为例，可根据实际情况调整）
      // 注意：如果后端返回的图片类型不固定，需要更精确的类型判断逻辑
      return `data:image/png;base64,${base64Str}`;
    },
    // 删除选中数据
  async deleteSelected(row) {
    try {
      const response = await this.$http.post('/api/number/data/delete',row)
      if (response && response.data.code === 0) {
        this.$message.success('删除成功');
        await this.selectNumberDataList();
      }
    } catch (error) {
      this.$message.error(`删除失败：${error.message}`);
    }
  },
  formatSerialNumber(row, column, cellValue) {
    return cellValue.toString().padStart(4, '0');
  },
    getRowDisplaySerial(row) {
      const { name, corp, type, serialNumber, router } = row;
      const paddedSerialNumber = serialNumber.toString().padStart(4, '0');

      return router === 0
        ? `${name}  ${type}${corp}${paddedSerialNumber}`
        : `${type}${corp}${paddedSerialNumber}  ${name}`;
    },async selectNumberDataList(){
      try{
        const params = {
          type : this.number,
          page : this.page.currPage +'',
          limit: this.page.size +''
        }
        const response = await this.$http.post('/api/number/data/list',params);
        // 修复：使用response.data获取数据，避免未定义的data变量
        if (response.data && response.data.code === 0) {
          const { currPage, pageSize, totalCount, totalPage, list } = response.data.page;
          this.page.currPage = currPage;
          this.page.size = pageSize;
          this.page.total = totalCount;
          this.numberDataList = list;
        }
      }catch (error){
        this.$message.error('数据查询失败' + error);
      }
    }// 分页尺寸变化处理（修复：使用page.size而非独立变量）
  ,handleSizeChange(size) {
    this.page.size = size;
    this.page.currPage = 1; // 切换页大小后重置到第一页
    this.selectNumberDataList();
  },

  // 页码变化处理
  handleCurrentPageChange(page) {
    this.page.currPage = page;
    this.selectNumberDataList();
  }
  },
  created() {
    this.selectNumberDataList();
  }
}
</script>
