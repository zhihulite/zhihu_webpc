<template>
  <component :is="listTag" class="list-node">
    <li
      v-for="(item, idx) in content.items"
      :key="idx"
      :style="{ paddingLeft: `${(item.indent_level || 0) * 20}px` }"
    >
      <RichText :text="item.text" :marks="item.marks" :is-list-item="true" />
    </li>
  </component>
</template>

<script setup>
import RichText from './RichText.vue';

const props = defineProps({
  segment: {
    type: Object,
    required: true
  }
});

const content = props.segment.list_node;
const listTag = content.ordered ? 'ol' : 'ul';
</script>

<style scoped>
.list-node {
  margin: 16px 0;
  padding-left: 20px;
}

.list-node li {
  margin: 4px 0;
  line-height: 1.6;
}
</style>