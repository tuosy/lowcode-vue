import { defineComponent, computed } from "vue";
import { ElButton, ElTag } from "element-plus";
import $tableDialog from "../components/DialogTable";
import deepcopy from "deepcopy";
export const TabelEditer = defineComponent({
    props: {
        options: Object,
        modelValue: Array
    },
    emits: ["update:modelValue"],
    setup(props, context) {
        const options = computed({
            get: () => {
                return props.modelValue || []
            },
            set: (newValue) => {
                context.emit("update:modelValue", deepcopy(newValue))
            }
        })
        const addOption = () => {
            $tableDialog({
                config: props.options,
                options: options.value,
                onConfirm: (value) => {
                    options.value = value
                }
            })
        }
        return () => <div>
            {(!options.value || options.value.length == 0) && <ElButton onClick={addOption}>添加</ElButton>}
            {(options.value || []).map(item => <ElTag onClick={addOption}>{item[props.options.table.key]}</ElTag>)}
        </div>

    }
})