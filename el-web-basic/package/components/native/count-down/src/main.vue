<!--
 * @Author: 段丽军
 * @Date: 2021-11-19 16:46:32
 * @LastEditTime: 2021-11-19 16:48:20
 * @LastEditors: 段丽军
 * @Description: 
 * @FilePath: /el-web-basic/package/components/native/count-down/src/main.vue
-->
<template>
    <el-button
          :disabled="send_code_button"
          v-bind="$attrs"
          @click="public_button"
    >{{send_text}}</el-button>
</template>

<script>
    export default {
        name: 'ECountDownN',
        props: {
            text: {
                type: String,
                default: "发送验证码"
            },
            text_splicing: {
                type: Boolean,
                default: true
            },
            prepare_text: {
                type: String,
                default: "发送验证码"
            },
            coundown: {
                type: Number,
                default:60
            },
        },
        data() {
            return {
                send_timer: null,
                send_count_down: "",
                send_text:this.text,
                send_code_button: false,
            };
        },
        methods: {
            public_button_splicing(send_count_down,Boo) {
                this.send_code_button = Boo ;
                if(this.text_splicing){
                    this.send_text =  send_count_down + "s" + "后重新发送";
                }else {
                    this.send_text =  send_count_down + "s" ;
                }
            },
            public_button() {
                const TIME_COUNT = this.coundown;
                if (this.send_code_button) return;
                if (!this.send_timer) {
                    clearInterval(this.send_timer);
                    this.send_code_interface();
                    this.send_count_down = TIME_COUNT;
                    this.public_button_splicing(this.send_count_down,true);
                    this.send_timer = setInterval(() => {
                        if (this.send_count_down > 0 && this.send_count_down <= TIME_COUNT) {
                            this.send_count_down--;
                            this.public_button_splicing(this.send_count_down,true);
                        } else {
                            this.send_text = this.prepare_text;
                            clearInterval(this.send_timer);
                            this.send_timer = null;
                            this.send_code_button = false;
                        }
                    }, 1000);
                }
            },
            send_code_interface() {
                this.$emit('interfance_code_send');     //向外分发一个方法，在组件外部发起发送验证码的接口
            },
        },
    };
</script>

