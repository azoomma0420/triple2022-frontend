import { Cookies } from 'react-cookie'

const cookie = new Cookies()

export const setCookie = (name: String, value: String, option?: any) => {
    return cookie.set(name, value, { ...option})
}

export const getCookie = (name: String) => {
    return cookie.get(name);
}