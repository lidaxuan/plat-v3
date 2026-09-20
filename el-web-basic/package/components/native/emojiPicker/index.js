
import EEmojiPicker from './src/index.vue';

/* istanbul ignore next */
EEmojiPicker.install = function(Vue) {
  Vue.component(EEmojiPicker.name, EEmojiPicker);
};

export default EEmojiPicker;
