<template>
    <el-upload
        class="cover-uploader"
        :action="addressOss"
        :data="dataObj"
        :show-file-list="false"
        :on-success="handleUploadCoverSuccess"
        :before-upload="beforeUpload"
    >
        <div class="upload-warp" :style="{ width: width + 'px', height: height + 'px' }">
            <img v-if="file_url" :src="file_url" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </div>
        <div slot="tip" class="el-upload__tip">
            {{ tip }}
        </div>
    </el-upload>
</template>

<script>
import { getPolicy } from '@/api/common'

export default {
    props: {
        file_url: {
            type: String,
            default: ''
        },
        tip: {
            type: String,
            default: ''
        },
        width: {
            type: [String, Number],
            default: 200
        },
        height: {
            type: [String, Number],
            default: 200
        },
        mark: {
            type: String,
            default: '',
            required: true
        }
    },
    data() {
        return {
            addressOss: '', // 上传接口地址
            dataObj: {} // 上传额外参数
        }
    },
    created() {},
    mounted() {},
    methods: {
        // 上传封面成功
        handleUploadCoverSuccess({ data }, file) {
            this.$emit('success', {
                id: data.id,
                url: data.fileUrl,
                mark: this.mark
            })
        },
        // 上传封面前
        beforeUpload(file) {
            const isJPG = file.type === 'image/jpeg'
            const isPNG = file.type === 'image/png'
            const isIcon = file.type === 'image/vnd.microsoft.icon'

            if (!isJPG && !isPNG && !isIcon) {
                this.$message.error('上传图片只能是 JPG/PNG/ICON 格式!')
                return false
            }
            const _self = this
            return new Promise(async (resolve, reject) => {
                try {
                    const res = await getPolicy({ fileName: file.name })
                    const data = JSON.parse(res.data)
                    _self.addressOss = data.host
                    const dataObj = {}
                    dataObj['key'] = data.dir + data.fileUUID + '.' + file.name.split('.')[1]
                    dataObj['policy'] = data.policy
                    dataObj['OSSAccessKeyId'] = data.accessid
                    dataObj['success_action_status'] = 200
                    dataObj['callback'] = data.callback
                    dataObj['signature'] = data.signature
                    dataObj['Content-Disposition'] = 'attachment;filename=' + file.name
                    _self.dataObj = dataObj
                    resolve(true)
                } catch (err) {
                    console.log(err)
                    reject(false)
                }
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.upload-warp {
    .avatar-uploader-icon {
        font-size: 18px;
        position: relative;
        color: #8c939d;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-sizing: border-box;
        border: 1px dashed #cccccc;
        background: #f4f4f4;
        border-radius: 6px;
    }
    .avatar {
        border: 1px solid #cccccc;
        border-radius: 6px;
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
    }
    &:hover .avatar-uploader-icon {
        border-color: #409eff;
    }
    &.tips:hover .avatar-uploader-icon {
        font-size: 0;
    }

    &.tips:hover .avatar-uploader-icon::after {
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        content: '选择头像';
        background-color: rgba($color: #000000, $alpha: 0.5);
        color: #2a2a2a;
        font-size: 18px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
}
</style>
