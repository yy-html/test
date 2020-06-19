import { MfbRequest } from '@mfb/pc-utils-micro';
const { request } = MfbRequest({ baseUrl: process.env.VUE_APP_API_ROOT})
import API_CONFIG from '../index.js'

/**
 *  基本配置-区域配置
 */
export const getRegionList = async (data) => {
  return request({
    url: API_CONFIG['BASE_CONFIG_REGION'].LIST,
    method: 'post',
    data,
    loading: true
  })
}
export const addRegion = async (data) => {
  return request({
    url: API_CONFIG['BASE_CONFIG_REGION'].ADD,
    method: 'post',
    data,
    loading: true
  })
}
export const editRegion = async (data) => {
  return request({
    url: API_CONFIG['BASE_CONFIG_REGION'].EDIT,
    method: 'post',
    data,
    loading: true
  })
}
/**
 *  基本配置-设备元件配置
 */
export const getElementList = async (data) => {
  return request({
    url: API_CONFIG['BASE_CONFIG_ELEMENT'].LIST,
    method: 'post',
    data,
    loading: true
  })
}

export const getDistrictList = async (data) => {
  return request({
    url: API_CONFIG['BASE_CONFIG_ELEMENT'].DISTRICT_LIST,
    method: 'post',
    data,
    loading: true
  })
}
export const addElement = async (data) => {
  return request({
    url: API_CONFIG['BASE_CONFIG_ELEMENT'].ADD,
    method: 'post',
    data,
    loading: true
  })
}
export const editElement = async (data) => {
  return request({
    url: API_CONFIG['BASE_CONFIG_ELEMENT'].EDIT,
    method: 'post',
    data,
    loading: true
  })
}
export const exportElementList = async (data) => {
  return request({
    url: API_CONFIG['BASE_CONFIG_ELEMENT'].EXPORT,
    method: 'post',
    data,
    responseType: 'blob',
    loading: true
  })
}

/**
 *  基本配置-图标配置
 */
export const getIconList = async (data) => {
  return request({
    url: API_CONFIG['BASE_CONFIG_ICON'].LIST,
    method: 'post',
    data,
    loading: true
  })
}
export const addIcon = async (data) => {
  return request({
    url: API_CONFIG['BASE_CONFIG_ICON'].ADD,
    method: 'post',
    data,
    loading: true
  })
}
export const editIcon = async (data) => {
  return request({
    url: API_CONFIG['BASE_CONFIG_ICON'].EDIT,
    method: 'post',
    data,
    loading: true
  })
}
export const uploadFile = async (data) => {
  return request({
    url: API_CONFIG['BASE_CONFIG_ICON'].UPLOAD,
    method: 'post',
    data,
    headers: { "Content-Type": "multipart/form-data" },
    loading: true
  })
}