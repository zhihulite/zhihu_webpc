<template>
  <a 
    :href="url" 
    class="card-link external" 
    target="_blank" 
    rel="noopener noreferrer"
    style="text-decoration: none; display: block"
  >
    <mdui-card variant="outlined" style="margin: 8px 0">
      <div style="display: flex; gap: 12px; align-items: center; padding: 12px">
        <div style="flex: 1; min-width: 0">
          <div style="font-weight: bold; word-break: break-word">
            {{ title }}
          </div>
          <div 
            v-if="desc" 
            style="color: #888; font-size: 14px; word-break: break-word"
          >
            {{ desc }}
          </div>
        </div>
        <div 
          v-if="cover" 
          style="width: 60px; height: 60px; flex-shrink: 0"
        >
          <img 
            :src="cover" 
            alt="" 
            style="width: 100%; height: 100%; object-fit: cover; border-radius: 4px"
            loading="lazy"
          />
        </div>
      </div>
    </mdui-card>
  </a>
</template>

<script setup>
const props = defineProps({
  segment: {
    type: Object,
    required: true
  }
});

const content = props.segment.card;

// 安全解析 extra_info
let extra = {};
try {
  extra = JSON.parse(content.extra_info || '{}');
} catch (e) {
  console.warn('CardSegment: Failed to parse extra_info', e);
}

const title = content.title || extra.description || '无标题';
const desc = extra.desc || '';
const url = extra.url || content.url || '#';
const cover = content.cover || extra.image_url || '';
</script>

<style scoped>
/* 可选：添加 hover 效果 */
.card-link:hover mdui-card {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
</style>