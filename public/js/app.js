const countrySelect  = document.querySelector('#country')
const stateSelect  = document.querySelector('#state')
const chartSection = document.querySelector('.chart-section')
const chart = document.querySelector('#myChart')

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
    initiallySeletedCountry = countrySelect.options[countrySelect.selectedIndex].value
    for(state in jsonData[initiallySeletedCountry]){
        let stateOption = document.createElement('option')
        stateOption.setAttribute('value',state)
        stateOption.textContent = state 
        stateSelect.appendChild(stateOption)
    }
    console.log(jsonData)
}

fetchData()


// whenever selected country changes change state options
countrySelect.onchange =  () =>{
    stateSelect.innerHTML = ''
    const covidData = JSON.parse(localStorage.getItem('covidData'))
    const selectedCountry = countrySelect.options[countrySelect.selectedIndex].value
    
    for(state in covidData[selectedCountry]){
        let stateOption = document.createElement('option')
        stateOption.setAttribute('value',state)
        stateOption.textContent = state
        stateSelect.appendChild(stateOption)
    }
}

// chart section
const myChart = new Chart(chart,{
        type:"doughnut",
        data : {
            labels : [
                'Affected',
                'Recovered',
                'Deaths'
              ],
              datasets: [{
                label: 'My First dataset',
                backgroundColor: ['#f1f51d',"#32a852","#c23c47"],
                borderColor:["#d6db37" ,"#20ad1d","#9c2832"],
                data: [2, 10, 5],
              }]
        },options: {
            responsive:false ,
            plugins: {
                legend : {
                    
                }
            }
        }
})