import { ElButton, ElColorPicker, ElForm, ElFormItem, ElInput, ElInputNumber, ElOption, ElSelect } from "element-plus"
import { defineComponent, inject, reactive, watch } from "vue"
import deepcopy from "deepcopy"
export const EditerAttribute = defineComponent({
    props: {
        block: Object, //最后选中的元素
        data: Object
    },
    setup(props, context) {
        const config = inject("config")
        const state = reactive({
            editerData: {}
        })
        const reset = () => {
            if (!props.block) {
                state.editerData = props.data.container
            } else {
                state.editerData = props.block
            }
        }
        watch(() => props.block, reset, { immediate: true })
        return () => {
            let content = []
            if (!props.block) {
                content.push(<>
                    <ElFormItem label="容器宽度">
                        <ElInputNumber v-model={state.editerData.width}></ElInputNumber>
                    </ElFormItem>
                    <ElFormItem label="容器高度">
                        <ElInputNumber v-model={state.editerData.height}></ElInputNumber>
                    </ElFormItem>
                </>)
            } else {
                const component = config.componentMap[props.block.key]
                content.push(
                    Object.entries(component.props).map(([key, value]) => {
                        return <ElFormItem label={value.label}>
                            {{
                                input: () => <ElInput v-model={state.editerData.props[key]}></ElInput>,
                                color: () => <ElColorPicker v-model={state.editerData.props[key]}></ElColorPicker>,
                                select: () => <ElSelect v-model={state.editerData.props[key]}>
                                    {value.option.map(item => {
                                        return <ElOption label={item.label} value={item.value}></ElOption>
                                    })}
                                </ElSelect>
                            }[value.type]()}
                        </ElFormItem>
                    })
                )
            }
            return <ElForm labelPosition="top" class="editer-attribute">
                {content}
                <ElFormItem class="editer-attribute-item">
                    <ElButton type="primary">应用</ElButton>
                    <ElButton>重置</ElButton>
                </ElFormItem>
            </ElForm>
        }
    }
})