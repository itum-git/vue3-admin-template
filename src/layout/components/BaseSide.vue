<template>
	<div
		:class="[show ? 'w-[var(--aside-width)] ' : 'w-[var(--aside-width-collapsed)] ', 'br-[var(--ep-card-border-color)]']"
		style="transition: width var(--ep-transition-duration)">
		<BaseSideLogo :show="show" />
		<el-menu
			:default-active="activeMenu"
			class="b-r-none"
			:collapse="isCollapse"
			@select="onMenuSelect"
			@open="handleOpen"
			@close="handleClose"
		>
			<BaseMenuItem :routes="routes" />
		</el-menu>
	</div>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router'
import BaseSideLogo from './BaseSideLogo.vue'
import BaseMenuItem from './BaseMenuItem.vue'
import { useStore } from '@/store'
import { isUrl } from '@/utils/is'

const { push, currentRoute } = useRouter()

const store = useStore()

const routes = computed(() => store.state.permission.routes)

const collapse =  computed(() => store.state.app.collapse)

// 是否显示 title logo
const show = ref(true)
// 为了延迟 collapse 变化的副作用
const isCollapse = ref(false)

// 当前采用的布局
const layout =  computed(() => store.state.app.layout)

const activeMenu = computed(() => {
    const { meta, path } = unref(currentRoute)
    // if set path, the sidebar will highlight the path you set
    if (meta.activeMenu) {
        return meta.activeMenu as string
    }
    return path
})

const onMenuSelect = (index: string) => {
    // 自定义事件
    if (isUrl(index)) {
        window.open(index)
    } else {
        push({ path: index })
    }
}

onMounted(() => {
    if (unref(collapse)) {
        show.value = false
        isCollapse.value = true
    }
})

watch(
    () => collapse.value,
    (collapse: boolean) => {
        if (unref(layout) === 'topLeft' || unref(layout) === 'cutMenu') {
            show.value = true
            return
        }
        if (!collapse) {
            // 先展开，再显示
            isCollapse.value = collapse
            setTimeout(() => {
                show.value = !collapse
            }, 200)
        } else {
            // 先消失，再折叠
            isCollapse.value = collapse
            show.value = !collapse
        }
    }
)

const handleOpen = (key: string, keyPath: string[]) => {
    console.log(key, keyPath);
};
const handleClose = (key: string, keyPath: string[]) => {
    console.log(key, keyPath);
};
</script>
