// Utilities
import axios from '../plugins/axios'
import { defineStore } from 'pinia'

export const useEditorUserStore = defineStore('editorUser', {
  id: 'editorUser',
    state: () => ({
      users: [],
      user_status: [],
      user_type: []
    }),
    getters: {
      getUsers: (state) => state.users,
      getUserStatus: (state) => state.user_status,
      getUserType: (state) => state.user_type
    },
    actions: {
      async getUsersAction(){
        await axios.get('/users')
        .then(({data}) => {
          this.users = [...data.data]
        })
      },
      async getUserMiscs(){
        await axios.get('/miscs')
        .then(({data}) => {
          this.user_status = [...data.user_status]
          this.user_type = [...data.user_type]
        })
      },
      async addUser(item){
        await axios.post('/users/register', item)
      },
      async updateUser(item, user_id){
        return await axios.patch(`/users/${user_id}`, item)
      },
      async deleteUserAc(user_id){
        return await axios.delete(`/users/${user_id}`)
      }
    },
    persist: true
})
