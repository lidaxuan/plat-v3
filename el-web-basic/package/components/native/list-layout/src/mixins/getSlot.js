export default {
  //方法集合
  methods: {
    getSlot(slotName, params) {
      return this.$scopedSlots[slotName] ? this.$scopedSlots[slotName](params) : null;
    },
  }
}