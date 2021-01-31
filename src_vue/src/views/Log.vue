<template>
  <v-container>
    <v-card>
      <v-card-title>
        和歌別正解率
        <v-spacer></v-spacer>
      </v-card-title>


      <v-data-table
        :headers="headers"
        :items="logs"
        :sort-by.sync="sortBy"
        :sort-desc.sync="sortDesc"
      >
      </v-data-table>
    </v-card>
  </v-container>
</template>

<script>
  import { mapGetters, mapState } from 'vuex'

  export default {
    data () {
      return {
        headers: [
          { text: 'ID', value: 'waka_id' },
          { text: '和歌', value: 'waka_all' },
          { text: '正解率', value: 'rate' },
        ],
        sortBy: "rate",
        sortDesc: false,
      }
    },

    watch: {
    },

    mounted() {
    },
    computed: {
        ...mapState({
          logs: state => {
            return Object.values(state.question_sets.answerLogs)
              .map(log => {
                log.rate = log.correct_count / log.total_count
                log.waka_all = log.kamino_ku + " " + log.shimono_ku
                return log
              })
          },
        })
    },
    methods: {
    }
  }
</script>
