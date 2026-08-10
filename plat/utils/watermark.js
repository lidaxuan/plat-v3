/*
 * @Description: 
 * @Author: 李大玄
 * @Date: 2022-06-30 10:57:48
 * @FilePath: /el-packaging-use/node_modules/web_beacon/src/mixins/watermark.js
 * @LastEditors: 李大玄
 * @LastEditTime: 2022-06-30 10:57:49
 */
let watermark = {},
  setWatermark = (str, sourceBody) => {
    let id = "1.23452384164.123412416";

    if (document.getElementById(id) !== null) {
      document.body.removeChild(document.getElementById(id));
    }

    //创建一个画布
    let can = document.createElement("canvas");
    //设置画布的长宽
    can.width = 450; //document.activeElement.offsetWidth / 4
    can.height = 350; //document.activeElement.offsetHeight / 6.5

    let cans = can.getContext("2d");
    //旋转角度
    cans.rotate((-22 * Math.PI) / 180);
    cans.font = "16px Vedana";
    //设置填充绘画的颜色、渐变或者模式
    cans.fillStyle = "rgba(200, 200, 200, 0.35)";
    //设置文本内容的当前对齐方式
    cans.textAlign = "left";
    //设置在绘制文本时使用的当前文本基线
    cans.textBaseline = "Middle";
    //在画布上绘制填色的文本（输出的文本，开始绘制文本的X坐标位置，开始绘制文本的Y坐标位置）
    cans.fillText(str, can.width / 8, can.height);

    let water_div = document.createElement("div");
    water_div.id = id;
    water_div.style.pointerEvents = "none";
    water_div.style.background =
      "url(" + can.toDataURL("image/png") + ") left top repeat";
    if (sourceBody) {
      water_div.style.width = "100%";
      water_div.style.height = "100%";
      sourceBody.appendChild(water_div);
    } else {
      water_div.style.top = "3px";
      water_div.style.left = "100px";
      water_div.style.position = "fixed";
      water_div.style.zIndex = "100000";
      water_div.style.width = document.documentElement.clientWidth - 17 + "px";
      water_div.style.height = document.documentElement.scrollHeight + "px";
      document.body.appendChild(water_div);
    }
    return id;
  };

// 该方法只允许调用一次
watermark.set = (str) => {
  let id = setWatermark(str);
  setInterval(() => {
    if (document.getElementById(id) === null) {
      id = setWatermark(str);
    }
  }, 500);
  window.onresize = () => {
    setWatermark(str);
  };
};

export default watermark;
