<template>
    <div class="app-container">
        <PageHeader>
            <template #left>
                <el-row :gutter="10">
                    <el-input
                        placeholder="请输入功能名称"
                        v-model="funcName"
                        clearable
                        @clear="onSearch"
                        class="input-with-select"
                    >
                        <template #append>
                            <el-button icon="el-icon-search" @click="onSearch"></el-button>
                        </template>
                    </el-input>
                </el-row>
            </template>
            <template #right>
                <el-button type="primary" icon="el-icon-plus" @click="handleAdd">添加功能</el-button>
            </template>
        </PageHeader>
        <div class="main-list">
            <!-- 表格 -->
            <el-table ref="multipleTable" :data="tableData" style="width: 100%">
                <el-table-column prop="code" label="功能编号" align="center"></el-table-column>
                <el-table-column prop="name" label="功能名称" align="center"></el-table-column>
                <el-table-column prop="description" label="功能描述" align="center"></el-table-column>
                <el-table-column label="网页导航" align="center">
                    <template #default="scope">
                        {{ scope.row.is_nav ? '是' : '否' }}
                    </template>
                </el-table-column>
                <el-table-column prop="classifyName" label="类型" align="center">
                    <template #default="scope">
                        {{ scope.row.type === 1 ? '本页网站' : '外部链接' }}
                    </template>
                </el-table-column>
                <el-table-column label="状态" align="center">
                    <template #default="scope">
                        {{ scope.row.status ? '正常' : '禁用' }}
                    </template>
                </el-table-column>
                <el-table-column prop="realname" label="创建人" align="center"></el-table-column>
                <el-table-column min-width="200" label="创建时间" align="center">
                    <template #default="scope">
                        {{ scope.row.create_time }}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="操作" min-width="150" fixed="right">
                    <template #default="scope">
                        <el-button type="text" @click="handleEdit(scope.row)">编辑</el-button>
                        <el-dropdown :style="{ marginLeft: '10px', color: '#409EFF' }">
                            <span class="el-dropdown-link">
                                <i class="el-icon-more"></i>
                            </span>
                            <template #dropdown>
                                <el-dropdown-menu>
                                    <el-dropdown-item>
                                        <span @click="handleDisable(scope.row)">
                                            {{ scope.row.status ? '禁用' : '恢复' }}
                                        </span>
                                    </el-dropdown-item>
                                    <el-dropdown-item>
                                        <span @click="handleDelete(scope.row)">删除</span>
                                    </el-dropdown-item>
                                </el-dropdown-menu>
                            </template>
                        </el-dropdown>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                hide-on-single-page
                background
                align="center"
                :current-page.sync="tablePages.pageNum"
                @current-change="count => pageChange(count)"
                :page-size="tablePages.pageSize"
                layout="prev, pager, next"
                style="margin-top: 20px"
                :total="tablePages.total"
            ></el-pagination>
        </div>
    </div>
</template>

<script>
import { getFuncList, delFuncItem, updateFuncStatus, delFunctionBefore } from '@/api/function'
import PageHeader from '@/components/pageHeader'
export default {
    name: 'xxx',
    components: {
        PageHeader
    },
    data() {
        return {
            tableData: [],
            funcName: '',
            tablePages: {
                pageNum: 1,
                pageSize: 10,
                total: 0
            }
        }
    },
    created() {
        this.getFuncList()
    },
    methods: {
        async getFuncList() {
            const { pageNum, pageSize } = this.tablePages
            this.listLoading = true
            let params = {
                pageNum,
                pageSize,
                name: this.funcName
            }
            const {
                data: { content, totalElements }
            } = await getFuncList(params)

            this.tableData = content
            this.tablePages.total = +totalElements
            this.listLoading = false
        },
        onSearch() {
            this.tablePages.pageNum = 1
            this.getFuncList()
        },
        pageChange(val) {
            this.tablePages.pageNum = val
            this.getFuncList()
        },
        handleAdd() {
            this.$router.push({
                name: 'addFunction'
            })
        },
        // 修改
        handleEdit({ id }) {
            this.$router.push({
                name: 'editFunction',
                params: { id }
            })
        },
        // 禁用
        async handleDisable({ id, status }) {
            if (status) {
                this.$confirm('禁用后，将不再为学校提供该项服务', '你确定禁用此产品吗', {
                    confirmButtonText: '禁用',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    await updateFuncStatus({ id, status: status ? 0 : 1 })
                    this.$message.success('操作成功!')
                    this.onSearch()
                })
            } else {
                await updateFuncStatus({ id, status: status ? 0 : 1 })
                this.$message.success('操作成功!')
                this.onSearch()
            }
        },
        // 删除
        async handleDelete({ id }) {
            const {
                data: { project_num }
            } = await delFunctionBefore({ id })
            console.log('project_num :>> ', project_num)
            if (+project_num > 0) {
                this.$confirm('若不再提供服务，请点击【禁用】', '有项目配置了此功能', {
                    confirmButtonText: '知道了',
                    type: 'warning',
                    center: true,
                    showCancelButton: false
                }).then(() => {
                    console.log('删除')
                })
            } else {
                this.$confirm('删除后，将无法恢复初始状态', '你确定删除这项内容吗？', {
                    confirmButtonText: '删除',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    await delFuncItem({ id })
                    this.$message.success('操作成功!')
                    this.onSearch()
                })
            }
        }
    }
}
</script>
<style lang="scss" scoped>
.app-container {
    .cell {
        display: flex;
        align-items: center;
        .label {
            flex-shrink: 0;
            font-size: 14px;
            color: #606266;
            margin-right: 15px;
            width: 110px;
        }
        .content {
            flex: 1;
        }
    }
    .mian-top {
        position: relative;
        width: 100%;
        background-color: #fff;
        padding: 20px;
        margin-bottom: 20px;

        .btns {
            position: absolute;
            top: 24px;
            right: 20px;
            // width: 300px;
        }
    }
}
</style>
