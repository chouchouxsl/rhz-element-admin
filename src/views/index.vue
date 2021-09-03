<script setup lang="ts">
import { ref } from 'vue'
import PageHeader from '@/components/PageHeader/index.vue'

const title = ref<string>('初始化项目')
const onClick = (e: Event, title: string) => {
    console.log('e :>> ', e, title)
}
</script>

<template>
    <PageHeader :title="title">
        <h1 @click="onClick($event, title)">{{ title }}</h1>
    </PageHeader>
</template>

<style scoped lang="scss">
.containar {
}
</style>
