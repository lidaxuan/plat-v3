/*
 * @Description: 布局主题色运行时配置
 * @Author: lidaxuan
 * @Date: 2026-09-04 15:27:53
 * @FilePath: plat/layouts/layoutColorSetting.ts
 * @LastEditors: lijixuan
 * @LastEditTime: 2026-09-08
*/

/** 主题色值（hex 格式，如 "#6359CA"） */
type ThemeColor = string;

/** 主题布局模式：0=默认 / 1=左侧菜单 / 2=顶部菜单 / 3=左侧菜单(全) */
type ThemeLayoutMode = '0' | '1' | '2' | '3';

/**
 * 布局主题色运行时配置
 * 通过 serRootStyle 动态写入 CSS 自定义属性到 :root，
 * 各布局组件通过 var(--layoutXxx) 消费对应变量实现主题切换。
 */
class LayoutColorSetting {

  /**
   * 十六进制色值转 rgba 字符串
   * @param hex hex 色值，支持 #rgb 和 #rrggbb 两种格式
   * @param opacity 透明度 0~1
   * @returns rgba 字符串，如 "rgba(99,89,202,0.4)"；hex 为空时返回空字符串
   */
  colorRgb(hex: string, opacity: number): string {
    if (!hex) return "";
    let sColor = hex.toLowerCase();
    // 处理 #rgb 缩写形式，补全为 #rrggbb
    if (sColor.length === 4) {
      let sColorNew = "#";
      for (let i = 1; i < 4; i += 1) {
        sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1));
      }
      sColor = sColorNew;
    }
    // 解析 r/g/b 分量
    const sColorChange: number[] = [];
    for (let j = 1; j < 7; j += 2) {
      sColorChange.push(parseInt("0x" + sColor.slice(j, j + 2)));
    }
    return "rgba(" + sColorChange.join(",") + "," + opacity + ")";
  }

  /**
   * 向 :root 写入 CSS 自定义属性
   * @param root 伪类名（如 "root" → :root）
   * @param val CSS 变量名（如 "--layoutSideMenuBg"）
   * @param style 变量值（如 "#ffffff"）
   */
  serRootStyle(root: string, val: string, style: string): void {
    const roots = document.querySelector(":" + root) as HTMLElement;
    roots?.style.setProperty(val, style);
  }

  /**
   * 初始化左侧菜单变量（默认主题配色）
   * @param v 主题色 hex 值
   */
  setLayoutThemeLayoutLeftInit(v: ThemeColor): void {
    this.serRootStyle("root", "--layoutSideMenuBg", "#ffffff");
    this.serRootStyle("root", "--layoutSideMenuColor7E84A3", "#7E84A3");
    this.serRootStyle("root", "--layoutSideMenuColorFFF", "#ffffff");
    this.serRootStyle("root", "--layoutSideMenuSelected", v);
    this.serRootStyle("root", "--layoutSideMenuColorF9F8FD", "#F9F8FD");
    this.serRootStyle("root", "--layoutSideMenuColorF9F8FD-rgba", this.colorRgb("#F9F8FD", 0.1));
    this.serRootStyle("root", "--layoutSideMenuColorArrow", "#7E84A3");
    this.serRootStyle("root", "--layoutSideMenuColor344563", "#344563");
  }

  /**
   * 初始化顶部菜单变量（默认主题配色）
   * @param v 主题色 hex 值
   */
  setLayoutThemeLayoutTopInit(v: ThemeColor): void {
    this.serRootStyle("root", "--layoutTopMenuCol", "#7E84A3");
    this.serRootStyle("root", "--layoutBeaconBg", "#ffffff");
    this.serRootStyle("root", "--layoutBeacon", v);
    this.serRootStyle("root", "--layoutBeaconCol", "#2c3e50");
    this.serRootStyle("root", "--layoutTopMenuBg", "#ffffff");
    this.serRootStyle("root", "--layoutTopMenuIsActive", v);
  }

  /**
   * 默认主题（mode=0）
   * 左侧浅底 + 顶部浅底，主题色用于选中态/高亮
   * @param v 主题色 hex 值
   */
  setLayoutThemeLayoutDefault(v: ThemeColor): void {
    this.setLayoutColor(v);
    this.setLayoutThemeLayoutLeftInit(v);
    this.setLayoutThemeLayoutTopInit(v);
  }

  /**
   * 左侧菜单主题（mode=1）
   * 左栏通铺主题色，文字/图标反白
   * @param v 主题色 hex 值
   */
  setLayoutThemeLayoutLeft(v: ThemeColor): void {
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
  }

  /**
   * 左侧菜单主题-全量（mode=3）
   * 在 mode=1 基础上，信标区域也反白为主题色底
   * @param v 主题色 hex 值
   */
  setLayoutThemeLayoutLeftAll(v: ThemeColor): void {
    this.setLayoutColor(v);
    this.setLayoutThemeLayoutTopInit(v);
    this.setLayoutThemeLayoutLeft(v);
    this.serRootStyle("root", "--layoutBeaconCol", "#fff");
    this.serRootStyle("root", "--layoutBeaconBg", v);
    this.serRootStyle("root", "--layoutBeacon", "#fff");
  }

  /**
   * 顶部菜单主题（mode=2）
   * 顶部通铺主题色，左栏保持浅底
   * @param v 主题色 hex 值
   */
  setLayoutThemeLayoutTop(v: ThemeColor): void {
    this.setLayoutColor(v);
    this.setLayoutThemeLayoutLeftInit(v);
    this.serRootStyle("root", "--layoutTopMenuCol", "#fff");
    this.serRootStyle("root", "--layoutBeaconBg", v);
    this.serRootStyle("root", "--layoutBeacon", "#fff");
    this.serRootStyle("root", "--layoutBeaconCol", "#fff");
    this.serRootStyle("root", "--layoutTopMenuIsActive", "#fff");
    this.serRootStyle("root", "--layoutTopMenuBg", v);
  }

  /**
   * 主题色系基础设置（被各主题方法复用）
   * 写入跨主题通用的变量：选中色、主色、面包屑、信标、高亮等
   * @param v 主题色 hex 值
   */
  setLayoutColor(v: ThemeColor): void {
    this.serRootStyle("root", "--layoutSideMenuSelected", v);
    this.serRootStyle("root", "--layoutMain-6359CA", v);
    this.serRootStyle("root", "--layoutBreadcrumbCol", v);
    this.serRootStyle("root", "--layoutTopMenuIsActive", v);
    this.serRootStyle("root", "--layoutBeacon", v);
  }

  /**
   * 根据主题布局模式分发到对应主题设置
   * @param value 主题布局模式 0=默认 / 1=左侧 / 2=顶部 / 3=左侧全量
   * @param color 主题色 hex 值
   */
  isThemeLayout(value: ThemeLayoutMode, color: ThemeColor): void {
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
