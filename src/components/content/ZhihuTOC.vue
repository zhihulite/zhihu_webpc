<template>
  <div class="block" style="margin:16px">
    <div class="block-title">目录</div>
    <ul id="toc-list" style="list-style:none;padding:0">
      <li v-for="(item, i) in visibleItems" :key="item.id">
        <a href="#" @click.prevent="scrollTo(item.id)" style="color:var(--mdui-color-primary)">{{ item.text }}</a>
      </li>
    </ul>
    <div v-if="showToggle" id="toc-toggle" @click="toggle" style="color:var(--mdui-color-primary);padding:8px 0;text-align:center;cursor:pointer">
      {{ expanded ? '收起' : `展开 (${hiddenCount} 项)` }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  items: { type: Array, required: true }
});

const MAX_VISIBLE = 3;
const expanded = ref(false);

const visibleItems = computed(() => {
  return expanded.value ? props.items : props.items.slice(0, MAX_VISIBLE);
});

const showToggle = computed(() => props.items.length > MAX_VISIBLE);
const hiddenCount = computed(() => props.items.length - MAX_VISIBLE);

const toggle = () => {
  expanded.value = !expanded.value;
};

const scrollTo = (id) => {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
};
</script>