function fetchCountry() {
    $('.js-search-results').empty();
    let userInput = $('#query').val();
    let url = `https://restcountries.eu/rest/v2/name/${userInput}`;

    if (userInput === '') {
        console.log("The user input is empty.");

        return;
    }

    $.ajax({
        url : url,
        method : "GET",
        dataType : "json",
        success : function(responseJSON) {
            displayCountry(responseJSON);
        },
        error : function(err) {
            $('.js-search-results').append(`<h2>País no existente.</h2>`);
            console.log(err);
        }
    });
}

function displayCountry(responseJSON) {
    let country = responseJSON[0];
    let results = $('.js-search-results');
    $('.js-search-results').empty();

    results.append(`
        <h1>Name: ${country.name}</h1>
        <h2>Capital: ${country.capital}</h2>
        <p>Flag</p>
        <img src="${country.flag}" alt=""/>
        <p>Population: ${country.population}</p>
        <p>Region: ${country.region}</p>
        <p>Timezones: ${country.timezones}</p>
        <p>Borders: ${country.borders}</p>
    `);
}

function watchForm() {
    let form = $('.js-search-form');

    form[0].addEventListener('submit', (event) => {
        event.preventDefault();
        
        fetchCountry();
    });
}

function init() {
    watchForm();
}

init();