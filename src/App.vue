<template>
    <RouterView />
</template>

<script setup>
import { watch, onMounted } from 'vue'
import { useStore } from 'vuex'

const {
    state: { settings },
    commit
} = useStore()

const setDocumentTitle = () => {
    if (settings.enableDynamicTitle && settings.title) {
        let title = settings.title
        document.title = `${title} - ${import.meta.env.VITE_APP_TITLE}`
    } else {
        document.title = import.meta.env.VITE_APP_TITLE
    }
}

const setMenuMode = () => {
    const body = document.body

    body.removeAttribute('data-sidebar-no-collapse')
    body.removeAttribute('data-sidebar-collapse')

    if (settings.sidebarCollapse) {
        body.setAttribute('data-sidebar-collapse', '')
    } else {
        body.setAttribute('data-sidebar-no-collapse', '')
    }

    body.setAttribute('data-menu-mode', settings.menuMode)
}

watch(
    () => settings.mode,
    () => {
        if (settings.mode === 'pc') {
            commit('settings/updateThemeSetting', {
                sidebarCollapse: settings.sidebarCollapseLastStatus
            })
        } else if (settings.mode === 'mobile') {
            commit('settings/updateThemeSetting', {
                sidebarCollapse: true
            })
        }
        document.body.setAttribute('data-mode', settings.mode)
    },
    {
        immediate: true
    }
)

watch([() => settings.menuMode, () => settings.sidebarCollapse], () => setMenuMode(), {
    immediate: true
})

watch([() => settings.enableDynamicTitle, () => settings.title], () => setDocumentTitle(), {
    immediate: true
})

onMounted(() => {
    window.onresize = () => {
        commit('settings/setMode', document.documentElement.clientWidth)
    }
    window.onresize()
})
</script>
