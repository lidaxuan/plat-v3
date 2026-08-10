<!--
 * @Description:
 * @Author: 李大玄
 * @Date: 2022-07-07 21:37:02
 * @FilePath: /framework/ui/components/Login.vue
 * @LastEditors: 李大玄
 * @LastEditTime: 2022-08-29 17:11:28
-->
<template>
  <div id="login" class="position-r" width="100%" height="100%" v-loading="loading" />
</template>
<script>
import auth from '../src/utils/auth';
import { mapGetters } from 'vuex';
import findData from '../src/utils/findData';
import setting from '../src/store/modules/setting';

export default {
  name: 'Login',
  data() {
    return {
      loading: true
    };
  },
  computed: {
    ...mapGetters([
      'token',
      // 'authCodeArr',
      'userMsg'
    ])
  },
  methods: {
    // 递归过滤菜单
    filterAnswers(arr, ids) {
      let newData = arr.filter((x) => !ids.includes(x.type));
      newData.forEach((x) => x.data && (x.data = this.filterAnswers(x.data, ids)));
      return newData;
    },
    treeDataSource(arr) {
      return arr.map((v) => {
        return {
          ...v,
          icon: v.iconUrl || '',
          path: v.uri || '',
          children: v.data ? this.treeDataSource(v.data) : []
        };
      });
    },

    async getMenu(nomalMenu) {
      let children = nomalMenu;
      children.forEach((item, index) => {
        item.countId = index.toString();
      });

      this.$store.commit('nomalMenu', children); //先获取所有菜单
      // this.$store.commit("defaultActiveHorizontalMenu",children[0].countId);//横向菜单选中
      if (children && children[0].children) {
        this.$store.dispatch('setSideMenu', children[0].children);
      } else {
        this.$store.dispatch('setSideMenu', [children[0]]);
      }

      let arr = findData.findParentArr(findData.getDataId([children[0]]).id, children);

      this.$store.commit('breadcrumb', arr); //面包屑
      this.$store.commit('layoutTag', findData.getDataId([children[0]])); //tag标签
      this.$store.commit('defaultActiveMenu', findData.getDataId([children[0]]).id);
      this.$router.push({
        path: findData.getDataId([children[0]]).path
      });
    },
    // 递归权限码 code
    findTreeArr(list, newArr = []) {
      for (let o of list || []) {
        if (o.code) {
          newArr.push(o.code);
          if (o.data) {
            this.findTreeArr(o.data, newArr);
          }
        } else if (o.data) {
          this.findTreeArr(o.data, newArr);
        }
      }
      return newArr;
    },
    // 获取菜单和用户信息
    getUserMD() {
      return Promise.all([
        // this.$HttpNomal.getLoginDetail().then((res) => {
        //   this.$store.commit('userMsg', res.data);
        // }),
        this.$structDemoClient.getMenuList().then((res) => {
          if (res.data) {
            this.$store.commit('menuChildren', JSON.parse(JSON.stringify(res.data))); //全量菜单
            let menu = res.data,
              authority = JSON.parse(JSON.stringify(menu));
            this.$store.commit('authCodeArr', this.findTreeArr(authority)); //权限码
            this.getMenu(this.treeDataSource(this.filterAnswers(menu, [2, 11]))); //菜单
          } else {
            this.$message.warning('此账号无菜单数据');
            setTimeout(() => {
              // auth.jumpLogin();
            }, 1000);
          }
        })
      ]);
    },
    initLayout() {
      this.$store.commit('token', null); //token初始化
      this.$store.commit('layoutSetting', setting.layoutSetting); //主题布局初始化
      this.$store.commit('layoutTag', ''); //tag标签页
      this.$store.commit('nomalMenu', []); //先获取所有菜单
      auth.getToken('access_token').then((res) => {
        this.$store.commit('token', res);
        if (this.token == null) {
          auth.jumpLogin();
        } else {
          auth.jumpOriginUrl();
          // setTimeout(() => {
          this.getUserMD();
          // }, 1000);
        }
      });
    }
  },
  mounted() {
    this.initLayout();
  }
};
</script>
