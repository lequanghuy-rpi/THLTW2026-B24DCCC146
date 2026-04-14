
export default [
	{
		path: '/user',
		layout: false,
		routes: [
			{
				path: '/user/login',
				layout: false,
				name: 'login',
				component: './user/Login',
			},
			{
				path: '/user',
				redirect: '/user/login',
			},
		],
	},

	
	{
		path: '/dashboard',
		name: 'Dashboard',
		component: './TrangChu',
		icon: 'HomeOutlined',
	},
	{
		path: '/gioi-thieu',
		name: 'About',
		component: './TienIch/GioiThieu',
		hideInMenu: true,
	},
	{
		path: '/random-user',
		name: 'RandomUser',
		component: './RandomUser',
		icon: 'ArrowsAltOutlined',
	},
	{
		path: '/todo-list',
		name: 'TodoList',
		icon: 'OrderedListOutlined',
		component: './TodoList',
	},
	{
		path: '/quan-ly-ban',
		name: 'QuanLyBan',
		icon: 'ShoppingOutlined',
		component: './QuanLyBan',
	},
	
	
	{
		path: '/th01',
		name: 'Th01 Bài 1',
		icon: 'SmileOutlined',
		component: './TH01',
	},
	{
		path: '/th01p2',
		name: 'Th01 Bài 2',
		icon: 'BookOutlined',
		component: './TH01p2',
	},
	{
		path:'/th02',
		name:'Th02',
		icon:'SmileOutlined',
		component:'./TH02',
	},
	{
		path:'/th02p2',
		name:'Th02 Bài 2',
		icon:'FileTextOutlined',
		component:'./TH02p2',
	},
	{
	 	path: '/TH03',
	 	name: 'TH03',
	 	icon: 'ToolOutlined',
	 	component: './TH03',
	},
	{
		path: '/TH04',
		name: 'TH04',
		icon: 'FileDoneOutlined',
		component: './TH04',
	},
	{
		path: '/TH05',
		name: 'TH05',
		icon: 'FileSearchOutlined',
		component: './TH05',
	},
	{
		path: '/TH06',
		name: 'TH06',
		icon: 'GlobalOutlined',
		component: './TH06',
	},
	{
		path: '/ktgk',
		name: 'Quản lý khóa học',
		icon: 'BookOutlined',
		component: './KTGK',
	},
	{
		path: '/notification',
		routes: [
			{
				path: './subscribe',
				exact: true,
				component: './ThongBao/Subscribe',
			},
			{
				path: './check',
				exact: true,
				component: './ThongBao/Check',
			},
			{
				path: './',
				exact: true,
				component: './ThongBao/NotifOneSignal',
			},
		],
		layout: false,
		hideInMenu: true,
	},
	{
		path: '/',
	},
	{
		path: '/403',
		component: './exception/403/403Page',
		layout: false,
	},
	{
		path: '/hold-on',
		component: './exception/DangCapNhat',
		layout: false,
	},
	{
		component: './exception/404',
	},
];
