<!--
 * @Author: 段丽军
 * @Date: 2022-02-21 10:49:03
 * @LastEditTime: 2022-08-22 20:52:26
 * @LastEditors: 段丽军
 * @Description:
 * @FilePath: /el-web-basic/package/components/native/editor/src/main.vue
-->
<template>
  <div :style="`height: ${heightComputed}; z-index: ${zIndexComputed};`" class="e-editor-n">
    <!-- 工具栏 -->
    <Toolbar
      style="border-bottom: 1px solid #ccc"
      :editor="editor"
      :defaultConfig="toolbarConfig"
    />
    <!-- 编辑器 -->
    <Editor
      style="height: 100%; overflow-y: auto"
      :defaultConfig="editorConfig"
      v-model="value_"
      @onChange="onChange"
      @onCreated="onCreated"
    />
  </div>
</template>

<script>
// import { Editor, Toolbar } from "@wangeditor/editor-for-vue";

export default {
  name: "EEditorN",
  model: {
    prop: "value",
    event: "change",
  },
  props: {
    value: {
      type: String,
      default: null,
    },
    height: {
      type: String,
      default: null,
    },
    zIndex: {
      type: Number,
      default: null,
    },
    // 图片上传 参数名
    uploadImgName: {
      type: String,
      default: null,
    },
    //
    vueProp: {
      type: String,
      default: null,
    },
    // 图片上传 函数
    uploadImgMethod: {
      type: [String, Object],
      default: null,
    },
    placeholder: {
      type: String,
      default: null,
    },
    // 自定义 图片上传 行数
    // param1: file 是 input 中选中的文件列表
    // param2: insertFn 是获取图片 url 后，插入到编辑器的方法
    // demo: customUploadImg(resultFiles, insertImgFn)
    customUploadImg: {
      type: Function,
      default: void 0,
    }
  },
  // components: { Editor, Toolbar },
  data() {
    let that = this;
    return {
      // 组件默认配置
      height_: "400px",
      uploadImgName_: "file",
      vueProp_: "$defaultApi",
      uploadImgMethod_: "fileUpload",

      value_: null,
      editor: null,
      toolbarConfig: {},
      editorConfig: {
        placeholder: that.placeholder || "请输入内容...",
        // autoFocus: false,

        // 所有的菜单配置，都要在 MENU_CONF 属性下
        MENU_CONF: {
          uploadImage: {
            customUpload: (file, insertFn) => {
              (that.customUploadImg || that.defaultUploadImg)(file, insertFn);
            },
          },
        },
      },
    };
  },
  watch: {
    value: {
      immediate: true,
      handler(nv) {
        if (nv === this.value_) {
          return;
        }
        if (!nv) {
          this.editor?.clear();
        }
        this.value_ = nv;
      },
    },
  },
  computed: {
    globalAttr() {
      return this.$EASYLIAO.EEditorN || {};
    },
    heightComputed() {
      return this.height || this.$EASYLIAO?.EEditorN?.height || this.height_;
    },
    zIndexComputed() {
      return this.zIndex || this.$EASYLIAO?.zIndex || 2000;
    },
  },
  methods: {
    async defaultUploadImg(file, insertFn) {
      // file 是 input 中选中的文件列表
      // insertFn 是获取图片 url 后，插入到编辑器的方法

      // 上传图片，返回结果，将图片插入到编辑器中
      // insertFn(imgUrl)

      let {
        uploadImgName: uploadImgName_g,
        vueProp: vueProp_g,
        uploadImgMethod: uploadImgMethod_g,
      } = this.globalAttr; // 全局属性

      let {
        // 使用者配置
        uploadImgName,
        vueProp,
        uploadImgMethod,

        // 组件默认
        uploadImgName_,
        vueProp_,
        uploadImgMethod_,
      } = this;

      const fileName = uploadImgName || uploadImgName_g || uploadImgName_;
      const methodProp = vueProp || vueProp_g || vueProp_;
      const method = uploadImgMethod || uploadImgMethod_g || uploadImgMethod_;

      let params = new FormData();
      params.append(fileName, file);
      let res;
      try {
        if (this[methodProp] && typeof this[methodProp][method] === "function") {
          res = await this[methodProp][method](params);
        } else if (window.EWebPlat && typeof window.EWebPlat.platService === "function") {
          if (typeof method === "object") {
            res = await window.EWebPlat.platService(method, params);
          } else {
            throw new Error("method is not a object")
          }
        } else {
          this.$message.error("请求方法异常");
        }
      } catch (error) {
        this.$message.error("请求异常");
        console.error(error);
        return;
      }

      if (!res || res.status !== 1) {
        this.$message.error(res && res.reason ? res.reason : "响应错误");
        return;
      }

      if (res.data) {
        insertFn(res.data);
      }
    },
    onCreated(editor) {
      this.editor = Object.seal(editor); // 【注意】一定要用 Object.seal() 否则会报错
    },
    onChange(editor) {
      this.$emit(
        "change",
        editor.getText() || editor.getHtml().includes("img") ? editor.getHtml() : ""
      );
    },
  },
  beforeDestroy() {
    const editor = this.editor;
    if (editor == null) return;
    editor.destroy(); // 组件销毁时，及时销毁 editor ，重要！！！
  },
};
</script>

<!--<style src="@wangeditor/editor/dist/css/style.css"></style>-->
<style lang="scss" scoped>
.e-editor-n {
  border: 1px solid #ccc;
  display: flex;
  flex-direction: column;
}
</style>
