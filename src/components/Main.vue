<template>
    <el-container style="border: 1px solid #eee">
      <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
        <el-menu :default-openeds="['1', '2']" @select="handleMenuSelect"
                 :collapse-on-select="false"
        >
          <el-submenu index="1">
            <template slot="title"><i class="el-icon-message"></i>数据填报页</template>
            <el-menu-item index="DataForm">数据填报</el-menu-item>
            <el-menu-item index="config">配置项</el-menu-item>
          </el-submenu>
          <el-submenu index="2">
            <template slot="title"><i class="el-icon-menu"></i>数据查看页</template>
            <el-menu-item v-for="item in numberTypeList" :key="item.id" :index="item.number" @click="selectNumberData(item)">
              {{ item.number }}——{{ item.name }}
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>

      <el-container>
        <el-main>
          <el-component :is="pageName" :key="number" :number="number"></el-component>
        </el-main>
      </el-container>
    </el-container>
</template>

<style>
.el-container{
  height: 100vh;
}
el-component {
  display: flex;
  flex-direction: column;
  height: 100%;
}
</style>

<script>
import Config from '@/components/Config.vue'
import DataForm from '@/components/DataForm.vue'
import NumberData from "@/components/NumberData.vue";


export default {
  data() {
    return {
      pageName:null,
      numberTypeList:[],
      number:'',
      currentActiveIndex: "" // 新增：记录当前选中的菜单项 index
    }
  }, methods: {
    handleMenuSelect(index) {
      this.pageName = {
        config: Config,
        DataForm: DataForm,
        NumberData: NumberData
      }[index]
      console.log(this.pageName)
    }, async getNumberTypeList() {
      try {
        this.numberTypeList = await this.$db.selectNumberTypeList(null);
      } catch (error) {
        this.$message.error('数据查询失败' + error);
      }
    }, selectNumberData(item) {
      this.number = item.number; // 存储选中的类型ID
      this.currentActiveIndex = item.number; // 关键：更新选中状态
      this.handleMenuSelect("NumberData"); // 可选：若需切换组件，保持原有逻辑
    },
  },created() {
    this.getNumberTypeList()
  }
}
</script>
