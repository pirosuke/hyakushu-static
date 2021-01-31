export default {
    async generateQuestionList(wakas, answerLogs, questionNum) {
        const shuffleArray = arr => arr.sort(() => Math.random() - 0.5)
        const shuffledWakas = shuffleArray(wakas)
        const questionWakas = shuffledWakas.slice(0, questionNum)

        let questionList = questionWakas
            .map(waka => {
                const answerWakas = shuffleArray(wakas)
                let answerChoices = answerWakas
                    .filter(answerWaka => waka.shimono_ku !== answerWaka.shimono_ku)
                    .slice(0, 3)
                    .map(answerWaka => answerWaka.shimono_ku)
                answerChoices.push(waka.shimono_ku)
                return {
                    waka,
                    answer_choices: shuffleArray(answerChoices),
                }
            })

        return questionList
    },
}