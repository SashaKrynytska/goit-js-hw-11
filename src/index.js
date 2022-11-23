import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import API from './js/api-servise';
import { createMarkup } from './js/markup';

const refs = {
  searchForm: document.querySelector('#search-form'),
  imagesContainer: document.querySelector('.gallery'),
  btn: document.querySelector('.btn'),
};

const lightbox = new SimpleLightbox('.gallery a', {
  docClose: true,
  captionsData: 'alt',
  captionDelay: 250,
});

let apiService;
let page;
let totalGallery;
refs.searchForm.addEventListener('submit', onSearch);

function onSearch(e) {
  e.preventDefault();
  apiService = e.target.elements.searchQuery.value;
  console.log(apiService);
  page = 1;
  API.getData(apiService, page).then(response => {
    if (
      response.data.hits.length === 0 ||
      !apiService ||
      apiService.charAt(0) === ' '
    ) {
      return Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    } else {
      Notiflix.Notify.success(
        `Hooray! We found ${response.data.totalHits} images.`
      );
      console.log(response.data.totalHits);
      createMarkup(response.data.hits, refs.imagesContainer);
      totalGallery = response.data.totalHits;
      console.log(totalGallery);
      totalGallery >= response.data.totalHits
        ? noActiveSearchBtn()
        : ActiveSearchBtn();
      const { height: cardHeight } = document
        .querySelector('.gallery')
        .firstElementChild.getBoundingClientRect();
      window.scrollBy({
        top: cardHeight * 2,
        behavior: 'smooth',
      });
      lightbox.refresh();
      loadingObserver.observe(refs.imagesContainer.lastElementChild);
    }
  });
}

function noActiveSearchBtn() {
  refs.btn.style.display = 'none';
  refs.btn.style.visibility = 'hidden';
}

function ActiveSearchBtn() {
  refs.btn.style.display = 'block';
  refs.btn.style.visibility = 'visible';
}

// Infinite Scroll
const loadingObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    /* для каждого наблюдаемого элемента */
    if (entry.isIntersecting) {
      // если элемент находится в видимой части браузера
      // подгружаем новую страницу
      page += 1;
      API.getData(apiService, page).then(response => {
        if (
          response.data.hits.length === 0 ||
          response.data.hits.length > response.data.totalHits
        ) {
          Notiflix.Notify.warning(
            "We're sorry, but you've reached the end of search results."
          );
          return;
        }
        createMarkup(response.data.hits, refs.imagesContainer);
        lightbox.refresh();
        loadingObserver.observe(refs.imagesContainer.lastElementChild);
        /* указываем, что необходимо наблюдать за лоадером */
      });
    }
  });
});
