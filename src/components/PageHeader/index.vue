<template>
    <div class="page_header">
        <div class="left">
            <slot name="left"></slot>
        </div>
        <div class="right">
            <slot name="right"></slot>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.page_header {
    @include flex(space-between);
    background-color: #fff;
    padding: 24px;
    border-radius: 6px;
    .left,
    .right {
        @include flex();
    }
}
</style>
