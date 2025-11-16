<template>
  <mdui-card :href="authorHref" variant="outlined" class="author-card" style="width: 100%">
    <div class="card-content">
      <img :src="avatarSrc" :alt="`${authorName} 头像`" class="author-avatar"/>
      <div class="author-info">
        <div class="author-name">{{ authorName }}</div>
        <div class="author-description">{{ authorDescription }}</div>
      </div>
    </div>
  </mdui-card>
</template>

<script>
export default {
  name: 'ZhihuAuthorCard',
  props: {
    author: {
      type: Object,
      required: true,
      validator: (author) => Boolean(author.id && (author.fullname || author.name))
    }
  },
  computed: {
    authorHref() {
      return `/people/${encodeURIComponent(this.author.id)}/`;
    },
    avatarSrc() {
      return this.author.avatar?.avatar_image?.day || '';
    },
    authorName() {
      return this.author.fullname || this.author.name || '未知作者';
    },
    authorDescription() {
      return this.author.description || this.author.headline || '';
    }
  }
};
</script>

<style scoped>
.author-card {
  margin: 8px 0;
  border-radius: 8px;
  text-decoration: none;
  color: inherit;
}

.card-content {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
}

.author-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
}

.author-info {
  display: flex;
  flex-direction: column;
}

.author-name {
  font-weight: bold;
  font-size: 16px;
}

.author-description {
  color: #888;
  font-size: 14px;
  margin-top: 4px;
}
</style>