<script setup lang="ts">
import { propTypes } from '@/utils/propTypes'
import Iconify from '@purge-icons/generated'

const props = defineProps({
    // icon name
    name: propTypes.string,
    // icon color
    color: propTypes.string,
    // icon size
    size: propTypes.number.def(16)
})

// eslint-disable-next-line no-undef
const elRef = ref<ElRef>(null)

const isLocal = computed(() => props.name.startsWith('svg-icon:'))

const symbolId = computed(() => {
    return unref(isLocal) ? `#icon-${props.name.split('svg-icon:')[1]}` : props.name
})

const getIconifyStyle = computed(() => {
    const { color, size } = props
    return {
        fontSize: `${size}px`,
        color
    }
})

const updateIcon = async (name: string) => {
    if (unref(isLocal)) return

    const el = unref(elRef)
    if (!el) return

    await nextTick()

    if (!name) return

    const svg = Iconify.renderSVG(name, {})
    if (svg) {
        el.textContent = ''
        el.appendChild(svg)
    } else {
        const span = document.createElement('span')
        span.className = 'iconify'
        span.dataset.icon = name
        el.textContent = ''
        el.appendChild(span)
    }
}

watch(
    () => props.name,
    (name: string) => {
        updateIcon(name)
    }
)
</script>

<template>
	<el-icon :size="size" :color="color">
		<svg v-if="isLocal" aria-hidden="true">
			<use :xlink:href="symbolId" />
		</svg>
		<span class="iconify" :style="getIconifyStyle" :data-icon="symbolId"></span>
	</el-icon>
</template>
