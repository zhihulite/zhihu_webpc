<template>
  <div
    class="infinite-list-container"
    ref="containerRef"
    :style="{ maxHeight: props.maxHeight ? props.maxHeight : 'none' }"
  >
    <!-- Header 插槽 -->
    <slot name="header"></slot>

    <div v-if="loadingInitial" class="loading-indicator">加载中...</div>
    <div v-else-if="error" class="error-message">{{ error }}</div>
    <div v-else-if="items.length === 0 && !loadingMore" class="empty-state">暂无内容</div>

    <div v-else class="data-list" ref="listRef">
      <div
        v-for="item in items"
        :key="getItemKey(item)"
        class="data-item-wrapper"
      >
        <mdui-card
          v-bind="itemProps"
		  :href="item.href"
          @click="() => itemClickHandler?.(item)"
        >
          <div v-html="renderItem(item)"></div>
        </mdui-card>
      </div>
    </div>

    <div v-if="loadingMore" class="loading-more">加载更多...</div>
    <div v-else-if="!hasMore && items.length > 0" class="no-more">没有更多了</div>

    <!-- Footer 插槽 -->
    <slot name="footer"></slot>

    <!-- 哨兵元素 -->
    <div ref="sentinel" class="sentinel"></div>

    <!-- 分页控制（可选） -->
    <div v-if="showPagination" class="pagination-controls">
      <mdui-button
        :disabled="currentPage <= 1 || loadingInitial || loadingMore"
        @click="loadPage(currentPage - 1, false)"
        variant="text"
      >
        上一页
      </mdui-button>
      <span class="page-info">第 {{ currentPage }} 页</span>
      <mdui-button
        :disabled="!hasMore || loadingInitial || loadingMore"
        @click="loadPage(currentPage + 1, true)"
        variant="text"
      >
        下一页
      </mdui-button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, defineProps, defineEmits, defineExpose } from 'vue';

const props = defineProps({
  fetchData: { type: Function, required: true },
  renderItem: { type: Function, required: true },
  itemProps: { type: Object, default: () => ({}) },
  pageSize: { type: Number, default: 20 },
  showPagination: { type: Boolean, default: false },
  initialPage: { type: Number, default: 1 },
  itemClickHandler: { type: Function, default: null },
  scrollContainerSelector: { type: String, default: null },
  autoLoad: { type: Boolean, default: true },
  scrollToTopOnLoad: { type: Boolean, default: false },
  maxHeight: { type: [String, Number], default: null }
});

const emit = defineEmits(['loaded', 'error']);

const items = ref([]);
const loadingInitial = ref(false);
const loadingMore = ref(false);
const error = ref(null);
const currentPage = ref(props.initialPage);
const hasMore = ref(true);
const observer = ref(null);

const containerRef = ref(null);
const sentinel = ref(null);

function getItemKey(item, index) {
  if (item.id !== undefined && item.id !== null) {
    return item.id;
  }
  console.warn('InfiniteList: Item missing "id", using index as key (not recommended)');
  return `item-${index}`;
}

async function loadPage(page, append = false) {
  if (loadingInitial.value || loadingMore.value) return;

  const isLoadMore = append && page > props.initialPage;

  if (isLoadMore) {
    loadingMore.value = true;
  } else {
    loadingInitial.value = true;
  }

  try {
    const response = await props.fetchData({ page, size: props.pageSize });

    const data = Array.isArray(response.data) ? response.data : [];
    const more = response.hasMore !== undefined ? response.hasMore : true;

    if (append) {
      items.value = [...items.value, ...data];
    } else {
      items.value = data;
    }

    currentPage.value = page;
    hasMore.value = more;
    error.value = null;

    emit('loaded', { page, data, hasMore: more });
  } catch (err) {
    error.value = '加载数据失败: ' + (err.message || '未知错误');
    console.error('InfiniteList: 加载失败', err);
    emit('error', err);
  } finally {
    loadingInitial.value = false;
    loadingMore.value = false;
  }
}

function setupIntersectionObserver() {
  if (typeof IntersectionObserver === 'undefined') return;

  const root = props.scrollContainerSelector
    ? document.querySelector(props.scrollContainerSelector)
    : containerRef.value;

  if (!root || !sentinel.value) return;

  observer.value = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting && props.autoLoad && hasMore.value) {
        loadPage(currentPage.value + 1, true);
      }
    },
    {
      root,
      rootMargin: '100px',
      threshold: 0
    }
  );

  observer.value.observe(sentinel.value);
}

function cleanup() {
  if (observer.value) {
    observer.value.disconnect();
    observer.value = null;
  }
}

function reset() {
  currentPage.value = props.initialPage;
  hasMore.value = true;
  items.value = [];
  error.value = null;
  loadPage(props.initialPage, false);
}

defineExpose({
  loadPage,
  reset,
  reload: () => loadPage(props.initialPage, false),
  getItems: () => items.value,
  getCurrentPage: () => currentPage.value
});

onMounted(() => {
  loadPage(props.initialPage, false);
  setupIntersectionObserver();
});

onUnmounted(() => {
  cleanup();
});
</script>

<style scoped>
.infinite-list-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 16px;
  box-sizing: border-box;
  overflow-y: auto;
}

/* 双列网格布局 */
.data-list {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
}

/* 平板及以上：双列 */
@media (min-width: 768px) {
  .data-list {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* 可选：大屏三列 */
/*
@media (min-width: 1200px) {
  .data-list {
    grid-template-columns: repeat(3, 1fr);
  }
}
*/

.data-item-wrapper {
}

.data-item-wrapper :deep(mdui-card) {
  width: 100%;
  max-width: 560px;
  margin: 0 auto;
}

.loading-indicator,
.loading-more {
  text-align: center;
  padding: 16px;
  margin: 16px 0;
  color: #666;
}

.loading-more {
  color: #999;
}

.error-message {
  color: #d32f2f;
  text-align: center;
  padding: 16px;
  background-color: #ffebee;
  border-radius: 4px;
  margin: 16px 0;
}

.empty-state {
  text-align: center;
  padding: 32px 16px;
  color: #999;
}

.no-more {
  text-align: center;
  padding: 16px;
  color: #999;
  margin: 16px 0;
}

.sentinel {
  height: 1px;
  margin: 10px 0;
}

.pagination-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  padding: 16px 0;
}

.page-info {
  color: #666;
}
</style>