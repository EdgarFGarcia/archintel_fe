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
              Companies
              <v-btn
                class="float-right"
                variant="flat"
                color="blue"
                @click="addCompanyFn()"
              >
                <v-icon
                  class="mr-3"
                >mdi-plus</v-icon>add company
              </v-btn>
            </v-card-title>
            <v-card-text>
              <v-data-table-virtual
                :headers="headers"
                :items="getCompanies"
                height="80vh"
                fixed-header
              >
                <template v-slot:item.logo="{item}">
                  <v-img
                    :width="200"
                    aspect-ratio="16/9"
                    :src="`${item.logo}`"
                  ></v-img>
                </template>
                <template v-slot:item.edit="{item}">
                  <v-icon class="mr-5" style="cursor:pointer;" @click="updateCompany(item)">mdi-pen</v-icon>
                  <v-icon style="cursor:pointer;" @click="deleteCompany(item)">mdi-delete</v-icon>
                </template>
              </v-data-table-virtual>
            </v-card-text>
          </v-card>
        </v-responsive>
      </v-main>
    </v-layout>
  </v-card>
  <!-- add user -->
  <v-dialog v-model="add_company_boolean" max-width="500" persistent>
    <v-card title="Add Company">

      <v-card-text>
        <v-col
          cols="12"
        >
          <v-text-field
            density="compact"
            placeholder="Company Name"
            prepend-inner-icon="mdi-domain"
            variant="outlined"
            v-model="company.name"
          ></v-text-field>

          <v-text-field
            density="compact"
            placeholder="Logo link"
            prepend-inner-icon="mdi-at"
            variant="outlined"
            v-model="company.logo"
          ></v-text-field>

          <v-select
            label="Company Status"
            :items="getCompanyStatus"
            :item-props="itemProps"
            density="compact"
            v-model="company.company_status_id"
          ></v-select>
        </v-col>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          text="Close"
          @click="add_company_boolean = false"
          variant="outlined"
          class="pl-10 pr-10"
        >
        </v-btn>
        <v-btn
          text="Save"
          @click="addActualCompany()"
          variant="flat"
          class="pl-10 pr-10"
          color="primary"
        ></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <!-- update dialog -->
  <v-dialog v-model="company_update_boolean" max-width="500" persistent>
    <v-card title="Company Edit">

      <v-card-text>
        <v-col
          cols="12"
        >
          <v-text-field
            density="compact"
            :placeholder="`${company_update_data.name}`"
            prepend-inner-icon="mdi-domain"
            variant="outlined"
            v-model="company_update_data.name"
          ></v-text-field>

          <v-text-field
            density="compact"
            :placeholder="`${company_update_data.logo}`"
            prepend-inner-icon="mdi-at"
            variant="outlined"
            v-model="company_update_data.logo"
          ></v-text-field>

          <v-select
            label="User Status"
            :items="getCompanyStatus"
            :item-props="itemProps"
            density="compact"
            v-model="company_update_data.company_status_id"
          ></v-select>
        </v-col>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          text="Close"
          @click="company_update_boolean = false"
          variant="outlined"
          class="pl-10 pr-10"
        >
        </v-btn>
        <v-btn
          text="Save"
          @click="updateCompanyActual()"
          variant="flat"
          class="pl-10 pr-10"
          color="primary"
        ></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <!-- delete user -->
  <v-dialog v-model="company_delete_boolean" max-width="500" persistent>
    <v-card title="Delete User">

      <v-card-text>
        <label>are you sure you want to delete this company?</label>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          text="Close"
          @click="company_delete_boolean = false"
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
import { useUserStore } from '@/stores/user.js'
import { useEditorCompany } from '@/stores/editor_company';
export default {
  data: () => ({
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
      { title: 'Logo', align: 'start', key: 'logo' },
      { title: 'Status', align: 'start', key: 'get_status.name' },
      { title: 'Created at', align: 'start', key: 'created_at' },
      { title: '', key: 'edit' }
    ],
    add_company_boolean: false,
    company: {
      name: null,
      logo: null,
      company_status_id: null
    },
    company_update_boolean: false,
    company_update_data: {},
    company_delete_boolean: false,
    company_delete_data: {}
  }),
  async mounted(){
    await this.getCompanyStatusAc()
    await this.getCompaniesAc()
  },
  computed: {
    ...mapState(useUserStore, {
      getUser:  'getUser'
    }),
    ...mapState(useEditorCompany, {
      getCompanies: 'getCompanies',
      getCompanyStatus: 'getCompanyStatus'
    })
  },
  methods: {
    ...mapActions(useEditorCompany, {
      getCompaniesAc: 'getCompaniesAc',
      getCompanyStatusAc: 'getCompanyStatusAc',
      addCompanyAc: 'addCompanyAc',
      updateCompanyAc: 'updateCompany',
      deleteCompanyAc: 'deleteCompany'
    }),
    ...mapActions(useUserStore, {
      snackBar: 'snackBar'
    }),
    addCompanyFn(){
      this.add_company_boolean = true
    },
    itemProps (item) {
      return {
        title: item.name,
        value: item.id
      }
    },
    async addActualCompany(){
      const add_company = await this.addCompanyAc(this.company)
      if(add_company.data.response){
        this.snackBar(true, add_company.data.message)
        this.company = {}
        this.add_company_boolean = false
        await this.getCompaniesAc()
      }
    },
    updateCompany(item){
      this.company_update_boolean = true
      this.company_update_data = item
    },
    async updateCompanyActual(){
      let tp = {
        name: this.company_update_data.name,
        logo: this.company_update_data.logo,
        company_status_id: this.company_update_data.company_status_id
      }
      const update_company = await this.updateCompanyAc(tp, this.company_update_data.id)
      if(update_company.data.response){
        this.snackBar(true, update_company.data.message)
        this.company_update_boolean = false
        this.company_update_data = {}
        await this.getCompaniesAc()
        return
      }
    },
    deleteCompany(item){
      this.company_delete_boolean = true
      this.company_delete_data = item
    },
    async deleteFn(){
      const delete_company = await this.deleteCompanyAc(this.company_delete_data.id)
      if(delete_company.data.response){
        this.snackBar(true, delete_company.data.message)
        this.company_delete_boolean = false
        this.company_delete_data = {}
        await this.getCompaniesAc()
        return
      }
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
