import { MfbRequest } from '@mfb/pc-utils-micro';
const { request } = MfbRequest({ baseUrl: process.env.VUE_APP_API_ROOT})
import API_CONFIG from '../index.js'

/**
 *  微仓布局陈列列表
 */
export const getLayoutList = async (data) => {
  return request({
    url: API_CONFIG['LAYOUT_WAREHOUSE'].LIST,
    method: 'post',
    data,
    loading: true
  })
}
/**
 *  微仓布局陈列修改
 */
export const updateLayout = async (data) => {
  return request({
    url: API_CONFIG['LAYOUT_WAREHOUSE'].UPDATE,
    method: 'post',
    data,
    loading: true
  })
}
/**
 *  导出布局图
 */
export const exportLayout = async (data) => {
  return request({
    url: API_CONFIG['LAYOUT_WAREHOUSE'].EXPORT_LAYOUT,
    method: 'post',
    data,
    responseType: 'blob',
    loading: true
  })
}
/**
 *  导出陈列图
 */
export const exportDisplay = async (data) => {
  return request({
    url: API_CONFIG['LAYOUT_WAREHOUSE'].EXPORT_DISPLAY,
    method: 'post',
    data,
    responseType: 'blob',
    loading: true
  })
}

/**
 *  微仓布局陈列 - 货架列表查询
 */
export const getEquipmentList = async (data) => {
  return request({
    url: API_CONFIG['LAYOUT_WAREHOUSE'].getEquipmentList,
    method: 'post',
    data,
    loading: true
  })
}


/**
 *  微仓布局陈列 - 货架详情查询
 */
export const getEquipmentInfo = async (data) => {
  return request({
    url: API_CONFIG['LAYOUT_WAREHOUSE'].getEquipmentInfo,
    method: 'post',
    data,
    loading: true
  })
}
/**
 *  微仓布局陈列 - 添加库位
 */
export const addEquipmentLocation = async (data) => {
  return request({
    url: API_CONFIG['LAYOUT_WAREHOUSE'].addEquipmentLocation,
    method: 'post',
    data,
    loading: true
  })
}
/**
 *  微仓布局陈列 - 删除库位
 */
export const deleteEquipmentLocation = async (data) => {
  return request({
    url: API_CONFIG['LAYOUT_WAREHOUSE'].deleteEquipmentLocation,
    method: 'post',
    data,
    loading: true
  })
}
/**
 *  微仓布局陈列 - 库位原料详情查询
 */
export const getLocationMaterialInfo = async (data) => {
  return request({
    url: API_CONFIG['LAYOUT_WAREHOUSE'].getLocationMaterialInfo,
    method: 'post',
    data,
    loading: true
  })
}
/**
 *  微仓布局陈列 - 可上架原料列表查询
 */
export const getShelveMaterialList = async (data) => {
  return request({
    url: API_CONFIG['LAYOUT_WAREHOUSE'].getShelveMaterialList,
    method: 'post',
    data,
    loading: true
  })
}
/**
 *  微仓布局陈列 - 上下架原料
 */
export const shelvesMaterials = async (data) => {
  return request({
    url: API_CONFIG['LAYOUT_WAREHOUSE'].shelvesMaterials,
    method: 'post',
    data,
    loading: true
  })
}

/**
 *  布局图 - 区域列表
 */
export const getPreciseDistrictList = async (data) => {
  return request({
    url: API_CONFIG['REGION_PAINT'].getPreciseDistrictList,
    method: 'post',
    data,
    loading: true
  })
}

/**
 *  布局图 - 设备列表
 */
export const getRelevanceEquipmentIconList = async (data) => {
  return request({
    url: API_CONFIG['REGION_PAINT'].getRelevanceEquipmentIconList,
    method: 'post',
    data,
    loading: true
  })
}

/**
 *  布局图 - 保存布局图
 */
export const savePaint = async (data) => {
  return request({
    url: API_CONFIG['REGION_PAINT'].savePaint,
    method: 'post',
    data,
    loading: true
  })
}

/**
 *  布局图 - 布局图详情
 */
export const getDetailByWarehouseCode = async (data) => {
  return request({
    url: API_CONFIG['REGION_PAINT'].getDetailByWarehouseCode,
    method: 'post',
    data,
    loading: true
  })
}

/**
 *  布局图 - 获取可绑定列表
 */
export const getKqList = async (data) => {
  return request({
    url: API_CONFIG['REGION_PAINT'].getKqList,
    method: 'post',
    data,
    loading: true
  })
}

/**
 *  布局图 - 绑定货架
 */
export const bindKq = async (data) => {
  return request({
    url: API_CONFIG['REGION_PAINT'].bindKq,
    method: 'post',
    data,
    loading: true
  })
}

/**
 *  布局图 - 解绑货架
 */
export const unBindKq = async (data) => {
  return request({
    url: API_CONFIG['REGION_PAINT'].unBindKq,
    method: 'post',
    data,
    loading: true
  })
}

/**
 *  布局图 - 查询货架详情
 */
export const kqDetail = async (data) => {
  return request({
    url: API_CONFIG['REGION_PAINT'].kqDetail,
    method: 'post',
    data,
    // loading: true
  })
}



