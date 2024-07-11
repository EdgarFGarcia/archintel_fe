// Utilities
import axios from '../plugins/axios'
import { defineStore } from 'pinia'

export const useDashboard = defineStore('dashboard', {
  id: 'dashboard',
    state: () => ({
      for_edit: [],
      published: [],
      companies: []
    }),
    getters: {
      getForEdit: (state) => state.for_edit,
      getPublished: (state) => state.published,
      getCompanies: (state) => state.companies
    },
    actions: {
      async getArticlesAc(){
        await axios.get('/article/')
        .then(({data}) => {
          this.for_edit = [...data.for_edit]
          this.published = [...data.published]
        })
      },
      async saveArticle(item, article_id){
        return await axios.patch(`/article/${article_id}/save`, item)
      },
      async publishArticle(item, article_id){
        return await axios.patch(`/article/${article_id}/publish`, item)
      },
      async getCompaniesAc(){
        await axios.get('/company')
        .then(({data}) => {
          this.companies = [...data.data]
        })
      },
      async saveWriteArticle(item){
        return await axios.post('/article', item)
      }
    },
    persist: true
})
