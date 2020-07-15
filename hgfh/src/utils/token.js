import Cookies from 'js-cookie'

const tokenKey = 'ccs-token'

export function getToken() {
  return Cookies.get(tokenKey) || ''
}

export function setToken(token) {
  return Cookies.set(tokenKey, token)
}

export function removeToken() {
  Cookies.remove(tokenKey, {
    path: '/',
    // domain: domainArray[location.host] || domainArray["vms.missfresh.net"]
    domain: process.env.VUE_APP_TOKEN_DOMAIN_RELEASE
  })
  return Cookies.remove(tokenKey, {
    path: '/',
    domain: '".missfresh.net"'
  })
}
