
import { computed, ref, reactive } from "vue"
import { events } from "./events"
export default function (data) {
    const lastSelectIndex = ref(-1)
    const lastSelectBlock = computed(() => { return data.blocks[lastSelectIndex.value] })
    let markLine = reactive({
        x: null,//用来存放横向放置的线
        y: null//用来存放纵向放置的线
    })
    const focusComponent = computed(() => {
        let focus = data.blocks.filter(item => item.focus)
        return focus
    })
    const unfocusComponent = computed(() => {
        let unfocus = data.blocks.filter(item => !item.focus)
        return unfocus
    })
    const componentMousedown = (e, component, index) => {
        e.preventDefault()
        e.stopPropagation()
        if (!component.focus) {
            component.focus = true
        }
        lastSelectIndex.value = index
        mousedown(e)
    }
    const canvasMousedown = (e) => {
        data.blocks.map(item => {
            item.focus = false
        })
        lastSelectIndex.value = -1
    }
    let dragState = {
        startX: 0,
        startY: 0,
        draging: false
    }
    const mousedown = (e) => {
        const { width: BWidth, height: BHeight } = lastSelectBlock.value
        dragState = {
            startX: e.clientX,
            startY: e.clientY,
            draging: false,
            startLeft: lastSelectBlock.value.left,
            startTop: lastSelectBlock.value.top,
            //保存每个元素的初始位置
            startPosition: focusComponent.value.map(({ top, left }) => ({ top, left })),
            lines: (() => {
                let lines = { x: [], y: [] };//x用来存放横向放置的线,y用来存放纵向放置的线
                [...unfocusComponent.value, { top: 0, left: 0, width: data.container.width, height: data.container.height }].forEach(item => {
                    const { top: Atop, left: Aleft, width: Awidth, height: Aheight } = item
                    lines.x.push({ top: Atop, showTop: Atop })//顶对顶时的辅助线
                    lines.x.push({ top: Atop - BHeight, showTop: Atop })//顶对底时
                    lines.x.push({ top: Atop + Aheight / 2 - BHeight / 2, showTop: Atop + Aheight / 2 })//中对中
                    lines.x.push({ top: Atop + Aheight, showTop: Atop + Aheight })//底对顶
                    lines.x.push({ top: Atop + Aheight - BHeight, showTop: Atop + Aheight })//底对底

                    lines.y.push({ left: Aleft, showLeft: Aleft }) //左对左
                    lines.y.push({ left: Aleft - BWidth, showLeft: Aleft }) //左对右
                    lines.y.push({ left: Aleft + Awidth / 2 - BWidth / 2, showLeft: Aleft + Awidth / 2 }) //中对中
                    lines.y.push({ left: Aleft + Awidth, showLeft: Aleft + Awidth }) //右对左
                    lines.y.push({ left: Aleft + Awidth - BWidth, showLeft: Aleft + Awidth }) //右对右
                })
                return lines
            })()
        }
        document.addEventListener("mousemove", mousemove)
        document.addEventListener("mouseup", mouseup)
        // console.log(dragState);
    }
    const mouseup = e => {
        document.removeEventListener("mousemove", mousemove)
        document.removeEventListener("mouseup", mouseup)
        //去除辅助线
        markLine.x = null
        markLine.y = null
        if (dragState.draging) {
            events.emit("end")
            dragState.draging = false
        }
    }
    const mousemove = e => {
        const { clientX, clientY } = e
        let moveX = clientX - dragState.startX
        let moveY = clientY - dragState.startY
        //计算最新的left,top
        const top = moveY + dragState.startTop
        const left = moveX + dragState.startLeft
        //寻找满足条件的线
        let x = null, y = null
        for (let i = 0; i < dragState.lines.x.length; i++) {
            const { top: Btop, showTop: Ltop } = dragState.lines.x[i]
            if (Math.abs(Btop - top) < 5) {
                x = Ltop
                //将最后一个选中的组件快速移到目标位置
                moveY = Btop - dragState.startTop
                break
            }
        }
        for (let i = 0; i < dragState.lines.y.length; i++) {
            const { left: Bleft, showLeft: Lleft } = dragState.lines.y[i]
            if (Math.abs(Bleft - left) < 5) {
                y = Lleft
                moveX = Bleft - dragState.startLeft
                break
            }
        }
        markLine.x = x
        markLine.y = y
        focusComponent.value.forEach((item, index) => {
            item.top = dragState.startPosition[index].top + moveY
            item.left = dragState.startPosition[index].left + moveX
        })
        if (!dragState.draging) {
            events.emit("start")
            dragState.draging = true
        }
    }

    return {
        componentMousedown,
        canvasMousedown,
        markLine
    }
}