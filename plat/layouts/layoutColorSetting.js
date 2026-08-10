/*
 * @Description: layoutColorSetting
 * @Author: 李大玄
 * @Date: 1985-10-26 16:15:00
 * @FilePath: /framework/ui/components/layouts/layoutColorSetting.js
 * @LastEditors: 李大玄
 * @LastEditTime: 2024-08-26 16:15:23
 */

class LayoutColorSetting {
  // 十六进制转rgba
  colorRgb(str, opacity) {
    if (str) {
      let sColor = str.toLowerCase();
      if (sColor) {
        if (sColor.length === 4) {
          let sColorNew = "#";
          for (let i = 1; i < 4; i += 1) {
            sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1));
          }
          sColor = sColorNew;
        }
        //处理六位的颜色值
        const sColorChange = [];
        for (let j = 1; j < 7; j += 2) {
          sColorChange.push(parseInt("0x" + sColor.slice(j, j + 2)));
        }
        return "rgba(" + sColorChange.join(",") + "," + opacity + ")";
      } else {
        return sColor;
      }
    }
  }
  // 全局设置
  serRootStyle(root, val, style) {
    let roots = document.querySelector(":" + root);
    return roots.style.setProperty(val, style);
  }
  setLayoutThemeLayoutLeftInit(v) {
    // Left
    this.serRootStyle("root", "--layoutSideMenuBg", "#ffffff");
    this.serRootStyle("root", "--layoutSideMenuColor7E84A3", "#7E84A3");
    this.serRootStyle("root", "--layoutSideMenuColorFFF", "#ffffff");
    this.serRootStyle("root", "--layoutSideMenuSelected", v);
    this.serRootStyle("root", "--layoutSideMenuColorF9F8FD", "#F9F8FD");
    this.serRootStyle("root", "--layoutSideMenuColorF9F8FD-rgba", this.colorRgb("#F9F8FD", 0.1));
    this.serRootStyle("root", "--layoutSideMenuColorArrow", "#7E84A3");
    this.serRootStyle("root", "--layoutSideMenuColor344563", "#344563");
    this.serRootStyle("root", "--layoutPickerBrNone", "none");
    this.serRootStyle("root", "--homeSideMenuCollapseSelected", v);
    this.serRootStyle("root", "--homeSideMenuColorIconfont", this.colorRgb("#F9F8FD", 0.1));
  }
  setLayoutThemeLayoutTopInit(v) {
    // top
    this.serRootStyle("root", "--layoutTopMenuBtn", v);
    this.serRootStyle("root", "--layoutTopMenuCol", "#7E84A3");
    this.serRootStyle("root", "--layoutTopMenuBtnCol", "#ffffff");
    this.serRootStyle("root", "--layoutTopBadgeCol", "#ffffff");
    this.serRootStyle("root", "--layoutTopBadge", v);
    this.serRootStyle("root", "--layoutBeaconBg", "#ffffff");
    this.serRootStyle("root", "--layoutBeacon", v);
    this.serRootStyle("root", "--layoutBeaconCol", "#2c3e50");
    this.serRootStyle("root", "--layoutBeaconBr", "rgba(21, 34, 50, 0.08)");
    this.serRootStyle("root", "--layoutTopMenuBg", "#ffffff");
    this.serRootStyle("root", "--layoutTopMenuIsActive", v);
  }
  // 默认主题
  setLayoutThemeLayoutDefault(v) {
    this.setLayoutColor(v);
    this.setLayoutThemeLayoutLeftInit(v);
    this.setLayoutThemeLayoutTopInit(v);
  }
  // 设置主题布局左侧菜单
  setLayoutThemeLayoutLeft(v) {
    this.setLayoutColor(v);
    this.setLayoutThemeLayoutTopInit(v);
    this.serRootStyle("root", "--layoutSideMenuBg", v);
    this.serRootStyle("root", "--layoutSideMenuColor7E84A3", "#fff");
    this.serRootStyle("root", "--layoutSideMenuColor344563", "#fff");
    this.serRootStyle("root", "--layoutSideMenuColorFFF", v);
    this.serRootStyle("root", "--layoutSideMenuColorF9F8FD", v);
    this.serRootStyle("root", "--layoutSideMenuColorF9F8FD-rgba", this.colorRgb("#F9F8FD", 0.1));
    this.serRootStyle("root", "--layoutSideMenuSelected", "#fff");
    this.serRootStyle("root", "--layoutSideMenuColorArrow", "#fff");
    this.serRootStyle("root", "--homeSideMenuCollapseSelected", v);
    this.serRootStyle("root", "--homeSideMenuColorIconfont", this.colorRgb("#F9F8FD", 0.1));
  }
  // 设置主题布局左侧菜单
  setLayoutThemeLayoutLeftAll(v) {
    this.setLayoutColor(v);
    this.setLayoutThemeLayoutTopInit(v);
    this.setLayoutThemeLayoutLeft(v);
    this.serRootStyle("root", "--layoutBeaconCol", "#fff");
    this.serRootStyle("root", "--layoutBeaconBg", v);
    this.serRootStyle("root", "--layoutBeacon", "#fff");
  }
  // 主题布局左侧菜单
  setLayoutThemeLayoutTop(v) {
    this.setLayoutColor(v);
    this.setLayoutThemeLayoutLeftInit(v);
    this.serRootStyle("root", "--layoutTopMenuBtn", "#fff");
    this.serRootStyle("root", "--layoutTopMenuCol", "#fff");
    this.serRootStyle("root", "--layoutTopMenuBtnCol", v);
    this.serRootStyle("root", "--layoutTopBadgeCol", v);
    this.serRootStyle("root", "--layoutTopBadge", "#ffffff");
    this.serRootStyle("root", "--layoutBeaconBg", v);
    this.serRootStyle("root", "--layoutBeacon", "#fff");
    this.serRootStyle("root", "--layoutBeaconCol", "#fff");
    this.serRootStyle("root", "--layoutTopMenuIsActive", "#fff");
    this.serRootStyle("root", "--layoutTopMenuBg", v);
    this.serRootStyle("root", "--layoutBeaconBr", this.colorRgb(v, 0.1));
  }
  // 主题色系设置
  setLayoutColor(v) {
    this.serRootStyle("root", "--layoutTopMenuBtn", v);
    this.serRootStyle("root", "--layoutSideMenuSelected", v);
    this.serRootStyle("root", "--layoutMain-6359CA", v);
    this.serRootStyle("root", "--layoutMain-7C90FF", v);
    this.serRootStyle("root", "--layoutMain-6359CA-rgba", this.colorRgb(v, 0.4));
    this.serRootStyle("root", "--layoutTopBadgeCol", "#ffffff");
    this.serRootStyle("root", "--layoutBeacon", v);
    this.serRootStyle("root", "--layoutBreadcrumbCol", v);
    this.serRootStyle("root", "--layoutDetailMore", v);
    this.serRootStyle("root", "--layoutTopMenuIsActive", v);
    this.serRootStyle("root", "--layoutTopBadge", v);
    this.serRootStyle("root", "--layoutPickerBrNone", "none");
    this.serRootStyle("root", "--layoutMain-6359CA-rgba1", this.colorRgb(v, 0.9));
    this.serRootStyle("root", "--layoutMain-6359CA-rgba2", this.colorRgb(v, 1));
  }
  // 判断设置了那个主题
  isThemeLayout(value, color) {
    if (value == "0") {
      this.setLayoutThemeLayoutDefault(color);
    } else if (value == "1") {
      this.setLayoutThemeLayoutLeft(color);
    } else if (value == "2") {
      this.setLayoutThemeLayoutTop(color);
    } else if (value == "3") {
      this.setLayoutThemeLayoutLeftAll(color);
    }
  }
}
export default new LayoutColorSetting();
