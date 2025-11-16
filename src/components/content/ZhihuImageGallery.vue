<template>
  <div class="image-gallery">
    <a v-for="(image, index) in images" :key="index" :href="image.url" target="_blank">
      <img :src="image.thumbnail || image.url" :alt="image.alt || 'Gallery Image'" class="gallery-image"/>
    </a>
  </div>
</template>

<script>
export default {
  name: 'ZhihuImageGallery',
  props: {
    images: {
      type: Array,
      required: true,
      validator: (images) => images.every(img => img.url)
    }
  }
};
</script>

<style scoped>
.image-gallery {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 16px;
}

.gallery-image {
  width: 100%;
  border-radius: 8px;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.gallery-image:hover {
  transform: scale(1.05);
}
</style>