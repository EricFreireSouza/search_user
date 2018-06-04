<template>
 <b-col md="4" class="user">
    <h4>Usuario:</h4>
    <b-link :href="user.html_url" target="_blank"><img :src="user.avatar_url" :alt="user.name" :title="user.id" class="avatar" /></b-link>
    <p class="userName"><b-link @click="getCount('user_view', null)" class="cursor">{{ user.name || 'Unknown' }}</b-link></p>
    <p>@{{ user.login }}</p>
    <p>{{ user.email }}</p>
  </b-col>
</template>

<script>
export default {
  name: 'User',
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