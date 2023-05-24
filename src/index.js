import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import axios from 'axios';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { renderPhotosList } from './js/renderPhotosList';

const submitForm = document.querySelector('.search-form');
const galleryList = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

const API_KEY = '26837460-553b8b6dbfe9a53b3dd0b8a3a';
const BASE_URL = 'https://pixabay.com/api/?key=';
const OPTIONS = '}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40';

let page = 1;
let searchQuery = '';
loadMoreBtn.style.display = 'none';
let total = 0;

submitForm.addEventListener('submit', onSearch);
loadMoreBtn.addEventListener('click', onLoadPhotos);

let gallery = new SimpleLightbox('.gallery a', { captionsData: 'alt' });

function onSearch(event) {
  event.preventDefault();
  searchQuery = event.currentTarget.elements.searchQuery.value;
  galleryList.innerHTML = '';
  total = 0;

  if (searchQuery !== '') {
    page = 1;
    onLoadPhotos();
  }
}

function onLoadPhotos() {
  loadMoreBtn.style.display = 'none';
  getPhotos(searchQuery)
    .then((array) => {
      renderPhotosList(array.hits, galleryList, gallery);
      loadMoreBtn.style.display = 'block';
      forScrollPage();
      if (page === 2) {
        Notify.success(`Hooray! We found ${array.totalHits} images.`);
      }
    })
    .catch((error) => {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    });
  page += 1;
}

function forScrollPage() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}

async function getPhotos(name) {
  try {
    const response = await axios.get(
      BASE_URL + API_KEY + `&q=${name}` + OPTIONS + `&page=${page}`
    );
    total += response.data.hits.length;
    const totalHits = response.data.totalHits;
    if (total >= totalHits) {
      Notify.warning('We`re sorry, but you`ve reached the end of search results.');
      loadMoreBtn.style.display = 'none';
    }
    return response.data;
  } catch (error) {
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    throw error;
  }
}
