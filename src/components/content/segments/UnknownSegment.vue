<template>
  <p style="color:orange">[未处理类型: {{ segment.type }}]</p>
</template>
<script setup>
defineProps({ segment: Object });
</script>