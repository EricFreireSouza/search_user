<template>
  <div>
    <b-row class="top">
      <b-col class="wdt-count">
        <b-link @click="getCount('repos_view', user.repos_url)" class="cursor">
          <span class="tit01">Repositórios</span>
          <span class="count">{{ getNumber(user.public_repos) }}</span>
        </b-link>
      </b-col>
      <b-col class="wdt-count">
        <span class="tit01">Seguidores</span>
        <span class="count">{{ getNumber(user.followers) }}</span>
      </b-col>
      <b-col class="wdt-count">
        <span class="tit01">Seguindo</span>
        <span class="count">{{ getNumber(user.following) }}</span>
      </b-col>
    </b-row>

    <b-row class="descriptionBox">
      <b-col md="4" class="user">
        <h4>Usuario:</h4>
        <b-link :href="user.html_url" target="_blank"><img :src="user.avatar_url" :alt="user.name" :title="user.name" class="avatar" /></b-link>
        <p class="userName"><b-link @click="getCount('user_view', null)">{{ user.name }}</b-link></p>
        <p>@{{ user.login }}</p>
      </b-col>
      <b-col v-if="current_view === 'user_view'" md="8" class="userInfo">
        <h4>Informações:</h4>
        <ul class="list">
          <li v-if="user.bio"><strong>Biodata:</strong> {{ user.bio }}</li>
          <li v-if="user.company"><strong>Empresa:</strong> {{ user.company }}</li>
          <li v-if="user.location"><strong>Localização:</strong> {{ user.location }}</li>
          <li v-if="user.email"><strong>E-Mail:</strong> {{ user.email }}</li>
          <li v-if="user.blog"><strong>Blog:</strong> {{ user.blog }}</li>
          <li><strong>Membro desde:</strong> {{ new Date(user.created_at).toLocaleDateString() }}</li>
        </ul>
      </b-col>

      <b-col v-if="current_view === 'repos_view'" md="4" class="userRepos">
        <div v-if="cache.repos.length > 0" class="listRepo">
          <h4>Repositórios:</h4>
          <b-form-input v-model="repos_filter" id="repos-filter" type="text" class="search" placeholder="Buscar"></b-form-input>
          <ul class="list">
            <li v-for="repo in filter" :key="repo.id">
              <b-link @click="moreRepos(repo.id)" class="cursor" :class="{ active: repo.id === cache.repos_id && cache.repos_more_view }">&raquo; {{ repo.name }}</b-link></li>
          </ul>
          <p>Exibindo {{ filter.length }} de {{ totalRepos }} Repositórios</p>
          <button v-if="cache.repos.length < user.public_repos" @click="loadMoreRepos()" class="btn btn-primary">Carregar mais</button>
        </div>
      </b-col>

      <b-col v-if="current_view === 'repos_view'" md="4" class="userReposDescription">
        <div v-if="cache.repos_more_view" class="descriptionRepos">
          <h4>Descrição:</h4>
          <ul class="list">
            <li class="title" :title="cache.repos[cache.repos_index].name" >{{ cache.repos[cache.repos_index].name }}</li>
            <li><b-link :href="cache.repos[cache.repos_index].html_url" :title="cache.repos[cache.repos_index].id" target="_blank">&raquo; Github Page</b-link></li>
            <li v-if="cache.repos[cache.repos_index].homepage"><b-link :href="cache.repos[cache.repos_index].homepage" target="_blank">&raquo; Home Page</b-link></li>
            <li><b>Linguagem:</b> {{ cache.repos[cache.repos_index].language }}</li>
            <li><b>Estrelas:</b> {{ cache.repos[cache.repos_index].stargazers_count }}</li>
          </ul>
        </div>
      </b-col>
    </b-row>
  </div>
</template>

<script>

export default {
  name: 'UserList',
  props: {
    user: Object,
    userID: String,
    userAgent: String
  },
  data: () => ({
    current_view: 'user_view',
    isActive: false,
    repos_filter: '',
    cache: {
      repos: {},
      repos_more: {},
      repos_index: 0,
      repos_id: 0,
      repos_page: 1,
      repos_more_view: false
    },
    call: {
      repos: {}
    }
  }),
  computed: {
    totalRepos () {
      return this.user.public_repos
    },
    filter () {
      return this.cache.repos.filter(repo => {
        return (~repo.name.toLowerCase().indexOf(this.repos_filter.toLowerCase()) ? true : false)
      })
    }
  },
  methods: {
    getNumber (num, digits = 1) {
      let si = [
          {value: 1E18},
          {value: 1E15},
          {value: 1E12},
          {value: 1E9},
          {value: 1E6},
          {value: 1E3},
          {value: 1E0}
        ],
        rx = /\.0+$|(\.[0-9]*[1-9])0+$/
      for (let i = 0; i < si.length; i++) {
        if (num >= si[i].value) {
          return (num / si[i].value).toFixed(digits).replace(rx, '$1')
        }
      }
      return num.toFixed(digits).replace(rx, '$1')
    },
    getCount (type, url) {
      this.current_view = type
      if ((!url) || (url === this.call.repos)) {
        return
      }
      this.$http.get(url + '?clientID=' + this.userID + '&clientAgent=' + this.userAgent + '&page=' + this.cache.repos_page)
        .then((res) => {
          const result = res.body
          if (type) {
            this.cache.repos = result
          } else {
            console.log('ERROR', type)
          }
          return result
        })
        .catch((error) => {
          console.log('Catch', error)
        })
    },
    moreRepos (id) {
      if (this.cache.repos_id !== id) {
        this.cache.repos_more_view = true
        this.cache.repos_id = id
        this.cache.repos_index = this.cache.repos.findIndex(repo => repo.id === id)
      } else {
        this.cache.repos_more_view = !this.cache.repos_more_view
      }
    },
    loadMoreRepos () {
      this.cache.repos_page = this.cache.repos_page + 1
      this.getCount('repos_view', this.user.repos_url)
    }
  }
}
</script>

<style scoped>
  a {
    color: #007bff !important;
    cursor: pointer;
  }
  a:hover {
    text-decoration: none;
  }
  a.active {
    color: #222 !important;
  }
  ul {
    list-style: none;
    padding: 0;
  }
  .top {
    border-bottom: solid 1px #d1d5da;
    margin: 0 0 15px;
    padding: 0 0 15px;
  }
  .wdt-count .tit01 {
    display: block;
    font-weight: bold;
    margin: 0 0 1rem;
  }
  .wdt-count a {
    display: block;
  }
  .wdt-count .count {
    background: #d1d5da;
    border-radius: 3px;
    display: inline-block;
    font-weight: bold;
    line-height: 1.2;
    min-width: 30px;
    padding: 5px;
  }
  .user .avatar {
    border: solid 2px #007bff;
    height: 115px;
    margin: 0 0 15px;
    padding: 3px;
    width: 115px;
  }
  .user .userName {
    font-size: 1.7rem;
    margin-bottom: 0.5rem;
    font-family: inherit;
    font-weight: 500;
    line-height: 1.2;
  }
  .userInfo, .userRepos {
    text-align: left;
  }
  .listRepo .search {
    margin: 0 0 10px;
  }
  .userReposDescription .title {
    text-transform: uppercase;
    white-space: nowrap;
    width: 100%;
    overflow: hidden;
    text-decoration: underline;
    text-overflow: ellipsis;
  }
</style>