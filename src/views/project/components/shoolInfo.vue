<template>
    <div class="shool_info" v-if="shoolInfo">
        <div class="shool_info-title">{{ shoolInfo.school_name }}</div>
        <div class="shool_info-bottom">
            <div class="cell">
                <div class="creator">
                    创建人:
                    <span>{{ shoolInfo.realname }}</span>
                </div>
                <div class="creationTime">
                    创建时间:
                    <span>{{ shoolInfo.create_time }}</span>
                </div>
            </div>
            <div class="cell">
                <div class="creationTime">
                    门户网址:
                    <a target="_blank" :href="shoolInfo.site_url">{{ shoolInfo.site_url }}</a>
                </div>
                <div class="status">
                    状态:
                    <span>{{ shoolInfo.status ? '正常' : '禁用' }}</span>
                    <el-button class="disablebtn" type="text" @click="handlerDisable(shoolInfo)">
                        {{ shoolInfo.status ? '禁用' : '恢复' }}
                    </el-button>
                </div>
            </div>
            <div class="cell">
                <div class="function">
                    功能包括:
                    <span>{{ shoolInfo.function_names }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { updateProjectStatus, getProjectConfigDetail } from '@/api/project'

export default {
    inject: ['id'],
    data() {
        return {
            shoolInfo: null
        }
    },
    created() {
        this.getProjectConfigDetail()
    },
    methods: {
        async getProjectConfigDetail() {
            const { data } = await getProjectConfigDetail({ id: this.id })
            this.shoolInfo = data
        },
        // 禁用
        async handlerDisable({ id, status }) {
            if (status) {
                this.$confirm('禁用后，将不再为学校提供该服务项目', '你确定禁用此项目吗？', {
                    confirmButtonText: '禁用',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    await updateProjectStatus({ id, status: status ? 0 : 1 })
                    this.$message.success('操作成功!')
                    this.getProjectConfigDetail()
                })
            } else {
                await updateProjectStatus({ id, status: status ? 0 : 1 })
                this.$message.success('操作成功!')
                this.getProjectConfigDetail()
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.shool_info {
    padding-top: 20px;
    &-title {
        font-size: 18px;
        font-weight: 700;
        margin-bottom: 20px;
    }

    &-bottom {
        font-size: 14px;
        .cell {
            width: 700px;
            @include flex(space-between);
            margin-top: 15px;
            > div:not(.function) {
                @include text-overflow();
                text-align: left;
                flex: 1;
                flex-shrink: 0;
            }
            .function {
                line-height: 25px;
                @include many-text-overflow(3);
            }
        }
        .disablebtn {
            margin-left: 7px;
        }
    }
}
</style>
