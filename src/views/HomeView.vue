<template>
	<div class="home-container" style="position: relative;">
		<mdui-tabs 
			class="home-tab-layout" 
			@change="handleNavChange" 
			placement="top" 
			ref="tabsRef"
		>
			<mdui-tab icon="home--two-tone" value="home">
				主页
			</mdui-tab>
			<mdui-tab icon="trending_up--two-tone" value="hot">
				热榜
			</mdui-tab>
			<mdui-tab icon="favorite--two-tone" value="following">
				关注
			</mdui-tab>
		</mdui-tabs>

		<div class="home-content">
			<router-view />
		</div>
	</div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const router = useRouter();
const route = useRoute();
const tabsRef = ref(null);

const TAB_CONFIG = {
	home: 'home-sub',
	hot: 'hot-sub',
	following: 'following-sub'
};

const routeNameToTabValue = Object.fromEntries(
	Object.entries(TAB_CONFIG).map(([tab, routeName]) => [routeName, tab])
);

onMounted(() => {
	const tabValue = routeNameToTabValue[route.name] || 'home';
	if (tabsRef.value) {
		tabsRef.value.value = tabValue;
	}
});

const handleNavChange = (event) => {
	const newValue = event.target.value;

	const routeName = TAB_CONFIG[newValue];
	if (routeName && route.name !== routeName) {
		router.push({ name: routeName });
	}
};
</script>

<style scoped>
.home-container {
	display: flex;
	flex-direction: column;
	height: 100vh;
}

.home-tab-layout {
	width: 100%;
	height: 60px;
}

.home-content {
	flex: 1;
	padding: 16px;
	overflow-y: hidden;
}
</style>