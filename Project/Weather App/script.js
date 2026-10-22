const apiKey = "a0c75c23ef91a9eec354b721a454a8bc";

const currentWeatherUrl =
    "https://api.openweathermap.org/data/2.5/weather";

const forecastUrl =
    "https://api.openweathermap.org/data/2.5/forecast";

const searchForm = document.querySelector("#searchForm");
const cityInput = document.querySelector("#cityInput");
const searchBtn = document.querySelector("#searchBtn");

const weatherSection = document.querySelector("#weatherSection");
const errorMessage = document.querySelector("#errorMessage");
const forecastList = document.querySelector("#forecastList");
const recentList = document.querySelector("#recentList");
const clearHistoryBtn = document.querySelector("#clearHistory");

const icons = {
    Clear: "clear.png",
    Clouds: "clouds.png",
    Drizzle: "drizzle.png",
    Rain: "rain.png",
    Thunderstorm: "rain.png",
    Snow: "snow.png",
    Mist: "mist.png",
    Smoke: "mist.png",
    Haze: "mist.png",
    Dust: "mist.png",
    Fog: "mist.png",
    Sand: "mist.png",
    Ash: "mist.png",
    Squall: "rain.png",
    Tornado: "rain.png"
};

let currentRequest = 0;

function getIcon(condition) {
    return `images/${icons[condition] || "clouds.png"}`;
}

async function fetchWeatherData(url) {
    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
        if (response.status === 401) {
            throw new Error(
                "Invalid API key or API key not activated."
            );
        }

        if (response.status === 404) {
            throw new Error(
                "City not found. Please check the spelling."
            );
        }

        throw new Error(
            data.message || "Unable to load weather data."
        );
    }

    return data;
}

function formatCityTime(timestamp, timezoneOffset) {
    return new Date(
        (timestamp + timezoneOffset) * 1000
    ).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
        timeZone: "UTC"
    });
}

function formatForecastDay(timestamp, timezoneOffset) {
    return new Date(
        (timestamp + timezoneOffset) * 1000
    ).toLocaleDateString("en-US", {
        weekday: "short",
        timeZone: "UTC"
    });
}

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = "block";
}

async function checkWeather(city) {
    const requestId = ++currentRequest;

    errorMessage.style.display = "none";
    searchBtn.disabled = true;
    searchBtn.textContent = "Loading...";

    try {
        const currentData = await fetchWeatherData(
            `${currentWeatherUrl}?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`
        );

        if (requestId !== currentRequest) return;

        displayCurrentWeather(currentData);
        weatherSection.hidden = false;

        saveRecentCity(currentData.name);
        renderRecentCities();

        forecastList.replaceChildren();

        const loadingText = document.createElement("p");
        loadingText.className = "muted";
        loadingText.textContent = "Loading forecast...";
        forecastList.appendChild(loadingText);

        try {
            const forecastData = await fetchWeatherData(
                `${forecastUrl}?lat=${currentData.coord.lat}&lon=${currentData.coord.lon}&appid=${apiKey}&units=metric`
            );

            if (requestId !== currentRequest) return;

            displayForecast(
                forecastData,
                currentData.timezone
            );
        } catch (forecastError) {
            if (requestId !== currentRequest) return;

            forecastList.replaceChildren();

            const forecastErrorText =
                document.createElement("p");

            forecastErrorText.className = "muted";
            forecastErrorText.textContent =
                "Forecast unavailable. " + forecastError.message;

            forecastList.appendChild(forecastErrorText);

            console.error("Forecast error:", forecastError);
        }

    } catch (error) {
        if (requestId !== currentRequest) return;

        showError(error.message);
        console.error("Weather error:", error);

    } finally {
        if (requestId === currentRequest) {
            searchBtn.disabled = false;
            searchBtn.textContent = "Search ↗";
        }
    }
}

function displayCurrentWeather(data) {
    const condition = data.weather[0].main;
    const timezoneOffset = data.timezone;

    document.querySelector(".city").textContent =
        data.name;

    document.querySelector(".weather-description").textContent =
        data.weather[0].description;

    document.querySelector(".temp").textContent =
        Math.round(data.main.temp) + "°";

    document.querySelector(".feels-like").textContent =
        Math.round(data.main.feels_like) + "°C";

    document.querySelector(".humidity").textContent =
        data.main.humidity + "%";

    document.querySelector(".Wind").textContent =
        (data.wind.speed * 3.6).toFixed(1) + " km/h";

    document.querySelector(".humidity-detail").textContent =
        data.main.humidity + "%";

    document.querySelector(".wind-detail").textContent =
        (data.wind.speed * 3.6).toFixed(1) + " km/h";

    document.querySelector(".pressure").textContent =
        data.main.pressure + " hPa";

    document.querySelector(".visibility").textContent =
        data.visibility != null
            ? (data.visibility / 1000).toFixed(1) + " km"
            : "N/A";

    document.querySelector(".sunrise").textContent =
        formatCityTime(data.sys.sunrise, timezoneOffset);

    document.querySelector(".sunset").textContent =
        formatCityTime(data.sys.sunset, timezoneOffset);

    const icon = document.querySelector(".weather-icon");

    icon.src = getIcon(condition);
    icon.alt = data.weather[0].description;

    icon.onerror = () => {
        icon.onerror = null;
        icon.src = "images/clouds.png";
    };
}

function displayForecast(data, timezoneOffset) {
    forecastList.replaceChildren();

    const dailyData = {};

    data.list.forEach((item) => {
        const date = item.dt_txt.split(" ")[0];

        if (!dailyData[date]) {
            dailyData[date] = {
                selected: item,
                min: item.main.temp_min,
                max: item.main.temp_max
            };
        }

        const day = dailyData[date];

        day.min = Math.min(day.min, item.main.temp_min);
        day.max = Math.max(day.max, item.main.temp_max);

        // Prefer the midday forecast for the daily icon.
        if (item.dt_txt.includes("12:00:00")) {
            day.selected = item;
        }
    });

    const days = Object.values(dailyData).slice(0, 5);

    days.forEach((day, index) => {
        const item = day.selected;
        const condition = item.weather[0].main;

        const card = document.createElement("article");
        card.className = "forecast-day";
        card.style.animationDelay = `${index * 70}ms`;

        const dayName = document.createElement("p");
        dayName.className = "forecast-date";
        dayName.textContent =
            formatForecastDay(item.dt, timezoneOffset);

        const icon = document.createElement("img");
        icon.src = getIcon(condition);
        icon.alt = item.weather[0].description;
        icon.loading = "lazy";
        icon.onerror = () => {
            icon.onerror = null;
            icon.src = "images/clouds.png";
        };

        const description = document.createElement("p");
        description.className = "forecast-condition";
        description.textContent = item.weather[0].description;

        const temperature = document.createElement("p");
        temperature.className = "forecast-temp";
        temperature.textContent =
            Math.round(item.main.temp) + "°";

        const range = document.createElement("p");
        range.className = "forecast-range";
        range.textContent =
            `${Math.round(day.max)}° / ${Math.round(day.min)}°`;

        card.append(
            dayName,
            icon,
            description,
            temperature,
            range
        );

        forecastList.appendChild(card);
    });

    if (days.length === 0) {
        const message = document.createElement("p");
        message.className = "muted";
        message.textContent = "No forecast data available.";
        forecastList.appendChild(message);
    }
}

// Recent searches are stored in this browser.
function getRecentCities() {
    try {
        const saved = JSON.parse(
            localStorage.getItem("atmosRecentCities") || "[]"
        );

        return Array.isArray(saved)
            ? saved.filter(
                (city) => typeof city === "string"
            )
            : [];
    } catch {
        return [];
    }
}

function saveRecentCity(city) {
    const cities = getRecentCities();

    const updated = [
        city,
        ...cities.filter(
            (item) => item.toLowerCase() !== city.toLowerCase()
        )
    ].slice(0, 6);

    try {
        localStorage.setItem(
            "atmosRecentCities",
            JSON.stringify(updated)
        );
    } catch (error) {
        console.error("Unable to save search history:", error);
    }
}

function renderRecentCities() {
    recentList.replaceChildren();

    const cities = getRecentCities();

    clearHistoryBtn.hidden = cities.length === 0;

    if (cities.length === 0) {
        const empty = document.createElement("p");
        empty.className = "empty-history";
        empty.textContent = "Your searched cities will appear here.";
        recentList.appendChild(empty);
        return;
    }

    cities.forEach((city) => {
        const item = document.createElement("div");
        item.className = "recent-city";

        const cityButton = document.createElement("button");
        cityButton.type = "button";
        cityButton.className = "recent-city-name";
        cityButton.textContent = city;
        cityButton.setAttribute(
            "aria-label",
            `Show weather for ${city}`
        );

        cityButton.addEventListener("click", () => {
            cityInput.value = city;
            checkWeather(city);
        });

        const removeButton = document.createElement("button");
        removeButton.type = "button";
        removeButton.className = "remove-city";
        removeButton.textContent = "×";
        removeButton.setAttribute(
            "aria-label",
            `Remove ${city} from history`
        );

        removeButton.addEventListener("click", () => {
            const updated = getRecentCities().filter(
                (savedCity) =>
                    savedCity.toLowerCase() !== city.toLowerCase()
            );

            try {
                localStorage.setItem(
                    "atmosRecentCities",
                    JSON.stringify(updated)
                );
            } catch (error) {
                console.error("Unable to update history:", error);
            }

            renderRecentCities();
        });

        item.append(cityButton, removeButton);
        recentList.appendChild(item);
    });
}

searchForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const city = cityInput.value.trim();

    if (city) {
        checkWeather(city);
    }
});

clearHistoryBtn.addEventListener("click", () => {
    try {
        localStorage.removeItem("atmosRecentCities");
    } catch (error) {
        console.error("Unable to clear history:", error);
    }

    renderRecentCities();
});

renderRecentCities();
checkWeather("Dhaka");
