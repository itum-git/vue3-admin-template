<template>
	<transition name="el-fade-in">
		<div class="table-com-search">
			<el-form label-position="top" :model="baseTable.comSearch.form" @submit.prevent="" @keyup.enter="onComSearch">
				<el-row>
					<template v-for="item, idx in baseTable.table.column">
						<template v-if="item.operator !== false">
							<!-- 时间范围 -->
							<el-col v-if="item.render == 'datetime' && (item.operator == 'RANGE' || item.operator == 'NOT RANGE')" :key="idx + 'if'" :xs="24" :sm="12">
								<div class="com-search-col">
									<div class="com-search-col-label w16">
										{{ item.label }}
									</div>
									<div class="com-search-col-input-range w83">
										<el-date-picker
											v-model="baseTable.comSearch.form[item.prop!]"
											class="datetime-picker"
											:default-value="baseTable.comSearch.form[item.prop! + '-default'] ? baseTable.comSearch.form[item.prop! + '-default']:[new Date(), new Date()]"
											:type="item.comSearchRender == 'date' ? 'daterange' : 'datetimerange'"
											range-separator="至"
											start-placeholder="开始时间"
											end-placeholder="结束时间"
											:value-format="item.comSearchRender == 'date' ? 'YYYY-MM-DD' : 'YYYY-MM-DD HH:mm:ss'"
										/>
									</div>
								</div>
							</el-col>
							<el-col v-else :key="idx + '-else'" :xs="24" :sm="6">
								<div class="com-search-col">
									<div class="com-search-col-label">
										{{ item.label }}
									</div>
									<!-- 数字范围 -->
									<div v-if="item.operator == 'RANGE' || item.operator == 'NOT RANGE'" class="com-search-col-input-range">
										<el-input
											v-model="baseTable.comSearch.form[item.prop! + '-start']"
											:placeholder="item.operatorPlaceholder"
											type="string"
											:clearable="true"
										/>
										<div class="range-separator">
											至
										</div>
										<el-input
											v-model="baseTable.comSearch.form[item.prop! + '-end']"
											:placeholder="item.operatorPlaceholder"
											type="string"
											:clearable="true"
										/>
									</div>
									<!-- 是否 [NOT] NULL -->
									<div v-else-if="item.operator == 'NULL' || item.operator == 'NOT NULL'" class="com-search-col-input">
										<el-checkbox v-model="baseTable.comSearch.form[item.prop!]" :label="item.operator" size="large" />
									</div>
									<div v-else-if="item.operator" class="com-search-col-input">
										<!-- 时间筛选 -->
										<el-date-picker
											v-if="item.render == 'datetime' || item.comSearchRender == 'date'"
											v-model="baseTable.comSearch.form[item.prop!]"
											class="datetime-picker"
											:type="item.comSearchRender == 'date' ? 'date' : 'datetime'"
											:value-format="item.comSearchRender == 'date' ? 'YYYY-MM-DD' : 'YYYY-MM-DD HH:mm:ss'"
											:placeholder="item.operatorPlaceholder"
											:default-value="baseTable.comSearch.form[item.prop! + '-default'] ? baseTable.comSearch.form[item.prop! + '-default']:new Date()"
										/>

										<!-- tag、select -->
										<el-select
											v-else-if="(item.render == 'tag' || item.comSearchRender == 'select') && item.replaceValue"
											v-model="baseTable.comSearch.form[item.prop!]"
											class="w100"
											:placeholder="item.operatorPlaceholder"
											:clearable="true"
										>
											<el-option v-for="(opt, okey) in item.replaceValue" :key="item.prop! + okey" :label="opt" :value="okey" />
										</el-select>

										<!-- 远程 select -->
										<el-input
											v-else-if="item.comSearchRender == 'remoteSelect'"
											v-model="baseTable.comSearch.form[item.prop!]"
											type="remoteSelect"
											:attr="item.remote"
											:placeholder="item.operatorPlaceholder"
										/>

										<!-- 自定义组件/函数渲染 -->
										<component
											:is="item.comSearchCustomRender"
											v-else-if="item.comSearchRender == 'customRender'"
											:render-row="item"
											:render-field="item.prop!"
											:render-value="baseTable.comSearch.form[item.prop!]"
										/>

										<!-- 开关 -->
										<el-select
											v-else-if="item.render == 'switch'"
											v-model="baseTable.comSearch.form[item.prop!]"
											:placeholder="item.operatorPlaceholder"
											:clearable="true"
											class="w100"
										>
											<template v-if="!isEmpty(item.replaceValue)">
												<el-option
													v-for="(opt, okey) in item.replaceValue"
													:key="item.prop! + okey"
													:label="opt"
													:value="okey"
												/>
											</template>
											<template v-else>
												<el-option label="开" value="1" />
												<el-option label="关" value="0" />
											</template>
										</el-select>

										<!-- 字符串 -->
										<el-input
											v-else
											v-model="baseTable.comSearch.form[item.prop!]"
											:placeholder="item.operatorPlaceholder"
											type="string"
											:clearable="true"
										/>
									</div>
								</div>
							</el-col>
						</template>
					</template>
					<el-col :xs="24" :sm="6">
						<div class="com-search-col pl-20">
							<el-button type="primary" @click="onComSearch">
								搜索
							</el-button>
							<el-button @click="onResetForm()">
								重置
							</el-button>
						</div>
					</el-col>
				</el-row>
			</el-form>
		</div>
	</transition>
</template>

<script setup lang="ts">
import { inject } from 'vue'
import type { BaseTable } from '@/hooks/useTable'
import { comSearchData } from '../types'
import { isEmpty } from '@/utils/is'

const baseTable = inject('baseTable') as BaseTable

const onComSearch = () => {
    let comSearchData: comSearchData[] = []
    for (const key in baseTable.comSearch.form) {
        if (!baseTable.comSearch.fieldData.has(key)) {
            continue
        }

        let val = ''
        let fieldDataTemp = baseTable.comSearch.fieldData.get(key)
        if (fieldDataTemp.render == 'datetime' && (fieldDataTemp.operator == 'RANGE' || fieldDataTemp.operator == 'NOT RANGE')) {
            // 时间范围组件返回的是时间数组
            if (baseTable.comSearch.form[key] && baseTable.comSearch.form[key].length >= 2) {
                // 数组转字符串，以实现通过url参数传递预设搜索值
                if (fieldDataTemp.comSearchRender == 'date') {
                    val = baseTable.comSearch.form[key][0] + ' 00:00:00' + ',' + baseTable.comSearch.form[key][1] + ' 23:59:59'
                } else {
                    val = baseTable.comSearch.form[key][0] + ',' + baseTable.comSearch.form[key][1]
                }
            }
        } else if (fieldDataTemp.operator == 'RANGE' || fieldDataTemp.operator == 'NOT RANGE') {
            // 普通的范围筛选，baseTable在初始化时已准备好start和end字段
            if (!baseTable.comSearch.form[key + '-start'] && !baseTable.comSearch.form[key + '-end']) {
                continue
            }
            val = baseTable.comSearch.form[key + '-start'] + ',' + baseTable.comSearch.form[key + '-end']
        } else if (baseTable.comSearch.form[key]) {
            val = baseTable.comSearch.form[key]
        }

        if (val) {
            comSearchData.push({
                field: key,
                val: val,
                operator: fieldDataTemp.operator,
                render: fieldDataTemp.render,
            })
        }
    }

    baseTable.onTableAction('com-search', comSearchData)
}

const onResetForm = () => {
    // 封装好的onResetForm在此处不能使用
    for (const key in baseTable.comSearch.form) {
        baseTable.comSearch.form[key] = ''
    }
}
</script>

<style scoped lang="scss">
.table-com-search {
    overflow: hidden;
    box-sizing: border-box;
    width: 100%;
    max-width: 100%;
    background-color: var(--main-bg-color-2);
    border: 1px solid var(--main-border-color);
    border-bottom: none;
    padding: 13px 15px;
    font-size: 14px;
    .com-search-col {
        display: flex;
        align-items: center;
        padding-top: 8px;
        color: var(--el-text-color-regular);
        font-size: 13px;
    }
    .com-search-col-label {
        width: 33.33%;
        padding: 0 15px;
        text-align: right;
        overflow: hidden;
        white-space: nowrap;
    }
    .com-search-col-input {
        padding: 0 15px;
        width: 66.66%;
    }
    .com-search-col-input-range {
        display: flex;
        align-items: center;
        padding: 0 15px;
        width: 66.66%;
        .range-separator {
            padding: 0 5px;
        }
    }
}
:deep(.datetime-picker) {
    width: 100%;
}
.pl-20 {
    padding-left: 20px;
}
.w16 {
    width: 16.5% !important;
}
.w83 {
    width: 83.5% !important;
}
</style>
