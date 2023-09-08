// Constants for API URL and API Key (Replace with your own)
const API_KEY = '39aa05b16316ef932fbf2721a36663c2';
const BASE_URL = 'https://api.openweathermap.org/data/2.5/';
const ICON_URL = 'https://openweathermap.org/img/wn/';

// DOM elements
const searchForm = document.getElementById('search-form');
const cityInput = document.getElementById('city-input');
const currentWeather = document.getElementById('current-weather');
const forecast = document.getElementById('forecast');
const searchHistory = document.getElementById('search-history');
const currentWeatherInfo = document.getElementById('current-weather-info');
const cityNameElement = document.getElementById('city-name');
const dateElement = document.getElementById('date');
const weatherIconElement = document.getElementById('weather-icon');
const temperatureElement = document.getElementById('temperature');
const humidityElement = document.getElementById('humidity');
const windSpeedElement = document.getElementById('wind-speed');
const forecastList = document.getElementById('forecast-list');
const searchHistoryList = document.getElementById('search-history-list');

// Initialize the application
function init() {
    // Add event listeners for navigation
    searchForm.addEventListener('submit', handleSearch);
    searchHistoryList.addEventListener('click', handleHistoryClick);

    // Load search history from localStorage and display it
    const searchHistoryData = JSON.parse(localStorage.getItem('searchHistory')) || [];
    displaySearchHistory(searchHistoryData);
}

// Function to handle form submission and fetch weather data
function handleSearch(event) {
    event.preventDefault();
    const cityName = cityInput.value.trim();
    if (cityName) {
        // Fetch weather data and update the UI
        fetchWeatherData(cityName);
        // Add city to search history
        addToSearchHistory(cityName);
        // Clear the input field
        cityInput.value = '';
    }
}

// Function to fetch weather data from the API
function fetchWeatherData(cityName) {
    const apiUrl = `${BASE_URL}weather?q=${cityName}&appid=${API_KEY}&units=metric`;

    fetch(apiUrl)
        .then((response) => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then((data) => {
            if (data.cod === 401) {
                throw new Error('Unauthorized: Check your API key');
            }
            updateCurrentWeather(data);
            // Show the current weather section
            currentWeather.style.display = 'block';
            // Hide other sections (forecast and search history)
            forecast.style.display = 'none';
            searchHistory.style.display = 'none';
        })
        .catch((error) => {
            console.error('Error fetching weather data:', error);
        });
}

// Function to update current weather information
function updateCurrentWeather(data) {
    cityNameElement.textContent = data.name;
    dateElement.textContent = new Date(data.dt * 1000).toLocaleDateString();
    weatherIconElement.src = `${ICON_URL}${data.weather[0].icon}@2x.png`;
    temperatureElement.textContent = `${data.main.temp} °C`;
    humidityElement.textContent = `${data.main.humidity} %`;
    windSpeedElement.textContent = `${data.wind.speed} m/s`;

    // Hide the "No Data" message if it was previously displayed
    currentWeatherInfo.style.display = 'block';
}

// Function to handle clicking on search history items
function handleHistoryClick(event) {
    if (event.target && event.target.classList.contains('search-history-item')) {
        const cityName = event.target.textContent;
        // Fetch weather data and update the UI for the selected city
        fetchWeatherData(cityName);
    }
}

// Function to add a city to the search history
function addToSearchHistory(cityName) {
    const searchHistoryData = JSON.parse(localStorage.getItem('searchHistory')) || [];
    searchHistoryData.push(cityName);
    localStorage.setItem('searchHistory', JSON.stringify(searchHistoryData));
    displaySearchHistory(searchHistoryData);
}

// Function to display search history
function displaySearchHistory(historyData) {
    searchHistoryList.innerHTML = '';
    historyData.forEach((city) => {
        const listItem = document.createElement('li');
        listItem.textContent = city;
        listItem.classList.add('search-history-item');
        searchHistoryList.appendChild(listItem);
    });
}

// Call the init() function when the page loads
window.addEventListener('load', init);
