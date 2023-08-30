import {defineStore} from "pinia";


export const useLoaderStore = defineStore('loaderStore', {
    state: () => ({
        loading: false,
    }),
    getters: {
        getLoading(): boolean {
            return this.loading;
        },
    },
    actions: {
        setLoading(loading: boolean) {
            this.loading = loading;
        },

    }
})