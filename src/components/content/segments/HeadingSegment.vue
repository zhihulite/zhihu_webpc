<template>
  <h3 
    :id="`heading-${index}`"
    :style="{ scrollMarginTop: `${navbarHeight}px` }"
  >
    {{ content.text }}
  </h3>
</template>

<script setup>
const props = defineProps({
  segment: Object,
  index: Number,
  navbarHeight: Number
});
const content = props.segment.heading;
</script>