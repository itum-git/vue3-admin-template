
<script lang='tsx'>
import { useStore } from '@/store'
import RenderLayout from './components/RenderLayout.vue'

const store = useStore()

// 当前采用的布局
const layout = computed(() => store.state.app.layout)

// 是否是移动端
const mobile = computed(() => store.state.app.mobile)

// 菜单折叠状态
const collapse = computed(() => store.state.app.collapse)

// 折叠菜单
const handleClickOutside = () => {
    store.state.app.setCollapse(true)
}

export default defineComponent({
    name: 'Layout',
    setup() {
        console.log('render layout')
        return () => (
            <>
                {mobile.value && !collapse.value ? (
                    <div
                        class="sh-outside"
                        onClick={handleClickOutside}
                    ></div>
                ) : undefined}

                <RenderLayout layout={ unref(layout) }></RenderLayout>
            </>
        )
    }
})

</script>
