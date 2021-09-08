<template>
    <div class="page_setup">
        <div class="modules_num">
            <div class="title">首页模块数量设置</div>
            <div class="info">
                <div class="table">
                    <el-table ref="multipleTable" :data="tableData" style="width: 100%">
                        <el-table-column align="center" prop="name" label="模块名称"></el-table-column>
                        <el-table-column align="center" label="显示个数">
                            <template #default="scope" min-width="100">
                                <el-input
                                    oninput="value=value.replace(/[^\d]/g,'')"
                                    v-model.number="scope.row.num"
                                    v-if="scope.row.num >= 0"
                                ></el-input>
                                <el-input disabled placeholder="不限数量" v-else></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="排序" min-width="100">
                            <template #default="scope">
                                <el-input
                                    oninput="value=value.replace(/[^\d]/g,'')"
                                    v-model.number="scope.row.sort"
                                    v-if="!scope.row.home_place"
                                ></el-input>
                                <el-input disabled placeholder="顺序不支持更改" v-else></el-input>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </div>
        </div>
        <FooterBtn @save="save"></FooterBtn>
    </div>
</template>

<script>
import FooterBtn from './footerBtn.vue'
import { saveProjectPageConfig, getProjectPageConfig } from '@/api/project'

export default {
    components: {
        FooterBtn
    },
    inject: ['id'],
    data() {
        let validateNum = (rule, value, callback) => {
            console.log(rule, value, callback)
            if (!value) {
                callback()
            } else {
                if (/^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/.test(value) == false) {
                    callback(new Error('请填写大于0的数字'))
                } else {
                    callback()
                }
            }
        }
        return {
            tableData: [],
            form: {
                num: ''
            },
            rules: {
                num: [{ validator: validateNum, trigger: 'change' }]
            }
        }
    },
    created() {
        this.getProjectPageConfig()
    },
    mounted() {},
    methods: {
        async getProjectPageConfig() {
            const { data } = await getProjectPageConfig({ project_id: this.id })
            this.tableData = data
        },
        async save() {
            await saveProjectPageConfig(
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
.page_setup {
    .table {
        width: 700px;
    }
    .title {
        padding-bottom: 20px;
        font-size: 16px;
        font-weight: 700;
    }
    .info {
        width: 700px;
        @include flex;
        .label {
            padding-right: 20px;
            width: 120px;
            text-align: right;
            font-size: 14px;
            color: #606266;
            font-weight: 700;
        }
    }
    .single_sign_on,
    .modules_num {
        margin-bottom: 20px;
        @include base-box;
    }
}
</style>
