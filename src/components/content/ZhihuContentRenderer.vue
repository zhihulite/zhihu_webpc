<template>
  <div class="zhihu-content-renderer">
    <component
      v-for="(segment, index) in props.segments"
      :key="index"
      :is="getComponentForType(segment.type)"
      :segment="segment"
      :index="index"
      :navbar-height="props.navbarHeight"
    />
  </div>
</template>

<script setup>
import { defineAsyncComponent } from 'vue';

const props = defineProps({
  segments: { type: Array, required: true },
  navbarHeight: { type: Number, default: 56 }
});

const getComponentForType = (type) => {
  switch (type) {
    case 'paragraph': return ParagraphSegment;
    case 'heading': return HeadingSegment;
    case 'code_block': return CodeBlockSegment;
    case 'blockquote': return BlockquoteSegment;
    case 'list_node': return ListNodeSegment;
    case 'hr': return HrSegment;
    case 'image': return ImageSegment;
    case 'card': return CardSegment;
    case 'video': return VideoSegment;
    case 'myapptip': return MyAppTipSegment;
    default: return UnknownSegment;
  }
};

import ParagraphSegment from './segments/ParagraphSegment.vue';
import HeadingSegment from './segments/HeadingSegment.vue';
import CodeBlockSegment from './segments/CodeBlockSegment.vue';
import BlockquoteSegment from './segments/BlockquoteSegment.vue';
import ListNodeSegment from './segments/ListNodeSegment.vue';
import HrSegment from './segments/HrSegment.vue';
import ImageSegment from './segments/ImageSegment.vue';
import CardSegment from './segments/CardSegment.vue';
import VideoSegment from './segments/VideoSegment.vue';
import MyAppTipSegment from './segments/MyAppTipSegment.vue';
import UnknownSegment from './segments/UnknownSegment.vue';
</script>

<style scoped>
.zhihu-content-renderer {
  padding: 0 16px;
}
</style>