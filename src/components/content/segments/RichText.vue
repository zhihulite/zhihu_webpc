<template>
  <span v-html="processedText"></span>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  text: String,
  marks: Array,
  isListItem: Boolean
});

const processedText = computed(() => {
  let result = props.text || '';
  if (!props.marks?.length) return result;

  const sorted = [...props.marks].sort((a, b) => b.start_index - a.start_index);
  sorted.forEach(m => {
    if (m.start_index == null || m.end_index == null) return;
    const start = m.start_index;
    const end = m.end_index;
    const orig = result.substring(start, end);
    let repl = orig;
    if (m.link?.href) {
      repl = `<a href="${m.link.href}" target="_blank">${orig}</a>`;
    } else if (props.isListItem) {
      repl = `<span class="highlight">${orig}</span>`;
    }
    result = result.substring(0, start) + repl + result.substring(end);
  });
  return result;
});
</script>

<style scoped>
.highlight {
  background-color: yellow;
}
</style>