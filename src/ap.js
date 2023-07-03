import axios from 'axios';


const API_KEY = '38045322-2f369602cee0bc2677197c244'
const BASE_URL = 'https://pixabay.com/api/'

async function fetchApiImages (searchValue){
    axios.get(`${BASE_URL}?key=${API_KEY}&q=${searchValue}&image_type=photo&orientation=horizontal&safesearch=true`)
    const respons = await axios.get(`${BASE_URL}?key=${API_KEY}&q=${searchValue}&image_type=photo&orientation=horizontal&safesearch=true`)

    if(respons.status !== 200){
        throw new Error()
    }
    return respons.data
}








export {fetchApiImages}