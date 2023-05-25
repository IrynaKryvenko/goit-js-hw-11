import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import axios from 'axios';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { renderPhotosList } from './js/renderPhotosList';

const API_KEY = '36655990-0724db180fb71d9be8c2c1bf3';
const BASE_URL = 'https://pixabay.com/api/?key=';
const OPTIONS = '}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40';

const submitForm = document.querySelector('.search-form');
const galleryList = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

let page = 1;
let searchQuery = '';
loadMoreBtn.style.setProperty('display', 'none', 'important');
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
  };
};

function onLoadPhotos() {
  loadMoreBtn.style.setProperty('display', 'none', 'important');
  getPhotos(searchQuery)
    .then((array) => {
      renderPhotosList(array.hits, galleryList, gallery);
      total += array.hits.length;
      const totalHits = array.totalHits;

      if (total === 0) {
        Notify.warning('Sorry, there are no images matching your search query.');
      } else if (total >= totalHits) {
        Notify.warning('You have reached the end of the search results.');
      } else {
        loadMoreBtn.style.removeProperty('display'); 
        forScrollPage();
        if (page === 2) {
          Notify.success(`Hooray! We found ${totalHits} images.`);
        }
      }
    })
    .catch((error) => {
      Notify.failure(
        'Sorry, there was an error retrieving images. Please try again.'
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
};

async function getPhotos(name) {
  try {
    const response = await axios.get(
      BASE_URL + API_KEY + `&q=${name}` + OPTIONS + `&page=${page}`
    );
    total += response.data.hits.length;
    const totalHits = response.data.totalHits;
    if (total >= totalHits) {
      Notify.warning('We`re sorry, but you`ve reached the end of search results.');
      loadMoreBtn.style.setProperty('display', 'none', 'important');
    }
    return response.data;
  } catch (error) {
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    throw error;
  } 
};
