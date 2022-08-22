import { defineComponent, computed, inject, ref, onMounted } from "vue";
import '../src/assets/scss/editer.scss'
import EditerBlock from "./editer-block";
import useDragEvent from "../utils/useDragEvent";
import useMove from "../utils/useMove";
import useCommand from "../utils/useCommand";
import $dialog from "../components/Dialog"
export default defineComponent({
    props: {
        modelValue: { type: Object }
    },
    emits: ["updata:modelValue"],
    setup(props, context) {
        const containerStyle = computed({
            get: () => {
                return {
                    width: props.modelValue.container.width + "px",
                    height: props.modelValue.container.height + "px",
                }
            }
        })
        const containerData = computed({
            get: () => {
                return props.modelValue
            },
            set: (val) => {
                context.emit("updata:modelValue", val)
            }
        })
        const preview = ref(false)
        const canvasRef = ref(null)
        const moveDom = ref(null)
        onMounted(() => {
            canvasRef.value.scrollLeft = (moveDom.value.clientWidth - canvasRef.value.clientWidth) / 2
            canvasRef.value.scrollTop = (moveDom.value.clientHeight - canvasRef.value.clientHeight) / 2
        })
        const config = inject("config")
        const { dragstart, dragend } = useDragEvent(moveDom, containerData.value, preview)//实现元素添加时的拖动

        const { componentMousedown, canvasMousedown, markLine, focusData, clearFocus } = useMove(containerData.value, preview) //实现画布中的元素移动
        const { commandMap } = useCommand(containerData.value, focusData) //封装撤销等命令
        const buttons = [
            { label: "撤销", icon: "iconfont icon-back", hander: () => commandMap.undo() },
            { label: "回退", icon: "iconfont icon-forward", hander: () => commandMap.redo() },
            {
                label: "导入", icon: "iconfont icon-import", hander: () => $dialog({
                    title: "输入json文件",
                    container: "",
                    footer: true,
                    onConfirm: (data) => {
                        commandMap.undateContainer(JSON.parse(data))
                    }
                })
            },
            {
                label: "导出", icon: "iconfont icon-export", hander: () => $dialog({
                    title: "导出的json文件",
                    container: JSON.stringify(containerData.value),
                    footer: false
                })
            },
            { label: "置顶", icon: "iconfont icon-control-top", hander: () => commandMap.contrulTop() },
            { label: "置底", icon: "iconfont icon-control-bottom", hander: () => commandMap.contrulBottom() },
            { label: "删除", icon: "iconfont icon-shanchu", hander: () => commandMap.delete() },
            {
                label: () => preview.value ? "编辑" : "预览",
                icon: () => preview.value ? "iconfont icon-bianji" : "iconfont icon-icon_yulan",
                hander: () => { preview.value = !preview.value, clearFocus() },
            }
        ]
        return () => <div class="editer">
            <div className="editer-left">
                {
                    config.componentList.map(item => (<div className="editer-left-component"
                        draggable
                        onDragstart={e => { dragstart(e, item) }}
                        onDragend={dragend}
                    >
                        <span>{item.label}</span>
                        <div>{item.preview()}</div>
                    </div>))
                }
            </div>
            <div className="editer-top">
                {
                    buttons.map((btn, index) => {
                        const icon = typeof btn.icon == "function" ? btn.icon() : btn.icon
                        const label = typeof btn.label == "function" ? btn.label() : btn.label
                        return <div className="editer-top-btn" onClick={btn.hander}>
                            <i className={icon} style={{ fontSize: "1.5rem" }}></i>
                            <span>{label}</span>
                        </div>
                    })
                }
            </div>
            <div className="editer-bottom">
                <div className="editer-bottom-canvas" onMousedown={canvasMousedown} ref={canvasRef}>
                    <div className="editer-bottom-canvas_nr" style={containerStyle.value} ref={moveDom}>
                        {
                            containerData.value.blocks.map((item, index) => //注意这里不能用forEach函数区遍历，因为该函数没用返回值
                            (<EditerBlock
                                class="component-style"
                                class={item.focus ? "component-style-focus" : ""}
                                class={preview.value ? "component-style-preview" : ""}
                                comInfo={item} onMousedown={e => { componentMousedown(e, item, index) }}></EditerBlock>)
                            )
                        }
                        {markLine.x !== null && <div className="line-x" style={{ top: markLine.x + "px" }}></div>}
                        {markLine.y !== null && <div className="line-y" style={{ left: markLine.y + "px" }}></div>}
                    </div>
                </div>
            </div>
            <div className="editer-right">属性区</div>
        </div>
    }
})