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
        <v-list nav
          v-if="getUser.user_type_id == 3"
        >
          <v-list-item
            v-for="(item, itemIndex) in items"
            :key="itemIndex"
            :title="item.title"
            :value="item.value"
            :prepend-icon="item.icon"
            @click="!item.url ? logout() : $router.push(item.url)"
          ></v-list-item>
        </v-list>
        <v-list nav
          v-if="getUser.user_type_id == 2"
        >
          <v-list-item
            v-for="(item, itemIndex) in items_writer"
            :key="itemIndex"
            :title="item.title"
            :value="item.value"
            :prepend-icon="item.icon"
            @click="!item.url ? logout() : $router.push(item.url)"
          ></v-list-item>
        </v-list>
      </v-navigation-drawer>

      <v-main style="height: 100vh">
        <v-responsive
          class="align-centerfill-height mx-auto"
          max-width="80%"
        >
          <v-card
            variant="outlined"
            class="mt-5"
          >
            <v-card-title>
              user list
              <v-btn
                class="float-right"
                variant="flat"
                color="blue"
                @click="add_user = true"
              >
                <v-icon
                  class="mr-3"
                >mdi-plus</v-icon>add user
              </v-btn>
            </v-card-title>
            <v-card-text>
              <v-data-table-virtual
                :headers="headers"
                :items="getUsers"
                height="400"
                fixed-header
              >
                <template v-slot:item.edit="{item}">
                  <v-icon class="mr-5" style="cursor:pointer;" @click="updateUser(item)">mdi-pen</v-icon>
                  <v-icon style="cursor:pointer;" @click="deleteUser(item)">mdi-delete</v-icon>
                </template>
              </v-data-table-virtual>
            </v-card-text>
          </v-card>
        </v-responsive>
      </v-main>
    </v-layout>
  </v-card>
  <!-- add user -->
  <v-dialog v-model="add_user" max-width="500" persistent>
    <v-card title="Add User">

      <v-card-text>
        <v-col
          cols="12"
        >
          <v-text-field
            density="compact"
            placeholder="Email address"
            prepend-inner-icon="mdi-email-outline"
            variant="outlined"
            v-model="register.email"
          ></v-text-field>

          <v-text-field
            density="compact"
            placeholder="Firstname"
            prepend-inner-icon="mdi-account"
            variant="outlined"
            v-model="register.firstname"
          ></v-text-field>

          <v-text-field
            density="compact"
            placeholder="Lastname"
            prepend-inner-icon="mdi-account"
            variant="outlined"
            v-model="register.lastname"
          ></v-text-field>

          <v-text-field
            density="compact"
            placeholder="Password"
            prepend-inner-icon="mdi-lock"
            variant="outlined"
            v-model="register.password"
          ></v-text-field>

          <v-select
            label="User Type"
            :items="getUserType"
            :item-props="itemProps"
            density="compact"
            v-model="register.user_type_id"
          ></v-select>

          <v-select
            label="User Status"
            :items="getUserStatus"
            :item-props="itemProps"
            density="compact"
            v-model="register.user_status_id"
          ></v-select>
        </v-col>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          text="Close"
          @click="add_user = false"
          variant="outlined"
          class="pl-10 pr-10"
        >
        </v-btn>
        <v-btn
          text="Save"
          @click="addUserFn()"
          variant="flat"
          class="pl-10 pr-10"
          color="primary"
        ></v-btn>
      </v-card-actions>
    </v-card>

  </v-dialog>
  <!-- update user -->
  <v-dialog v-model="update_user_bool" max-width="500" persistent>
    <v-card title="Add User">

      <v-card-text>
        <v-col
          cols="12"
        >
          <v-text-field
            density="compact"
            prepend-inner-icon="mdi-email-outline"
            variant="outlined"
            v-model="update_user.email"
            :placeholder="`${update_user.email}`"
          ></v-text-field>

          <v-text-field
            density="compact"
            prepend-inner-icon="mdi-account"
            variant="outlined"
            v-model="update_user.firstname"
            :placeholder="`${update_user.firstname}`"
          ></v-text-field>

          <v-text-field
            density="compact"
            prepend-inner-icon="mdi-account"
            variant="outlined"
            v-model="update_user.lastname"
            :placeholder="`${update_user.firstname}`"
          ></v-text-field>

          <v-text-field
            density="compact"
            placeholder="Password"
            prepend-inner-icon="mdi-lock"
            variant="outlined"
            v-model="update_user.password"
          ></v-text-field>

          <v-select
            label="User Type"
            :items="getUserType"
            :item-props="itemProps"
            density="compact"
            v-model="update_user.user_type_id"
          ></v-select>

          <v-select
            label="User Status"
            :items="getUserStatus"
            :item-props="itemProps"
            density="compact"
            v-model="update_user.user_status_id"
          ></v-select>
        </v-col>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          text="Close"
          @click="update_user_bool = false"
          variant="outlined"
          class="pl-10 pr-10"
        >
        </v-btn>
        <v-btn
          text="Update"
          @click="updateUserFn()"
          variant="flat"
          class="pl-10 pr-10"
          color="primary"
        ></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <!-- delete user -->
  <v-dialog v-model="delete_user_bool" max-width="500" persistent>
    <v-card title="Delete User">

      <v-card-text>
        <label>are you sure you want to delete this user?</label>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          text="Close"
          @click="delete_user_bool = false"
          variant="outlined"
          class="pl-10 pr-10"
        >
        </v-btn>
        <v-btn
          text="Delete"
          @click="deleteFn()"
          variant="flat"
          class="pl-10 pr-10"
          color="primary"
        ></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import { mapState, mapActions } from 'pinia'
import { useEditorUserStore } from '@/stores/editor_user.js'
import { useUserStore } from '@/stores/user'
export default {
  data: () => ({
    add_user: false,
    drawer: false,
    group: null,
    items_writer: [
      {
        title: 'Dashboard',
        value: 'dashboard',
        icon: 'mdi-view-dashboard',
        url: {
          path: '/dashboard'
        }
      },
      {
        title: 'Logout',
        value: 'logout',
        icon: 'mdi-logout',
        url: false
      }
    ],
    items: [
      {
        title: 'Dashboard',
        value: 'dashboard',
        icon: 'mdi-view-dashboard',
        url: {
          path: '/dashboard'
        }
      },
      {
        title: 'Users',
        value: 'users',
        icon: 'mdi-account-group',
        url: {
          path: '/user'
        }
      },
      {
        title: 'Companies',
        value: 'companies',
        icon: 'mdi-domain',
        url: {
          path: '/company'
        }
      },
      {
        title: 'Logout',
        value: 'logout',
        icon: 'mdi-logout',
        url: false
      }
    ],
    headers: [
      { title: 'Name', align: 'start', key: 'name' },
      { title: 'Email', align: 'start', key: 'email' },
      { title: 'User Type', align: 'start', key: 'get_user_type.name' },
      { title: 'User Status', align: 'start', key: 'get_user_status.name' },
      { title: '', sortable: false, key: 'edit' }
    ],
    register: {
      email: null,
      firstname: null,
      lastname: null,
      password: null,
      user_type_id: null,
      user_status_id: null
    },
    update_user: {},
    update_user_bool: false,
    update: {
      email: null,
      firstname: null,
      lastname: null,
      password: null,
      user_type_id: null,
      user_status_id: null
    },
    delete_user: {},
    delete_user_bool: false
  }),
  computed: {
    ...mapState(useUserStore, {
      getUser: 'getUser'
    }),
    ...mapState(useEditorUserStore, {
      getUsers: 'getUsers',
      getUserStatus: 'getUserStatus',
      getUserType: 'getUserType'
    })
  },
  async mounted() {
    await this.getUsersAction()
    await this.getUserMiscs()
  },
  methods: {
    ...mapActions(useEditorUserStore, {
      getUsersAction: 'getUsersAction',
      getUserMiscs: 'getUserMiscs',
      addUserAc: 'addUser',
      updateUserAc: 'updateUser',
      deleteUserAc: 'deleteUserAc'
    }),
    ...mapActions(useUserStore, {
      snackBar:   'snackBar'
    }),
    itemProps (item) {
      return {
        title: item.name,
        value: item.id
      }
    },
    async addUserFn(){
      this.register.name = this.register.firstname + ' ' + this.register.lastname
      await this.addUserAc(this.register)
      this.add_user = false;
      this.register = {}
      await this.getUsersAction()
    },
    updateUser(item){
      this.update_user_bool = true
      this.update_user = item
    },
    async updateUserFn(){
      this.update_user.name = this.update.firstname + ' ' + this.update.lastname
      let tp = {
        email: this.update_user.email,
        firstname: this.update_user.firstname,
        lastname: this.update_user.lastname,
        user_status_id: this.update_user.user_status_id,
        user_type_id: this.update_user.user_type_id,
        password: this.update_user.password,
        name: this.update_user.name
      }
      const update_user_call = await this.updateUserAc(tp, this.update_user.id)
      if(update_user_call.data.response){
        this.update_user_bool = false;
        this.update_user = {};
        this.update = {}
        await this.getUsersAction()
        return
      }
      let data  = update_user_call.data
      if(!update_user_call.response){
        for (let field in data) {
          if (data.hasOwnProperty(field)) {
            let messages = data[field];
            for (let i = 0; i < messages.length; i++) {
              this.snackBar(true, messages[i])
            }
          }
        }
        return
      }
    },
    deleteUser(item){
      this.delete_user_bool = true
      this.delete_user = item
    },
    async deleteFn(){
      await this.deleteUserAc(this.delete_user.id)
      this.delete_user = {}
      this.delete_user_bool = false
      await this.getUsersAction()
    },
    logout(){
      localStorage.clear();
      setTimeout(() => {
        this.$router.push({path: '/'})
      }, 2000);
    }
  },
  watch: {
    group () {
      this.drawer = false
    },
  },
}
</script>
