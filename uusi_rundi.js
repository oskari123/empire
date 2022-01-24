const cvs = document.getElementById("empire");
const ctx = cvs.getContext("2d");



uusi_rundi();





// TAMA EI NYT KAYTOSSA KUN EI JAA ODOTTOMAAN JOSTAIN SYYSTA

async function Suusi_rundi() {
    
    // serverilla
       
    var   targetUrl = 'http://localhost:3000/SuusiRundi';

    alert("kutsutaan uusi rundiollaan pelaajan hakemisssa");
    try {
        let response1 = await fetch(targetUrl);
        let json1= await response1.json();
        
        pelaajan_code=json1[0].ret;
        
        return(json1[0].ret);  
    } catch(err) {
        alert("ERROR TULI FETCHISSSA smikapelaajatunnus");
    }
}




  







async function uusi_rundi() {

    tulos=Suusi_rundi();
    
}

