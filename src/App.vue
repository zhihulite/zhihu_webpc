<template>
	<mdui-layout full-height class="app-layout">
		<mdui-navigation-rail ref="navigationRail" placement="left" class="navigation-rail">
			<template v-for="(item, index) in sidebarItems" :key="index">
				<mdui-divider v-if="item.type === 'divider'" />
				<mdui-navigation-rail-item v-else :icon="item.icon + '--two-tone'" :value="item.value"
					@click="navigateTo(item.value)">
					{{ item.text }}
				</mdui-navigation-rail-item>
			</template>
		</mdui-navigation-rail>

		<mdui-layout-main>
			<div class="main-content">
				<router-view />
			</div>
		</mdui-layout-main>
	</mdui-layout>
</template>

<script setup>
	import {
		ref,
		onMounted
	} from 'vue';
	import {
		useRouter,
		useRoute
	} from 'vue-router';

	const router = useRouter();
	const route = useRoute();
	const navigationRail = ref(null);

	const routeMap = {
		home: 'home',
		favorites: 'favorites',
		daily: 'daily',
		following: 'following',
		more: 'more',
		local: 'local',
		history: 'history',
		settings: 'settings'
	};

	const sidebarItems = [{
			text: '主页',
			icon: 'home',
			value: 'home'
		},
		{
			text: '收藏',
			icon: 'book',
			value: 'favorites'
		},
		{
			text: '日报',
			icon: 'work',
			value: 'daily'
		},
		{
			text: '关注',
			icon: 'list_alt',
			value: 'following'
		},
		{
			text: '更多',
			icon: 'menu',
			value: 'more'
		},
		{
			type: 'divider'
		},
		{
			text: '本地',
			icon: 'inbox',
			value: 'local'
		},
		{
			text: '历史',
			icon: 'history',
			value: 'history'
		},
		{
			text: '设置',
			icon: 'settings',
			value: 'settings'
		}
	];

	const navigateTo = (value) => {
		const topRouteName = route.matched[0]?.name;
		const routeName = routeMap[value];
		if (routeName && routeMap[topRouteName] !== routeName) {
			router.push({
				name: routeName
			});
		}
	};

	onMounted(() => {
		const topRouteName = route.matched[0]?.name;
		const value = routeMap[topRouteName] || 'home';
		if (navigationRail.value) {
			navigationRail.value.value = value;
		}
	});
</script>

<style scoped>
	.main-content {
		min-height: 100vh;
		padding: 16px;
		overflow-y: auto;
		box-sizing: border-box;
	}
</style>