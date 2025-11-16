if (!typeof GM_xmlhttpRequest === 'function') {
	alert('未检测到油猴（Tampermonkey环境！');
	window.location.href = 'https://greasyfork.org/scripts/508709';
}
if (!window.innerWidth >= 768) {
	alert('请在桌面端大屏设备上使用本页面以获得最佳体验。即将跳转到移动版页面');
	window.location.href = 'https://zhihulite.github.io/zhihu_web/';
}

import {
	createApp
} from 'vue'
import App from './App.vue'
import router from './router';

import 'mdui/mdui.css';
import 'mdui';


import http, {
	init,
	get,
	update
} from '@/api/http.js';
init({})
window.$http = http;
window.$zhihu = get();

const app = createApp(App)
app.use(router);
app.mount('#app')