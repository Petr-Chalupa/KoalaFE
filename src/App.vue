<script setup lang="ts">
import { ref, onMounted } from "vue";
import Table from "./components/Table.vue";

const data = ref(null);

onMounted(async () => {
  const response = await fetch("/data.json");
  data.value = await response.json();
});
</script>

<template>
  <Table v-if="data != null" :data="data" />
</template>

<style lang="scss" src="@/styles/main.scss"></style>
