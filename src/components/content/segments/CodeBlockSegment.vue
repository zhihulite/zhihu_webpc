<template>
  <pre><code>{{ content.content || '' }}</code></pre>
</template>

<script setup>
const props = defineProps({
  segment: {
    type: Object,
    required: true
  }
});

const content = props.segment.code_block;
</script>

<style scoped>
pre {
  background-color: #f6f8fa;
  border-radius: 6px;
  padding: 16px;
  overflow-x: auto;
  font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
  font-size: 14px;
  line-height: 1.45;
  margin: 16px 0;
}

code {
  display: inline-block;
  min-width: 100%;
  white-space: pre;
}
</style>