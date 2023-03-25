import './css/styles.css';

import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

import { fetchCountries } from './js/fetchCountries';

const DEBOUNCE_DELAY = 300;

const searchBoxEl = document.querySelector('#search-box');
const countryListEl = document.querySelector('.country-list');
const countryInfoEl = document.querySelector('.country-info');

searchBoxEl.addEventListener('input', debounce(onInputSearch, DEBOUNCE_DELAY));

function onInputSearch(event) {
  event.preventDefault();
  let searchQuery = event.target.value.trim();
  if (searchQuery) {
    return fetchCountries(searchQuery)
      .then(data => {
        choseMarkup(data);
      })
      .catch(error => {
        Notify.failure('Oops, there is no country with that name');
      });
  }
}

function choseMarkup(countryArray) {
  if (countryArray.length === 1) {
    countryListEl.innerHTML = '';
    return markupCountryCard(countryArray);
  }
  if (countryArray.length >= 2 && countryArray.length <= 10) {
    countryInfoEl.innerHTML = '';
    return markupCountryItem(countryArray);
  }

  return Notify.info(
    'Too many matches found. Please enter a more specific name.'
  );
}

function markupCountryItem(data) {
  const markup = data
    .map(element => {
      return `<li class="country-item">
            <img src="${element.flags.svg}" alt="${element.name.official}" width="40" height="20" /> 
            <p>${element.name.official}</p>
            </li>`;
    })
    .join('');

  countryListEl.innerHTML = markup;
}

function markupCountryCard(data) {
  const markup = data
    .map(element => {
      return `<h1>
       <img src="${element.flags.svg}" alt="${
        element.name.official
      }" width="40" height="20" /> 
            
        ${element.name.official}
      </h1>
      <ul class="country-info_list">
        <li class="country-info_item">
          <h2>Capital:</h2>
          <p>${element.capital}</p>
        </li>
        <li class="country-info_item">
          <h2>Population:</h2>
          <p>${element.population}</p>
        </li>
        <li class="country-info_item">
          <h2>Languages:</h2>
          <p>${Object.values(element.languages).join(', ')}</p>
        </li>
      </ul>`;
    })
    .join('');

  countryInfoEl.innerHTML = markup;
}
