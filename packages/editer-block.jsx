import { defineComponent, computed, inject, ref, onMounted, onBeforeUpdate } from "vue";
import { BlockResize } from "./block-resize";
export default defineComponent({
    props: {
        comInfo: { type: Object },
        formData: { type: Object }
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
            const { width, height } = component.resize || {}

            return <div
                style={comStyle.value} ref={centerRef}
            >
                {component.render({
                    size: props.comInfo.isChanged ? { width: props.comInfo.width, height: props.comInfo.height } : {},
                    props: props.comInfo.props,
                    model: Object.keys(props.comInfo.model || {}).reduce((current, key) => {
                        const propsKey = props.comInfo.model[key]//username
                        current[key] = {
                            modelValue: props.formData[propsKey],
                            "onUpdate:modelValue": val => props.formData[propsKey] = val
                        }
                        return current
                    }, {})
                })}
                {props.comInfo.focus && (width || height) && <BlockResize block={props.comInfo} component={component}></BlockResize>}
            </div>
        }
    }
})