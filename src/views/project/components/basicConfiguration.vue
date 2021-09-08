<template>
    <div>
        <div class="basic_configuration">
            <div class="title">基础信息配置</div>
            <div class="info">
                <el-form ref="form" :model="form" label-width="120px" :style="{ width: '80%' }">
                    <el-form-item label="浏览器图标">
                        <Upload
                            mark="icon"
                            :file_url="form.icon_url"
                            :width="30"
                            :height="30"
                            tip="建议32*32尺寸"
                            @success="onUploadSuccess"
                        ></Upload>
                    </el-form-item>
                    <el-form-item label="前端学校logo">
                        <Upload
                            mark="beforeLogo"
                            :file_url="form.home_logo_url"
                            :width="200"
                            :height="100"
                            @success="onUploadSuccess"
                        ></Upload>
                    </el-form-item>
                    <el-form-item label="后台学校logo">
                        <Upload
                            mark="afterLogo"
                            :file_url="form.back_logo_url"
                            :width="120"
                            :height="120"
                            @success="onUploadSuccess"
                        ></Upload>
                    </el-form-item>
                    <el-form-item label="版权信息Copyright©" label-width="160px">
                        <el-input v-model="form.copyright"></el-input>
                    </el-form-item>
                </el-form>
            </div>
        </div>
        <div class="single_sign_on">
            <div class="title">登录设置</div>
            <div class="info">
                <el-form ref="form" :model="form" label-width="120px" :style="{ width: '80%' }">
                    <el-form-item label="登录方式">
                        <el-checkbox label="智慧树登录" v-model="form.zhs_login"></el-checkbox>
                        <el-checkbox label="单点登录" v-model="form.sso_login"></el-checkbox>
                    </el-form-item>
                </el-form>
            </div>
        </div>
        <FooterBtn @save="save"></FooterBtn>
    </div>
</template>

<script>
import FooterBtn from './footerBtn.vue'
import Upload from './upload.vue'
import { getProjectBaseConfig, saveProjectBaseConfig } from '@/api/project'

export default {
    inject: ['id'],
    components: {
        Upload,
        FooterBtn
    },
    data() {
        return {
            form: {
                back_logo_id: null,
                back_logo_url: null,
                copyright: null,
                home_logo_id: null,
                home_logo_url: null,
                icon_id: null,
                icon_url: null,
                sso_login: false,
                zhs_login: false,
                copyright: '2003-现在 Zhihuishu. All rights reserved. 沪ICP证10007183-5'
            }
        }
    },
    created() {
        this.getProjectBaseConfig()
    },
    methods: {
        async getProjectBaseConfig() {
            const { data } = await getProjectBaseConfig({ project_id: this.id })
            delete data.project_id
            this.form = data
        },
        async save() {
            const { sso_login, zhs_login } = this.form

            const params = {
                ...this.form,
                sso_login: sso_login ? 1 : 0,
                zhs_login: zhs_login ? 1 : 0
            }

            delete params.icon_url
            delete params.home_logo_url
            delete params.back_logo_url

            await saveProjectBaseConfig(params)

            this.$message.success('保存成功')
        },
        // 上传成功接口
        onUploadSuccess({ id, url, mark }) {
            console.log('id, url, mark :>> ', id, url, mark)

            switch (mark) {
                case 'icon':
                    this.form.icon_id = id
                    this.form.icon_url = url
                    break
                case 'beforeLogo':
                    this.form.home_logo_id = id
                    this.form.home_logo_url = url
                    break
                case 'afterLogo':
                    this.form.back_logo_id = id
                    this.form.back_logo_url = url
                    break
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.basic_configuration,
.single_sign_on {
    @include base-box;
    margin-bottom: 20px;

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
}
</style>
