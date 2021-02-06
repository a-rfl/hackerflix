import './styles.scss';
import { movies } from './src/movies';

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

/* -- RENDERING -- */
const render = (arr, selectedGenre, selectedNoteFilter) => {
  const app = document.getElementById('app');
  app.innerHTML = `
    <h1>hackerflix</h1>
  `;

  // Carousel
  let slider = '<div class="slider">';
  for (let i = 0; i < 10; i++) {
    const randomMovie = getRandomMovie(movies);
    if (randomMovie.img) {
      slider += `
        <div class="slider-item movie" id="slider-movie-${i}">
          <img src="images/${randomMovie.imdb}.jpg" />
        </div>
    `;
    } else {
      slider += `
        <div class="no-bg-img slider-item movie" id="slider-movie-${i}">
          <h3>${randomMovie.title}</h3>
        </div>
    `;
    }
  }
  slider += '</div>';
  app.innerHTML += slider;

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
  app.innerHTML += `
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

  // Recent btn
  const btnRecent = document.getElementById('btn-recent');
  btnRecent.addEventListener('click', () => {
    const yearSort = (item) => {
      if (item.year >= 2000) {
        return item;
      }
    };
    const recentMovies = arr.filter(yearSort);
    render(recentMovies);
  });

  // Genres filter
  const genresFilter = document.getElementById('genre-filter');
  genresFilter.addEventListener('change', () => {
    const genreSelected = genresFilter.value;
    if (genresList.includes(genreSelected)) {
      const genreSort = (item) => item.genres.includes(genreSelected);
      const moviesSorted = movies.filter(genreSort);
      render(moviesSorted, genreSelected);
    } else {
      render(movies);
    }
  });

  // Note filter
  const noteFilter = document.getElementById('note-filter');
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

  // Slider function
  const sliderAction = () => {
    const visibleMovies = [];
    const sliderItems = document.querySelectorAll('.slider-item');
    sliderItems.forEach((item) => {
      const id = item.id.split('-')[2];
      if (id < 3) {
        item.classList.add('show');
        visibleMovies.push(item);
      }
    });
    let newMovieIndex = 0;
    setInterval(() => {
      visibleMovies.forEach((movie, index) => {
        const id = Number(movie.id.split('-')[2]);
        if (id < sliderItems.length - 1) {
          newMovieIndex = id + 1;
        } else if (id === sliderItems.length - 1) {
          newMovieIndex = 0;
        }
        movie.classList.remove('show');
        visibleMovies[index] = sliderItems[newMovieIndex];
      });
      visibleMovies.forEach((movie) => {
        movie.classList.add('show');
      });
    }, 6000);
  };
  sliderAction();
};
render(movies, '_all', '_none');
