<template>
    <div style="width:800px;height:450px;">
        <div v-show="fileType == 1" id="container" style="width:800px; height:450px;margin:0 auto;overflow: hidden;background:#000;"></div>
        <iframe v-show="fileType == 2" :src="viewUrl" width="100%" height="100%" style="border:none" allowfullscreen="true" webkitallowfullscreen="true" mozallowfullscreen="true"></iframe>
        <el-image v-show="fileType == 3" :src="imageUrl" fit="contain" style="width:800px; height:450px;"></el-image>
    </div>
</template>
<script>
export default {
    name: "filePreView",
    props: {
        file: {}
    },
    data() {
        return {
            viewUrl: '',
            imageUrl: '',
            fileType: 0
        };
    },
    mounted() {
        this.fileType = this.switchFileType(this.file.suffix);
        if (this.fileType == 1) {
            this.initPlay();
        } else if (this.fileType == 2) {
            this.viewUrl = 'https://hikcsz.zhihuishu.com/aliyuncs/previewdoc/index.html?fileId=' + this.file.id;
        } else if (this.fileType == 3) {
            this.imageUrl = this.file.url;
        }
    },
    methods: {
        initPlay() {
            new Aliplayer({
                id: 'container',
                source: this.file.url,
                width: "100%",
                height: "100%",
                autoplay: false,
                isLive: false,
                rePlay: false,
                playsinline: true,
                "p~reload": true,
                enableStashBufferForFlv: true,
                stashInitialSizeForFlv: 32,
                controlBarVisibility: "hover",
                useH5Prism: true,
            }, function (player) {
                console.log("The player is created", player);
            });
        },
        switchFileType(suffix) {
            if (suffix != null) {
                suffix = suffix.toLowerCase();
            }
            if (suffix == "doc" || suffix == "docx") {
                return 2;
            } else if (suffix == "xls" || suffix == "xlsx") {
                return 2;
            } else if (suffix == "ppt" || suffix == "pptx") {
                return 2;
            } else if (suffix == "pdf") {
                return 2;
            } else if (
                suffix == "gif" ||
                suffix == "jpg" ||
                suffix == "jpeg" ||
                suffix == "png" ||
                suffix == "bmp"
            ) {
                return 3;
            } else if (suffix == "mp4") {
                return 1;
            }
            return 0;
        },
    }
};
</script>