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
              Articles
              <v-btn
                class="float-right"
                variant="flat"
                color="blue"
                @click="add_article = true"
                v-if="getUser.user_type_id == 2"
              >
                <v-icon
                  class="mr-3"
                >mdi-plus</v-icon>add article
              </v-btn>
            </v-card-title>
            <v-card-text>
              <v-tabs
                v-model="tab"
                bg-color="dark"
              >
                <v-tab value="one">For Edit</v-tab>
                <v-tab value="two">Published</v-tab>
              </v-tabs>
              <v-tabs-window v-model="tab">
                <v-tabs-window-item value="one">
                  <v-data-table-virtual
                    :headers="headers"
                    :items="getForEdit"
                    height="80vh"
                    fixed-header
                  >
                    <template v-slot:item.image="{item}">
                      <v-img
                        :width="200"
                        aspect-ratio="16/9"
                        :src="`${item.image}`"
                      ></v-img>
                    </template>
                    <template v-slot:item.content="{item}">
                      <label v-html="item.content"/>
                    </template>
                    <template v-slot:item.get_article_status.name="{item}">
                      <v-chip variant="outlined">
                        {{ item.get_article_status.name }}
                      </v-chip>
                    </template>
                    <template v-slot:item.edit="{item}">
                      <v-icon class="mr-5" style="cursor:pointer;" v-if="getUser.user_type_id == 3 || getUser.user_type_id == 2" @click="editForEdit(item)">mdi-pen</v-icon>
                    </template>
                  </v-data-table-virtual>
                </v-tabs-window-item>

                <v-tabs-window-item value="two">
                  <v-data-table-virtual
                    :headers="headers"
                    :items="getPublished"
                    height="80vh"
                    fixed-header
                  >
                    <template v-slot:item.image="{item}">
                      <v-img
                        :width="200"
                        aspect-ratio="16/9"
                        :src="`${item.image}`"
                      ></v-img>
                    </template>
                    <template v-slot:item.content="{item}">
                      <label v-html="item.content"/>
                    </template>
                    <template v-slot:item.get_article_status.name="{item}">
                      <v-chip variant="outlined">
                        {{ item.get_article_status.name }}
                      </v-chip>
                    </template>
                    <template v-slot:item.edit="{item}">
                      <v-icon class="mr-5" style="cursor:pointer;" v-if="getUser.user_type_id == 3" @click="editForEdit(item)">mdi-pen</v-icon>
                    </template>
                  </v-data-table-virtual>
                </v-tabs-window-item>
              </v-tabs-window>
            </v-card-text>
          </v-card>
        </v-responsive>
      </v-main>
    </v-layout>
  </v-card>
  <!-- add article -->
   <!-- edit article -->
  <v-dialog v-model="add_article" max-width="500" persistent>
    <v-card :title="getUser.user_type_id == 3 ? 'Edit article' : 'you can only edit unpublished articles'">

      <v-card-text>
        <v-col
          cols="12"
        >
          <v-text-field
            density="compact"
            label="image link"
            placeholder="image link"
            prepend-inner-icon="mdi-image-area"
            variant="outlined"
            v-model="article.image"
          ></v-text-field>

          <v-text-field
            density="compact"
            prepend-inner-icon="mdi-domain"
            label="Title"
            variant="outlined"
            v-model="article.title"
          ></v-text-field>

          <v-text-field
            density="compact"
            prepend-inner-icon="mdi-at"
            variant="outlined"
            label="Link"
            v-model="article.link"
          ></v-text-field>

          <v-select
            label="Company"
            :items="getCompanies"
            :item-props="itemProps"
            density="compact"
            variant="outlined"
            v-model="article.company_id"
          ></v-select>

          <v-date-input
            label="Date"
            prepend-icon=""
            prepend-inner-icon="$calendar"
            variant="outlined"
            density="compact"
            v-model="article.date_created"
          ></v-date-input>

          <QuillEditor
            theme="snow"
            contentType="html"
            v-model:content="article.content"
          />
        </v-col>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          text="Save"
          variant="flat"
          color="secondary"
          class="pl-10 pr-10"
          @click="addArticle(1)"
        >
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <!-- edit article -->
  <v-dialog v-model="edit_article_model" max-width="500" persistent>
    <v-card :title="getUser.user_type_id == 3 ? 'Edit article' : 'you can only edit unpublished articles'">

      <v-card-text>
        <v-col
          cols="12"
        >
          <v-text-field
            density="compact"
            :placeholder="`${edit_article_data.image}`"
            prepend-inner-icon="mdi-image-area"
            variant="outlined"
            v-model="edit_article_data.image"
          ></v-text-field>

          <v-text-field
            density="compact"
            :placeholder="`${edit_article_data.title}`"
            prepend-inner-icon="mdi-domain"
            variant="outlined"
            v-model="edit_article_data.title"
          ></v-text-field>

          <v-text-field
            density="compact"
            :placeholder="`${edit_article_data.link}`"
            prepend-inner-icon="mdi-at"
            variant="outlined"
            v-model="edit_article_data.link"
          ></v-text-field>

          <v-date-input
            label="Date"
            prepend-icon=""
            prepend-inner-icon="$calendar"
            variant="outlined"
            density="compact"
            :placeholder="edit_article_data.date_created"
          ></v-date-input>
          <QuillEditor
            theme="snow"
            contentType="html"
            v-model:content="edit_article_data.content"
          />
        </v-col>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          text="Save"
          variant="flat"
          color="secondary"
          class="pl-10 pr-10"
          @click="saveArticle(1)"
        >
        </v-btn>
        <v-btn
          text="Publish"
          variant="flat"
          class="pl-10 pr-10"
          color="primary"
          v-if="getUser.user_type_id == 3"
          @click="publishArticle(2)"
        ></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import { mapState, mapActions } from 'pinia'
import { useUserStore } from '@/stores/user.js'
import { useDashboard } from '@/stores/dashboard';
import { VDateInput } from 'vuetify/labs/VDateInput'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
export default {
  components: {
    VDateInput,
    QuillEditor
  },
  data: () => ({
    drawer: false,
    group: null,
    tab: null,
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
      { title: 'Image', align: 'start', key: 'image' },
      { title: 'Title', align: 'start', key: 'title' },
      { title: 'Content', align: 'start', key: 'content' },
      { title: 'Link', align: 'start', key: 'link' },
      { title: 'Date', align: 'start', key: 'date_created' },
      { title: 'Writer Name', align: 'start', key: 'get_writer.name' },
      { title: 'Editor Name', align: 'start', key: 'get_editor.name' },
      { title: 'Article Status', align: 'start', key: 'get_article_status.name' },
      { title: '', key: 'edit' }
    ],
    edit_article_model: false,
    edit_article_data: {},
    add_article: false,
    article: {
      image: '',
      title: '',
      link: '',
      date_created: null,
      content: '',
      company_id: ''
    }
  }),
  computed: {
    ...mapState(useUserStore, {
      getUser:  'getUser'
    }),
    ...mapState(useDashboard, {
      getForEdit: 'getForEdit',
      getPublished: 'getPublished',
      getCompanies: 'getCompanies'
    })
  },
  async mounted() {
    await this.getArticlesAc()
    await this.getCompaniesAc()
  },
  methods: {
    ...mapActions(useDashboard, {
      getArticlesAc: 'getArticlesAc',
      saveArticleAc: 'saveArticle',
      publishArticleAc: 'publishArticle',
      getCompaniesAc: 'getCompaniesAc',
      saveWriteArticle: 'saveWriteArticle'
    }),
    ...mapActions(useUserStore, {
      snackBar: 'snackBar'
    }),
    itemProps (item) {
      return {
        title: item.name,
        value: item.id
      }
    },
    logout(){
      localStorage.clear();
      setTimeout(() => {
        // this.$router.push({path: '/'})
        window.location.reload(true)
      }, 2000);
    },
    editForEdit(item){
      this.edit_article_model = true
      this.edit_article_data = item
    },
    async saveArticle(article_status_id){
      let tp = {
        image:  this.edit_article_data.image,
        title: this.edit_article_data.title,
        link: this.edit_article_data.link,
        content: this.edit_article_data.content,
        company_id: this.edit_article_data.company_id,
        article_status_id: article_status_id
      }
      const save_article = await this.saveArticleAc(tp, this.edit_article_data.id)
      if(save_article.data.response){
        this.snackBar(true, save_article.data.message)
        this.edit_article_model = false
        this.edit_article_data = {}
        await this.getArticlesAc()
      }
    },
    async publishArticle(article_status_id){
      let tp = {
        image:  this.edit_article_data.image,
        title: this.edit_article_data.title,
        link: this.edit_article_data.link,
        content: this.edit_article_data.content,
        company_id: this.edit_article_data.company_id,
        article_status_id: article_status_id
      }
      const publish_article = await this.publishArticleAc(tp, this.edit_article_data.id)
      if(publish_article.data.response){
        this.snackBar(true, publish_article.data.message)
        this.edit_article_model = false
        this.edit_article_data = {}
        await this.getArticlesAc()
      }
    },
    async addArticle(){
      const save_article = await this.saveWriteArticle(this.article)
      if(save_article.data.response){
        this.snackBar(true, save_article.data.message)
        this.article = {}
        this.add_article = false
        await this.getArticlesAc()
        return
      }
      if(!save_article.response){
        this.snackBar(true, save_article.message)
        return
      }

    }
  },
  watch: {
    group () {
      this.drawer = false
    },
  },
}
</script>
