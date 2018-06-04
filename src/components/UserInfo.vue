<template>
  <b-col md="8" class="userInfo" v-if="current_view === 'user_view'">
    <h4>Informações:</h4>
    <ul class="list">
      <li v-if="user.email"><strong>E-Mail:</strong> {{ user.email }}</li>
      <li v-if="user.company"><strong>Empresa:</strong> {{ user.company }}</li>
      <li v-if="user.blog"><strong>Blog:</strong> {{ user.blog }}</li>
      <li v-if="user.location"><strong>Localização:</strong> {{ user.location }}</li>
      <li v-if="user.bio"><strong>Biodata:</strong> {{ user.bio }}</li>
      <li><strong>Membro desde:</strong> {{ new Date(user.created_at).toLocaleDateString() }}</li>
    </ul>
  </b-col>
</template>

<script>
export default {
  name: 'UserInfo',
  props: {
    user: Object,
    userID: String,
    userAgent: String
  },
  data: () => ({
    current_view: "user_view",
    isActive: false,
    repos_filter: '',
    last_call: {
      repos: {},
      //followers: {},
      //following: {}
    },
    cache: {
      repos: {},
      repos_more: {},
      repos_index: 0,
      repos_id: 0,
      repos_page: 1,
      repos_more_view: false,
      //followers: {},
      //following: {}
    },
  }),
  computed: {
    filteredRepos () {
      return this.cache.repos.filter(repo => {
        return (~repo.name.toLowerCase().indexOf(this.repos_filter.toLowerCase()) ? true : false)
      })
    },
    totalReposPage () {
      return this.user.public_repos
    },
  },
  methods: {
    totalStars (result) {
      return result.sort((a, b) => {
        return b.stargazers_count - a.stargazers_count 
      })
    },
    formatNumber (num, digits = 1) {
      let si = [
        { value: 1E18, symbol: 'E' },
        { value: 1E15, symbol: 'P' },
        { value: 1E12, symbol: 'T' },
        { value: 1E9,  symbol: 'G' },
        { value: 1E6,  symbol: 'M' },
        { value: 1E3,  symbol: 'K' },
        { value: 1E0,  symbol: ''  }
      ], 
      rx = /\.0+$|(\.[0-9]*[1-9])0+$/, i;
      for (let i = 0; i < si.length; i++) {
        if (num >= si[i].value) {
          return (num / si[i].value).toFixed(digits).replace(rx, '$1') /*+ si[i].symbol*/;
        }
      }
      return num.toFixed(digits).replace(rx, '$1');
    },
    getCount (type, url) {
      this.current_view = type
        if ((!url) || (url === this.last_call.repos)/* || (url === this.last_call.followers) || (url === this.last_call.following)*/)
          return
       
      //this.cache.repos = {}
      
      this.$http.get(url + '?client_id=' + this.userID + '&client_secret=' + this.userAgent)
        .then((res) => {
          const result = res.body
          if(type) {
            this.cache.repos = result
          } else {
            console.log('SWITCH ERROR' , type)
          }
          /*switch (type) {
            case 'followers':
              this.followers = result.length
              break
            case 'following':
              this.following = result.length
              break
            case 'repos_view':
              this.cache.repos = result
              this.last_call.repos = url
              break
            default:
              console.log('SWITCH ERROR' , type)
          }*/
          return result
        })
        /*.catch((error) => {
          console.log('Catch', error)
        })*/
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
</style>