<template>
    <div class="app-container">
        <ShoolInfo></ShoolInfo>
        <div class="tab-content">
            <el-tabs v-model="activeName" :before-leave="leaveTab">
                <el-tab-pane label="基础配置" name="basicConfiguration">
                    <BasicConfiguration v-if="activeName == 'basicConfiguration'"></BasicConfiguration>
                </el-tab-pane>
                <el-tab-pane label="页面设置" name="pageSetup">
                    <PageSetup v-if="activeName == 'pageSetup'"></PageSetup>
                </el-tab-pane>
                <el-tab-pane label="功能权限设置" name="functionPermissionSetting">
                    <FunctionPermissionSetting
                        v-if="activeName == 'functionPermissionSetting'"
                    ></FunctionPermissionSetting>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>

<script>
import ShoolInfo from './components/shoolInfo'
import BasicConfiguration from './components/basicConfiguration'
import PageSetup from './components/pageSetup'
import FunctionPermissionSetting from './components/functionPermissionSetting'

export default {
    provide() {
        return {
            id: this.$route.params.id
        }
    },
    components: {
        ShoolInfo,
        BasicConfiguration,
        PageSetup,
        FunctionPermissionSetting
    },
    data() {
        return { activeName: 'basicConfiguration' }
    },
    created() {
        const { query } = this.$route
        query.activeName && (this.activeName = query.activeName)
    },
    methods: {
        leaveTab(activeName) {
            this.$router.replace({
                name: 'portalConfiguration',
                query: {
                    activeName
                }
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.app-container {
    .tab-content {
        margin-top: 20px;
    }
}
</style>
