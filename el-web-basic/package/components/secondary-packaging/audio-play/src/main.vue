
<template>
	<div class="audio-play">
		<audio
			ref="audio"
			:src="audioSrc"
			@loadedmetadata="onLoadedmetadata"
			@timeupdate="onTimeupdate"
			@error="onerror"
			@play="onPlay"
			@pause="onPause"
			@ended="onended" />
		<slot :data="params">
			<div class="customAudios"
				:style="{
					'background-color': params.ready ? activeColor : inactiveColor,
					'color': params.ready ? activeText : inactiveText }">
				<span>{{ native.sliderVal | parseTime }}</span>
				<el-slider
					style="width:100%;"
					:value="native.sliderVal"
					:disabled="!params.ready"
					:show-tooltip="false"
					:min="0"
					:max="params.duration ? params.duration : 1"
					@mousedown.native="sliderMouseDown"
					@mouseup.native="sliderMouseUp"
					@change="sliderChange"
					@input="sliderInput"
				></el-slider>
				<span>{{ params.duration | parseTime }}</span>
				<div class="audio-icon">
					<i v-show="!native.play" class="el-icon-video-play" @click="playPause"></i>
					<i v-show="native.play" class="el-icon-video-pause" @click="playPause"></i>
				</div>
			</div>
		</slot>
	</div>
</template>

<script>

export default {
	name:'EAudioPlaySp',
	props:{
		// controls: { // 是否显示原生audio标签
		// 	type: Boolean,
		// 	default: false,
		// },
		audioSrc: { // audio数据源，必传
			required: true,
			default: null,
		},
		activeColor: { // 有效数据源可播放时的背景颜色【使用默认组件时可传入】
			default: '#6359CA',
		},
		inactiveColor: { // 有效数据源可播放时的字体颜色【使用默认组件时可传入】
			default: '#999',
		},
		activeText: { // 不可播放时的背景颜色【使用默认组件时可传入】
			default: '#fff',
		},
		inactiveText: { // 不可播放时的背景颜色【使用默认组件时可传入】
			default: '#fff',
		},
		play: { // 是否播放【使用自定义插槽时需传入】
			type: Boolean,
			default: false,
		},
		currentTime: { // 改变播放时间【使用自定义插槽时需传入】
			default: 0,
		},
	},
	data () {
		return {
			load: false, // 加载数据
			params: { // 传给插槽的数据
				ready: false, // 是否可以播放
				duration: 0, // 时长
			},
			native: { // 默认组件用到的属性
				isDrag: false, // 标识是否在拖拽
				sliderVal: 0,
				play: false,
			}
		};
	},
	watch: {
		currentTime: {
			handler(v) {
				this.$refs.audio.currentTime = v;
			}
		},
		audioSrc: {
			handler(v) {
				this.load = true;
				this.$refs.audio.pause();
				this.$emit('ended'); // 通知插槽播放结束
				this.native.play = false; // 播放结束
				this.$refs.audio.currentTime = 0;
				if (!v) {
					this.params.duration = 0;
					this.$emit('timeupdate', 0);
				}
			},
		},
		load: {
			handler(v) {
				if (v) this.params.ready = false;
				else this.params.ready = true;
			}
		},
		play: { // 插槽控制开关
			handler(v) {
				if (v) this.onPlay();
				else this.onPause();
			}
		},
		'native.play': { // 内部组件控制开关
			handler(v) {
				if (v) this.onPlay();
				else this.onPause();
			}
		},
		'native.sliderVal': {
			handler(v) {
				this.$emit('timeupdate', v);
			}
		},
		'params.duration': {
			handler(v) {
				if (v > 0) {
					this.params.ready = true;
				} else {
					this.params.ready = false;
				}
			}
		},
	},
	filters: {
		parseTime(data) {
            const d = data * 1000;
            const hours = parseInt((d % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60), 0);
            const minutes = parseInt((d % (1000 * 60 * 60)) / (1000 * 60), 0);
            const seconds = parseInt((d % (1000 * 60)) / 1000, 0);
            const s = `${(hours < 10 ? (`0${hours}`) : hours)}:${(minutes < 10 ? (`0${minutes}`) : minutes)}:${(seconds < 10 ? (`0${seconds}`) : seconds)}`;
            return s;
		}
	},
	methods: {
		onended() { // 结束
			this.native.play = false;
			this.$emit('ended');
		},
		onPlay() { // 播放
			try {
				this.$refs.audio.play();
			} catch (error) {
				console.log(error);
				this.params.ready = false;
				this.params.duration = 0;
			}
		},
		onPause() { // 暂停
			this.$refs.audio.pause();
		},
		onTimeupdate(res) { // 播放中，播放位置发生改变
			if (!this.native.isDrag) {
				this.native.sliderVal = parseInt(res.target.currentTime, 0);
			}
        },
        onLoadedmetadata(res) { // 元数据被加载时，可判断是否是有效的src数据源
			this.load = false;
			this.params.duration = parseInt(res.target.duration, 0);
        },
		onerror(error) {
			console.log('error，' + error);
			this.params.ready = false;
			this.params.duration = 0;
		},
		sliderInput(v) { // slider鼠标拖动
			this.native.sliderVal = v;
		},
		sliderChange(v) { // slider鼠标松开
			this.$refs.audio.currentTime = v;
			this.native.sliderVal = v;
			this.native.isDrag = false;
		},
		sliderMouseDown(e) {
			if (e.target.className.indexOf('el-slider__button') !== -1 || e.target.className.indexOf('el-slider__button-wrapper') !== -1) {
				this.native.isDrag = true;
			}
		},
		sliderMouseUp() {
			this.native.isDrag = false;
		},

		playPause() {
			if (this.params.ready) {
				this.native.play = !this.native.play;
			}
		},
	}
}
</script>

<style lang='scss' scoped>
.customAudios {
	padding: 20px;
	border-radius: 30px;
	background-color: gray;
	color: #fff;
	display: flex;
	align-items: center;
	transition: all 0.3s;
	& > span {
		padding: 0 20px;
		font-size: 20px;
		font-weight: bold;
	}
	.audio-icon {
		i {
			font-size: 40px;
			cursor: pointer;
		}
	}
}
</style>
