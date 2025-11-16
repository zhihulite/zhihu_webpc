<template>
	<div class="follow-page">
		<InfiniteList class="follow-list" :fetch-data="fetchData" :render-item="finalRenderFunction" ref="infiniteListRef">
			<template #header>
				<mdui-segmented-button-group ref="segmentedButtonGroupRef" @change="handleSegmentedButtonGroupChange"
					selects="single" style="margin-bottom: 16px" full-width>
					<mdui-segmented-button value="featured">精选</mdui-segmented-button>
					<mdui-segmented-button value="latest">最新</mdui-segmented-button>
					<mdui-segmented-button value="ideas">想法</mdui-segmented-button>
				</mdui-segmented-button-group>
			</template>
		</InfiniteList>
	</div>
</template>

<style scoped>
	.follow-page {
		height: 100%;
		display: flex;
		flex-direction: column;
		padding: 16px;
		box-sizing: border-box;
	}

	.follow-list {
		flex: 1;
		min-height: 0;
	}
</style>

<script setup>
	import {
		ref,
		onMounted
	} from 'vue';
	import InfiniteList from '@/components/InfiniteList.vue';
	import {
		HomeCardRender
	} from '@/render/HomeCardRender.js';

	const selectedTab = ref('featured');

	const homeCardRender = new HomeCardRender({
		truncateTitleLength: 50,
		truncateContentLength: 150
	});
	const finalRenderFunction = homeCardRender.createRenderFunction();

	const infiniteListRef = ref(null);
	const segmentedButtonGroupRef = ref(null);

	async function fetchData({
		page,
		size
	}) {
		// 注意：InfiniteList 传入的参数可能不含 type，
		// 所以我们要从 selectedTab 中获取当前类型
		const type = selectedTab.value;

		await new Promise(resolve => setTimeout(resolve, 500));

		const mockData = {
			data: Array.from({
				length: size
			}, (_, i) => ({
				target: {
					id: (page - 1) * size + i + 1,
					type: 'answer',
					content: {
						title: `标题 ${page}-${i + 1}`
					},
					question: {
						title: `问题标题 ${page}-${i + 1}`
					},
					excerpt_title: `标题片段 ${page}-${i + 1}`,
					excerpt: `这是推荐内容的摘要... ${page}-${i + 1}`,
					author: {
						name: `作者 ${page}-${i + 1}`,
						url: `https://example.com/user/${page}-${i + 1}`,
					},
					voteup_count: Math.floor(Math.random() * 1000),
					comment_count: Math.floor(Math.random() * 100),
				}
			})),
			hasMore: page < 5
		};

		return mockData;
	}

	function handleSegmentedButtonGroupChange(event) {
		const newValue = event.target.value;
		if (newValue === "") {
			segmentedButtonGroupRef.value.updateComplete.then(() => {
				segmentedButtonGroupRef.value.value = selectedTab.value;	
			});
		} else {
			selectedTab.value = newValue;
		}
		// 通知 InfiniteList 重置并重新加载
		infiniteListRef.value?.reset?.();
	}

	function onDataLoaded(payload) {
		console.log('数据加载完成:', payload);
	}

	function onDataError(error) {
		console.error('加载数据出错:', error);
	}

	onMounted(() => {
		if (segmentedButtonGroupRef.value) {
			segmentedButtonGroupRef.value.value = 'featured';
		}
	});
</script>

<style scoped>
</style>