<template>
  <el-form ref="form" :model="form" :rules="rules" label-width="80px">
    <el-form-item label="类型" required>
      <el-select v-model="form.type" prop="type" placeholder="请选择图纸类型">
        <el-option :label="item.number + '——' + item.name" :value="item.number" v-for="item in numberTypeList" :key="item._id">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="公司" prop="corp" required>
      <el-input
        style="width: 30%"
        placeholder="请输入公司"
        v-model="form.corp">
      </el-input>
    </el-form-item>
    <el-form-item label="中文名" prop="name" required>
      <el-input
        style="width: 30%"
        placeholder="请输入中文"
        v-model="form.name">
      </el-input>
    </el-form-item>
    <el-form-item label="中文配置" required>
      <el-radio-group v-model="form.router">
        <el-radio label="0">前置</el-radio>
        <el-radio label="1">后置</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="图片上传">
      <div class="image-upload-wrapper">
        <!-- 图片选择框，默认显示 -->
        <el-upload
          v-if="!imageUrl"
          ref="uploadInput"
          :action="''"
          :on-change="handleImageChange"
          :show-file-list="false"
          class="image-upload-btn"
        >
          <el-button type="primary">选择图片</el-button>
        </el-upload>

        <!-- 图片预览区域，选择后显示 -->
        <div v-else class="image-preview-container">
          <div class="image-preview-wrapper" @mouseenter="showDeleteIcon = true" @mouseleave="showDeleteIcon = false">
            <el-image
              :src="imageUrl"
              alt="预览图"
              :preview-src-list="[imageUrl]"
              class="preview-image"
              style="cursor: pointer;"
            >
            </el-image>
            <!-- 删除标识，居中显示，悬停时显示 -->
            <div
              v-show="showDeleteIcon"
              class="delete-icon"
              @click="deleteImage"
            >
              <i class="fas fa-times"></i>
            </div>
          </div>
        </div>
      </div>
    </el-form-item>
    <el-form-item label="流水号" prop="serialNumber" required>
      <el-input
        style="width: 30%"
        placeholder=""
        :value="displaySerialNumber"
        :disabled="true">
      </el-input>
      <el-button @click="getSerialNumberMax">生成流水号</el-button>
      <el-button @click="copySerialNumber">复制</el-button>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="handleSubmit">立即创建</el-button>
      <el-button>取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  data() {
    return {
      form: {
        type: '',
        corp: 'HT',
        name: '',
        router: '0',
        serialNumber: null,
        imageBase64: ''  // 存储后端返回的图片URL
      },
      showDeleteIcon: false,
      imageUrl: '',
      numberTypeList: [],
      rules: {
        type: [{ required: true, message: '请选择图纸类型', trigger: 'change' }],
        corp: [
          { required: true, message: '公司名称为必填项', trigger: ['blur', 'change'] },
          { validator: this.checkNotEmpty, trigger: 'blur' } // 额外校验空格
        ],
        name: [
          { required: true, message: '中文名为必填项', trigger: ['blur', 'change'] },
          { validator: this.checkNotEmpty, trigger: 'blur' } // 额外校验空格
        ],
        serialNumber: [{ required: true, message: '请先生成流水号', trigger: 'change' }]
      }
    }
  },
  computed: {
    displaySerialNumber() {
      if (this.form.serialNumber === null) return null;
      const paddedSerialNumber = this.form.serialNumber.toString().padStart(4, '0');
      return this.form.router === '0'
        ? `${this.form.name}  ${this.form.type}${this.form.corp}${paddedSerialNumber}`
        : `${this.form.type}${this.form.corp}${paddedSerialNumber}  ${this.form.name}`;
    }
  },
  methods: {
    // 图片选择处理
    handleImageChange(file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imageUrl = e.target.result;
        this.form.imageBase64 = e.target.result; // 存储base64用于提交
      };
      reader.readAsDataURL(file.raw);
    },
    // 删除图片
    deleteImage() {
      this.imageUrl = '';
      this.form.imageBase64 = '';
      this.showDeleteIcon = false;
      // 清空上传组件的文件（如需彻底重置，取消注释并根据实际情况调整）
      // this.$refs.uploadInput.$el.querySelector('input[type="file"]').value = '';
    },
    // 新增空格校验方法（修复this指向问题）
    checkNotEmpty(rule, value, callback) {
      if (value.trim() === '') {
        callback(new Error('禁止输入空格'));
      } else {
        callback();
      }
    },
    async getNumberTypeList() {
      try {
        const response = await this.$http.post('/api/number/type/list', {});
        if (response.data && response.data.code === 0) {
          this.numberTypeList = response.data.page.list;
        }
      } catch (error) {
        this.$message.error(`数据查询失败：${error.message}`);
      }
    },
    // 修复复制逻辑（原代码中this.corpName不存在）
    copySerialNumber() {
      navigator.clipboard.writeText(this.displaySerialNumber).then(() => {
        this.$message.success('复制成功');
      }).catch((error) => {
        this.$message.error('复制失败：' + error);
      });
    },
    async getSerialNumberMax() {
      try {
        if (!this.form.type) {
          this.$message.warning('请先选择图纸类型');
          return;
        }
        const request = { type: this.form.type };
        const response = await this.$http.post('/api/number/data/max', request);
        if (response.data && response.data.code === 0) {
          const newSerialNumber = Number(response.data.data) + 1;
          this.form.serialNumber = newSerialNumber;
          await navigator.clipboard.writeText(this.displaySerialNumber);
          this.$message.success('流水号已生成并复制到剪贴板');
        }
      } catch (error) {
        this.$message.error('生成失败' + error);
      }
    },
    handleSubmit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.onSubmit();
        } else {
          this.$message.error('请正确填写所有必填项');
          return false;
        }
      });
    },
    async onSubmit() {
      try {
        await this.$http.post('/api/number/data/save', this.form);
        this.$message.success('数据添加成功');
      } catch (error) {
        this.$message.error('数据添加失败' + error);
      }
    }
  },
  created() {
    this.getNumberTypeList();
  }
};
</script>

<style scoped>
.image-upload-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px 0;
}

.image-preview-container {
  width: 150px;
  height: 100px;
  position: relative;
}

.image-preview-wrapper {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
}

.preview-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.delete-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 30px;
  height: 30px;
  background: rgba(255, 0, 0, 0.8);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-size: 14px;
  cursor: pointer;
  display: none; /* 默认隐藏，通过mouseenter显示 */
}

/* 悬停时显示删除标识（修复CSS选择器） */
.image-preview-wrapper:hover .delete-icon {
  display: flex;
}
</style>
