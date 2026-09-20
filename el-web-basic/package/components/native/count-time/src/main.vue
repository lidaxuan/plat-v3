<template>
    <div>
        <p v-if="myTime.show">
            <span v-if="tipShow">{{tipText}}：</span>
            <span v-if="!tipShow">{{tipTextEnd}}：</span>
            <span v-if="myTime.days>0">
                   <span>{{myTime.days}}</span>
                    <i>{{daysTxt}}</i>
            </span>
            <span>{{myTime.hours}}</span><i>{{hoursTxt}}</i>
            <span>{{myTime.minutes}}</span><i>{{minutesTxt}}</i>
            <span>{{myTime.seconds}}</span><i>{{secondsTxt}}</i>
        </p>
        <p v-if="!myTime.show">{{endText}}</p>
    </div>
</template>
<script>
    export default {
        name: 'ECountTimeN',
        replace: true,
        data() {
            return {
                tipShow: true,
                myTime: {
                    //倒计时数值
                    show: false, //倒计时状态
                    days: "", //天
                    hours: "", //小时
                    minutes: "", //分钟
                    seconds: "" //秒
                },
                star: "", //活动开始时间
                end: "", //活动结束时间
                current: "" //当前时间
            };
        },
        props: {
            //距离开始提示文字
            tipText: {
                type: String,
                default: "距离开始"
            },
            //距离结束提示文字
            tipTextEnd: {
                type: String,
                default: "距离结束"
            },
            //当前时间
            currentTime: {
                type: Number
            },
            // 活动开始时间
            startTime: {
                type: Number
            },
            // 活动结束时间
            endTime: {
                type: Number
            },
            // 倒计时结束显示文本
            endText: {
                type: String,
                default: "已结束"
            },
            //自定义显示文字:天
            daysTxt: {
                type: String,
                default: ":"
            },
            //自定义显示文字:时
            hoursTxt: {
                type: String,
                default: ":"
            },
            //自定义显示文字:分
            minutesTxt: {
                type: String,
                default: ":"
            },
            //自定义显示文字:秒
            secondsTxt: {
                type: String,
                default: ":"
            }
        },
        mounted() {
            this.milliseconds();
        },
        methods: {
            milliseconds() {
                //判断是秒还是毫秒
                

                this.startTime.toString().length === 10 ? (this.star = this.startTime * 1000) : (this.star = this.startTime);
                this.endTime.toString().length === 10 ? (this.end = this.endTime * 1000) : (this.end = this.endTime);
                if (this.currentTime) {
                    this.currentTime.toString().length === 10
                          ? (this.current = this.currentTime * 1000)
                          : (this.current = this.currentTime);
                } else {
                    this.current = new Date().getTime();
                }

                if (this.end < this.current) {
                    /**
                     * 结束时间小于当前时间 活动已结束
                     */
                    this.myTime.show = false;
                    this.end_message();
                } else if (this.current < this.star) {
                    /**
                     * 当前时间小于开始时间 活动尚未开始
                     */
                    this.$set(this, "tipShow", true);
                    setTimeout(() => {
                        this.runTime(this.star, this.current, this.start_message);
                    }, 1);
                } else if (
                      (this.end > this.current && this.star < this.current) ||
                      this.star == this.current
                ) {
                    /**
                     * 结束时间大于当前并且开始时间小于当前时间，执行活动开始倒计时
                     */
                    this.$set(this, "tipShow", false);
                    this.myTime.show = true;
                    this.$emit("start_callback", this.myTime.show);
                    setTimeout(() => {
                        this.runTime(
                              this.end,
                              this.current,
                              this.end_message,
                              true
                        );
                    }, 1);
                }
            },
            runTime(startTime, endTime, callFun, type) {
                let timeLag = (startTime - endTime) / 1000;
                let add = num => {
                    return num < 10 ? '0' + num : num;
                }
                // 时间倒计时运算的方法
                if (timeLag > 0) {
                    let time = timeLag--;
                    this.myTime = {
                        //倒计时数值
                        show: true, //倒计时状态
                        days: `${add(Math.floor(time / 60 / 60 / 24))}`, //天
                        hours: `${add(Math.floor(time / 60 / 60) % 24)}`, //小时
                        minutes: `${add(Math.floor(time / 60) % 60)}`, //分钟
                        seconds: `${add(Math.floor(time % 60))}` //秒
                    }
                    setTimeout(() => {
                        type?this.runTime(this.end, (endTime += 1000), callFun, true): this.runTime(this.star, (endTime += 1000), callFun);
                    }, 1000);
                } else {
                    callFun();
                }
            },
            start_message() {
                this.$set(this, "tipShow", false);
                this.$emit("start_callback", this.myTime.show);
                setTimeout(() => {
                    this.runTime(this.end, this.star, this.end_message, true);
                }, 1);
            },
            end_message() {
                this.myTime.show = false;
                if (this.currentTime <= 0)return;
                this.$emit("end_callback", this.myTime.show);
            }
        }
    };
</script>
<style lang="scss" scoped>
    .bg{
        color: rgb(235, 62, 61);
    }
</style>
