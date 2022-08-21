import { events } from "./events"
import { onUnmounted } from "vue"
import deepcopy from "deepcopy"
export default function (containerData) {
    const state = {
        current: -1,//操作队列的索引
        commands: [],
        commandMap: {},
        queue: [],//记录完成操作指令的队列
        destroyEmit: []
    }
    const register = (command) => {
        state.commands.push(command)
        state.commandMap[command.name] = (...data) => {
            const { redo, undo } = command.excutor(...data)
            redo()
            if (!command.pushQueue) return
            let { queue, current } = state
            if (queue.length > 0) {
                queue = queue.slice(0, current + 1)
                state.queue = queue
            }
            state.queue.push({ redo, undo })
            state.current = current + 1
        }
    }
    register({
        name: "undo",
        keyword: "ctrl+z",
        excutor() {
            return {
                redo() {
                    if (state.current == -1) return
                    let item = state.queue[state.current]
                    if (item) {
                        item.undo && item.undo()
                        state.current--
                    }
                }
            }
        }
    })
    register({
        name: "redo",
        keyword: "ctrl+y",
        excutor() {
            return {
                redo() {
                    let item = state.queue[state.current + 1]
                    if (item) {
                        item.redo && item.redo()
                        state.current++
                    }
                }
            }
        }
    })
    register({
        name: "undateContainer",
        pushQueue: true,
        excutor(newValue) {
            let state = {
                before: containerData.blocks,
                after: newValue.blocks
            }
            return {
                redo() {
                    containerData.blocks = state.after
                },
                undo() {
                    containerData.blocks = state.before
                }
            }
        }
    })
    register({
        name: "drag",
        pushQueue: true, //是否放入操作对列中
        init() { //初始化函数
            this.oldValue = null
            const start = () => this.oldValue = deepcopy(containerData.blocks)
            const end = () => state.commandMap.drag()
            events.on("start", start)
            events.on("end", end)
            return () => {
                events.off("start", start)
                events.off("end", end)
            }
        },
        excutor() {
            let oldValue = this.oldValue;
            let newValue = containerData.blocks;
            return {
                redo() {
                    containerData.blocks = newValue
                },
                undo() {
                    containerData.blocks = oldValue
                }
            }
        }
    });
    const keywardEvent = (() => {
        const keyCodes = {
            90: "z",
            89: "y"
        }
        const onKeydown = e => {
            const { ctrlKey, keyCode } = e
            let keyString = []
            if (ctrlKey) keyString.push("ctrl")
            keyString.push(keyCodes[keyCode])
            let keyBord = keyString.join("+")
            state.commands.forEach(({ name, keyword }) => {
                if (!keyword) return
                if (keyBord === keyword) {
                    state.commandMap[name]()
                    e.preventDefault();
                }
            })
        }
        const init = () => {
            window.addEventListener("keydown", onKeydown)
            return () => {
                window.removeEventListener("keydown", onKeydown)
            }
        }
        return init
    })();
    (() => {
        state.destroyEmit.push(keywardEvent())
        state.commands.forEach(command => {
            command.init && state.destroyEmit.push(command.init())
        });
    })();

    onUnmounted(() => {
        state.destroyEmit.forEach(func => func && func())
    })
    return state
}