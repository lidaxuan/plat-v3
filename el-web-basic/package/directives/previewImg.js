let previewBox = null; // 预览弹窗单例，只创建一次
let imgEl = null;
let closeBtn = null;

// 回调函数  // 点击时间
function clickFun(e) {
  if(e.target.tagName !== 'IMG' || !e.target.src) { return; }
  const src = e.target.src;
  // 用户自定义预览
  if(e.target._previewCallback instanceof Function) {
    e.target._previewCallback(src);
  }
  // 使用默认预览
  else {
    previewImg(src);
  }
}

// 预览图片
function previewImg(src) {
  // 放大倍数
  const allowScale = 1;
  const allowOpacity = 0.5;

  // 弹窗只初始化一次
  if (!previewBox) {
    // 图片
    imgEl = document.createElement('img');
    // 这个查看图片包含框
    previewBox = document.createElement('div');
    closeBtn = document.createElement('div');

    // 查看大图的关闭按钮
    closeBtn.innerText = '×';
    closeBtn.className = 'close';

    previewBox.appendChild(imgEl);
    previewBox.appendChild(closeBtn);
    previewBox.style.display = 'none';
    document.getElementById("app").appendChild(previewBox);

    // 设置关闭样式 右上角定位
    closeBtn.style.cssText = `position:absolute;top:24px;right:24px;border:1px solid #ccc;border-radius:50%;height:32px;width:32px;display:flex;align-items:center;justify-content:center;font-size:22px;color:red;cursor:pointer;background:#fff;z-index:1000000;`;

    // 点击关闭按钮隐藏查看大图
    closeBtn.addEventListener('click', function (e) {
      e.stopPropagation() // 阻止冒泡，避免点关闭同时触发外层div关闭
      previewBox.style.display = 'none';
    });

    // 遮罩点击空白关闭，点击图片不关闭
    previewBox.addEventListener('click', function (e) {
      if (e.target === previewBox) {
        previewBox.style.display = 'none';
      }
    })

    // ESC按键关闭
    const escClose = (e) => {
      if (e.key === 'Escape' && previewBox.style.display === 'block') {
        previewBox.style.display = 'none';
      }
    }
    document.addEventListener('keydown', escClose)
  }

  // 图片展示
  imgEl.src = src;
  // 图片加载失败兜底
  imgEl.onerror = () => {
    console.warn('预览图片加载失败：', src)
  }

  previewBox.style.cssText = `display:block;position:fixed;top:0;bottom:0;left:0;right:0;background:rgba(0,0,0,${allowOpacity});height:100%;z-index:99999;overflow:auto;cursor:zoom-out;`
  // 设置图片居中，最大宽高适配屏幕
  imgEl.style.cssText = `position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);max-width:90vw;max-height:90vh;width:auto;height:auto;`;
}

export default {
  created(el, { value }) {
    // 回调挂载元素上，不再全局变量，多指令互不干扰
    el._previewCallback = value
    el.addEventListener('click', clickFun);
  },
  // 当传进来的值更新的时候触发
  updated(el, { value }) {
    el._previewCallback = value
  },
  // 指令与元素解绑的时候，移除事件绑定
  unmounted(el) {
    el.removeEventListener('click', clickFun);
    delete el._previewCallback
  }
}
