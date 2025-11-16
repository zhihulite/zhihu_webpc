<template>
  <div class="zhihu-content-page" style="position: relative;">
    <mdui-top-app-bar scroll-target=".page-content">
      <mdui-button-icon @click="goBack">
        <mdui-icon name="arrow_back"></mdui-icon>
      </mdui-button-icon>
      <mdui-top-app-bar-title>{{ title || '加载中' }}</mdui-top-app-bar-title>
      <div style="flex-grow: 1"></div>
      <mdui-button-icon @click="openOriginal" target="_blank">
        <mdui-icon name="open_in_new"></mdui-icon>
      </mdui-button-icon>
    </mdui-top-app-bar>

    <main class="page-content">
      <div class="reading-container">
        <div id="dynamic-content">
          <div v-if="loading" class="text-align-center">加载中...</div>
          <template v-else-if="!error">
            <ZhihuAuthorCard v-if="author" :author="author" :type="type" />
            <ZhihuImageGallery v-if="imageList.length" :images="imageList" />
            <ZhihuTOC v-if="tocItems.length" :items="tocItems" />
            <ZhihuContentRenderer :segments="segments" :navbar-height="56" />
            <CommentsManager v-if="commentsManager" :type="type" :id="id" />
          </template>
          <div v-else class="text-align-center">内容加载失败。</div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import ZhihuAuthorCard from '@/components/content/ZhihuAuthorCard.vue';
import ZhihuTOC from '@/components/content/ZhihuTOC.vue';
import ZhihuImageGallery from '@/components/content/ZhihuImageGallery.vue';
import ZhihuContentRenderer from '@/components/content/ZhihuContentRenderer.vue';
import CommentsManager from '@/components/content/CommentsManager.vue';

const router = useRouter();
const title = ref('');
const author = ref(null);
const segments = ref([]);
const imageList = ref([]);
const tocItems = ref([]);
const loading = ref(true);
const error = ref(false);

const route = useRoute();
const type = route.params.type;
const id = route.params.id;

const goBack = () => history.back();
const openOriginal = () => {
  window.open(`https://www.zhihu.com/${type}/${id}`, '_blank');
};

const extractTOC = (segs) => {
  const items = [];
  segs.forEach((seg, idx) => {
    if (seg.type === 'heading' && seg.heading?.text) {
      items.push({ id: `heading-${idx}`, text: seg.heading.text });
    }
  });
  return items;
};

onMounted(async () => {
  try {
    const apiType = type === 'p' ? 'article' : type;
    const res = await window.$zhihu.get(`https://api.zhihu.com/${apiType}s/v2/${id}`);

    title.value = res.header?.text || '知乎内容';
    author.value = res.author || null;

    let segs = res.structured_content?.segments ? [...res.structured_content.segments] : [];
    if (res.relationship_tips) segs.unshift({ type: 'myapptip', myapptip: { text: res.relationship_tips.text } });
    if (res.video) segs.unshift({ type: 'video', video: { id: res.video.attachment_id, title: res.video.title } });

    let bottomText = '未知';
    const info = res.content_end_info;
    if (info) {
      bottomText = info.update_time_text || info.create_time_text || '未知';
      if (info.ip_info) bottomText += ` · ${info.ip_info}`;
    }
    segs.push({ type: 'myapptip', myapptip: { text: bottomText } });

    segments.value = segs;
    imageList.value = res.image_list?.images || [];

    if (type === 'p') {
      tocItems.value = extractTOC(segs);
    }

    await nextTick();
    loading.value = false;
  } catch (err) {
    console.error('加载失败:', err);
    error.value = true;
    loading.value = false;
  }
});
</script>

<style scoped>
.zhihu-content-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.page-content {
  flex: 1;
  overflow-y: auto;
}

.reading-container {
  width: 100%;
  max-width: 768px;
  margin: 0 auto;
  padding: 0 16px;
}

@media (max-width: 600px) {
  .reading-container {
    padding: 0 12px;
  }
}

.text-align-center {
  text-align: center;
  padding: 24px;
}
</style>