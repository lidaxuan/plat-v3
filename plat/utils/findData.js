/*
 * @Description: 
 * @Author: 李大玄
 * @Date: 1985-10-26 16:15:00
 * @FilePath: /data-config-view/node_modules/plat/utils/findData.js
 * @LastEditors: 李大玄
 * @LastEditTime: 2022-07-29 10:10:41
 */
export default {
  //   从上往下找 第一个id 组成 ['2-2', '2-2-1', '2-2-1-1']
  getTreeExpandKeys({ id, children }, array = []) {
    array.push(id);
    if (children && children.length > 0) {
      for (let child of [children[0]]) {
        this.getTreeExpandKeys(child, array);
      }
    }
    return array;
  },

  // 菜单层级
  levelFun(array, menuFlag, levelName = "level", childrenName = "children") {
    if (!Array.isArray(array)) {
      return [];
    }
    const recursive = (array, level = -1) => {
      level++;
      return array.map((v) => {
        v[levelName] = level;
        const child = v[childrenName];
        if (child && child.length > 0) {
          if (menuFlag === "0") {
            for (let j of child || []) {
              j.icon = "";
            }
          }
          recursive(child, level);
        }
        return v;
      });
    };
    return recursive(array);
  },

  // 获取数据id
  getDataId(treeData) {
    for (let i = 0; i < treeData.length; i++) {
      const item = treeData[i];
      if (item.disabled) {
        continue;
      }
      if (item.children && item.children.length > 0) {
        return this.getDataId(item.children);
      }
      return item;
    }
  },

  // 递归id取当前数据 从上往下找
  //id:特定的id 和list数组中的匹配 取list对应的数据
  getParentId(list, id) {
    for (let o of list || []) {
      if (o.id === id || o.uri === id) {
        return o;
      }
      if (o.children && o.children.length > 0) {
        const o_ = this.getParentId(o.children, id);
        if (o_) {
          return o_;
        }
      }
    }
  },

  // 把树拉平 (每个节点之间的联系依靠parentid)
  treeLevel(data) {
    const treeData = JSON.parse(JSON.stringify(data)),
      flattenData = [];
    let flattenTree = (data, parentid) => {
      data.forEach((ele) => {
        const { path, icon, name, id, children } = ele;
        flattenData.push({ path, icon, name, id, parentid });
        if (children && children.length > 0) {
          flattenTree(children, id, path, icon, name);
        }
      });
    };
    flattenTree(treeData, null);
    return flattenData;
  },

  /*
   *  把树拉平后的数据来找对应的数据 从下往上找  根据根据某个id  找到对应id数据
   *  如 根据0-0-2  找到id数组 ：['0','0-0-1','0-0-2']
   */
  findParentArr(id, treeData) {
    let allparents = [];
    if (treeData.length === 0) {
      return;
    }
    let findele = (data, id) => {
      if (!id) { return; }
      data.forEach((item) => {
        if (item.id === id) {
          // 找到ele.id数组 ：['0','0-0-1','0-0-2']
          // 找到ele数组对象 ：[[{"id":"1","icon":"icon-A-A2","name":"首页总框架","level":"0","children":[{"id":"1-1","icon":"","name":"首页总框架","disabled":true,"pid":"1"},{"id":"1-2","icon":"","path":"/newMenu","name":"主推框架样式","pid":"1"},{"id":"1-3","icon":"","path":"/oldMenu","name":"老版框架样式","pid":"1"}]},{"id":"1-3","icon":"","path":"/oldMenu","name":"老版框架样式","pid":"1"}]
          allparents.unshift(item);
          findele(treeData, item.parentId);
        } else {
          if (item.children) {
            findele(item.children, id);
          }
        }
      });
    };
    findele(treeData, id);
    return allparents;
  }
}
