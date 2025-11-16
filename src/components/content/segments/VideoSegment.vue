<template>
  <figure>
    <video 
      v-if="videoUrl" 
      :src="videoUrl" 
      controls 
      style="width: 100%; background: #eee"
    ></video>
    <div v-else style="padding: 20px; background: #f5f5f5;">视频加载中...</div>
    <figcaption>{{ content.title || '视频' }}</figcaption>
  </figure>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const props = defineProps({ segment: Object });
const content = props.segment.video;

const videoUrl = ref('');

onMounted(async () => {
  if (!content?.id) return;
  try {
    const res = await window.$zhihu.get(`https://lens.zhihu.com/api/v4/videos/${content.id}`);
    const json = await res.json();
    videoUrl.value = json.playlist?.SD?.play_url || json.playlist?.HD?.play_url || '';
  } catch (err) {
    console.error('视频加载失败', err);
  }
});
</script>