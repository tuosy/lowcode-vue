export default function (moveDom, blocks) {
    let currentComponent = null
    const drop = e => {
        blocks.push({
            top: e.offsetY,
            left: e.offsetX,
            zIndex: 1,
            key: currentComponent.key,
            alignCenter: true
        })
    }
    const dragenter = e => {
        e.dataTransfer.dropEffect = 'move' //添加移动标志
    }
    const dragover = e => {
        e.preventDefault()
    }
    const dragleave = e => {
        e.dataTransfer.dropEffect = 'none'
    }
    const dragstart = (e, component) => {
        //当一元素拖入到目标元素中监听事件dragenter触发一次
        //dragover在目标元素中拖动会一直触发，需要阻止默认事件，否则触发不了drop事件
        //dragleave离开时促发一次
        //drop在目标元素中释放时触发一次
        currentComponent = component
        moveDom.value.addEventListener('dragenter', dragenter)
        moveDom.value.addEventListener('dragover', dragover)
        moveDom.value.addEventListener('dragleave', dragleave)
        moveDom.value.addEventListener('drop', drop)
    }
    const dragend = () => {//移除监听事件
        currentComponent = null
        moveDom.value.removeEventListener('dragenter', dragenter)
        moveDom.value.removeEventListener('dragover', dragover)
        moveDom.value.removeEventListener('dragleave', dragleave)
        moveDom.value.removeEventListener('drop', drop)
    }
    return {
        dragend,
        dragstart
    }
}