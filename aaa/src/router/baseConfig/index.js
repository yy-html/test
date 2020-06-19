// 基础配置
const baseDataRoutes = [
  {
    path: '/dms/baseConfig/area/index',
    name: 'dms-baseConfig-area-index', // 区域配置
    component: () => import('@/views/baseConfig/area/index.vue')
  },
  {
    path: '/dms/baseConfig/element/index',
    name: 'dms-baseConfig-element-index', // 元件配置
    component: () => import('@/views/baseConfig/element/index.vue')
  },
  {
    path: '/dms/baseConfig/icon/index',
    name: 'dms-baseConfig-icon-index', // 图标配置
    component: () => import('@/views/baseConfig/icon/index.vue')
  },
]
  
  export default [
    ...baseDataRoutes
  ]
  