<script lang='tsx'>
import { defineComponent } from 'vue'
import { propTypes } from '@/utils/propTypes'
import { useStore } from '@/store'
// import { Menu } from '@/components/Menu'
// import { TabMenu } from '@/components/TabMenu'
// import { TagsView } from '@/components/TagsView'
// import { Logo } from '@/components/Logo'
import AppMain from './AppView.vue'
import BaseHeader from './BaseHeader.vue'
import BaseSide from './BaseSide.vue'
// import { ElScrollbar } from 'element-plus'

const store = useStore()

// const pageLoading = computed(() => store.state.app.pageLoading)

// // 标签页
// const tagsView = computed(() => store.state.app.tagsView)

// // 菜单折叠状态
// const collapse = computed(() => store.state.app.collapse)

// // logo
// const logo = computed(() => store.state.app.logo)

// // 是否是移动端
// const mobile = computed(() => store.state.app.mobile)

const asideClass =  computed(() => store.state.app.asideFix ? 'fixed top-0 left-0 z-999' : '')

const renderClassic = () => {
    return (
        <el-container class="w-[100%] h-[100%] relative">
            <el-aside class={['h-full w-auto bg-[var(--aside-bg-color)]', asideClass.value ]}>
                <BaseSide />
            </el-aside>
            <el-container>
                <el-header class="bg-[var(--header-bg-color)] bb-[var(--ep-card-border-color)]" >
                    <BaseHeader />
                </el-header>
                <AppMain/>
                {/* <el-footer>Footer</el-footer> */}
            </el-container>
        </el-container>
    );
};


export default defineComponent({
    name: 'RenderLayout',
    props: {
        layout: propTypes.oneOfType([String]).def('classic')
    },
    setup(props) {
        console.log(props.layout)
        switch (props.layout) {
            case 'classic':
                return renderClassic
            case 'topLeft':
                return <div>未定义</div>
            case 'top':
                return <div>未定义</div>
            case 'cutMenu':
                return <div>未定义</div>
            default:
                return <div>未定义</div>
        }
    }
})

</script>
