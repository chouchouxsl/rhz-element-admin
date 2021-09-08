<script setup lang="ts">
import { ref, getCurrentInstance } from 'vue'
import PageHeader from '@/components/pageHeader/index.vue'

const { proxy }: any = getCurrentInstance()

console.log('proxy, ctx :>> ', proxy.$dayjs())

const title = ref<string>('初始化项目')
const onClick = (e: Event, title: string) => {
    console.log('e :>> ', e, title)
}
</script>

<template>
    <PageHeader>
        <template #left>
            <h1 @click="onClick($event, title)">{{ title }}</h1>
        </template>
    </PageHeader>
</template>

<style scoped lang="scss"></style>
