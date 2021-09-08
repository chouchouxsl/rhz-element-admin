<template>
    <div :class="{fullscreen:fullscreen}" class="tinymce-container" :style="{width:containerWidth}">
        <textarea :id="tinymceId" class="tinymce-textarea" />
    </div>
</template>
<script>
import { getPolicy } from "@/api/common";
import axios from 'axios';
const tinymceCDN = window.location.origin + (window.location.hostname == 'localhost'?'':'/admin') + "/tinymce/tinymce.min.js";
import plugins from "./plugins";
import toolbar from "./toolbar";
import load from "./dynamicLoadScript";
export default {
    name: "Tinymce",
    props: {
        id: {
            type: String,
            default: function() {
                return 'vue-tinymce-' + +new Date() + ((Math.random() * 1000).toFixed(0) + '')
            }
        },
        value: {
            type: String,
            default: ""
        },
        toolbar: {
            type: Array,
            required: false,
            default() {
                return [];
            }
        },
        menubar: {
            type: String,
            default: "file edit insert view format table"
        },
        height: {
            type: [Number, String],
            required: false,
            default: 360
        },
        width: {
            type: [Number, String],
            required: false,
            default: "auto"
        }
    },
    data() {
        return {
            hasChange: false,
            hasInit: false,
            tinymceId: this.id,
            fullscreen: false
        };
    },
    computed: {
        containerWidth() {
            const width = this.width;
            if (/^[\d]+(\.[\d]+)?$/.test(width)) {
                return `${width}px`;
            }
            return width;
        }
    },
    watch: {
        value(val) {
            if (!this.hasChange && this.hasInit) {
                this.$nextTick(() =>
                    window.tinymce.get(this.tinymceId).setContent(val || "")
                );
            }
        }
    },
    mounted() {
        this.init();
    },
    activated() {
        if (window.tinymce) {
            this.initTinymce();
        }
    },
    deactivated() {
        this.destroyTinymce();
    },
    destroyed() {
        this.destroyTinymce();
    },
    methods: {
        init() {
            this.initTinymce();
        },
        initTinymce() {
            const _this = this;
            window.tinymce.init({
                language: "zh_CN",
                selector: `#${this.tinymceId}`,
                height: this.height,
                body_class: "panel-body ",
                object_resizing: true,
                toolbar: this.toolbar.length > 0 ? this.toolbar : toolbar,
                menubar: false,
                plugins: plugins,
                end_container_on_empty_block: true,
                powerpaste_word_import: "clean",
                paste_data_images: true,
                code_dialog_height: 450,
                code_dialog_width: 1000,
                advlist_bullet_styles: "square",
                advlist_number_styles: "default",
                default_link_target: "_blank",
                link_title: false,
                nonbreaking_force_tab: true,
                lineheight_formats :"1 1.5",
                init_instance_callback: editor => {
                    if (_this.value) {
                        editor.setContent(_this.value);
                    }
                    _this.hasInit = true;
                    editor.on("NodeChange Change KeyUp SetContent", () => {
                        this.hasChange = true;
                        this.$emit("input", editor.getContent());
                    });
                },
                setup(editor) {
                    editor.on("FullscreenStateChanged", e => {
                        _this.fullscreen = e.state;
                    });
                },
                images_upload_handler: function(blobInfo, success, failure) {
                    var filename = blobInfo.filename();
                    getPolicy({fileName: filename}).then((res) => {
                        var data = JSON.parse(res.data);
                        var formData = new FormData();
                        formData.append('key', data.dir + data.fileUUID + '.'+ filename.split('.')[1]);
                        formData.append('policy', data.policy);
                        formData.append('OSSAccessKeyId', data.accessid);
                        formData.append('success_action_status',200);
                        formData.append('callback', data.callback);
                        formData.append('signature', data.signature);
                        formData.append('Content-Disposition', 'attachment;filename=' + filename);
                        formData.append('file', blobInfo.blob());
                        axios({ method: 'POST', url: data.host, data: formData}).then((result) => {
                            success(result.data.data.fileUrl)
                        }).catch(() => {
                            failure('上传失败')
                        })
                    })
                }
            });
        },
        destroyTinymce() {
            const tinymce = window.tinymce.get(this.tinymceId);
            if (this.fullscreen) {
                tinymce.execCommand("mceFullScreen");
            }
            if (tinymce) {
                tinymce.destroy();
            }
        },
        setContent(value) {
            window.tinymce.get(this.tinymceId).setContent(value);
        },
        getContent() {
            window.tinymce.get(this.tinymceId).getContent();
        },
        imageSuccessCBK(arr) {
            arr.forEach(v =>
                window.tinymce.get(this.tinymceId).insertContent(`<img class="wscnph" src="${v.url}" >`)
            );
        }
    }
};
</script>
