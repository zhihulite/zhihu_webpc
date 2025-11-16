<template>
  <blockquote>
    <p><RichText :text="content.text" :marks="content.marks" /></p>
  </blockquote>
</template>

<script setup>
import RichText from './RichText.vue';

const props = defineProps({
  segment: {
    type: Object,
    required: true
  }
});

const content = props.segment.blockquote;
</script>

<style scoped>
blockquote {
  margin: 16px 0;
  padding-left: 16px;
  border-left: 3px solid #ddd;
  color: #666;
  font-style: italic;
}

blockquote p {
  margin: 0;
}
</style>