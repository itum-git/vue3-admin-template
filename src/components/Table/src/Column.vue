<script lang="ts">
import { defineComponent, createVNode, reactive } from 'vue'
import { ElTableColumn } from 'element-plus'
import { toAnyID } from '@/utils'
export default defineComponent({
    name: 'Column',
    props: {
        attr: {
            type: Object,
            required: true,
        },
    },
    setup(props, { slots }) {
        const attr = reactive(props.attr)
        attr['column-key'] = attr['column-key'] ? attr['column-key'] : attr.prop || toAnyID()
        return () => {
            return createVNode(ElTableColumn, attr, slots.default)
        }
    },
})
</script>
