<template>
	<!-- 通用搜索 -->
	<transition name="el-zoom-in-bottom" mode="out-in">
		<ComSearch v-show="props.buttons.includes('comSearch') && baseTable.table.showComSearch" />
	</transition>

	<!-- 操作按钮组 -->
	<div v-bind="$attrs" class="table-header">
		<el-tooltip v-if="props.buttons.includes('refresh')" content="刷新" placement="top">
			<el-button color="#40485b" class="table-header-operate" type="info" @click="onAction('refresh', { loading: true })">
				<Icon name="fa:refresh" />
			</el-button>
		</el-tooltip>
		<el-tooltip v-if="props.buttons.includes('add')" content="添加" placement="top">
			<el-button class="table-header-operate" type="primary" @click="onAction('add')">
				<Icon name="fa:plus" />
				<span class="table-header-operate-text">添加</span>
			</el-button>
		</el-tooltip>
		<el-tooltip v-if="props.buttons.includes('edit')" content="编辑所选行" placement="top">
			<el-button :disabled="!enableBatchOpt" class="table-header-operate" type="primary" @click="onAction('edit')">
				<Icon name="fa:pencil" />
				<span class="table-header-operate-text">编辑</span>
			</el-button>
		</el-tooltip>
		<el-popconfirm
			v-if="props.buttons.includes('delete')"
			confirm-button-text="删除"
			cancel-button-text="取消"
			confirm-button-type="danger"
			title="确定要删除所选行吗？"
			:disabled="!enableBatchOpt"
			@confirm="onAction('delete')"
		>
			<template #reference>
				<div class="mlr-12">
					<el-tooltip content="批量删除所选行" placement="top">
						<el-button :disabled="!enableBatchOpt" class="table-header-operate" type="danger">
							<Icon name="fa:trash" />
							<span class="table-header-operate-text">删除</span>
						</el-button>
					</el-tooltip>
				</div>
			</template>
		</el-popconfirm>
		<el-tooltip
			v-if="props.buttons.includes('unfold')"
			:content="(baseTable.table.expandAll ? '收起' : '展开') + '所有子菜单'"
			placement="top"
		>
			<el-button
				class="table-header-operate ml-12px"
				:type="baseTable.table.expandAll ? 'danger' : 'warning'"
				@click="baseTable.onTableHeaderAction('unfold', { unfold: !baseTable.table.expandAll })"
			>
				<span class="table-header-operate-text">{{ baseTable.table.expandAll ? '收起全部' : '展开全部' }}</span>
			</el-button>
		</el-tooltip>

		<!-- slot -->
		<slot></slot>

		<!-- 右侧搜索框和工具按钮 -->
		<div class="table-search">
			<el-input
				v-if="props.buttons.includes('quickSearch')"
				v-model="state.quickSearch"
				class="xs-hidden quick-search ml-12px"
				:placeholder="quickSearchPlaceholder ? quickSearchPlaceholder : '搜索'"
				@input="onSearchInput"
			/>
			<div v-if="props.buttons.includes('columnDisplay') || props.buttons.includes('comSearch')" class="table-search-button-group">
				<el-dropdown v-if="props.buttons.includes('columnDisplay')" :max-height="380" :hide-on-click="false">
					<el-button
						plain
					>
						<Icon :size="14" name="ep:grid" />
					</el-button>
					<template #dropdown>
						<el-dropdown-menu>
							<el-dropdown-item v-for="(item, idx) in columnDisplay" :key="idx">
								<el-checkbox
									v-if="item.prop"
									:checked="!item.show"
									:model-value="item.show"
									size="small"
									:label="item.label"
									@change="onChangeShowColumn($event, item.prop!)"
								/>
							</el-dropdown-item>
						</el-dropdown-menu>
					</template>
				</el-dropdown>
				<el-tooltip
					v-if="props.buttons.includes('comSearch')"
					:disabled="baseTable.table.showComSearch"
					content="展开通用搜索"
					placement="top"
				>
					<el-button
						class="table-search-button-item"
						color="#dcdfe6"
						plain
						@click="baseTable.table.showComSearch = !baseTable.table.showComSearch"
					>
						<Icon :size="14" name="ep:search" />
					</el-button>
				</el-tooltip>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { reactive, computed, inject } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import type { BaseTable } from '@/hooks/useTable'
import { HeaderOptButton, TableColumn, RecordableTSX } from '../types'
import ComSearch from './ComSearch.vue'

const baseTable = inject('baseTable') as BaseTable

interface Props {
    buttons: HeaderOptButton[]
    quickSearchPlaceholder?: string
}
const props = withDefaults(defineProps<Props>(), {
    buttons: () => {
        return ['refresh', 'add', 'edit', 'delete']
    },
    quickSearchPlaceholder: '',
})

const state = reactive({
    quickSearch: '',
})

const columnDisplay = computed(() => {
    let columnDisplayArr: TableColumn[] = []
    for (let item of baseTable.table.column) {
        item.type === 'selection' || item.render === 'buttons' || item.enableColumnDisplayControl === false ? '' : columnDisplayArr.push(item)
    }
    return columnDisplayArr
})

const enableBatchOpt = computed(() => (baseTable.table.selection!.length > 0 ? true : false))

const onAction = (event: string, data: RecordableTSX = {}) => {
    baseTable.onTableHeaderAction(event, data)
}

const onSearchInput = useDebounceFn(() => {
    baseTable.onTableHeaderAction('quick-search', { keyword: state.quickSearch })
}, 500)

const onChangeShowColumn = (value: string | number | boolean, field: string) => {
    baseTable.onTableHeaderAction('change-show-column', { field: field, value: value })
}
</script>

<style scoped lang="scss">
.table-header {
    position: relative;
    overflow-y: auto;
    box-sizing: border-box;
    display: flex;
	flex-wrap: wrap;
    align-items: center;
    width: 100%;
    max-width: 100%;
    background-color: var(--main-bg-color-1);
    padding: var(--common-space-10);
    font-size: 14px;
	margin-top: -12px;
	.table-header-operate {
		margin-top: 12px;
	}
	&:deep(.table-header-operate) {
		margin-top: 12px;
	}
    .table-header-operate-text {
        margin-left: 6px;
    }
	&:deep(.table-header-operate-text) {
		margin-left: 6px;
	}
}

.mlr-12 {
    margin-left: 12px;
}
.mlr-12 + .el-button {
    margin-left: 12px;
}
.table-search {
    display: flex;
    margin-left: auto;
	margin-top: 12px;
    .quick-search {
        width: auto;
    }
}
.table-search-button-group {
    display: flex;
    margin-left: 12px;
    border: 1px solid var(--ep-border-color);
    border-radius: var(--ep-border-radius-base);
    overflow: hidden;
    button:focus,
    button:active {
        background-color: var(--main-bg-color-2);
    }
    button:hover {
        background-color: var(--el-color-info-light-7);
    }
    .el-button + .el-button {
        margin: 0;
    }
    .right-border {
        border-right: 1px solid var(--el-border-color);
    }
}

html.dark {
    .table-search-button-group {
        button:focus,
        button:active {
            background-color: var(--ep-color-info-dark-2);
        }
        button:hover {
            background-color: var(--ep-color-info-light-7);
        }
        button {
            background-color: #898a8d;
            #{$namespace}-icon {
                color: white !important;
            }
        }
    }
}
</style>
