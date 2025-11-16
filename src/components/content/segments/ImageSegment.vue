<template>
  <figure>
    <img 
      :src="content.urls?.[0]" 
      style="width:100%; cursor: pointer"
      @click="handleClick(content.urls?.[0])"
    />
    <figcaption>{{ content.description }}</figcaption>
  </figure>
</template>

<script setup>
const props = defineProps({ segment: Object });
const content = props.segment.image;

const handleClick = (url) => {
   // TODO: 集成图片查看器
  if(url) {
    window.open(url, '_blank');
  }
};
</script>