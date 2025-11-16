<template>
	<div class="home-page">
		<InfiniteList class="home-list" :fetch-data="fetchData" :render-item="finalRenderFunction"
			@loaded="onDataLoaded" @error="onDataError" ref="infiniteListRef" />
	</div>
</template>

<style scoped>
	.home-page {
		height: 100%;
		display: flex;
		flex-direction: column;
		padding: 16px;
		box-sizing: border-box;
	}

	.home-list {
		flex: 1;
		min-height: 0;
	}
</style>

<script setup>
	import InfiniteList from '@/components/InfiniteList.vue';
	import {
		ref,
		computed,
		onMounted
	} from 'vue';
	import {
		HomeCardRender
	} from '@/render/HomeCardRender.js';

	const infiniteListRef = ref(null);
	const items = ref([]);
	const loading = ref(false);
	const error = ref('');

	const homeCardRender = new HomeCardRender({
		truncateTitleLength: 50,
		truncateContentLength: 150
	});
	const homeRenderFunction = homeCardRender.createRenderFunction();
	const finalRenderFunction = homeRenderFunction;
	async function fetchData({
		page,
		size
	}) {
		const offset = (page - 1) * size;
		const limit = size;

		const res = await $http.get('https://api.zhihu.com/topstory/recommend', {
			isWWW: true
		});
		const dataWithHref = (res.data || []).map(item => {
			const type = homeCardRender.getDataType(item);
			const id = homeCardRender.getId(item)
            const href = `./content/${type}/${id}`
			return {
				...item,
				href
			};
		});
		return {
			data: dataWithHref,
			total: null,
			hasMore: !res.paging?.is_end
		};
	}

	function onDataLoaded(payload) {
		console.log('数据加载完成:', payload);
	}

	function onDataError(error) {
		console.error('加载数据出错:', error);
		error.value = error.message;
	}
</script>