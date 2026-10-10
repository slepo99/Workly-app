<template>
    <div>

    </div>
</template>

<script setup lang="ts">
const route = useRoute();
const taskId = computed(() => route.params.id as string);
</script>

<style scoped>

</style>