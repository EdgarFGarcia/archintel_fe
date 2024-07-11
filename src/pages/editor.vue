<template>
  <v-card>
    <v-layout>
      <v-app-bar
        prominent
      >
        <v-app-bar-nav-icon variant="text" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>

        <v-toolbar-title>{{ getUser.name }}</v-toolbar-title>

        <v-spacer></v-spacer>

        <template v-if="$vuetify.display.mdAndUp">
          <v-btn icon="mdi-magnify" variant="text"></v-btn>

          <v-btn icon="mdi-filter" variant="text"></v-btn>
        </template>

        <v-btn icon="mdi-dots-vertical" variant="text"></v-btn>
      </v-app-bar>

      <v-navigation-drawer
        v-model="drawer"
        :location="$vuetify.display.mobile ? 'bottom' : undefined"
        temporary
      >
        <v-list nav>
          <v-list-item
            v-for="(item, itemIndex) in items"
            :key="itemIndex"
            :title="item.title"
            :value="item.value"
            :prepend-icon="item.icon"
            @click="$router.push(item.url)"
          ></v-list-item>
        </v-list>
      </v-navigation-drawer>

      <v-main style="height: 100vh">
        Main
      </v-main>
    </v-layout>
  </v-card>
</template>
<script>
import { mapState, mapActions } from 'pinia'
import { useUserStore } from '@/stores/user.js'
export default {
  data: () => ({
    drawer: false,
    group: null,
    items: [
      {
        title: 'Dashboard',
        value: 'dashboard',
        icon: 'mdi-view-dashboard',
        url: {
          path: '/editor'
        }
      },
      {
        title: 'Users',
        value: 'users',
        icon: 'mdi-account-group',
        url: {
          path: '/editor_user'
        }
      },
      {
        title: 'Companies',
        value: 'companies',
        icon: 'mdi-domain',
        url: {
          path: '/editor_company'
        }
      },
    ],
  }),
  computed: {
    ...mapState(useUserStore, {
      getUser:  'getUser'
    })
  },
  watch: {
    group () {
      this.drawer = false
    },
  },
}
</script>
