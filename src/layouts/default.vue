<template>
  <v-snackbar
    v-model="getSnackBar"
  >
    {{ getMessage }}

    <template v-slot:actions>
      <v-btn
        color="pink"
        variant="text"
        @click="hideSnack()"
      >
        Close
      </v-btn>
    </template>
  </v-snackbar>
  <v-app>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import { mapState, mapActions } from 'pinia'
import { useUserStore } from '@/stores/user.js'
export default{
  computed: {
    ...mapState(useUserStore, {
      getSnackBar: 'getSnackBar',
      getMessage: 'getMessage'
    })
  },
  methods: {
    ...mapActions(useUserStore, {
      snackBar: 'snackBar'
    }),
    hideSnack(){
      this.snackBar(false, "")
    }
  }
}
</script>
