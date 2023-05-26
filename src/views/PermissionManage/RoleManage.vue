<script setup lang="ts">
import { useTable } from '@/hooks/useTable'
import { getUserListApi, addUserApi, editUserApi } from '@/api/user'

const tableRef = ref()

const renderBtns = () => [
    {
        render: 'tipButton',
        name: 'edit',
        // title: '编辑', // tooltip 内容
        text: '编辑',
        type: 'primary',
        class: 'table-row-edit',
    },
    {
        render: 'confirmButton',
        name: 'delete',
        // title: '删除',
        text: '删除',
        type: 'danger',
        class: 'table-row-delete',
        popconfirm: {
            confirmButtonText: '删除',
            cancelButtonText: '取消',
            confirmButtonType: 'danger',
            title: '确定删除此用户吗？',
        },
        disabled: (row) => row.status !== 0
    },
]

const baseTable = useTable({
    api: {
        // 获取表格数据
        index: (filter) => {

            console.log(filter)

            return getUserListApi(filter)
        },
        // 添加、编辑后的表单提交
        postData: (operate, data) => {
            if (operate === 'edit') {
                return editUserApi(data)
            } else {
                return addUserApi(data)
            }
        },
        // 单项编辑前获取数据
        edit: (id) => {
            console.log('正在编辑', id)
            return new Promise((r) => r(null))
        },
        del: (id) => {
            console.log('正在删除', id)
            return new Promise((r) => r(null))
        }
    },
    table: {
        expandAll: true,
        column: [
            { type: 'selection', align: 'center', operator: false },
            { label: '角色名称', prop: 'name', align: 'left' },
            { label: '权限', prop: 'permissions', align: 'center', },
            { label: '状态', prop: 'status', align: 'center' },
            { label: '操作', align: 'center', render: 'buttons', buttons: renderBtns() },
        ],
        dblClickNotEditColumn: ['id'], // 双击这些列不启动编辑，其它保留
    },
    before: {
        // 获得编辑数据后
        requestEdit: () => {
            if (baseTable.form.items && !baseTable.form.items.icon) baseTable.form.items.icon = 'el-icon-Minus'
        },
    }
})

provide('baseTable', baseTable)

</script>

<template>
	<Table ref="tableRef" :pagination="true" />
</template>
