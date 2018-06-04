<template>
  <b-container fluid class="bv-example-row">
    <b-row>
      <b-col md="4" class="searchBox">
        <div class="searchbox">
          <h1>Busca de Usuário GitHub</h1>
          <b-form-input id="searchbox" class="txt" type="text" @keyup.enter.native="getUserData(usName)" v-model="usName" placeholder="Digite: usuário1, usuário2, usuário3" autofocus="true"></b-form-input>
          <b-button @click="getUserData(usName)" v-bind:disabled="usName == ''" class="btn btn-warning">Buscar</b-button>
        </div>
      </b-col>

      <b-col md="8" class="content">
        <div class="userBox" v-for="user in users" :key="user.id">
          <UserList :user=user  v-if="user.id" />
        </div>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import UserList from './UserList.vue'

export default {
  name: 'SearchBox',
  components: {
    UserList
  },

  data () {
    return {
      usName: '',
      users: [],
      userID: 'fake',
      UserAgent: 'fake',
      on: false,
    }
  },

  methods: {
    idUsers () {
      return this.usName.split(',')
    },

    getUserData (id) {
      this.users = []
      const idUsers = this.idUsers()
      idUsers.forEach(id => {
        this.$http.get('https://api.github.com/users/' + id + '?clientID=' + this.userID + '&clientAgent=' + this.UserAgent)
          .then((response) => {
            this.text = response.status
            return response
          })
          .then((res) => {
            const result = res.body
            this.users.push(result)
            this.on = true
            return result
          })
          .catch((error) => {
            this.text = error.status
          })
      })
    }
  }
}
</script>

<style scoped>
  .searchBox {
    background-color: #d1d5da;
    height: 50vh;
    padding-top: 20px;
  }
  .searchBox .txt {
    margin-bottom: 15px;
  }
  .content {
    padding-top: 20px;
  }
  .userBox {
    background-color: white;
    border: solid 1px #d1d5da ;
    border-radius: 3px;
    color: #333;
    margin: 0 0 15px;
    padding: 10px;
    width: 100%;
  }
  .userBox:first-chuld {
    margin: 0;
  }
</style>