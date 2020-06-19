const apis = {
  'COMMON': {
    GET_MATERIAL_BY_WORDS: '/sms/external/dms/material/getByWords', //原料模糊查询
    GET_ENUM: '/dms/enum', //获取枚举类型
    GET_CATEGORYS: '/sms/external/dms/enum/getParentCategories', //品类模糊查询
    GET_SMS_ENUM: '/sms/external/dms/enum/getByType', //微仓存储条件
    GROUP_LIST: '/mds/warehouse-group/name-list', // 仓组
    CITY_LIST: '/mds/station/getCityList',  // 城市
    MILITARY_LIST: '/mds/military/listspinner', // 军区
    STATION_LIST: '/mds/station/getList',  // 微仓

  }
}
export default apis
