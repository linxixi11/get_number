<template>
  <el-form ref="form" :model="form" label-width="80px">
    <el-form-item label="类型">
      <el-select v-model="form.type" placeholder="请选择图纸类型">
        <el-option :label="item.number+'——'+item.name" :value="item.number" v-for="item in numberTypeList"
                   :key="item._id">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="公司">
      <el-input
        style="width: 30%"
        placeholder="请输入公司"
        v-model="form.corp">
      </el-input>
    </el-form-item>
    <el-form-item label="中文名">
      <el-input
        style="width: 30%"
        placeholder="请输入中文"
        v-model="form.name">
      </el-input>
    </el-form-item>
    <el-form-item label="中文配置">
      <el-radio-group v-model="form.router">
        <el-radio label="0">前置</el-radio>
        <el-radio label="1">后置</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="流水号">
      <el-input
        style="width: 30%"
        placeholder=""
        :value="displaySerialNumber"
        :disabled="true">
      </el-input>
      <el-button @click="getSerialNumberMax">生成流水号</el-button>
      <el-button @click="copyCorpName">复制</el-button>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">立即创建</el-button>
      <el-button>取消</el-button>
    </el-form-item>
  </el-form>
</template>
<script>

import common from '@/common/common.js'
export default {
  data() {
    return {
      form: {
        type: '',
        corp: 'HT',
        name: '',
        delivery: false,
        router: '0',
        serialNumber: null,
        desc: ''
      },
      numberTypeList: []
    }
  }, computed: {
    displaySerialNumber() {
      if (this.form.serialNumber === null) {
        return null;
      }
      const paddedSerialNumber = this.form.serialNumber.toString().padStart(4, '0');
      // 修改点：使用 this.form.router 而不是 this.$router
      return this.form.router === '0'
        ? `${this.form.name}  ${this.form.type}${this.form.corp}${paddedSerialNumber}`
        : `${this.form.type}${this.form.corp}${paddedSerialNumber}  ${this.form.name}`;
    }
  },
  methods: {
    getNumberTypeList() {
      this.$db.selectNumberTypeList(null).then((res, error) => {
        this.numberTypeList = res
      }).catch((error) => {
        this.$message.error('数据查询失败' + error);
      })
    }, copyCorpName() {
      navigator.clipboard.writeText(this.corpName).then(() => {
        this.$message.success('复制成功');
      }).catch((error) => {
        this.$message.error('复制失败：' + error);
      });
    },async getSerialNumberMax() {
        try {
          const type = this.form.type;
          const maxSerialNumber = await this.$db.selectSerialNumberMax(type)
          let newSerialNumber = Number(maxSerialNumber)+1;
          this.form.serialNumber = newSerialNumber;
          // 强制更新界面
          this.$forceUpdate();
          await navigator.clipboard.writeText(this.displaySerialNumber);
          // 复制到剪贴板
          this.$message.success('序列号已生成并复制到剪贴板');
        }catch (error){
          this.$message.error('生成失败' + error);
        }
    },async onSubmit() {
      try{
        await this.$db.addNumberData(this.form)
        this.$message.success('数据添加成功');
      }catch (error){
        this.$message.error('数据添加失败' + error);
      }
    }
  },
  created() {
    this.getNumberTypeList()
  }
}
</script>
