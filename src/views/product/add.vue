<template>
    <div class="app-container">
        <div class="info">
            <el-form ref="form" :model="form" label-width="80px" :rules="rules">
                <el-form-item label="产品名称" prop="name">
                    <el-input v-model="form.name" maxlength="50" placeholder="请输入产品名称" style="width: 400px" />
                </el-form-item>
                <el-form-item label="产品描述">
                    <el-input
                        maxlength="50"
                        v-model="form.description"
                        type="textarea"
                        size="small"
                        placeholder="请输入产品描述"
                        style="width: 400px"
                    />
                </el-form-item>
                <el-form-item label="选择功能" prop="function_ids">
                    <div class="header">
                        <div class="left">（将会在以上管理范围内配置权限）</div>
                        <div class="right">
                            <el-switch v-model="checked" active-text="全部权限" active-color="#13ce66"></el-switch>
                        </div>
                    </div>
                    <div class="main">
                        <el-tree
                            :style="{ width: '400px' }"
                            ref="tree"
                            :data="treeList"
                            show-checkbox
                            node-key="id"
                            default-expand-all
                            @check="onChange"
                            :default-checked-keys="form.function_ids"
                            :props="defaultProps"
                            empty-text="无使用后台的权限"
                        >
                            <span class="custom-tree-node" slot-scope="{ node, data }">
                                <span class="tree-lable">{{ node.label }}</span>
                                <el-tooltip v-if="data.description" :content="data.description" placement="top">
                                    <span class="tree-description">
                                        {{ data.description }}
                                    </span>
                                </el-tooltip>
                            </span>
                        </el-tree>
                    </div>
                </el-form-item>
                <el-form-item>
                    <el-button @click="$router.go(-1)">取消</el-button>
                    <el-button type="primary" @click="onSubmit">保存</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
import { getFunctionTree, getProductDetail, addProductItem, updateProductItem } from '@/api/product'

export default {
    data() {
        return {
            form: {
                name: '',
                description: '',
                function_ids: []
            },
            rules: {
                name: [{ required: true, message: '请输入产品名称', trigger: 'blur' }],
                function_ids: [{ required: true, message: '必须选择该产品对应的功能', trigger: 'change' }]
            },
            defaultProps: {
                label: 'name',
                children: 'children'
            },
            treeList: []
        }
    },
    async created() {
        const { id } = this.$route.params
        if (id) {
            this.form.id = id
            await this.getProductDetail(id)
        }
        this.getFunctionTree()
    },
    computed: {
        checked: {
            get() {
                const ids = this.form.function_ids
                return this.treeList.every(item => ids.includes(item.id))
            },
            set(val) {
                console.log('val :>> ', val)
                if (val) {
                    this.$nextTick(function() {
                        // 全选
                        this.$refs.tree.setCheckedNodes(this.treeList)
                        this.form.function_ids = this.$refs.tree.getCheckedKeys()
                    })
                } else {
                    this.$nextTick(function() {
                        // 反选
                        this.$refs.tree.setCheckedKeys([])
                        this.form.function_ids = []
                    })
                }
            }
        }
    },
    methods: {
        async getProductDetail(id) {
            const { data } = await getProductDetail({ id })
            this.form = {
                ...this.form,
                ...data
            }
        },
        hasCheck() {
            return this.form.function_ids.includes('-1')
        },
        async getFunctionTree() {
            const {
                data: { list, check_ids }
            } = await getFunctionTree({ product_id: this.form.id || 0 })
            this.form.function_ids = check_ids.map(item => item.function_id)
            this.treeList = list
        },
        onChange(data, { checkedKeys }) {
            let ids = checkedKeys
            // 判断是选中还是不选中
            const hasCheck = checkedKeys.includes(data.id)
            console.log('hasCheck :>> ', hasCheck)
            if (data.relationIds && hasCheck) {
                ids = ids.concat(data.relationIds.split(','))
            }
            console.log('ids :>> ', ids)
            this.form.function_ids = ids
        },
        onSubmit() {
            this.$refs['form'].validate(async valid => {
                if (valid) {
                    // 半选的
                    const halfCheckedIds = this.$refs.tree.getHalfCheckedKeys().filter(item => item != -1)
                    // 选中的
                    const checkedIds = this.form.function_ids

                    const params = {
                        ...this.form,
                        function_ids: [...checkedIds, ...halfCheckedIds].join(',')
                    }

                    if (this.form.id) {
                        await updateProductItem(params)
                    } else {
                        await addProductItem(params)
                    }

                    this.$message.success('保存成功!')

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

<style scoped lang="scss">
.app-container {
    .info {
        @include base-box;
    }
    .header {
        width: 400px;
        @include flex(space-between);
    }
    .custom-tree-node {
        @include flex;
        .tree-description {
            display: inline-block;
            margin-left: 10px;
            font-size: 12px;
            max-width: 100px;
            line-height: 36px;
            height: 36px;
            @include text-overflow();
        }
    }
}
</style>
