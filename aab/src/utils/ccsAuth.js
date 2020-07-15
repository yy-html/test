// 跳转至不同环境下的ccs登陆地址
export function relogin() {
  const ccsDomain = process.env.VUE_APP_CCS_URL
  const curDomain = encodeURIComponent(location.href)
  location.href = `${ccsDomain}?ret=${curDomain}`
}
