


import axios from "axios";
import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const formEl = document.querySelector('.search-form');
const galleryEl = document.querySelector('.gallery');
const infiniteScroll = document.querySelector('.js-scroll');

formEl.addEventListener('submit', onImageSearch);

Notiflix.Notify.init({
    position: 'center-top',
    distance: '45px',
    timeout: 2000,
    cssAnimationStyle: 'zoom',
    fontFamily: 'Arial, sans-serif',
});
let lightbox;
let options = {
  root: null,
  rootMargin: "200px",
  threshold: 1.0,
};
let observer = new IntersectionObserver(onLoadPage, options);

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '38045322-2f369602cee0bc2677197c244';

let page = 1;
let totalPage = 0;
const itemsOnPage = 40;
let currentSearch = '';

const searchParams = new URLSearchParams({
  key: API_KEY,
  image_type: 'photo',
  orientation: 'horizontal',
  safesearch: true,
  page: page,
  per_page: itemsOnPage  
});

async function getData(value){
    const response = await axios.get(`${BASE_URL}?${searchParams}&q=${value}`);
    return response.data;
};

async function onImageSearch(e){
    e.preventDefault();
    const {searchQuery: {value}} = e.currentTarget.elements;
   
    if(value.trim() === ''){
        Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.'); 
    }
    currentSearch = value;
    page = 1;
    observer.unobserve(infiniteScroll);
    galleryEl.innerHTML = '';

    await renderData();
    observer.observe(infiniteScroll);
  
    setLightbox();
};

async function renderData(){
    try {
        searchParams.set('page', page);
        const data = await getData(currentSearch);
        const {hits, totalHits} = data;
        totalPage = Math.ceil(totalHits / itemsOnPage);

        if(hits.length === 0){
            Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.'); 
            return
        }
           if (page === 1) {
              Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`)
            }
        galleryEl.insertAdjacentHTML('beforeend', getMarkupItem(hits));
        
    } catch (error) {
        console.error(error.message);
    }
};

function getMarkupItem(arr){
    const photoCard = arr.map(({tags,largeImageURL, webformatURL, views, downloads, likes, comments}) => 
    `<div class="photo-card">
    <a href="${largeImageURL}">
    <img src="${webformatURL}" alt="${tags}" loading="lazy" />
    </a>
    <div class="info">
      <p class="info-item">
        <b>Likes</b>
        ${likes}
      </p>
      <p class="info-item">
        <b>Views</b>
        ${views}
      </p>
      <p class="info-item">
        <b>Comments</b>
        ${comments}
      </p>
      <p class="info-item">
        <b>Downloads</b>
        ${downloads}
      </p>
    </div>
  </div>`).join('');
  return photoCard;
};



function setLightbox() {
    lightbox = new SimpleLightbox('.photo-card a', {
    navText: ['&#10094;', '&#10095;'],
    captionsData: 'alt',
    captionDelay: 250,
    showCounter: false,
   });
};

async function onLoadPage(entries, observer){
  entries.forEach(async (entry) => {
    if(entry.isIntersecting){
        page += 1;
        if(page === totalPage){
            Notiflix.Notify.warning('We are sorry, but you have reached the end of search results.');
            observer.unobserve(infiniteScroll);
            return;
        }
        
        lightbox.refresh();
    }
  });
}
