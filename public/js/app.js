const countrySelect  = document.querySelector('#country')
const stateSelect  = document.querySelector('#state')
const chartSection = document.querySelector('.chart-section')
const chart = document.querySelector('#myChart')
let recovered,confirmed,deaths
let selectedCountry,selectedState
let myChart

// function to render chart 
const renderChart = (confirmed ,recovered , deaths) =>{  
    myChart = new Chart(chart,{
        type:"doughnut",
        data : {
            labels : [
                'Confirmed',
                'Recovered',
                'Deaths'
              ],
              datasets: [{
                label: 'Corona patient statics',
                backgroundColor: ['#f1f51d',"#32a852","#c23c47"],
                borderColor:["#d6db37" ,"#20ad1d","#9c2832"],
                data: [confirmed, recovered, deaths],
              }]
        },options: {
            responsive:false ,
            plugins: {
                legend : {
                    align:'center'
                }
            }
        }
})}


// update covid report on ui
const updateReport = () =>{
    const parsedCovidData = JSON.parse(localStorage.getItem('covidData'))
    const report = parsedCovidData[selectedCountry][selectedState]

    document.querySelector('#report-country').textContent = `Country : ${selectedCountry}`
    document.querySelector('#report-state').textContent =  `State : ${selectedState}`
    document.querySelector('#report-confirmed').textContent =  `Confirmed : ${report.confirmed}`
    document.querySelector('#report-recovered').textContent =  `Recovered : ${report.recovered}`
    document.querySelector('#report-deaths').textContent =  `Deaths : ${report.deaths}`
    if(selectedState === "All"){
        document.querySelector('#report-location').textContent =  `Location : ${report.location}`
        document.querySelector('#report-area').textContent =  `Area : ${report.sq_km_area} sq. km`
        document.querySelector('#report-population').textContent =  `Population : ${report.population}`

    }else{
        document.querySelector('#report-population').textContent = ''
        document.querySelector('#report-area').textContent = ''
        document.querySelector('#report-location').textContent = ''
    }
} 

// fetch data from api 
const fetchData = async () =>{
    let jsonData
    // If data  in localstorage was fetched before 6 hours return same else fetch
    if(localStorage.getItem('covidData') && localStorage.getItem('covidDataLastFetchTime') && ( new Date().getTime() - JSON.parse(localStorage.getItem('covidDataLastFetchTime')) < 1000*60*60*6)  ){
        jsonData= JSON.parse(localStorage.getItem('covidData'))
    }else{
        const url= 'https://covid-api.mmediagroup.fr/v1/cases'
        const res = await fetch(url)
        jsonData = await res.json()
        localStorage.setItem('covidData',JSON.stringify(jsonData))
        localStorage.setItem('covidDataLastFetchTime',JSON.stringify(new Date().getTime()))
    }

// fill options in state and country for initial load
    for(country in jsonData){
        let countryOption  = document.createElement('option')
        countryOption.setAttribute('value',country)
        countryOption.textContent = country 
        countrySelect.appendChild(countryOption)
    }

    selectedCountry = countrySelect.options[countrySelect.selectedIndex].value
    
    for(state in jsonData[selectedCountry]){
        let stateOption = document.createElement('option')
        stateOption.setAttribute('value',state)
        stateOption.textContent = state 
        stateSelect.appendChild(stateOption)
    }
    selectedState = stateSelect.options[stateSelect.selectedIndex].value

    updateReport()

    confirmed = jsonData[selectedCountry]['All'].confirmed
    recovered = jsonData[selectedCountry]['All'].recovered
    deaths = jsonData[selectedCountry]['All'].deaths

    renderChart(confirmed,recovered,deaths)
}

fetchData()

// whenever selected country changes change state options state will be all by default
countrySelect.onchange =  () =>{
    stateSelect.innerHTML = ''
    const covidData = JSON.parse(localStorage.getItem('covidData'))
    selectedCountry = countrySelect.options[countrySelect.selectedIndex].value
    

    // render all states options in state select html based on selected country 
    for(state in covidData[selectedCountry]){
        let stateOption = document.createElement('option')
        stateOption.setAttribute('value',state)
        stateOption.textContent = state
        stateSelect.appendChild(stateOption)
    }
    selectedState = stateSelect.options[stateSelect.selectedIndex].value

    updateReport()

    // render new chart after destroying prev on selecting new state 
    confirmed = covidData[selectedCountry][selectedState].confirmed
    recovered = covidData[selectedCountry][selectedState].recovered
    deaths = covidData[selectedCountry][selectedState].deaths
    
    myChart.destroy()
    renderChart(confirmed,recovered,deaths)
    
}

// render new chart after destroying prev on selecting new state 
stateSelect.onchange = () =>{
    const covidData = JSON.parse(localStorage.getItem('covidData'))
    selectedState = stateSelect.options[stateSelect.selectedIndex].value
    confirmed = covidData[selectedCountry][selectedState].confirmed
    recovered = covidData[selectedCountry][selectedState].recovered
    deaths = covidData[selectedCountry][selectedState].deaths
    
    updateReport()

    myChart.destroy()
    renderChart(confirmed,recovered,deaths)
}


