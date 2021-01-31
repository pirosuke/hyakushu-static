<template>
  <v-app>

    <v-navigation-drawer
      app
    >
      <v-list dense>
        <v-list-item link @click="$router.push({path: `/Trial`})">
          <v-list-item-action>
            <v-icon>mdi-plus</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>特訓開始</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link @click="$router.push({path: `/Log`})">
          <v-list-item-action>
            <v-icon>mdi-view-list</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>正解率を確認</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link @click="saveLog">
          <v-list-item-action>
            <v-icon>mdi-download</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>履歴を保存 <span v-if="$store.state.question_sets.isEditedAfterSave">(*未保存)</span></v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item>
          <v-list-item-action>
            <v-icon>mdi-upload</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>
              <label>
                履歴を読込
                <input ref="file" class="file-button" type="file" @change="loadLog" />
              </label>
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <v-spacer></v-spacer>
      <v-list dense>
        <v-list-item link href="https://github.com/pirosuke/hyakushu-static" target="_blank">
          <v-list-item-action>
            <v-icon>mdi-github</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>ソースはこちら</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar
      app
      color="indigo"
      dark
    >
      <v-toolbar-title class="headline">
        <span>百人一首特訓ツール</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
    </v-app-bar>

    <v-main>
      <v-container fluid class="fill-height">
        <v-layout row>
          <v-flex grow pa-1>
            <router-view/>
          </v-flex>
        </v-layout>
      </v-container>
    </v-main>
    <v-footer
      color="indigo"
      app
    >
      <span class="white--text">&copy; 2021</span>
    </v-footer>
  </v-app>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import { saveAs } from "file-saver"
import moment from 'moment'
moment.locale("ja")

export default {
  name: 'App',
  components: {
  },
  data () {
    return {
    }
  },
  computed: {
    ...mapState({
    })
  },

  created () {
    window.addEventListener("beforeunload", this.confirmSave)
  },

  destroyed () {
    window.removeEventListener("beforeunload", this.confirmSave)
  },

  methods: {
    
    confirmSave (event) {
      if (this.$store.state.question_sets.isEditedAfterSave) {
        event.returnValue = "履歴を保存せずにページを離れようとしています。このまま移動しますか？"
        return "履歴を保存せずにページを離れようとしています。このまま移動しますか？"
      }
    },

    saveLog () {
      const blob = new Blob([JSON.stringify(this.$store.state.question_sets.answerLogs)], {
        type: "application/json"
      })

      const ts = moment(new Date()).format("YYYYMMDD_HHmmss")

      saveAs(blob, "answer_log_" + ts + ".json")
      this.$store.commit("question_sets/updateEditedStatus", {
        isEdited: false
      })
    },

    async loadLog (event) {
      const files = event.target.files || event.dataTransfer.files
      const file = files[0]

      if (!this.checkFile(file)) {
        alert("ファイルを読み込めませんでした")
        return
      }

      const logData = await this.getFileData(file)

      this.$store.commit("question_sets/setAnswerLogs", JSON.parse(logData))
    },

    getFileData(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsText(file)
        reader.onload = () => resolve(reader.result)
        reader.onerror = error => reject(error)
      })
    },

    checkFile(file) {
      if (!file) {
        return false
      }

      if (file.type !== 'application/json') {
        return false
      }

      const SIZE_LIMIT = 5000000 // 5MB
      if (file.size > SIZE_LIMIT) {
        return false
      }
      return true
    }
  },
}
</script>
