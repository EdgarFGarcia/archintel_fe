// Utilities
import axios from '../plugins/axios'
import { defineStore } from 'pinia'

export const useEditorCompany = defineStore('editorCompany', {
  id: 'editorCompany',
    state: () => ({
      companies: [],
      company_status: []
    }),
    getters: {
      getCompanies: (state) => state.companies,
      getCompanyStatus: (state) => state.company_status
    },
    actions: {
      async getCompaniesAc(){
        await axios.get('/company')
        .then(({data}) => {
          this.companies = [...data.data]
        })
      },
      async getCompanyStatusAc(){
        await axios.get('/miscs/company')
        .then(({data}) => {
          this.company_status = [...data.data]
        })
      },
      async addCompanyAc(item){
        return await axios.post('/company/', item)
      },
      async updateCompany(item, company_id){
        return await axios.patch(`/company/${company_id}`, item)
      },
      async deleteCompany(company_id){
        return await axios.delete(`/company/${company_id}`)
      }
    },
    persist: true
})
