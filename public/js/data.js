
const getData = async () =>{
    if( !localStorage.getItem('covidData')){
    const res = await fetch("https://covid-api.mmediagroup.fr/v1/cases")
    const data = await res.json()
    
    
}
return localStorage.getItem('covidData')
}
