<template>
    <div>
        {{ userId }}
    </div>
</template>

<script setup lang="ts">
const route = useRoute();
const userId = computed(() => route.params.id as string);
</script>

<style scoped>

</style>