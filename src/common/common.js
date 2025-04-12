import Config from '@/components/Config.vue'
import DataForm from '@/components/DataForm.vue'


export default {
  data() {
    return {
      pageName: null,
      numberTypeList: [],
      formDialogVisible: false,
      newNumberType: {
        number: '',
        name: '',
      }
    }
  }, methods: {
    handleMenuSelect(index) {
      this.pageName = {
        config: Config,
        DataForm: DataForm
      }[index]
    }, openFormDialog() {
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
        await this.$db.addNumberType(this.newNumberType);
        this.$message.success('数据添加成功');
        await this.getNumberTypeList();
      } catch (error) {
        this.$message.error('数据添加失败' + error);
      }
      this.formDialogVisible = false;
    }
  }
}
