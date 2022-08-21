import { ElDialog, ElInput, ElButton } from "element-plus";
import { reactive, defineComponent, render, createVNode } from "vue";
const Dialog = defineComponent({
    props: {
        option: { type: Object }
    },
    setup(props, context) {
        const state = reactive({
            isShow: false,
            option: props.option
        })
        context.expose({
            dialogShow(option) {
                state.isShow = true
                state.option = option
            }
        })
        const cancel = () => {
            state.isShow = false
        }
        const confirm = () => {
            state.isShow = false
            state.option.onConfirm && state.option.onConfirm(state.option.container)
        }
        return () => {
            return <ElDialog v-model={state.isShow} title={state.option.title}>
                {{
                    default: () => <ElInput
                        type="textarea"
                        v-model={state.option.container}
                        rows={10}
                    ></ElInput>,
                    footer: () => state.option.footer && <div>
                        <ElButton onClick={cancel}>取消</ElButton>
                        <ElButton type="primary" onClick={confirm}>确定</ElButton>
                    </div>
                }}
            </ElDialog>
        }
    }

})
var vm
export default function $dialog(option) {
    if (!vm) {
        let el = document.createElement("div")
        vm = createVNode(Dialog, { option })
        document.body.appendChild((render(vm, el), el))
    }
    let { dialogShow } = vm.component.exposed
    dialogShow(option)
}