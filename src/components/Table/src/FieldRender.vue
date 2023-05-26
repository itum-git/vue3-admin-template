<template>
	<!-- Icon -->
	<Icon v-if="field.render == 'icon'" class="ba-icon-dark" :name="fieldValue ? fieldValue : field.default ?? ''" />

	<!-- switch -->
	<el-switch
		v-if="field.render == 'switch'"
		:model-value="fieldValue.toString()"
		:loading="row.loading"
		active-value="1"
		inactive-value="0"
		@change="onChangeField"
	/>

	<!-- image -->
	<div v-if="field.render == 'image' && fieldValue" class="ba-render-image">
		<el-image
			:hide-on-click-modal="true"
			:preview-teleported="true"
			:preview-src-list="[fieldValue]"
			:src="fieldValue"
		/>
	</div>

	<!-- images -->
	<div v-if="field.render == 'images'" class="ba-render-image">
		<template v-if="Array.isArray(fieldValue) && fieldValue.length">
			<el-image
				v-for="(item, idx) in fieldValue"
				:key="idx"
				:initial-index="idx"
				:preview-teleported="true"
				:preview-src-list="fieldValue"
				class="images-item"
				:src="item"
				:hide-on-click-modal="true"
			/>
		</template>
	</div>

	<!-- tag -->
	<div v-if="field.render == 'tag' && fieldValue !== ''">
		<el-tag :type="getTagType(fieldValue, field.custom)" :effect="field.effect ?? 'light'" :size="field.size ?? 'default'">
			{{
				field.replaceValue ? field.replaceValue[fieldValue] : fieldValue
			}}
		</el-tag>
	</div>

	<!-- tags -->
	<div v-if="field.render == 'tags'">
		<template v-if="Array.isArray(fieldValue)">
			<template v-for="(tag, idx) in fieldValue">
				<el-tag
					v-if="tag"
					:key="idx"
					class="m-10"
					:type="getTagType(tag, field.custom)"
					:effect="field.effect ?? 'light'"
					:size="field.size ?? 'default'"
				>
					{{ field.replaceValue ? field.replaceValue[tag] ?? tag : tag }}
				</el-tag
				>
			</template>
		</template>
		<template v-else>
			<el-tag
				v-if="fieldValue !== ''"
				class="m-10"
				:type="getTagType(fieldValue, field.custom)"
				:effect="field.effect ?? 'light'"
				:size="field.size ?? 'default'"
			>
				{{ field.replaceValue ? field.replaceValue[fieldValue] ?? fieldValue : fieldValue }}
			</el-tag
			>
		</template>
	</div>

	<!-- url -->
	<div v-if="field.render == 'url' && fieldValue">
		<el-input :model-value="fieldValue" placeholder="链接地址">
			<template #append>
				<el-button
					style="padding: 8px;"
					@click="typeof field.click == 'function' ? field.click(row, field, fieldValue, column, index) : openUrl(fieldValue, field)"
				>
					<template #icon>
						<Icon :color="'#606266'" name="ep:position" />
					</template>
				</el-button>
			</template>
		</el-input>
	</div>

	<!-- datetime -->
	<div v-if="field.render == 'datetime'">
		{{ !fieldValue ? '-' : timeFormat(fieldValue, field.timeFormat ?? undefined) }}
	</div>

	<!-- color -->
	<div v-if="field.render == 'color'">
		<div :style="{ background: fieldValue }" class="ba-render-color"></div>
	</div>

	<!-- customTemplate 自定义模板 -->
	<div
		v-if="field.render == 'customTemplate'"
		v-html="field.customTemplate ? field.customTemplate(row, field, fieldValue, column, index) : ''"
	></div>

	<!-- 自定义组件/函数渲染 -->
	<component
		:is="field.customRender"
		v-if="field.render == 'customRender'"
		:render-row="row"
		:render-field="field"
		:render-value="fieldValue"
		:render-column="column"
		:render-index="index"
	/>

	<!-- 按钮组 -->
	<div v-if="field.render == 'buttons' && field.buttons" class="inline-flex">
		<template v-for="(btn, idx) in field.buttons">
			<template v-if="btn.display ? btn.display(row, field) : true">
				<el-tooltip
					v-if="btn.render == 'tipButton'"
					:key="idx"
					:disabled="btn.title ? false : true"
					:content="btn.title ? btn.title : ''"
					placement="top"
				>
					<el-button
						v-if="btn.name == 'edit'"
						:class="btn.class"
						class="table-operate"
						:type="btn.type"
						:disabled="btn.disabled && btn.disabled(row, field)"
						v-bind="btn.attr"
						link
						@click="onButtonClick(btn)"
					>
						<Icon v-if="btn.icon" :name="btn.icon" />
						<div v-if="btn.text" class="table-operate-text">
							{{ btn.text }}
						</div>
					</el-button>
					<el-button
						v-else
						:class="btn.class"
						class="table-operate"
						:type="btn.type"
						:disabled="btn.disabled && btn.disabled(row, field)"
						v-bind="btn.attr"
						link
						@click="onButtonClick(btn)"
					>
						<Icon v-if="btn.icon" :name="btn.icon" />
						<div v-if="btn.text" class="table-operate-text">
							{{ btn.text }}
						</div>
					</el-button>
				</el-tooltip>
				<el-popconfirm
					v-if="btn.render == 'confirmButton'"
					:key="idx"
					:disabled="btn.disabled && btn.disabled(row, field)"
					v-bind="btn.popconfirm"
					@confirm="onButtonClick(btn)"
				>
					<template #reference>
						<div class="ml-6px">
							<el-tooltip :disabled="btn.title ? false : true" :content="btn.title ? btn.title : ''" placement="top">
								<el-button
									v-if="btn.name == 'delete'"
									:class="btn.class"
									class="table-operate"
									:type="btn.type"
									:disabled="btn.disabled && btn.disabled(row, field)"
									v-bind="btn.attr"
									link
								>
									<Icon v-if="btn.icon" :name="btn.icon" />
									<div v-if="btn.text" class="table-operate-text">
										{{ btn.text }}
									</div>
								</el-button>
								<el-button
									v-else
									:class="btn.class"
									class="table-operate"
									:type="btn.type"
									:disabled="btn.disabled && btn.disabled(row, field)"
									v-bind="btn.attr"
									link
								>
									<Icon v-if="btn.icon" :name="btn.icon" />
									<div v-if="btn.text" class="table-operate-text">
										{{ btn.text }}
									</div>
								</el-button>
							</el-tooltip>
						</div>
					</template>
				</el-popconfirm>
				<el-tooltip
					v-if="btn.render == 'moveButton'"
					:key="idx"
					:disabled="btn.title && !btn.disabledTip ? false : true"
					:content="btn.title ? btn.title : ''"
					placement="top"
				>
					<el-button
						v-if="btn.name == 'weigh-sort'"
						:class="btn.class"
						class="table-operate move-button"
						:type="btn.type"
						:disabled="btn.disabled && btn.disabled(row, field)"
						v-bind="btn.attr"
						link
					>
						<Icon v-if="btn.icon" :name="btn.icon" />
						<div v-if="btn.text" class="table-operate-text">
							{{ btn.text }}
						</div>
					</el-button>
					<el-button
						v-else
						:class="btn.class"
						class="table-operate move-button"
						:type="btn.type"
						:disabled="btn.disabled && btn.disabled(row, field)"
						v-bind="btn.attr"
						link
					>
						<Icon v-if="btn.icon" :name="btn.icon" />
						<div v-if="btn.text" class="table-operate-text">
							{{ btn.text }}
						</div>
					</el-button>
				</el-tooltip>
			</template>
		</template>
	</div>

	<!-- 默认 -->
	<div v-if="!field.render && field.renderFormatter && typeof field.renderFormatter == 'function'">
		{{ fieldValue }}
	</div>
</template>

<script setup lang="ts">
import { ref, inject } from 'vue'
import type { TagProps } from 'element-plus'
import type { BaseTable } from '@/hooks/useTable'
import { TableRow, TableColumn, OptButton } from '../types'
import { timeFormat, openUrl } from '../helper'
import { TableColumnCtx } from 'element-plus/es/components/table/src/table-column/defaults'

const baseTable = inject('baseTable') as BaseTable

interface Props {
    row: TableRow
    field: TableColumn
    column: TableColumnCtx<TableRow>
    index: number
}
const props = defineProps<Props>()

// 字段值（单元格值）
const fieldName = ref(props.field.prop)
const fieldValue = ref(fieldName.value ? props.row[fieldName.value] : '')
if (fieldName.value && fieldName.value.indexOf('.') > -1) {
    let fieldNameArr = fieldName.value.split('.')
    let val: any = ref(props.row[fieldNameArr[0]])
    for (let index = 1; index < fieldNameArr.length; index++) {
        val.value = val.value ? val.value[fieldNameArr[index]] ?? '' : ''
    }
    fieldValue.value = val.value
}

if (props.field.renderFormatter && typeof props.field.renderFormatter == 'function') {
    fieldValue.value = props.field.renderFormatter(props.row, props.field, fieldValue.value, props.column, props.index)
}

const onChangeField = (value: any) => {
    baseTable.onTableAction('field-change', { value: value, ...props })
}

const onButtonClick = (btn: OptButton) => {
    if (typeof btn.click === 'function') {
        btn.click(props.row, props.field)
        return
    }
    baseTable.onTableAction(btn.name, props)
}

const getTagType = (value: string, custom: any): TagProps['type'] => {
    return custom && custom[value] ? custom[value] : ''
}
</script>

<style scoped lang="scss">
.m-10 {
    margin: 4px;
}
.ba-render-image {
    text-align: center;
}
.images-item {
    width: 50px;
    margin: 0 5px;
}
.#{$namespace}-image {
    height: 36px;
    width: 36px;
}
.table-operate-text {
    padding-left: 5px;
}
.table-operate {
    padding: 4px 5px;
    height: auto;
}
.table-operate .icon {
    font-size: 14px !important;
    color: var(--main-bg-color-2) !important;
}
.table-operate + .table-operate {
	margin-left: 6px;
}
.move-button {
    cursor: move;
}
.ml-6 + .#{$namespace}-button {
    margin-left: 6px;
}
.ba-render-color {
    height: 25px;
    width: 100%;
}
</style>
