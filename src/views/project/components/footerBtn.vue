<template>
    <div class="footer-btn">
        <el-button @click="$router.go(-1)">取消</el-button>
        <el-button type="primary" @click="$emit('save')">保存</el-button>
    </div>
</template>

<script>
export default {
    props: ['url'],
    components: {},
    data() {
        return {}
    },
    created() {},
    mounted() {},
    methods: {
        preview() {
            window.open(this.url)
        }
    }
}
</script>

<style lang="scss" scoped>
.footer-btn {
    box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
    position: fixed;
    bottom: 0;
    right: 0;
    width: 100%;
    padding: 10px 20px;
    background-color: #fff;
    @include flex(flex-end);
    z-index: 99;
}
</style>
