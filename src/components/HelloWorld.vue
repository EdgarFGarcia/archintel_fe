<template>
  <v-container class="fill-height">
    <v-responsive
      class="align-centerfill-height mx-auto"
      max-width="900"
    >
      <v-row>
        <v-col cols="12">
          <v-card
            class="mx-auto pa-12 pb-8"
            elevation="8"
            max-width="448"
            rounded="lg"
          >
            <div class="text-subtitle-1 text-medium-emphasis">Account</div>

            <v-text-field
              density="compact"
              placeholder="Email address"
              prepend-inner-icon="mdi-email-outline"
              variant="outlined"
              v-model="login.email"
            ></v-text-field>

            <div class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between">
              Password
            </div>

            <v-text-field
              :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
              :type="visible ? 'text' : 'password'"
              density="compact"
              placeholder="Enter your password"
              prepend-inner-icon="mdi-lock-outline"
              variant="outlined"
              @click:append-inner="visible = !visible"
              v-model="login.password"
            ></v-text-field>

            <v-btn
              class="mb-8"
              color="blue"
              size="large"
              variant="tonal"
              block
              @click="loginFn()"
            >
              Log In
            </v-btn>
          </v-card>
        </v-col>
      </v-row>
    </v-responsive>
  </v-container>
</template>

<script>
  import { mapState, mapActions } from 'pinia'
  import { useUserStore } from '../stores/user.js'
  export default{
    data: () => ({
      visible: false,
      login: {
        email: null,
        password: null
      }
    }),
    mounted() {
      // console.log(this.getUser)
      if(Object.keys(this.getUser).length > 0){
        switch(this.getUser.user_type_id){
          case 1:
            // admin
            break;
          case 2:
            // writer
            break;
          case 3:
            // editor
            this.$router.push({path: 'editor'})
            break;
        }
      }
    },
    computed: {
      ...mapState(useUserStore, {
        getUser: 'getUser'
      })
    },
    methods: {
      ...mapActions(useUserStore, {
        loginAction: 'loginAction'
      }),
      async loginFn(){
        const login_attempt = await this.loginAction(this.login)
        location.reload()
      }
    }
  }
</script>
