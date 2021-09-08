<template>
    <div class="app-container">
        <PageHeader>
            <template #left>
                <el-row :gutter="10">
                    <el-col :span="12">
                        <el-input
                            placeholder="请输入学校名称"
                            v-model="school_name"
                            clearable
                            @clear="onSearch"
                            class="input-with-select"
                        >
                            <template #append>
                                <el-button icon="el-icon-search" @click="onSearch"></el-button>
                            </template>
                        </el-input>
                    </el-col>
                    <el-col :span="12">
                        <el-select v-model="status" placeholder="请选择状态" clearable @change="onSearch">
                            <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            ></el-option>
                        </el-select>
                    </el-col>
                </el-row>
            </template>
            <template #right>
                <el-button type="primary" icon="el-icon-plus" @click="addItem">新增项目</el-button>
            </template>
        </PageHeader>
        <div class="main-list">
            <!-- 表格 -->
            <el-table ref="multipleTable" :data="tableData" style="width: 100%">
                <el-table-column align="center" type="index" width="50" label="序号"></el-table-column>
                <el-table-column
                    align="center"
                    show-overflow-tooltip
                    min-width="150"
                    prop="school_name"
                    label="学校名称"
                ></el-table-column>
                <el-table-column align="center" min-width="100" prop="school_type" label="学校类型">
                    <template #default="scope">
                        {{ scope.row.school_type == 1 ? '本科' : '高职' }}
                    </template>
                </el-table-column>
                <el-table-column
                    align="center"
                    show-overflow-tooltip
                    min-width="150"
                    prop="site_name"
                    label="网站名称"
                ></el-table-column>
                <el-table-column prop="course_status" align="center" label="状态">
                    <template #default="scope">
                        {{ scope.row.status ? '正常' : '禁用' }}
                    </template>
                </el-table-column>
                <el-table-column align="center" prop="product_name" label="产品组合" width="200"></el-table-column>
                <el-table-column align="center" prop="realname" label="创始人"></el-table-column>
                <el-table-column align="center" min-width="200" label="创建时间">
                    <template #default="scope">
                        {{ scope.row.create_time }}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="操作" min-width="200" fixed="right">
                    <template #default="scope">
                        <el-button type="text" @click="preview(scope.row)">预览</el-button>
                        <el-button type="text" @click="portalConfiguration(scope.row)">门户配置</el-button>
                        <el-button type="text" @click="editItem(scope.row)">编辑</el-button>
                        <el-dropdown :style="{ marginLeft: '10px', color: '#409EFF' }">
                            <span class="el-dropdown-link">
                                <i class="el-icon-more"></i>
                            </span>
                            <el-dropdown-menu #dropdown>
                                <el-dropdown-item>
                                    <span @click="disableItem(scope.row)">
                                        {{ scope.row.status ? '禁用' : '恢复' }}
                                    </span>
                                </el-dropdown-item>
                                <el-dropdown-item>
                                    <span @click="deleteItem(scope.row)">删除</span>
                                </el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                background
                hide-on-single-page
                align="center"
                @current-change="pageChange"
                :current-page.sync="tablePages.pageNum"
                :page-size="tablePages.pageSize"
                layout="total, prev, pager, next, jumper"
                style="margin-top: 20px"
                :total="tablePages.total"
            ></el-pagination>
        </div>
    </div>
</template>

<script>
import PageHeader from '@/components/pageHeader'

import { getProjectList, updateProjectStatus, delProjectItem } from '@/api/project'

export default {
    components: {
        PageHeader
    },
    data() {
        return {
            school_name: '', // 搜索
            options: [
                // 状态
                {
                    value: 1,
                    label: '正常'
                },
                {
                    value: 0,
                    label: '禁用'
                }
            ],
            tableData: [], // 列表数据
            status: '', //选中状态
            tablePages: {
                pageNum: 1,
                pageSize: 10,
                total: 0
            } // 分页
        }
    },
    created() {
        this.getProjectList()
    },
    methods: {
        // 列表
        async getProjectList() {
            const { pageNum, pageSize } = this.tablePages
            this.listLoading = true
            let params = {
                pageNum,
                pageSize,
                school_name: this.school_name,
                status: this.status
            }
            const {
                data: { content, totalElements }
            } = await getProjectList(params)

            this.tableData = content
            this.tablePages.total = +totalElements
            this.listLoading = false
        },
        // 新增项目
        addItem() {
            this.$router.push({ name: 'addItem' })
        },
        // 搜索
        onSearch() {
            this.tablePages.pageNum = 1
            this.getProjectList()
        },
        // 预览
        preview({ site_url }) {
            window.open(site_url)
        },
        // 门户配置
        portalConfiguration({ id }) {
            this.$router.push({ name: 'portalConfiguration', params: { id } })
        },
        // 编辑
        editItem({ id }) {
            this.$router.push({ name: 'editItem', params: { id } })
        },
        // 改变分页
        pageChange(val) {
            this.tablePages.pageNum = val
            this.getProjectList()
        },
        // 禁用
        async disableItem({ id, status }) {
            if (status) {
                this.$confirm('禁用后，将不再为学校提供该服务项目', '你确定禁用此项目吗？', {
                    confirmButtonText: '禁用',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    await updateProjectStatus({ id, status: status ? 0 : 1 })
                    this.$message.success('操作成功!')
                    this.onSearch()
                })
            } else {
                await updateProjectStatus({ id, status: status ? 0 : 1 })
                this.$message.success('操作成功!')
                this.onSearch()
            }
        },
        // 删除
        deleteItem({ id }) {
            this.$confirm('删除后，将无法恢复初始状态', '你确定删除这项内容吗？', {
                confirmButtonText: '删除',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                await delProjectItem({ id })
                this.$message.success('操作成功!')
                this.onSearch()
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.app-container {
    position: relative;
}
</style>
