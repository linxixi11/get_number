<template>
    <el-container style="border: 1px solid #eee">
      <el-aside height="100%" width="200px" style="background-color: rgb(238, 241, 246)">
        <el-menu :default-openeds="['1', '3']" @select="handleMenuSelect">
          <el-submenu index="1">
            <template slot="title"><i class="el-icon-message"></i>数据填报页</template>
            <el-menu-item index="1-1" @click="goToDataForm">数据填报</el-menu-item>
            <el-menu-item index="config" @click="goToConfig">配置项</el-menu-item>
          </el-submenu>
          <el-submenu index="2">
            <template slot="title"><i class="el-icon-menu"></i>数据查看页</template>
            <el-menu-item v-for="item in numberTypeList" :key="item.id" :index="item.index">
              {{ item.label }}
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>

      <el-container>
        <el-header style="text-align: right; font-size: 12px">
          <el-dropdown>
            <i class="el-icon-setting" style="margin-right: 15px"></i>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>查看</el-dropdown-item>
              <el-dropdown-item @click.native="openFormDialog">新增</el-dropdown-item>
              <el-dropdown-item>删除</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <span>王小虎</span>
        </el-header>
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
        <el-main>
          <el-component :is="pageName"></el-component>
        </el-main>
      </el-container>
    </el-container>
</template>

<style>

template {
  height: 100%;
  width: 100%;
}
.el-container{
  flex: 1; /* 填满父容器 */
  min-height: 0; /* 修复 Chrome 的 flex 溢出问题 */
}
.el-main {
  padding: 20px; /* 按需调整内边距 */
}
.el-header {
  background-color: #B3C0D1;
  color: #333;
  line-height: 60px;
}

.el-aside {
  color: #333;
}
</style>

<script>
import Config from '@/components/Config.vue'


export default {
  data() {
    return {
      numberTypeList: [],
      numberList: [],
      pageName:null,
      newNumberType: {
        number: '',
        name: ''
      },
      formDialogVisible: false
    }
  }, methods: {
    handleMenuSelect(index) {
      this.pageName = {
        config: Config,
      }[index]
    },
    async getNumberTypeList() {
      try {
        this.$db.selectNumberTypeList(null).then((res)=>{
          this.numberTypeList = res
        })
      } catch (error) {
        this.$message.error('数据查询失败' + error);
      }
    }
    , async addNumberType() {
      try {
        await this.$db.addNumberType(this.newNumberType);
        this.$message.success('数据添加成功');
        await this.getNumberTypeList();
      } catch (error) {
        this.$message.error('数据添加失败' + error);
      }
      this.formDialogVisible = false;
    }, goToDataForm() {
      this.$router.push({name: 'NumberData'});
    },
    addClick() {
      if (this.$router.path === '/config') {

      }
    }
  }
}
</script>
