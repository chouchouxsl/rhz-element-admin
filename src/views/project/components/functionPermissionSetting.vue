<template>
    <div class="setting">
        <div class="setting-list">
            <div class="table">
                <el-table ref="multipleTable" :data="tableData" style="width: 100%">
                    <el-table-column align="center" type="index" width="50" label="序号"></el-table-column>
                    <el-table-column align="center" prop="name" label="功能"></el-table-column>
                    <el-table-column align="center" label="访问权限" min-width="100">
                        <template #default="scope">
                            <el-select v-model="scope.row.auth_type" placeholder="请选择">
                                <el-option
                                    v-for="item in options"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value"
                                ></el-option>
                            </el-select>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
        <FooterBtn @save="save"></FooterBtn>
    </div>
</template>

<script>
import { getProjectAuthConfig, saveProjectAuthConfig } from '@/api/project'

import FooterBtn from './footerBtn.vue'

export default {
    components: {
        FooterBtn
    },
    inject: ['id'],
    data() {
        return {
            options: [
                {
                    value: 0,
                    label: '无需登录'
                },
                {
                    value: 1,
                    label: '详情需登录'
                },
                {
                    value: 2,
                    label: '菜单需登录'
                }
            ],
            tableData: []
        }
    },
    created() {
        this.getProjectAuthConfig()
    },
    mounted() {},
    methods: {
        async getProjectAuthConfig() {
            const { data } = await getProjectAuthConfig({ project_id: this.id })
            this.tableData = data
        },
        async save() {
            await saveProjectAuthConfig(
                {
                    list: this.tableData
                },
                {
                    headers: {
                        'Content-Type': 'application/json;charset=UTF-8'
                    }
                }
            )

            this.$message.success('保存成功')
        }
    }
}
</script>

<style lang="scss" scoped>
.setting {
    .setting-list {
        .table {
            width: 700px;
        }
        @include base-box;
    }
}
</style>
