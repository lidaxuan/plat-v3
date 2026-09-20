
<template>
  <div class="duration" v-cloak ref="duration">
    <div v-show="disabled" class="mark"></div>
    <table class="time-table" @mousedown="onMousedown" @mouseup="onMouseup" @mouseover="onMouseover">
      <colgroup>
        <col class="day" />
        <col class="hour" v-for="i in 48" :key="i" />
      </colgroup>
      <thead>
        <tr>
          <th class="day" rowspan="2">
            <span font="h6">星期\时间</span>
          </th>
          <th colspan="24">00:00-12:00</th>
          <th colspan="24">12:00-24:00</th>
        </tr>
        <tr>
          <th colspan="2" v-for="i in 24" :key="i">
            <span>{{ i - 1 }}</span>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, x) in time" :key="x">
          <td class="day">
            <span font="h6">周{{ x | day }}</span>
          </td>
          <template v-for="(value, y) in item" :key="`${x}-${y}`">
            <td class="hour" :class="value | classNmae" :style="getbgColor(value)" :data-x="x" :data-y="y" @click="checkendItem"></td>
          </template>
        </tr>
      </tbody>
    </table>
    <div class="duration-tipline">
      <div class="empty-button" @click="empty">
        <span>
          <b>清空</b>
        </span>
      </div>
      <div>
        <span class="sample off" font="h5"></span>
        <label font="h5">未选</label>
        <span class="sample on" :style="`background-color: ${color};`" font="h5"></span>
        <label font="h5">已选</label>
        <label class="ml20 gray" font="h5">可拖动鼠标选择时间</label>
      </div>
    </div>
  </div>
</template>
<script>
import _ from 'lodash';
// import seafSet from '@lijixuan/safe-set';
// import seafGet from '@lijixuan/safe-get';

const On = '1';
const Off = '0';

function create_data() {
  let arr = [];
  for (let i = 0; i < 48; i++) {
    arr.push({
      value: Off,
      state: false,
    });
  }
  return arr;
}

export default {
  name: 'ETimerN',
  data: function () {
    return {
      time: [],
      text: '',
    };
  },
  props: {
    value: {
      type: String,
      default: function () {
        return '';
      },
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    color: {
      type: String,
      default: () => '#50aad8',
    },
  },
  filters: {
    day: function (index) {
      return ['一', '二', '三', '四', '五', '六', '日'][index];
    },
    classNmae: function (item) {
      if (item.value === On) {
        return {
          on: true,
        };
      }
      return {
        off: true,
      };
    },
  },
  created() {
    this.autoSelect();
  },
  mounted() {},
  methods: {
    getbgColor(item) {
      if (item.value === On) {
        return `background-color: ${this.color};`
      }
      return '';
    },
    getDom(e) {
      const { target } = e || {};
      if (target) {
        const className = target.getAttribute('class');
        if (className && className.includes('hour')) {
          return target;
        }
      }
    },
    getCoordinate(e) {
      const dom = this.getDom(e);
      if (dom) {
        let x = dom.getAttribute('data-x');
        let y = dom.getAttribute('data-y');
        return {
          x: _.toInteger(x),
          y: _.toInteger(y),
        };
      }
    },
    onMousedown(e) {
      const dom = this.getDom(e);
      if (dom) {
        const start = this.getCoordinate(e);
        if (start) {
          this.start = start;
          this.mousedown = true;
        }
      }
    },
    onMouseup() {
      if (this.mousedown) {
        this.mousedown = false;
        this.success();
      }
    },
    onMouseover(e) {
      if (this.mousedown) {
        let end = this.getCoordinate(e);
        if (end) {
          this.SelectTD(this.start, end);
        }
      }
    },
    SelectTD: function (start, end) {
      const y1 = Math.min(_.toInteger(start.y), _.toInteger(end.y));
      const y2 = Math.max(_.toInteger(start.y), _.toInteger(end.y));
      const x1 = Math.min(_.toInteger(end.x), _.toInteger(end.x));
      const x2 = Math.max(_.toInteger(start.x), _.toInteger(end.x));
      let array = _.map(this.time, (item) => [].concat(item));
      for (let i = x1; i <= x2; i++) {
        for (let j = y1; j <= y2; j++) {
          let item = Object.assign({}, array[i][j]);
          //在同一次鼠标按下的过程中，选中过的表格不进行选中或取消操作
          if (item.state) {
            continue;
          }
          item.state = true;
          item.value = item.value === On ? Off : On;
          array[i][j] = item;
        }
      }
      this.time = array;
    },
    success() {
      const text = [];
      this.time = _.map(this.time, function (arr) {
        return _.map(arr, function (item) {
          item.state = false;
          text.push(String(item.value));
          return item;
        });
      });
      const value = text.join('');
      this.$emit('input', value);
    },
    checkendItem(e) {
      let coordinate = this.getCoordinate(e);
      const key = `[${coordinate.x}][${coordinate.y}].value`;
      const value = seafGet(this.time, key) === On ? Off : On;
      seafSet(this.time, key, value);
      this.success();
    },
    // 清空数据
    empty() {
      this.mousedown = false;
      this.time = _.map(this.time, function () {
        return create_data();
      });
      this.success();
    },
    autoSelect() {
      let time = [];
      for (let j = 0; j < 7; j++) {
        let text = this.value.slice(j * 48, (j + 1) * 48);
        let day = [];
        if (text) {
          text = text.split('');
          for (let i = 0; i < 48; i++) {
            text[i] = parseInt(text[i]);
            if (_.isNaN(text[i]) || !text[i]) {
              day[i] = {
                value: Off,
                state: false,
              };
            } else {
              day[i] = {
                value: String(text[i]),
                state: false,
              };
            }
          }
        } else {
          day = create_data();
        }
        time.push(day);
      }
      _.assign(this.$data, {
        time: time,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
/*
  高级时间
*/

.duration {
  position: relative;
  $width: 670px;
  $day: 70px;

  width: $width;
  .mark {
    position: absolute;
    left: 0;
    top: 0;
    z-index: 10;
    width: 100%;
    height: 100%;
    cursor: not-allowed;
  }

  thead {
    th {
      height: 24px;
    }
  }
  .time-table {
    width: 100%;
    table-layout: fixed;
    border-collapse: collapse;
    th,
    td {
      border: 1px solid #d1d1d1;
    }

    .day,
    .hour {
      height: 30px;
      outline: none;
      user-select: none;
    }

    .day {
      width: $day;
      text-align: center;
    }
    .hour {
      cursor: pointer;
    }
    span {
      font-weight: normal;
    }
  }

  .on {
    background-color: #50aad8;
  }
  .off {
    background-color: none;
  }

  .duration-tipline {
    padding: 5px;
    .sample {
      width: 15px;
      height: 15px;
      border: 1px solid #d1d1d1;
    }
    span,
    label {
      display: inline-block;
      vertical-align: middle;
    }
    .gray {
      color: #999;
    }
    .empty-button {
      float: right;
      cursor: pointer;
    }
  }
}
</style>
