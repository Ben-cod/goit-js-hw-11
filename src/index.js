

import { fetchApiImages } from "./ap";
import SimpleLightbox from "simplelightbox";

import "simplelightbox/dist/simple-lightbox.min.css";

const form = document.querySelector('.search-form')
const input = document.querySelector('[name="searchQuery"]');
const button = document.querySelector('button')
const galleryWrapper = document.querySelector('.gallery')
const photoCard = document.querySelector('.photo-card')
form.addEventListener('submit', displayImages)

async function displayImages(event){
    event.preventDefault()  
    const inputValue = input.value.trim()

     const searchResalt = await fetchApiImages(inputValue) 
        console.log(searchResalt)
   const cardsList = searchResalt.hits.map(card => {
    return `<div class="photo-card">
        <img src="${card.webformatURL}" alt="${card.tags}" loading="lazy" />
        <div class="info">
        <p class="info-item">
            <b>${card.likes}</b>
        </p>
        <p class="info-item">
            <b>${card.views}</b>
        </p>
        <p class="info-item">
            <b>${card.comments}</b>
        </p>
        <p class="info-item">
            <b>${card.downloads}</b>
        </p>
        </div>
    </div>`
   }).join('');

   galleryWrapper.innerHTML = cardsList;

}
const markup = createGalleryItemsMarkup(galleryItems)
galeryContainer.insertAdjacentHTML('beforeend', markup)


function createGalleryItemsMarkup(items) {
    return items.map(({ preview, original, description }) => {
        return `<li class="gallery__item">
    <a class="gallery__link" 
        href="${original}">
        <img class="gallery__image" 
       src="${preview}" 
       alt="${description}" />
    </a>
 </li>`
    }).join('');
};
var lightbox = new SimpleLightbox('.gallery a', {
    captionsData: 'alt', 
    captionPosition: 'bottom',
     captionDelay: 250
});




