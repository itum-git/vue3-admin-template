<template>
	<div class="p-[var(--common-space-10)]">
		<slot name="neck"></slot>
		<el-table
			ref="tableRef"
			v-loading="baseTable.table.loading || false"
			class="data-table"
			header-cell-class-name="table-header-cell"
			:default-expand-all="baseTable.table.expandAll"
			:data="baseTable.table.data"
			:row-key="baseTable.table.pk"
			:border="true"
			stripe
			v-bind="$attrs"
			@select-all="onSelectAll"
			@select="onSelect"
			@selection-change="onSelectionChange"
			@sort-change="onSortChange"
			@row-dblclick="baseTable.onTableDblclick"
		>
			<slot name="columnPrepend"></slot>
			<template v-for="(item, key) in baseTable.table.column">
				<Column v-if="item.show !== false" :key="key + '-column'" :attr="item">
					<template v-if="item.render || item.renderFormatter" #default="scope">
						<FieldRender
							:key="item.render == 'switch' ? 'sw-' + item.prop + '-' + key + '-' + scope.row[item.prop!] : key"
							:field="item"
							:row="scope.row"
							:column="scope.column"
							:index="scope.$index"
						/>
					</template>
				</Column>
			</template>
			<slot name="columnAppend"></slot>
		</el-table>
		<div v-if="props.pagination" class="table-pagination">
			<el-pagination
				:current-page="baseTable.table.filter!.page"
				:page-size="baseTable.table.filter!.limit"
				:page-sizes="pageSizes"
				background
				:layout="'sizes,total, ->, prev, pager, next, jumper'"
				:total="baseTable.table.total"
				@size-change="onTableSizeChange"
				@current-change="onTableCurrentChange"
			/>
			<!-- 'sizes,total, ->, prev, pager, next, jumper' -->
		</div>
		<slot name="footer"></slot>
	</div>
</template>

<script setup lang="ts">
import type { ElTable } from 'element-plus'
import { TableRow } from '../types'
import { propTypes } from '@/utils/propTypes'
import Column from './Column.vue'
// import FieldRender from './FieldRender.vue'
import { BaseTable } from '@/hooks/useTable'

const tableRef = ref<InstanceType<typeof ElTable>>()

const props = defineProps({
    pagination: propTypes.bool.def(true),
})

const baseTable = inject('baseTable') as BaseTable

const onTableSizeChange = (val: number) => {
    baseTable.onTableAction('page-size-change', { size: val })
}

const onTableCurrentChange = (val: number) => {
    baseTable.onTableAction('current-page-change', { page: val })
}

const onSortChange = ({ order, prop }: { order: string; prop: string }) => {
    baseTable.onTableAction('sort-change', { prop: prop, order: order ? (order == 'ascending' ? 'asc' : 'desc') : '' })
}

const pageSizes = computed(() => {
    let defaultSizes = [10, 20, 50, 100]
    if (baseTable.table.filter!.limit) {
        if (!defaultSizes.includes(baseTable.table.filter!.limit)) {
            defaultSizes.push(baseTable.table.filter!.limit)
        }
    }
    return defaultSizes
})

/*
 * 全选和取消全选
 * 实现子级同时选择和取消选中
 */
const onSelectAll = (selection: TableRow[]) => {
    if (isSelectAll(selection.map((row: TableRow) => row[baseTable.table.pk!].toString()))) {
        selection.map((row: TableRow) => {
            if (row.children) {
                selectChildren(row.children, true)
            }
        })
    } else {
        tableRef.value?.clearSelection()
    }
}

/*
 * 是否是全选操作
 * 只检查第一个元素是否被选择
 * 全选时：selectIds为所有元素的id
 * 取消全选时：selectIds为所有子元素的id
 */
const isSelectAll = (selectIds: string[]) => {
    let data = baseTable.table.data as TableRow[]
    for (const key in data) {
        return selectIds.includes(data[key][baseTable.table.pk!].toString())
    }
    return false
}

/*
 * 选择子项-递归
 */
const selectChildren = (children: TableRow[], type: boolean) => {
    children.map((j: TableRow) => {
        toggleSelection(j, type)
        if (j.children) {
            selectChildren(j.children, type)
        }
    })
}

/*
 * 执行选择操作
 */
const toggleSelection = (row: TableRow, type: boolean) => {
    if (row) {
        nextTick(() => {
            tableRef.value?.toggleRowSelection(row, type)
        })
    }
}

/*
 * 手动选择时，同时选择子级
 */
const onSelect = (selection: TableRow[], row: TableRow) => {
    if (
        selection.some((item: TableRow) => {
            return row[baseTable.table.pk!] === item[baseTable.table.pk!]
        })
    ) {
        if (row.children) {
            selectChildren(row.children, true)
        }
    } else {
        if (row.children) {
            selectChildren(row.children, false)
        }
    }
}

/*
 * 记录选择的项
 */
const onSelectionChange = (selection: TableRow[]) => {
    baseTable.onTableAction('selection-change', selection)
}

/*
 * 设置折叠所有-递归
 */
const setUnFoldAll = (children: TableRow[], unfold: boolean) => {
    for (const key in children) {
        tableRef.value?.toggleRowExpansion(children[key], unfold)
        if (children[key].children) {
            setUnFoldAll(children[key].children!, unfold)
        }
    }
}

/*
 * 折叠所有
 */
const unFoldAll = (unfold: boolean) => {
    setUnFoldAll(baseTable.table.data!, unfold)
}

const getRef = () => {
    return tableRef.value
}

defineExpose({
    unFoldAll,
    getRef,
})
</script>

<style scoped lang="scss">
.data-table :deep(.#{$namespace}-button + .#{$namespace}-button) {
    margin-left: 6px;
}
.data-table :deep(.table-header-cell) .cell {
    color: var(--ep-text-color-primary);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.table-pagination {
    box-sizing: border-box;
    width: 100%;
    max-width: 100%;
    background-color: var(--main-bg-color-1);
    padding: var(--common-space-10);
}
</style>
