import { defineComponent, computed, inject, ref, onMounted, onBeforeUpdate } from "vue";

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
        const key = computed({
            get: () => {
                return props.comInfo.key
            },
            set: (val) => {

            }
        })
        const centerRef = ref(null)
        const config = inject("config")
        let component = config.componentMap[key.value]
        onBeforeUpdate(() => {
            component = config.componentMap[key.value]
        })
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
                {component.render()}
            </div>
        }
    }
})