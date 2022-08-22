import { defineComponent, computed, inject, ref, onMounted } from "vue";

export default defineComponent({
    props: {
        comInfo: { type: Object }
    },
    setup(props) {
        const comStyle = computed({
            get: () => {
                return {
                    top: `${props.comInfo.top}px`,
                    left: `${props.comInfo.left}px`,
                    zIndex: `${props.comInfo.zIndex}`,
                }
            },
            set: (val) => {
                //修改计算属性
            }
        })
        const centerRef = ref(null)
        const config = inject("config")
        const component = config.componentMap[props.comInfo.key].render()
        onMounted(() => {
            const { offsetHeight, offsetWidth } = centerRef.value
            if (props.comInfo.alignCenter) { //修改松手时元素位置
                props.comInfo.left -= offsetWidth / 2
                props.comInfo.top -= offsetHeight / 2
                props.comInfo.alignCenter = false
            }
            props.comInfo.width = offsetWidth
            props.comInfo.height = offsetHeight
        })
        return () => {
            return <div
                style={comStyle.value} ref={centerRef}
            >
                {component}
            </div>
        }
    }
})