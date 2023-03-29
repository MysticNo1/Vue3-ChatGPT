export default [{
    path: '/',
    name: 'home',
    component: () =>
        import('@/pages/index/index'),
        meta: {
            keepAlive: true,
            isTab: false,
            isAuth: false
        }
    }
]
