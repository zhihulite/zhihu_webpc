import HomeView from '../views/HomeView.vue';
import UserView from '../views/UserView.vue';
import ConetentView from '../views/ConetentView.vue';
import HomeSubView from '../views/home/HomeSubView.vue';
import HotSubView from '../views/home/HotSubView.vue';
import FollowingSubView from '../views/home/FollowingSubView.vue';
// import NotFoundView from '../views/NotFoundView.vue';

const routes = [{
		path: '/',
		redirect: '/home'
	},
	{
		path: '/home',
		name: 'home',
		component: HomeView,
		children: [{
				path: '',
				name: 'home-sub',
				component: HomeSubView
			},
			{
				path: 'hot',
				name: 'hot-sub',
				component: HotSubView
			},
			{
				path: 'following',
				name: 'following-sub',
				component: FollowingSubView
			}
		]
	},
	{
		path: '/user',
		name: 'user',
		component: UserView
	},
	{
		path: '/content/:type/:id',
		name: 'content',
		component: ConetentView
	},
	// {
	//   path: '/:pathMatch(.*)*', // 404 路由 (可选)
	//   name: 'not-found',
	//   component: NotFoundView
	// }
];

export default routes;