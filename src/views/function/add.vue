<template>
    <div class="app-container">
        <el-form ref="form" :model="form" label-width="120px" :rules="rules" class="enter-x">
            <div class="info">
                <div class="title">功能基础信息</div>
                <el-form-item class="enter-x" label="功能编号" prop="code">
                    <el-input
                        v-model="form.code"
                        placeholder="请输入功能编号,用于匹配研发的功能模块"
                        style="width: 500px"
                    />
                </el-form-item>
                <el-form-item class="enter-x" label="功能名称" prop="name">
                    <el-input
                        v-model="form.name"
                        maxlength="10"
                        placeholder="请输入功能名称，限制10字以内"
                        style="width: 500px"
                    />
                </el-form-item>
                <el-form-item class="enter-x" label="功能类型" required>
                    <el-select v-model="form.type" placeholder="请选择功能类型" style="width: 500px">
                        <el-option
                            v-for="item in functionType"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item class="enter-x" label="前端页面导航" required>
                    <el-radio-group v-model="form.is_nav">
                        <el-radio :label="1">是</el-radio>
                        <el-radio :label="0">否</el-radio>
                    </el-radio-group>
                </el-form-item>
                <template v-if="form.type == 1">
                    <el-form-item class="enter-x" label="后台菜单">
                        <el-radio-group v-model="form.is_menu">
                            <el-radio :label="1">是</el-radio>
                            <el-radio :label="0">否</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item class="enter-x" label="后台父级模块" v-if="form.is_menu == 1">
                        <el-select v-model="form.parent_id" placeholder="请选择功能类型" style="width: 500px">
                            <el-option
                                v-for="item in parentFunctionList"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                </template>
                <template v-else>
                    <el-form-item class="enter-x" label="链接地址" prop="target_url" key="target_url">
                        <el-input v-model="form.target_url" placeholder="请以http://开头" style="width: 500px" />
                    </el-form-item>
                </template>
                <el-form-item class="enter-x" label="跳转方式">
                    <el-radio-group v-model="form.target_type">
                        <el-radio :label="1">新开页面跳转</el-radio>
                        <el-radio :label="0">当前页面跳转</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item class="enter-x" label="访问权限" prop="auth_type" v-if="form.type == 2" :key="form.type">
                    <el-select v-model="form.auth_type" clearable placeholder="请选择访问权限" style="width: 500px">
                        <el-option
                            v-for="item in accessPermissionType"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item class="enter-x" label="访问权限" v-else :key="form.type">
                    <el-select v-model="form.auth_type" clearable placeholder="请选择访问权限" style="width: 500px">
                        <el-option
                            v-for="item in accessPermissionType"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item class="enter-x" label="联动功能">
                    <el-cascader
                        v-model="form.relation_ids"
                        placeholder="请选择联动功能"
                        style="width: 500px"
                        :options="functionTree"
                        :props="{ multiple: true, label: 'name', value: 'id' }"
                        clearable
                        filterable
                    ></el-cascader>
                </el-form-item>
                <el-form-item class="enter-x" label="功能描述">
                    <el-input
                        v-model="form.description"
                        type="textarea"
                        maxlength="25"
                        placeholder="将显示于学校门户功能配置处，描述请斟酌，25字以内"
                        style="width: 500px"
                    />
                </el-form-item>
            </div>
            <div class="info" v-if="form.type == 1">
                <div class="title">首页规则设置</div>
                <el-form-item class="enter-x" label="首页上展示" required>
                    <el-radio-group v-model="form.home_show">
                        <el-radio :label="1">支持</el-radio>
                        <el-radio :label="0">不支持</el-radio>
                    </el-radio-group>
                </el-form-item>
                <template v-if="form.home_show == 1">
                    <el-form-item class="enter-x" label="在首页的位置" required>
                        <el-radio-group v-model="form.home_place">
                            <el-radio :label="1">固定</el-radio>
                            <el-radio :label="0">不固定</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item class="enter-x" label="首页后台配置" required>
                        <el-radio-group v-model="form.home_config">
                            <el-radio :label="1">支持</el-radio>
                            <el-radio :label="0">不支持</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item class="enter-x" label="首页展示个数" prop="home_num" v-if="form.home_config == 1">
                        <el-input
                            oninput="value=value.replace(/[^\d]/g,'')"
                            v-model.number="form.home_num"
                            placeholder="请输入默认在首页展示的个数，支持项目管理中个性化配置"
                            style="width: 400px"
                        />
                    </el-form-item>
                </template>
            </div>
        </el-form>
        <FooterBtn :isEdit="!!$route.params.id" @save="onSubmit"></FooterBtn>
    </div>
</template>

<script>
import FooterBtn from './components/footerBtn'

import { getFuncDetail, addFuncItem, updateFuncItem, getParentFunctionList, getFunctionTree } from '@/api/function'
export default {
    components: {
        FooterBtn
    },
    data() {
        return {
            form: {
                name: '',
                code: '',
                home_place: 1,
                home_config: 1,
                home_show: 1,
                type: 1,
                is_nav: 1,
                is_menu: 1,
                target_type: 1,
                auth_type: '',
                home_num: '', // 个数
                parent_id: '', // 后台父级模块
                relation_ids: '', // 联动功能
                description: '', // 功能描述
                target_url: '' // 链接地址
            },
            rules: {
                name: [{ required: true, message: '请输入功能名称', trigger: 'blur' }],
                code: [{ required: true, message: '请输入功能编号', trigger: 'blur' }],
                target_url: [
                    { required: true, message: '请输入链接地址', trigger: 'blur' },
                    {
                        pattern: /(http|https):\/\/([\w.]+\/?)\S*/,
                        message: '请输入以http://开头的完整链接',
                        trigger: 'blur'
                    }
                ],
                auth_type: [{ required: true, message: '请选择访问权限', trigger: 'change' }],
                home_num: [{ required: true, message: '首页展示个数', trigger: 'blur' }]
            },
            functionTree: [],
            parentFunctionList: [],
            accessPermissionType: [
                { label: '不支持设置', value: 0 },
                { label: '无需登录', value: 1 },
                { label: '详情需登录', value: 2 },
                { label: '菜单需登录', value: 3 }
            ],
            functionType: [
                { label: '本站网页', value: 1 },
                { label: '外部链接', value: 2 }
            ]
        }
    },
    async created() {
        this.getParentFunctionList()
        await this.getFunctionTree()

        const { id } = this.$route.params
        id && this.getFuncDetail(id)
    },
    methods: {
        async getFuncDetail(id) {
            const { data } = await getFuncDetail({ id })

            for (const key in data) {
                if (Object.hasOwnProperty.call(data, key)) {
                    let item = data[key]
                    if (typeof item === 'boolean') {
                        data[key] = item ? 1 : 0
                    }
                    // 父级id置空
                    if (key === 'parent_id' && item === '0') {
                        data[key] = ''
                    }
                    // 级联选择器回显
                    if (key === 'relation_ids' && item) {
                        const arr = []
                        item.split(',').forEach(r => {
                            arr.push(this.changeDetSelect(r, this.functionTree))
                        })
                        data[key] = arr
                    }
                }
            }
            console.log('data :>> ', data)
            this.form = data
        },
        async getParentFunctionList() {
            const { data } = await getParentFunctionList()
            this.parentFunctionList = data
        },
        async getFunctionTree() {
            const { data } = await getFunctionTree()
            this.functionTree = data
        },
        changeDetSelect(key, treeData) {
            let arr = [] // 在递归时操作的数组
            let returnArr = [] // 存放结果的数组
            let depth = 0 // 定义全局层级
            // 定义递归函数
            function childrenEach(childrenData, depthN) {
                for (var j = 0; j < childrenData.length; j++) {
                    depth = depthN // 将执行的层级赋值 到 全局层级
                    arr[depthN] = childrenData[j].id
                    if (childrenData[j].id == key) {
                        returnArr = arr.slice(0, depthN + 1) //将目前匹配的数组，截断并保存到结果数组，
                        break
                    } else {
                        if (childrenData[j].children) {
                            depth++
                            childrenEach(childrenData[j].children, depth)
                        }
                    }
                }
                return returnArr
            }

            return childrenEach(treeData, depth)
        },
        onSubmit(flag) {
            console.log('flag :>> ', flag)
            this.$refs.form.validate(async valid => {
                if (valid) {
                    let relation_ids = ''
                    if (this.form.relation_ids) {
                        relation_ids = this.form.relation_ids
                            .map(item => {
                                return item.slice(-1)[0]
                            })
                            .join(',')
                    }
                    console.log('relation_ids :>> ', relation_ids)

                    const params = {
                        ...this.form,
                        relation_ids,
                        parent_id: this.form.parent_id || '0'
                    }

                    if (this.form.id) {
                        await updateFuncItem(params)
                    } else {
                        await addFuncItem(params)
                    }

                    this.$message({
                        type: 'success',
                        message: '保存成功!'
                    })

                    if (flag) {
                        this.$router.go(-1)
                    } else {
                        this.form = {
                            name: '',
                            code: '',
                            home_place: 1,
                            home_config: 1,
                            home_show: 1,
                            type: 1,
                            is_nav: 1,
                            is_menu: 1,
                            target_type: 1,
                            auth_type: 0,
                            home_num: '', // 个数
                            parent_id: '', // 后台父级模块
                            relation_ids: '', // 联动功能
                            description: '', // 功能描述
                            target_url: '' // 链接地址
                        }
                        window.scroll(0, 0)
                    }
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
        margin-bottom: 20px;
        @include base-box;
        .title {
            padding-bottom: 20px;
            font-size: 16px;
            font-weight: 700;
        }
    }
}
</style>
