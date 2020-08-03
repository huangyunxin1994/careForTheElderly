import Cookies from 'js-cookie'

const TokenKey = 'TokenKey'
const User="User"
const RoleId="roleId"
const MenuData="menuData"
var millisecond = new Date().getTime();
var expiresTime = new Date(millisecond + 60 * 1000 * 1);
export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function getUser() {
  return Cookies.get(User)
}
export function setUser(user) {
  return Cookies.set(User, user)
}
export function removeUser() {
  return Cookies.remove(User)
}

export function getRole() {
  return Cookies.get(RoleId)
}
export function setRole(roleId) {
  return Cookies.set(RoleId, roleId)
}
export function removeRole() {
  return Cookies.remove(RoleId)
}
export function getMenuData() {
  return Cookies.get(MenuData)
}
export function setMenuData(menuData) {
  return Cookies.set(MenuData, menuData)
}
export function removeMenuData() {
  return Cookies.remove(MenuData)
}