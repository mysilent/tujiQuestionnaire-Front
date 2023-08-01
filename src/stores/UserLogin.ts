import { defineStore } from 'pinia'

export const useLoginStore = defineStore('userLoginStore',  {
    state: () => {
        return {
            id:'',
            username:'',
            nickname:''
        }
    },
    persist: {
        // 修改存储中使用的键名称，默认为当前 Store的 id
        key: 'login',
        // 修改为 sessionStorage，默认为 localStorage
        storage: window.localStorage,
        // 部分持久化状态的点符号路径数组，[]意味着没有状态被持久化(默认为undefined，持久化整个状态)
        // paths: ['nested.data'],
    },

})
export const useAdminLoginStore = defineStore('userAdminLoginStore',  {
    state: () => {
        return {
            id:'',
            username:'',
            name:'',
            permissions:''
        }
    },
    persist: {
        // 修改存储中使用的键名称，默认为当前 Store的 id
        key: 'adminLogin',
        // 修改为 sessionStorage，默认为 localStorage
        storage: window.sessionStorage,
        // 部分持久化状态的点符号路径数组，[]意味着没有状态被持久化(默认为undefined，持久化整个状态)
        // paths: ['nested.data'],
    },

})
