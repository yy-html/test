import { MfbRequest } from '@mfb/pc-utils-micro';
const { request } = MfbRequest({ baseUrl: process.env.VUE_APP_API_ROOT})
import API_CONFIG from '../index.js'

/**
 *  获取枚举
 */
export const getEnum = async (data) => {
  return request({
    url: API_CONFIG['COMMON'].GET_ENUM,
    method: 'get',
    data,
  })
}
/**
 *  获取一级品类
 */
export const getCategorys = async (data) => {
  return request({
    url: API_CONFIG['COMMON'].GET_CATEGORYS,
    method: 'get',
    loading: true,
    data
  })
}

/**
 *  获取微仓枚举
 */
export const getSmsEnum = async (data) => {
  return request({
    url: API_CONFIG['COMMON'].GET_SMS_ENUM,
    method: 'get',
    loading: true,
    data
  })
}

/**
 * 根据关键字获取原料列表
 * @param {"word":"xx","pageSize":50,"page":1} data 
 */
export const getMaterialByWords = async (data) => {
  return request({
    url: API_CONFIG['COMMON'].GET_MATERIAL_BY_WORDS,
    method: 'post',
    loading: true,
    data
  }) 
}

/**
 *  获取仓组
 */
export const getWarehouseGroupList = async (data) => {
  return request({
    url: API_CONFIG['COMMON'].GROUP_LIST,
    method: 'get',
    loading: true,
    data
  }) 
}

/**
 *  获取城市
 */
export const getCityList = async (data) => {
  return request({
    url: API_CONFIG['COMMON'].CITY_LIST,
    method: 'get',
    loading: true,
    data
  }) 
}

/**
 *  获取军区
 */
export const getMilitaryList = async (data) => {
  return request({
    url: API_CONFIG['COMMON'].MILITARY_LIST,
    method: 'post',
    loading: true,
    data
  }) 
}

/**
 *  获取微仓
 */
export const getStationList = async (data) => {
  return request({
    url: API_CONFIG['COMMON'].STATION_LIST,
    method: 'get',
    loading: true,
    data
  }) 
}