import QuestionSetAPI from "../../api/question_sets"
import wakas from "../../assets/wakas.json"

export default {
    namespaced: true,
    state: {
        questionNumPerTrial: 10,
        questionList: [],
        answerLogs: {},
        wakas: wakas,
        isEditedAfterSave: false,
    },
    mutations: {
        setQuestionList(state, payload) {
            state.questionList = payload.questionList;
        },
        addAnswerLog(state, payload) {
            if (!state.answerLogs.hasOwnProperty(payload.waka.waka_id)) {
                state.answerLogs[payload.waka.waka_id] = {
                    waka_id: payload.waka.waka_id,
                    kamino_ku: payload.waka.kamino_ku,
                    shimono_ku: payload.waka.shimono_ku,
                    total_count: 0,
                    correct_count: 0,
                }
            }

            state.answerLogs[payload.waka.waka_id].total_count += 1
            if (payload.answered_correctly) {
                state.answerLogs[payload.waka.waka_id].correct_count += 1
            }
        },
        setAnswerLogs(state, payload) {
            state.answerLogs = payload
        },
        updateEditedStatus(state, payload) {
            state.isEditedAfterSave = payload.isEdited
        },
    },
    actions: {
        async generateQuestionSet(context, payload) {
            const questionList = await QuestionSetAPI.generateQuestionList(context.state.wakas, context.state.answerLogs, context.state.questionNumPerTrial)
            context.commit("setQuestionList", {
                questionList,
            })
        },

        async addAnswerLog(context, payload) {
            context.commit("addAnswerLog", {
                waka: payload.waka,
                answered_correctly: payload.answered_correctly,
            })
        }
    },
}