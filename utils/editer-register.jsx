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
const InputProps = (label) => ({ type: "input", label })
const ColorProps = (label) => ({ type: "color", label })
const SelectProps = (label, option) => ({ type: "select", label, option })
config.register({
    label: '文本',
    render: ({ props }) => <span style={{ color: props.color, fontSize: props.size }}>{props.text || "渲染文本"}</span>,
    preview: () => "预览文本",
    key: 'text',
    props: {
        text: InputProps("文本内容"),
        color: ColorProps("字体颜色"),
        size: SelectProps("字体大小", [
            { label: '1rem', value: '1rem' },
            { label: '1.5rem', value: '1.5rem' },
            { label: '2rem', value: '2rem' }
        ])
    }
})
config.register({
    label: '按钮',
    render: ({ props }) => <ElButton type={props.type} size={props.size}>{props.text || "按钮"}</ElButton>,
    preview: () => <ElButton>按钮</ElButton>,
    key: 'button',
    props: {
        text: InputProps("按钮内容"),
        size: SelectProps("按钮大小", [
            { label: "默认", value: '' },
            { label: "小", value: 'small' },
            { label: "大", value: 'large' },
        ]),
        type: SelectProps("按钮类型", [
            { label: '基础', value: 'primary' },
            { label: '成功', value: 'success' },
            { label: '警告', value: 'warning' },
            { label: '危险', value: 'danger' },
            { label: '信息', value: 'info' },
            { label: '文本', value: 'text' },
        ])
    }
})
config.register({
    label: '输入框',
    render: () => { return <ElInput placeholder="输入框"></ElInput> },
    preview: () => <ElInput placeholder="输入框"></ElInput>,
    key: 'input',
    props: {

    }
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
