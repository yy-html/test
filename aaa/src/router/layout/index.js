// 陈列布局
const layoutRoutes = [
  {
    path: '/dms/layout/warehouse/index',
    name: 'dms-layout-warehouse-index', // 微仓陈列
    component: () => import('@/views/layout/warehouse/index.vue')
  },
  {
    path: '/dms/layout/warehouse/product',
    name: 'dms-layout-warehouse-product', // 微仓商品陈列
    component: () => import('@/views/layout/warehouse/product.vue')
  },
  {
    path: '/dms/layout/warehouse/slocation',
    name: 'dms-layout-warehouse-slocation', // 微仓陈列库位
    component: () => import('@/views/layout/warehouse/slocation.vue')
  },
  {
    path: '/dms/layout/warehouse/region',
    name: 'dms-layout-warehouse-region', // 微仓布局图
    component: () => import('@/views/layout/warehouse/region/region.vue')
  },
  {
    path: '/dms/layout/warehouse/detail',
    name: 'dms-layout-warehouse-detail', // 查看
    component: () => import('@/views/layout/warehouse/detail.vue')
  },
]
  
  export default [
    ...layoutRoutes
  ]
  