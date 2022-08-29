import deepcopy from "deepcopy"
import { ElButton, ElDialog, ElInput, ElTable, ElTableColumn } from "element-plus"
import { defineComponent, createVNode, render, reactive } from "vue"

const TableDialog = defineComponent({
    props: {
        option: Object
    },
    setup(props, context) {
        const state = reactive({
            option: props.option,
            isShow: false,
            tableData: []
        })
        const methords = {
            dialogShow(option) {
                state.option = option //更新state数据
                state.isShow = true
                state.tableData = deepcopy(option.options)
            }
        }
        const add = () => {
            state.tableData.push({})
        }
        const cancel = () => {
            state.isShow = false
        }
        const confirm = () => {
            state.option.onConfirm(state.tableData)
            cancel()
        }
        context.expose(methords)
        return () => {
            return <ElDialog v-model={state.isShow} title={state.option.config.label}>
                {{
                    default: () => {
                        return <div>
                            <div>
                                <ElButton type="primary" onClick={add}>添加</ElButton>
                                <ElButton>重置</ElButton>
                            </div>
                            <ElTable data={state.tableData}>
                                <ElTableColumn type="index"></ElTableColumn>
                                {state.option.config.table.options.map((item, index) => {
                                    return <ElTableColumn label={item.label}>
                                        {{
                                            default: ({ row }) => <ElInput v-model={row[item.filed]}></ElInput>
                                        }}
                                    </ElTableColumn>
                                })}
                                <ElTableColumn label="操作">
                                    <ElButton type="danger">删除</ElButton>
                                </ElTableColumn>
                            </ElTable>
                        </div>
                    },
                    footer: () => <div>
                        <ElButton type="primary" onClick={confirm}>确认</ElButton>
                        <ElButton onClick={cancel}>取消</ElButton>
                    </div>
                }}
            </ElDialog>
        }
    }
})
var vm
export default function $tableDialog(option) {
    if (!vm) {
        let el = document.createElement("div")
        vm = createVNode(TableDialog, { option })
        document.body.appendChild((render(vm, el), el))
    }
    let { dialogShow } = vm.component.exposed
    dialogShow(option)
}