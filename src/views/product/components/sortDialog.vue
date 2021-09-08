<template>
    <el-dialog
        title="设置排序"
        v-if="isShow"
        :visible.sync="isShow"
        width="320px"
        top="30vh"
        :before-close="handlerColse"
    >
        <el-form :model="dialogItem" label-width="95px">
            <el-form-item label="将排序改为">
                <el-input-number
                    placeholder="输入数值"
                    v-model="dialogItem.sort"
                    :precision="0"
                    :step="1"
                    :min="1"
                    :max="100"
                    size="small"
                    style="width: 100%"
                ></el-input-number>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="handlerColse">取 消</el-button>
            <el-button type="primary" @click="saveSort">确 认</el-button>
        </div>
    </el-dialog>
</template>

<script>
export default {
    props: {
        isShow: {
            type: Boolean,
            default: false
        },
        sort: {
            type: Number | String
        }
    },
    data() {
        return {
            dialogItem: {
                sort: ''
            }
        }
    },
    watch: {
        isShow: {
            immediate: true,
            handler(val) {
                if (val) {
                    this.dialogItem.sort = this.sort
                }
            }
        }
    },
    methods: {
        handlerColse() {
            this.$emit('update:isShow', false)
            this.dialogItem = { sort: '' }
        },
        saveSort() {
            if (!this.dialogItem.sort) return this.$message.error('请输入排序后确认!')
            this.$emit('saveSort', this.dialogItem.sort)
            this.handlerColse()
        }
    }
}
</script>

<style lang="scss" scoped></style>
