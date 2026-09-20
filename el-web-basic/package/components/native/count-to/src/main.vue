<!--
 * @Description: 
 * @Author: 李大玄
 * @Date: 2021-12-01 14:09:31
 * @FilePath: /el-web-basic/package/components/native/count-to/src/main.vue
-->
<template>
  <span>
    {{ displayValue }}
  </span>
</template>
<script>


let lastTime = 0;
const requestAnimationFrame = function (callback) {
  const currTime = new Date().getTime();
  // 为了使setTimteout的尽可能的接近每秒60帧的效果 // 1000 / 60 ~ 16
  const timeToCall = Math.max(0, 16 - (currTime - lastTime));
  const id = window.setTimeout(() => {
    callback(currTime + timeToCall);
  }, timeToCall);
  lastTime = currTime + timeToCall;
  return id;
};

const cancelAnimationFrame = function (id) {
  window.clearTimeout(id);
};

export default {
  name: 'ECountToN',
  props: {
    startVal: {
      // 开始
      type: Number,
      required: false,
      default: 0,
    },
    endVal: {
      // 结束
      type: Number,
      required: false,
      default: 2021,
    },
    duration: {
      // 时长
      type: Number,
      required: false,
      default: 3000,
    },
    autoplay: {
      // 是否自动开始
      type: Boolean,
      required: false,
      default: true,
    },
    decimals: {
      // 保留几位小数
      type: Number,
      required: false,
      default: 0,
      validator(value) {
        return value >= 0;
      },
    },
    decimal: {
      type: String,
      required: false,
      default: '.',
    },
    separator: {
      // 分隔符
      type: String,
      required: false,
      default: ',',
    },
    prefix: {
      // 前缀
      type: String,
      required: false,
      default: '',
    },
    suffix: {
      // 后缀
      type: String,
      required: false,
      default: '',
    },
  },
  data() {
    return {
      localStartVal: this.startVal,
      displayValue: this.formatNumber(this.startVal),
      printVal: null,
      paused: false,
      localDuration: this.duration,
      startTime: null,
      timestamp: null,
      remaining: null,
      timeObject: null,

      num: 1,
    };
  },
  computed: {
    countDown() {
      return this.startVal > this.endVal;
    },
  },
  watch: {
    startVal() {
      if (this.autoplay) {
        this.start();
      }
    },
    endVal() {
      if (this.autoplay) {
        this.start();
      }
    },
  },
  mounted() {
    if (this.autoplay) {
      this.start();
    }
  },
  methods: {
    start() {
      this.localStartVal = this.startVal;
      this.startTime = null;
      this.localDuration = this.duration;
      this.paused = false;
      this.timeObject = requestAnimationFrame(this.count);
    },
    pauseResume() {
      if (this.paused) {
        this.resume();
      } else {
        this.pause();
      }
      this.paused = !Boolean(this.paused);
    },
    pause() {
      cancelAnimationFrame(this.timeObject);
    },
    resume() {
      this.startTime = null;
      this.localDuration = +this.remaining;
      this.localStartVal = +this.printVal;
      requestAnimationFrame(this.count);
    },
    reset() {
      this.startTime = null;
      cancelAnimationFrame(this.timeObject);
      this.displayValue = this.formatNumber(this.startVal);
    },
    count(timestamp) {
      this.num += 1;
      if (!this.startTime) {
        this.startTime = timestamp;
      }
      this.timestamp = timestamp;
      const progress = timestamp - this.startTime;
      this.remaining = this.localDuration - progress;

      if (this.countDown) {
        this.printVal = this.localStartVal - (this.localStartVal - this.endVal) * (progress / this.localDuration);
      } else {
        this.printVal = this.localStartVal + (this.endVal - this.localStartVal) * (progress / this.localDuration);
      }
      if (this.countDown) {
        this.printVal = this.printVal < this.endVal ? this.endVal : this.printVal;
      } else {
        this.printVal = this.printVal > this.endVal ? this.endVal : this.printVal;
      }

      this.displayValue = this.formatNumber(this.printVal);
      if (progress < this.localDuration) {
        this.timeObject = requestAnimationFrame(this.count);
      } else {
        this.$emit('callback');
      }
    },
    isNumber(val) {
      return !isNaN(parseFloat(val));
    },
    formatNumber(num) {
      num = String(num.toFixed(this.decimals));
      const x = num.split('.');
      let x1 = x[0];
      const x2 = x.length > 1 ? this.decimal + x[1] : '';
      const rgx = /(\d+)(\d{3})/;
      if (this.separator && !this.isNumber(this.separator)) {
        while (rgx.test(x1)) {
          x1 = x1.replace(rgx, '$1' + this.separator + '$2');
        }
      }
      return this.prefix + x1 + x2 + this.suffix;
    },
  },
};
</script>
