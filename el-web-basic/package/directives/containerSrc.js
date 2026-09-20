/*
 * @Author: 段丽军
 * @Date: 2021-11-15 09:32:20
 * @LastEditTime: 2021-11-15 22:25:14
 * @LastEditors: 段丽军
 * @Description: 
 * @FilePath: /el-web-basic/package/directives/containerSrc.js
 */
let calback; // 回调函数

// 点击时间
function clickFun(e) {
  if(e.target.tagName !== 'IMG' || !e.target.src) { return; }
  let src = e.target.src;
  // 用户自定义预览
  if(calback instanceof Function) { calback(src); }
  // 使用默认预览
  else { previewImg(src); }
}

// 预览图片
function previewImg(src) {
  // 放大倍数
  let allowScale = 1;
  let allowOpacity = 0.5;
  // 图片
  let img = document.createElement('img');
  // 这个查看图片包含框
  let divBox = document.createElement('div');
  let closeBox = document.createElement('span');
  // 查看大图的关闭按钮
  closeBox.innerText = '×';
  closeBox.className = 'close';
  divBox.appendChild(img);
  divBox.style.display = 'none';
  document.getElementById("app").appendChild(divBox);
  
  // 图片展示
  img.src = src;
  divBox.style.cssText = `display: block;position: fixed;top: 0;bottom: 0;left: 0;right: 0;background: rgba(0,0,0,${allowOpacity});height: 100%; z-index: 99999; overflow: auto;`
  // 设置图片居中
  // let imgBoxH = img.offsetHeight/2 + 'px';
  // let clientH = divBox.offsetHeight/2  + 'px'
  // img.style.cssText = `position: relative;bottom: 0;right: 0;left: 0;margin: auto;top:calc(${clientH} - ${imgBoxH});transform: scale(${allowScale});z-index: 9999999`;
  img.style.cssText = `position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%);`;
  // 设置关闭样式
  closeBox.style.cssText = `border: 1px solid #ccc;
  border-radius: 50%;
  display: inline-block;
  height: 22px;
  width: 22px;
  line-height: 22px;
  text-align: center;
  font-size: 16px;
  color: red;`;

  // 点击关闭按钮隐藏查看大图
  closeBox.addEventListener('click', function () {
    divBox.style.display = 'none';
  });
  divBox.addEventListener('click', function () {
    divBox.style.display = 'none';
  });
}

export default {
  bind(el, { value }) {
    calback = value;
    el.addEventListener('click', clickFun);
  },
  // 当传进来的值更新的时候触发
  componentUpdated(el, { value }) {
    calback = value;
  },
  // 指令与元素解绑的时候，移除事件绑定
  unbind(el) {
    el.removeEventListener('click', clickFun);
  }
}