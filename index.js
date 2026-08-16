let currentMovies = [];

document.getElementById('search-form').addEventListener('submit', async function(event) {
  event.preventDefault();

  const query = document.getElementById('search-input').value.trim();

  loadingSpinner.classList.remove('hidden');
  document.getElementById('displayResults').innerHTML = '';

  try {
    const results = await fetchData(query);
    currentMovies = results
      ? await Promise.all(results.map(item => fetchMovieDetails(item.imdbID)))
      : [];
    await new Promise(resolve => setTimeout(resolve, 800));
    displayResults(currentMovies);
        filterContainer.classList.remove('hidden');
  } finally {
    loadingSpinner.classList.add('hidden');
  }
});
document.getElementById('sort-select').addEventListener('change', (event) => {
  const sortValue = event.target.value;
  const sorted = [...currentMovies];

  if (sortValue === 'year-desc') sorted.sort((a, b) => parseInt(b.Year) - parseInt(a.Year));
  if (sortValue === 'year-asc') sorted.sort((a, b) => parseInt(a.Year) - parseInt(b.Year));
  if (sortValue === 'rating-desc') sorted.sort((a, b) => parseFloat(b.imdbRating) - parseFloat(a.imdbRating));
  if (sortValue === 'rating-asc') sorted.sort((a, b) => parseFloat(a.imdbRating) - parseFloat(b.imdbRating));

  displayResults(sorted);
});
const modalOverlay = document.getElementById('modal__overlay');
const modalDetails = document.getElementById('modal__details');
const loadingSpinner = document.getElementById('loading__spinner');
const filterContainer = document.getElementById('filter__container');
const modalCloseBtn = document.getElementById('modal__close-btn');

  

modalCloseBtn.addEventListener('click', () => {
  modalOverlay.classList.add('hidden');
});

function displayResults(results) {
    const displayResults = document.getElementById('displayResults');
    displayResults.innerHTML = ''; // Clear previous results

    if (results) {
        results.forEach(item => {
            const div = document.createElement('div');
            div.classList.add('movie__card');
           
           div.addEventListener('click', async () => {
            const movie = await fetchMovieDetails(item.imdbID);
          modalDetails.innerHTML = `
            <img src="${movie.Poster}" alt="${movie.Title}">
            ${Object.entries(movie)
                .filter(([key]) => !['Response', 'imdbID', 'Poster', 'Ratings'].includes(key))
                .map(([key, value]) => `<p><strong>${key}:</strong> ${value}</p>`)
                .join('')}`;
          
            modalOverlay.classList.remove('hidden');
            modalDetails.scrollTop = 0
            });
          

             div.innerHTML = `<h3>${item.Title}</h3><p>${item.Year}</p> <img src="${item.Poster}" alt="${item.Title}">`;
            displayResults.appendChild(div);
            
        });
    } else {
        displayResults.innerHTML = '<p>No results found.</p>';
    }
}
async function fetchData(query) {
    const response = await fetch(`https://www.omdbapi.com/?s=${query}&apikey=4566be5d&`);
    const data = await response.json();
    return data.Search;
}

async function fetchMovieDetails(imdbID) {
    const response = await fetch(`https://www.omdbapi.com/?i=${imdbID}&apikey=4566be5d&`);
    const data = await response.json();
    return data
}

async function fetchMovieDetails(imdbID) {
    const response = await fetch(`https://www.omdbapi.com/?i=${imdbID}&apikey=4566be5d&`);
    const data = await response.json();
    return data
}


