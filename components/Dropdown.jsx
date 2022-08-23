import { reactive, createVNode, render, defineComponent, computed, ref, onMounted, onUnmounted, provide, inject } from "vue";
export const DropdownItem = defineComponent({
    props: {
        label: String,
        icon: String
    },
    setup(props) {
        const { label, icon } = props
        const hide = inject("hide")
        return () => <div class="item-dropdown" onClick={hide}>
            <i class={icon}></i>
            <span>{label}</span>
        </div>
    }
})
const Dropdown = defineComponent({
    props: {
        option: { type: Object }
    },
    setup(props, context) {
        const state = reactive({
            option: props.option,
            isShow: false,
            top: 0,
            left: 0
        })
        const el = ref(null)
        context.expose({
            showDropdown(option) {
                state.option = option
                state.isShow = true
                const { clientX, clientY } = option.eob
                state.top = clientY
                state.left = clientX
            }
        })
        const position = computed(() => {
            return {
                top: `${state.top}px`,
                left: `${state.left}px`
            }
        })
        const onMousedown = (e) => {
            if (el.value && !el.value.contains(e.target)) {
                state.isShow = false;
            }
        }
        const onMouseWheel = (e) => {
            if (el.value && !el.value.contains(e.target)) {
                state.isShow = false;
            }
        }
        provide("hide", () => { state.isShow = false })
        onMounted(() => {
            document.body.addEventListener("mousedown", onMousedown, true)
            document.body.addEventListener("mousewheel", onMouseWheel)
        })
        onUnmounted(() => {
            document.body.removeEventListener("mousedown", onMousedown)
            document.body.removeEventListener("mousewheel", onMouseWheel)
        })
        return () => state.isShow && <div class="contextmenu" style={position.value} ref={el}>
            {state.option.content()}
        </div>
    }
})

var vm
export function $dropdown(option) {
    if (!vm) {
        let el = document.createElement("div")
        vm = createVNode(Dropdown, { option })
        document.body.appendChild((render(vm, el), el))
    }
    let { showDropdown } = vm.component.exposed
    showDropdown(option)
}