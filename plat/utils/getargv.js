/*
 * @Description: 
 * @Author: 李大玄
 * @Date: 1985-10-26 16:15:00
 * @FilePath: /framework/plat/src/utils/getargv.js
 * @LastEditors: 李大玄
 * @LastEditTime: 2022-08-19 10:30:57
 */

// 判断是否是参数名
const isKey = function (value) {
  if (/^-+/.test(value)) {
    return true;
  }
  return false;
}

const getKey = function (value) {
  return String(value).replace(/^-+/, '')
}

const getValue = function (value) {
  if (value === 'true') {
    return true;
  } else if (value === 'false') {
    return false;
  }
  return value || null;
}

const getArgvs = function () {
  const argv = [].concat(process.argv).slice(1);
  const data = {}
  for (let i = 0, size = argv.length; i < size; i++) {
    const key = String(argv[i]);
    if (isKey(key)) {
      const value = String(argv[i + 1]);
      const name = getKey(key)
      if (isKey(value)) {
        data[name] = true;
      } else {
        data[name] = getValue(value);
        i += 1;
      }
    }
  }
  return data;
}

const argvs = getArgvs();
module.exports = argvs;
exports.default = argvs;