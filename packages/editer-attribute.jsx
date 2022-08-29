import { ElButton, ElColorPicker, ElForm, ElFormItem, ElInput, ElInputNumber, ElOption, ElSelect } from "element-plus"
import { defineComponent, inject, reactive, watch } from "vue"
import deepcopy from "deepcopy"
import { TabelEditer } from "./editer-table"
export const EditerAttribute = defineComponent({
    props: {
        block: Object, //最后选中的元素
        data: Object,
        updateBlock: Function,
        updateContainer: Function
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
        const replay = () => {
            if (!props.block) {
                state.editerData = { width: 550, height: 550 }
                apply()
            } else {
                state.editerData.props = {}
            }
        }
        const apply = () => {
            if (!props.block) {
                props.updateContainer({ ...props.data, container: state.editerData })
            } else {
                props.updateBlock(props.block, state.editerData)
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
                if (component && component.props) {
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
                                    </ElSelect>,
                                    table: () => <TabelEditer options={value} v-model={state.editerData.props[key]}></TabelEditer>
                                }[value.type]()}
                            </ElFormItem>
                        })
                    )
                }
                if (component && component.model) {
                    content.push(
                        // default  
                        Object.entries(component.model).map(([key, value]) => {
                            return <ElFormItem label={value}>
                                <ElInput v-model={state.editerData.model[key]}></ElInput>
                            </ElFormItem>
                        })
                    )
                }
            }
            return <ElForm labelPosition="top" class="editer-attribute">
                {content}
                <ElFormItem class="editer-attribute-item">
                    <ElButton type="primary" onClick={apply}>应用</ElButton>
                    <ElButton onClick={replay}>重置</ElButton>
                </ElFormItem>
            </ElForm>
        }
    }
})