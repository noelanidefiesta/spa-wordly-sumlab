const form = document.getElementById('word-form');
const input = document.getElementById('word-input');
const title = document.getElementById('word-title');
const audio = document.getElementById('word-audio');
const definitionDiv = document.getElementById('word-definition');
const synonymsDiv = document.getElementById('word-synonyms');
const errorMessage = document.getElementById('error-message');

form.addEventListener('submit', (e) => {
    e.preventDefault();

    const word = input.value.trim();
    clearResults();

    if (word === '') {
        showError('Please enter a word!');
        return;
    }

    fetchWordData(word);
});

// fetch function using async/await
async function fetchWordData(word) {
    try {
        const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
        if (!response.ok) {
            throw new Error('Word not found.');
        }
        const data = await response.json();
        updateDOM(data[0]); // send the first result to the DOM handler
    } catch (error) {
        showError(error.message);
    }
}

// the DOM updates
function updateDOM(data) {
    title.textContent = data.word;

    // Pronunciation audio
    const audioUrl = data.phonetics.find(p => p.audio)?.audio;
    if (audioUrl) {
        audio.src = audioUrl;
        audio.hidden = false;
    }

    const meaning = data.meanings[0];
    const def = meaning.definitions[0];

    definitionDiv.innerHTML = `
    <p><strong>Part of Speech:</strong> ${meaning.partOfSpeech}</p>
    <p><strong>Definition:</strong> ${def.definition}</p>
    <p><strong>Example:</strong> ${def.example || 'No example available.'}</p>
  `;

    if (meaning.synonyms.length > 0) {
        synonymsDiv.innerHTML = `<p><strong>Synonyms:</strong> ${meaning.synonyms.join(', ')}</p>`;
    }
}

// show error messages
function showError(msg) {
    errorMessage.textContent = msg;
    errorMessage.classList.remove('hidden');
}

// clear previous search results
function clearResults() {
    title.textContent = '';
    audio.src = '';
    audio.hidden = true;
    definitionDiv.innerHTML = '';
    synonymsDiv.innerHTML = '';
    errorMessage.classList.add('hidden');
}
