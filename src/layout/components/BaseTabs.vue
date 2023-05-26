<template>
	<div ref="tabScrollbarRef" class="nav-tabs">
		<div
			v-for="(item, idx) in navTabs.aliveViews"
			:ref="tabsRefs.set"
			:key="idx"
			class="nav-tab-item h-full whitespace-nowrap flex justify-center items-center pl-5px pr-5px z-1 select-none transition-all-200 cursor-pointer"
			:class="navTabs.activeIndex == idx ? 'active' : ''"
			@click="onTab(item)"
		>
			<div class="nav-item-card flex items-center bg-transparent">
				{{ item.title }}
				<transition name="el-fade-in" @after-leave="selectNavTab(tabsRefs[navTabs.activeIndex])">
					<Icon v-show="navTabs.aliveViews.length > 1" class="p-2px mt-[px ml-4px" :size="15" name="ep:close" @click.stop="closeTab(item)" />
				</transition>
			</div>
		</div>
		<!-- <div :style="activeBoxStyle" class="h-[var(--ep-header-height)] absolute bg-[var(--ep-color-primary)]"></div> -->
	</div>
</template>

<script setup lang="ts">
import { useRouter, RouteLocationNormalized } from 'vue-router'
import { useStore } from '@/store'
import { useTemplateRefsList, useScroll } from '@vueuse/core'
import { useHorizontalScroll } from '@/hooks/useHorizontalScroll'

/**
 * 此页面中没有 store.dispatch('navTabs/addAliveViews', route) 操作，只有 delAliveViews、setActiveView
 * 加入缓存页签的操作统一在 <AppView/> 中，因为需要同时兼顾页签跳转、菜单跳转、页面刷新等情况
 */

const { push, currentRoute } = useRouter()
const store = useStore()

const navTabs = store.state.navTabs

const tabScrollbarRef = ref()
const tabScrollbar = useScroll(tabScrollbarRef)


const tabsRefs = useTemplateRefsList<HTMLDivElement>()

const activeBoxStyle = reactive({
    width: '0',
    transform: 'translateX(0px)',
})

const onTab = (menu: RouteLocationNormalized) => {
    push(menu)
}

// tab 激活状态切换
const selectNavTab = function (dom: HTMLDivElement) {
    if (!dom) {
        return false
    }
    activeBoxStyle.width = dom.clientWidth + 'px'
    activeBoxStyle.transform = `translateX(${dom.offsetLeft}px)`

    let scrollLeft = dom.offsetLeft + dom.clientWidth - tabScrollbarRef.value.clientWidth
    if (dom.offsetLeft < tabScrollbarRef.value.scrollLeft) {
        tabScrollbar.x.value = dom.offsetLeft
        // tabScrollbarRef.value.scrollTo(dom.offsetLeft, 0)
    } else if (scrollLeft > tabScrollbarRef.value.scrollLeft) {
        tabScrollbar.x.value = scrollLeft
        // tabScrollbarRef.value.scrollTo(scrollLeft, 0)
    }
}

const toLastTab = () => {
    const lastTab = navTabs.aliveViews.slice(-1)[0]
    if (lastTab) {
        push(lastTab.path)
    } else {
        push('/')
    }
}

const closeTab = (route: RouteLocationNormalized) => {
    store.dispatch('navTabs/delAliveViews', route)
    if (unref(currentRoute).fullPath === route.fullPath) {
        toLastTab()
    } else {
        // 激活当前 tab
        store.dispatch('navTabs/setActiveView', unref(currentRoute))
        nextTick(() => {
            selectNavTab(tabsRefs.value[navTabs.activeIndex])
        })
    }
}

watch(
    () => navTabs.activeIndex,
    (activeIndex) => {
        selectNavTab(tabsRefs.value[activeIndex])
    }
)

onMounted(() => {
    useHorizontalScroll(tabScrollbarRef.value)
})
</script>

<style scoped lang="scss">
.nav-tabs {
    scrollbar-width: none;

    .nav-tab-item {
        background-color: transparent;
        .nav-item-card {
            padding: 10px 20px;
            border: 1px solid var(--ep-card-border-color);
            &:hover {
                background-color: var(--ep-color-primary-light-9);
                box-shadow: var(--ep-box-shadow-light);
            }
        }
    }
    .nav-tab-item.active {
        .nav-item-card {
            background-color: var(--ep-color-primary-light-9);
            box-shadow: var(--ep-box-shadow-light);
        }
    }

    &::-webkit-scrollbar {
        height: 5px;
    }
    &::-webkit-scrollbar-thumb {
        background: #eaeaea;
        border-radius: var(--ep-border-radius-base);
        box-shadow: none;
        -webkit-box-shadow: none;
    }
    &:hover {
        &::-webkit-scrollbar-thumb:hover {
            background: #c8c9cc;
        }
    }
}
</style>