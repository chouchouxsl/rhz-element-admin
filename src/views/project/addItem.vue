<template>
    <div class="app-container">
        <div class="form-info">
            <el-form ref="form" :model="form" :rules="rules" label-width="80px" :style="{ width: formWidth }">
                <el-form-item label="项目代码" prop="code">
                    <el-input placeholder="请输入项目代码" maxlength="50" v-model="form.code"></el-input>
                </el-form-item>
                <el-form-item label="会员学校" prop="school_name">
                    <el-input placeholder="请输入学校全称" maxlength="50" v-model="form.school_name"></el-input>
                </el-form-item>
                <el-form-item label="学校类型" prop="school_type">
                    <el-select v-model="form.school_type" placeholder="请选择学校类型">
                        <el-option label="本科" :value="1"></el-option>
                        <el-option label="高职" :value="2"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="网站名称" prop="site_name">
                    <el-input
                        maxlength="50"
                        placeholder="请输入，命名可参考“上海卓越大学课程思政平台”"
                        v-model="form.site_name"
                    ></el-input>
                </el-form-item>
                <el-form-item label="网站地址" prop="site_url">
                    <el-input maxlength="100" placeholder="请以http://开头" v-model="form.site_url"></el-input>
                </el-form-item>
                <el-form-item label="产品组合" prop="product_id">
                    <el-select v-model="form.product_id" placeholder="请选择产品组合">
                        <el-option
                            v-for="item in productList"
                            :label="item.name"
                            :value="item.id"
                            :key="item.id"
                        ></el-option>
                    </el-select>
                    <div class="tips" v-if="function_names">功能包括：{{ function_names }}</div>
                </el-form-item>
                <el-form-item label="备注">
                    <el-input
                        maxlength="500"
                        placeholder="请描述详细的签约情况，如合同编号、签约时间等，500字以内"
                        type="textarea"
                        v-model="form.remarks"
                    ></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button @click="$router.go(-1)">取消</el-button>
                    <el-button type="primary" @click="onSubmit">确定</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
import { addProjectItem, updateProjectItem, getProjectDetail, getProductSelectList } from '@/api/project'

export default {
    data() {
        return {
            function_names: '',
            formWidth: '500px', // 表单宽度
            productList: [],
            form: {
                code: '',
                school_name: '',
                school_type: 1,
                site_name: '',
                site_url: '',
                product_id: '',
                remarks: ''
            },
            rules: {
                code: [{ required: true, message: '请输入学校全称', trigger: 'blur' }],
                school_name: [{ required: true, message: '请输入学校全称', trigger: 'blur' }],
                school_type: [{ required: true, message: '请选择学校类型', trigger: 'change' }],
                site_name: [{ required: true, message: '请输入网站名称', trigger: 'blur' }],
                site_url: [
                    { required: true, message: '请输入网站地址', trigger: 'blur' },
                    {
                        pattern: /(http|https):\/\/([\w.]+\/?)\S*/,
                        message: '请输入以http://开头的完整链接',
                        trigger: 'blur'
                    }
                ],
                product_id: [{ required: true, message: '请选择产品组合', trigger: 'change' }]
            }
        }
    },
    created() {
        this.getProductSelectList()

        const { id } = this.$route.params
        id && this.getProjectDetail(id)
    },
    watch: {
        'form.product_id'(val) {
            const { function_names } = this.productList.find(item => item.id === val)
            this.function_names = function_names
        }
    },
    mounted() {},
    methods: {
        async getProductSelectList() {
            const { data } = await getProductSelectList()
            this.productList = data
        },
        async getProjectDetail(id) {
            const { data } = await getProjectDetail({ id })
            this.form = data
        },
        // 提交
        onSubmit() {
            this.$refs['form'].validate(async valid => {
                if (valid) {
                    if (this.form.id) {
                        await updateProjectItem(this.form)
                    } else {
                        await addProjectItem(this.form)
                    }
                    this.$message.success('操作成功')
                    this.$router.go(-1)
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.app-container {
    .form-info {
        @include base-box();
        min-height: 90vh;
        .tips {
            word-break: break-all;
            line-height: 28px;
            color: #999999;
        }
    }
}
</style>
