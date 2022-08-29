import { defineComponent } from "vue";

export const BlockResize = defineComponent({
    props: {
        block: Object,
        component: Object
    },
    setup(props) {
        const { width, height } = props.component.resize || {}
        let data = {}
        const onmousemove = (e) => {
            let { clientX, clientY } = e
            let { startX, startY, startHeight, startWidth, startLeft, startTop, direction } = data
            if (direction.horizontal == 'center') clientX = startX
            if (direction.vertical == 'center') clientY = startY
            let durX = clientX - startX
            let durY = clientY - startY
            if (direction.horizontal == 'start') {
                durX = -durX
                props.block.left = startLeft - durX
            }
            if (direction.vertical == 'start') {
                durY = -durY
                props.block.top = startTop - durY
            }
            const width = startWidth + durX
            const height = startHeight + durY
            props.block.width = width
            props.block.height = height
            props.block.isChanged = true
        }
        const onmouseup = (e) => {
            props.block.isChanged = false
            document.body.removeEventListener("mousemove", onmousemove)
            document.body.removeEventListener("mouseup", onmouseup)

        }
        const onmousedown = (e, direction) => {
            e.stopPropagation()
            data = {
                startX: e.clientX,
                startY: e.clientY,
                startWidth: props.block.width,
                startHeight: props.block.height,
                startLeft: props.block.left,
                startTop: props.block.top,
                direction
            }
            document.body.addEventListener("mousemove", onmousemove)
            document.body.addEventListener("mouseup", onmouseup)
        }
        return () => {
            return <>
                {width && <>
                    <div class="block-resize resize-right" onmousedown={e =>
                        onmousedown(e, { horizontal: 'end', vertical: 'center' })
                    }></div>
                    <div class="block-resize resize-left" onmousedown={e =>
                        onmousedown(e, { horizontal: 'start', vertical: 'center' })
                    }></div>
                </>}
                {height && <>
                    <div class="block-resize resize-top" onmousedown={e =>
                        onmousedown(e, { horizontal: 'center', vertical: 'start' })
                    }></div>
                    <div class="block-resize resize-bottom" onmousedown={e =>
                        onmousedown(e, { horizontal: 'center', vertical: 'end' })
                    }></div>
                </>}
                {width && height && <>
                    <div class="block-resize resize-top-left" onmousedown={e =>
                        onmousedown(e, { horizontal: 'start', vertical: 'start' })
                    }></div>
                    <div class="block-resize resize-top-right" onmousedown={e =>
                        onmousedown(e, { horizontal: 'end', vertical: 'start' })
                    }></div>
                    <div class="block-resize resize-bottom-right" onmousedown={e =>
                        onmousedown(e, { horizontal: 'end', vertical: 'end' })
                    }></div>
                    <div class="block-resize resize-bottom-left" onmousedown={e =>
                        onmousedown(e, { horizontal: 'start', vertical: 'end' })
                    }></div>
                </>}
            </>
        }
    }
})