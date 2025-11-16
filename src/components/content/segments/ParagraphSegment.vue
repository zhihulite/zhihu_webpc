<template>
  <p><RichText :text="content.text" :marks="content.marks" /></p>
</template>

<script setup>
import RichText from './RichText.vue';
const props = defineProps({ segment: Object });
const content = props.segment.paragraph;
</script>