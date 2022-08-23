import { ElButton, ElInput, ElContainer, ElHeader, ElDatePicker, ElCheckbox } from 'element-plus'
import { ref } from "vue"
const value = ref('')
const checkValue = ref(true)
function componentsConfig() {
    let componentList = []
    let componentMap = {}
    return {
        componentList,
        componentMap,
        register: (component) => {
            componentList.push(component)
            componentMap[component.key] = component
        }
    }
}
export var config = componentsConfig()
config.register({
    label: '文本',
    render: () => "渲染文本",
    preview: () => "预览文本",
    key: 'text'
})
config.register({
    label: '按钮',
    render: () => <ElButton>按钮</ElButton>,
    preview: () => <ElButton>按钮</ElButton>,
    key: 'button'
})
config.register({
    label: '输入框',
    render: () => { return <ElInput placeholder="输入框"></ElInput> },
    preview: () => <ElInput placeholder="输入框"></ElInput>,
    key: 'input'
})
config.register({
    label: '布局容器',
    render: () => <ElContainer>布局容器</ElContainer>,
    preview: () => <ElContainer>布局容器</ElContainer>,
    key: 'container'
})
config.register({
    label: '头部容器',
    render: () => <ElHeader>头部容器</ElHeader>,
    preview: () => <ElHeader>头部容器</ElHeader>,
    key: 'header'
})
config.register({
    label: '日期',
    render: () => <ElDatePicker type="date" placeholder="Pick a Date" format="YYYY/MM/DD" v-model={value} />,
    preview: () => <ElDatePicker type="date" placeholder="Pick a Date" format="YYYY/MM/DD" style={{ width: "120px" }} />,
    key: 'date'
})
config.register({
    label: '多选框',
    render: () => <ElCheckbox checked={checkValue} label="Option 1" />,
    preview: () => <ElCheckbox checked={checkValue} label="Option 1" />,
    key: 'checkbox'
})
