// Utilities
import axios from '../plugins/axios'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('landing', {
  id: 'landing',
    state: () => ({
      user: {},
      token: null,
      showSnack: false,
      message: null
    }),
    getters: {
      getUser: (state) => state.user,
      getSnackBar: (state) => state.showSnack,
      getMessage: (state) => state.message
    },
    actions: {
      async loginAction(item){
        await axios.post('/unauth/login', item)
        .then(({data}) => {
          this.user = data.data.user_information
          this.token = data.data.token
          this.snackBar(true, data.message)
        })
        .catch((e) => {
          this.snackBar(true, "there's an error")
        })
      },
      snackBar(boolValue, message){
        this.showSnack = boolValue
        this.message = message
      }
    },
    persist: true
})
