const result = document.getElementById('result')
const BASE_URL = 'https://api.dictionaryapi.dev/api/v2/entries/en'

async function fetchWord(word, event) {
    if (event.key === 'Enter') {
        result.innerHTML = "<div class='loading'> Searching... </div>"
        if (!word) {
            result.innerHTML = "<p>Please enter a word to search.</p>"
            return
        }

        try {
            const response = await fetch(`${BASE_URL}/${word.trim()}`)
            const data = await response.json()

            if(data?.title){
                result.innerHTML = `<p>No definitions found for word : ${word}.</p>`
                return
            }

            result.innerHTML = ''
            if(data.length > 0){
                data.forEach(item => {
                    displayData(item)
                })
            }
        } catch (e) {
            result.innerHTML = `<p>An error occurred while fetching the word</p>`
            console.log(e);
            
        }
    }
}


function displayData(data) {
    const phonotic = data?.phonetic ? `<p> Phonetic : <em> ${data?.phonetic}</em>` : ''
    const word = data?.word ? `<p> Word :  ${data?.word}` : ''

    const phoneticHTML = data?.phonetics?.map(item => (
        `   
            <div class="phonetics">
                <span>${item?.text}</span>
                ${item?.audio ? `<span class="audio" onclick="playAudio('${item?.audio}')"> 
                    <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 9H5a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h6m0-6v6m0-6 5.419-3.87A1 1 0 0 1 18 5.942v12.114a1 1 0 0 1-1.581.814L11 15m7 0a3 3 0 0 0 0-6M6 15h3v5H6v-5Z"/>
                    </svg>

                </span>` : ''} 
            </div>
        `
    )).join(' ')

    const meaningHTML = data?.meanings?.map(item => (
        `
            <div class="meaning"> 
                <div class="part-of-speech"> ${item?.partOfSpeech}</div>
                ${item?.definitions?.map(def => (
            `
                        <div class="definition"> - ${def.definition}</div>
                        ${def.example ? `<div class="example">${def.example}</div>` : ''}
                    `
        )).join(' ')}
            </div>
        `
    )).join('')

    result.innerHTML += `
        <div class="word-info">
            <h2>${word}</h2>
            ${phonotic}
            ${phoneticHTML}
        </div>
        ${meaningHTML}
    `
}

function playAudio(url) {
    const audio = new Audio(url)
    audio.play()
}