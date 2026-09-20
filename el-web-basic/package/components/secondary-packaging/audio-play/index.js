/*
 * @Author: 段丽军
 * @Date: 2021-06-03 10:29:40
 * @LastEditTime: 2021-09-02 15:20:44
 * @LastEditors: 段丽军
 * @Description:
 * @FilePath: /code/el-web-basic/package/components/secondary-packaging/audio-play/index.ts
 */
import EAudioPlaySp from './src/main.vue';

/* istanbul ignore next */
EAudioPlaySp.install = function(Vue) {
  Vue.component(EAudioPlaySp.name, EAudioPlaySp);
};

export default EAudioPlaySp;
