import './styles.scss';
import { movies } from './src/movies';
import { tns } from './node_modules/tiny-slider/src/tiny-slider';

const displayJackets = (arr, htmlEl) => {
  arr.forEach((item, index) => {
    if (item.img) {
      htmlEl.innerHTML += `
          <div class="movie" id="movie-${index}">
              <img src="images/${item.imdb}.jpg" />
          </div>
          `;
    } else {
      htmlEl.innerHTML += `
      <div class="no-bg-img movie" id="movie-${index}">
          <h3>${item.title}</h3>
      </div>
      `;
    }
  });
};

const compareNotesIncreasing = (a, b) => a.note - b.note;
const compareNotesDecreasing = (a, b) => b.note - a.note;

const genresList = [];
movies.forEach((item) => {
  item.genres.forEach((genre) => {
    if (!genresList.includes(genre.trim())) {
      genresList.push(genre);
    }
  });
});

const getRandomMovie = (arr) => {
  const randomIndex = Math.floor(Math.random() * arr.length);
  return arr[randomIndex];
};

// Slider
const mySlider = document.getElementById('slider');

const moviesInSlider = [];
for (let i = 0; i < 10; i++) {
  const randomMovie = getRandomMovie(movies);
  if (randomMovie.img) {
    moviesInSlider.push(`
      <div class="slider-item movie" id="slider-movie-${i}">
        <img src="images/${randomMovie.imdb}.jpg" />
      </div>
  `);
  } else {
    moviesInSlider.push(`
      <div class="slider-item slider-item-no-img movie" id="slider-movie-${i}">
        <h3>${randomMovie.title}</h3>
      </div>
  `);
  }
}
moviesInSlider.forEach((jacketMovie) => {
  mySlider.innerHTML += jacketMovie;
});

/* -- RENDERING -- */
const render = (arr, selectedGenre, selectedNoteFilter) => {
  const app = document.getElementById('section-app');

  // Button to display only recent movies
  let btns = `
    <div class="btns-container">
      <button class="btn-recent" id="btn-recent">recent only</button>
      <div class="select-container">
        <label for="genre-filter">Sort by genre :</label>
        <select class="genre-filter" id="genre-filter">`;
    // Options of the sort by genre select
  if (selectedGenre === '_all') {
    btns += `
        <option value="_all" selected>See All</option>
      `;
  } else {
    btns += `
        <option value="_all">See All</option>
      `;
  }
  genresList.forEach((genre) => {
    if (genre === selectedGenre) {
      btns += `
          <option value="${genre}" id="option-${genre}" selected>${genre}</option>
        `;
    } else {
      btns += `
          <option value="${genre}" id="option-${genre}">${genre}</option>
        `;
    }
  });

  btns += `
        </select>
      </div>
        <div class="select-container">
          <label for="note-filter">Sort by note :</label>
          <select class="note-filter" id="note-filter">`;
  if (selectedNoteFilter === '_none') {
    btns += `
        <option value="_none" selected>Not sorted</option>
      `;
  } else {
    btns += `
        <option value="_none">Not sorted</option>
      `;
  }
  if (selectedNoteFilter === 'decreasing') {
    btns += `
        <option value="decreasing" selected>decreasing</option>
      `;
  } else {
    btns += `
        <option value="decreasing">decreasing</option>
      `;
  }
  if (selectedNoteFilter === 'increasing') {
    btns += `
        <option value="increasing" selected>increasing</option>
      `;
  } else {
    btns += `
        <option value="increasing">increasing</option>
      `;
  }
  btns += `
          </select>
        </div>
      </div>
    `;
  app.innerHTML = `
      ${btns}
      <section class="movies" id="movies">
    `;

  // Displays the jackets
  const sectionMovies = document.getElementById('movies');
  displayJackets(arr, sectionMovies);

  app.innerHTML += '</section>';
  // Create the modal's container
  const popup = `
    <div class="modal">
        <div class="modal-content"></div>
    </div>
  `;
  app.innerHTML += popup;

  /* -- EVENTS -- */
  // MODAL
  const jackets = document.querySelectorAll('.movie');
  jackets.forEach((jacket) => {
    jacket.addEventListener('click', (e) => {
      // Find Id of the movie via the jacket id attribute
      const attrId = e.currentTarget.id;
      const movieId = Number(attrId.split('-')[1]);

      // Change the array of the genres property in an string
      const genres = arr[movieId].genres.join(', ');

      // Get the container of the modal content
      const modalContent = document.querySelector('.modal-content');
      // Add content to the modal
      modalContent.innerHTML = `
        <i class="fa fa-times close-icon" aria-hidden="true"></i>
        <h2 class="modal-title">${arr[movieId].title}</h2>
        <ul>
            <li>
                <span class="modal-element">Genres :</span>
                <p class="modal-element-data">${genres}</p>
            </li>
            <li>
              <span class="modal-element">Year :</span>
              <p class="modal-element-data">${arr[movieId].year}</p>
            </li>
            <li>
              <span class="modal-element">Note :</span>
              <p class="modal-element-data">${arr[movieId].note}/10</p>
            </li>
            <li>
              <span class="modal-element">Plot :</span>
              <p class="modal-element-data">${arr[movieId].plot}</p>
            </li>
        </ul>
        `;
      // Get the (all) modal
      const modal = document.querySelector('.modal');
      // Make it visible
      modal.style.display = 'block';

      // Get the close icon
      const closeIcon = document.querySelector('.close-icon');
      closeIcon.addEventListener('click', () => {
        // Hide the modal
        modal.style.display = 'none';
      });
    });
  });

  // Btn & select element
  const btnRecent = document.getElementById('btn-recent');
  const genresFilter = document.getElementById('genre-filter');
  const noteFilter = document.getElementById('note-filter');

  // Recent btn
  btnRecent.addEventListener('click', () => {
    const yearSort = (item) => {
      if (item.year >= 2000) {
        return item;
      }
    };
    const recentMovies = arr.filter(yearSort);
    render(recentMovies, genresFilter.value, noteFilter.value);
  });

  // Genres filter
  genresFilter.addEventListener('change', () => {
    const genreSelected = genresFilter.value;
    if (genresList.includes(genreSelected)) {
      const genreSort = (item) => item.genres.includes(genreSelected);
      const moviesSorted = movies.filter(genreSort);
      render(moviesSorted, genreSelected, noteFilter.value);
    } else {
      render(movies, '_all', noteFilter.value);
    }
  });

  // Note filter
  noteFilter.addEventListener('change', () => {
    // Value of the select to sort by note
    const noteFilterSelected = noteFilter.value;
    // To keep the genre selected actif
    const genreSelected = genresFilter.value;
    const genreSort = (item) => item.genres.includes(genreSelected);
    const moviesSorted = movies.filter(genreSort);

    let moviesSortedByNote;
    // Check if there's a genre selected
    // If there's one, the sort by note will be done on the list filtered by genre
    if (genreSelected !== '_all') {
      if (noteFilterSelected === 'increasing') {
        moviesSortedByNote = moviesSorted.sort(compareNotesIncreasing);
        render(moviesSortedByNote, genreSelected, noteFilterSelected);
      } else if (noteFilterSelected === 'decreasing') {
        moviesSortedByNote = moviesSorted.sort(compareNotesDecreasing);
        render(moviesSortedByNote, genreSelected, noteFilterSelected);
      } else {
        render(movies, genreSelected, noteFilterSelected);
      }
    } else if (noteFilterSelected === 'increasing') {
      moviesSortedByNote = movies.sort(compareNotesIncreasing);
      render(moviesSortedByNote, genreSelected, noteFilterSelected);
    } else if (noteFilterSelected === 'decreasing') {
      moviesSortedByNote = movies.sort(compareNotesDecreasing);
      render(moviesSortedByNote, genreSelected, noteFilterSelected);
    } else {
      render(movies, genreSelected, noteFilterSelected);
    }
  });
};
render(movies, '_all', '_none');

const slider = tns({
  container: '.my-slider',
  mode: 'gallery',
  autoplay: true,
  controls: false,
  nav: false,
  autoplayButtonOutput: false,
  loop: true,
  autoplayTimeout: 5500,
  speed: 700,
  slideBy: 1,
  items: 3,
  gutter: 5,
});
