const cvs = document.getElementById("empire");
const ctx = cvs.getContext("2d");

// TAMA VAAN SEN TAKIA ETTÄ VOIDAAN TUNNUS TOISTAISEKSI PÄÄTELLÄ LOKAALINA CLIENTISSA
class pelaajaluokka {
    constructor (tunnus, salasana, koodi, vari) {
        this.tunnus=tunnus;
        this.salasana=salasana;
        this.koodi=koodi;
        this.vari=vari;
    }
}

let pm=2;
sp= [];

SalustaPelaajat();


/*
    Globaaleja muuttujia clientin päässä
*/
ruutux=7;           //ruudun ylakulman kohta glovbaalissa koordinaatistossa
ruutuy=7;        
ruutuxkoko=16;      //tulosettavan ruudun koko, pitaa olla 2:sella jaollinen
ruutuykoko=16;
blokkikoko=30;      //yhden blokin koko pikseleina

// nama sisältää "vilkkuvan" unitin tiedot
unittix=9;   //globaalissa koordinaatistossa
unittiy=10;   //globaalissa koordinaatistossa
unitin_koodi=0; // sisaltaa aktiivisen/vilkkuvan unitin koodin (numero)
unitin_lp=0;    // liikkumispisteet
unitin_tyyppi="TANKKI"; // tyyppi
unitin_omistaja="WHITE";

pelimoodi="normaali";
/* 
    Client puolen alustus
*/

vilkku=false;       //kaytetaan unitin vilkuttamiseen


// load images


const maa_kuva = new Image;
maa_kuva.src = "maa.jpg";

const vesi_kuva = new Image();
vesi_kuva.src = "vesi.jpg";

const tyhja_kuva = new Image();
tyhja_kuva.src = "tyhja.jpg";

const tankki_white_kuva = new Image();
tankki_white_kuva.src = "tankki_white.jpg";

const tankki_red_kuva = new Image();
tankki_red_kuva.src = "tankki_red.jpg";

const tankki_yellow_kuva = new Image();
tankki_yellow_kuva.src = "tankki_yellow.jpg";

const laiva_white_kuva = new Image();
laiva_white_kuva.src = "laiva_white.jpg";

const laiva_red_kuva = new Image();
laiva_red_kuva.src = "laiva_red.jpg";

const laiva_yellow_kuva = new Image();
laiva_yellow_kuva.src = "laiva_yellow.jpg";

const transu_white_kuva = new Image();
transu_white_kuva.src = "transu_white.jpg";

const transu_red_kuva = new Image();
transu_red_kuva.src = "transu_red.jpg";

const transu_yellow_kuva = new Image();
transu_yellow_kuva.src = "transu_yellow.jpg";

//file:///C:/javakoe/empire/client/empire_verkkossa_OMASIVU.html?username=jokujoku&password=sillisilli
// a          ?username=jokujoku&password=sillisilli
// apuapu     jokujoku&password=sillisilli


var pelaajan_code="5678";
//alert("perse1");


// TÄMÄN KUTSUN JÄLKEEN PELAAJAN HASH KOODI ON GLOB MUUTTUJASSA 'pelaajan_code'
// Nyt tällä tavalla koska jostain syystä "promisien" ei onnistu tässä funktiorakennelmassa
// Tama osuus tehdään jossain vaiheessa edellisella sivulla jotta salasanat ja tunnukset ei välity tänne
//perkaa_tunnukset();

// taman jalkeen 'pelaajan_code' toimii fetch-kutsuissa pelaajan tunnistamiseen

formSend();



async function perkaa_tunnukset() {
    a=parent.document.URL.substring(parent.document.URL.indexOf('?'), parent.document.URL.length);
    tunnus=a.substring(a.indexOf('=')+1,a.indexOf('&'));
    apuapu=a.substring(a.indexOf('=')+1,a.lenght); 
    salis=apuapu.substring(apuapu.indexOf('=')+1,apuapu.length);
    
    //tunnus=await SmikaPelaajaTunnus_L(tunnus,salis);
    //LISAKUTSU SEN TAKIA ETTA TUNNUS SAADAAN LOKAALINA
    alert("olen perkaa tunnuksissa tunnus="+tunnus+" salalasana="+salis)
    mika_tunnus(tunnus,salis);
    aputunnus= await SmikaPelaajaTunnus_L(tunnus,salis);

    alert("servulta pelaajatunnus "+aputunnus);
}



// TAMA EI NYT KAYTOSSA KUN EI JAA ODOTTOMAAN JOSTAIN SYYSTA

async function SmikaPelaajaTunnus_L(tunnus,salis) {
    
    // serverilla
       
    var   targetUrl = 'http://localhost:3000/SmikaPelaajaTunnus/'+tunnus+'/'+salis;

    alert("ollaan pelaajan hakemisssa");
    try {
        let response1 = await fetch(targetUrl);
        let json1= await response1.json();
        
        pelaajan_code=json1[0].ret;
        
        return(json1[0].ret);  
    } catch(err) {
        alert("ERROR TULI FETCHISSSA smikapelaajatunnus");
    }
    alert("ollaan pelaajan hakemisssa OHI");
}




  







async function formSend() {

	/*var username = document.getElementById('username').value;
	var password = document.getElementById('password').value;
	alert (globalMessage + " username: " + username + ", password: " + password);*/
  



	//var username = document.getElementById('username').value;
//	var password = document.getElementById('password').value;
//	alert ("Olen clientin formSendisss"+ " username: " + username + ", password: " + password);
    alert("olen formsendin alussa)")
   

    // vilkkumis synicn kutsuminen
    game = setInterval(drawVilkku,500);
       
    // nappaipen aiheuttama toiminta
    document.addEventListener("keydown",direction);

    perkaa_tunnukset();
    

    alert("odotellaan pelin alkua pelaajan code"+pelaajan_code);
    // haetaan seuraan pelaajan unitin tiedot glob muuttujiin
    await SseuraavaUnitti_L();
   
    if(unittix==-1)
    {
        // RUNDI LOPPU
        alert("TÄMÄ RUNDI JO PELATTU!!!!");
        clearInterval(game);
        document.removeEventListener("keydown",direction);
        // TASSA PITAISI HAIPYA JAVASCRIPTISTA
        location.replace("TUNNUS_sivu.html")
    } else {
        // rundi jatkuu
        tarkastaOnkoRuudulla();
    
        tee_nako_alussa();
        drawKokonaan();      // kutsutaan piirtoa heti alkuun
    }
}


function tee_nako_alussa() {
    Stee_nako_L();

}

async function direction(event){
    let viesti="NA";
    let key = event.keyCode;
        
    

    if( key == 100) {
        viesti = "LEFT";
    }else if(key == 104){
        viesti = "UP";        
    }else if(key == 102){
        viesti = "RIGHT";        
    }else if(key == 98){
        viesti = "DOWN";        
    }else if(key == 81) {
        viesti = "QUIT";
    }else if(key == 103){
        viesti = "UPLEFT";        
    }else if(key == 105){
        viesti = "UPRIGHT";        
    }else if(key == 99){
        viesti = "DOWNRIGHT";        
    }else if(key == 97){
        viesti = "DOWNLEFT";        
    } else if(key == 32){
        viesti = "SPACE";        
    } else if(key == 85){
        viesti = "UNLOAD"; 
    }
    //console.log(viesti+"keykode="+key);
    //alert(viesti+"keykode="+key);
    //alert("key="+key+"viesti="+viesti);
//    alert("Pelaajan koodi"+pelaajan_code);
    if(viesti=="QUIT") {
        // exitti
        alert("Pitäs quitata");
    }
    if(viesti=="UNLOAD") {
        // mennään unload moodiin
        
        // pitaa tarkastaa onko unloadaava unitti
        // jos on niin pitaa etsia pois meneva unitti (kysely serverille)
         //
        
        
        if(unitin_tyyppi=="transu") {
            // on transportteri
            pelimoodi="UNLOAD";
            jokujoku=await SunittiSisalta(unittix, unittiy);
            alert("unitti sisalta palautti = "+jokujoku);

        } else {
            alert("Unitti ei ole transporter");
            
        }


    }
    if(viesti=="LEFT" || viesti=="RIGHT" || viesti=="DOWN" || viesti=="UP" || viesti=="DOWNRIGHT" || viesti=="DOWNLEFT"|| viesti=="UPRIGHT"|| viesti=="UPLEFT" || viesti=="SPACE") {
        //alert("ennen liikettä unittix="+unittix+"unittiy="+unittiy);
        //clearInterval(game);
        t=await SkasitteleLiike_L(viesti,unittix,unittiy);
        // alert("jälkeen liikkeen unittix="+unittix+"unittiy="+unittiy);
        
        Stee_nako_L();
        //t=SkasitteleLiike_L(viesti, SaktiivinenUnitti);
        

        

        // tässä ilmoitetaan tapahtuma tulos
        // 1. pääsee  ei unittia -> liiku
        // 2. paase , oma -> meneeko sisaan vai onko liikkumisesto
        // 3. paasee , vihollinen -> hyokkays
        // 4. ei pääse ei unittia
        // 5. ei pääse , oma unitti -> meneeko sisään 
        // 6.  ei pääse ,  viholline -> sivuyokkays

   

        /*  Painalluksen jälkeen ja toimintojen jälkeen
            haetaan seuraava unitti joka on vuorossa (voi olla sama)
        */
       // alert("etsitaan seuraavaunitti unittix="+unittix+"unittiy="+unittiy);
        
       await SseuraavaUnitti_L();
        // alert("aktiivinen unitti unittix="+unittix+"unittiy="+unittiy);

        if(unittix==-1)
        {
            // RUNDI LOPPU
          
            clearInterval(game);
            document.removeEventListener("keydown",direction);
            Stee_nako_L();
            await drawKokonaan();
            alert("RUNDI LOPPU");
            pelaajan_code="1234"
            location.replace("TUNNUS_sivu.html")
            
            // TASSA PITAISI HAIPYA JAVASCRIPTISTA

        } else {
            // rundi jatkuu
            tarkastaOnkoRuudulla();
            await drawKokonaan();
        }
        //game = setInterval(drawVilkku,500);
    }        
    

    


}

 

function tarkastaOnkoRuudulla(){
    if(unittix<(ruutux+2) || (unittiy+ruutuxkoko)>(ruutux-2) || unittiy<(ruutuy+2) || (unittiy+ruutuykoko)<(ruutuy-2)) {
        // ei ruudulla -> keskita
        ruutux=unittix-(ruutuxkoko/2);
        ruutuy=unittiy-(ruutuykoko/2);
    }
    if(ruutuy<0) {
        ruutux=0;
    }
    if(ruutuy<0) {
        ruutuy=0;
    }
}
     



// TASSA PIIRRETAAN JA TATA KUTSUTAAN SYNCIN MUKAAN
// tai kai erikseenkin...
async function drawVilkku(){
    // Piirretaan maasto
    let tPala = new Image();
    
    ctx.font="20px Georgia";
    ctx.fillStyle="white";
    ctx.fillRect(10,380,150,200);
    ctx.fillStyle="black";
    ctx.fillText("Pelaajan tunnus="+pelaajan_code,10,400);
    
    //ctx.fillText("x="+unittix,10,420);
    ctx.fillText("x="+unittix,10,420);
    ctx.fillText("y="+unittiy,10,440);
    ctx.fillText("koodi="+unitin_koodi,10,460);
    ctx.fillText("omistaja="+unitin_omistaja,10,480);
    ctx.fillText("tyyppi="+unitin_tyyppi,10,500);
    ctx.fillText("lp="+unitin_lp,10,520);
    
    
    // Stee_nako_L();

   /*for( let i = 0; i < ruutuxkoko ; i++){
        for( let j = 0; j < ruutuykoko ; j++){ 
            pala=await SmikaPalaKuva_L(ruutux+i,ruutuy+j);
            //ctx.drawImage(tyhja_kuva,i*blokkikoko,j*blokkikoko);
            //console.log("pala drawrutiinissa ="+pala);
            //console.log("palan nimi draws="+pala);
            tPala=palaNimiGraffaksi(pala);
            //console.log("graffa paladraws="+tPala);
            //console.log("tpala draw rutiinissa="+tPala);
           
            ctx.drawImage(tPala,i*blokkikoko,j*blokkikoko);
        }
    }*/       
    
    // piirretaan lopuksi unitti
    if(vilkku==false) {
        // ei nay eli laitetaan
        // tassa pitas hakea oikea maastopala jos olisikin vesi
      //console.log("unittix"+unittix+"unitty"+unittiy+"vilkkuuko false");
     
        pala=await SmikaPalaUnitti_L(unittix,unittiy);
        //pala="tankkiwhite";
        tPala=palaNimiGraffaksi(pala);
        ctx.drawImage(tPala,(unittix-ruutux)*blokkikoko,(unittiy-ruutuy)*blokkikoko); 
        
        
        vilkku=true;
    } else {
        // nakyy-> eli maan vuoro 
        // tassa pitas hakea oikea maastopala jos olisikin vesi
        //console.log("unittix"+unittix+"unitty"+unittiy+"vilkkuuko true");
        
        pala=await SmikaPalaMaasto_L(unittix,unittiy);
        //pala="maa";
        tPala=palaNimiGraffaksi(pala);
        ctx.drawImage(tPala,(unittix-ruutux)*blokkikoko,(unittiy-ruutuy)*blokkikoko); 
        vilkku=false;
    }
    //ctx.fillStyle = "white";
    //ctx.font = "bold 20px sans-serif";
    //ctx.fillText("unum="+SaktiivinenUnitti+" x="+unittix+" y="+unittiy+" lp"+Sunitit[SaktiivinenUnitti].lp,0,20);
    //ctx.fillText("pelaaja="+pelaaja+" unitin om="+Sunitit[SaktiivinenUnitti].omistaja,0,40);
}



async function drawKokonaan(){
    // Piirretaan maasto
    let tPala = new Image();
    
   // Stee_nako_L();

    for( let i = 0; i < ruutuxkoko ; i++){
        for( let j = 0; j < ruutuykoko ; j++){ 
            //alert("palanhako drawkokonaan");
            pala=await SmikaPalaKuva_L(ruutux+i,ruutuy+j);
            //ctx.drawImage(tyhja_kuva,i*blokkikoko,j*blokkikoko);
            console.log("pala drawrutiinissa ="+pala);
            //console.log("palan nimi draws="+pala);
            tPala=palaNimiGraffaksi(pala);
            console.log("graffa paladraws="+tPala);
            //console.log("tpala draw rutiinissa="+tPala);
           
            ctx.drawImage(tPala,i*blokkikoko,j*blokkikoko);
        }
    }       
    
    // piirretaan lopuksi unitti
    if(vilkku==false) {
        // ei nay eli laitetaan
        // tassa pitas hakea oikea maastopala jos olisikin vesi
  
        pala=await SmikaPalaUnitti_L(unittix,unittiy);
        tPala=palaNimiGraffaksi(pala);
        ctx.drawImage(tPala,(unittix-ruutux)*blokkikoko,(unittiy-ruutuy)*blokkikoko); 
        
        
        vilkku=true;
    } 
    
    
    /*
    else {
        // nakyy-> eli maan vuoro 
        // tassa pitas hakea oikea maastopala jos olisikin vesi
        console.log("unittix"+unittix+"unitty"+unittiy+"vilkkuuko true");
        pala=await SmikaPalaMaasto_L(unittix,unittiy);
        tPala=palaNimiGraffaksi(pala);
        ctx.drawImage(tPala,(unittix-ruutux)*blokkikoko,(unittiy-ruutuy)*blokkikoko); 
        vilkku=false;
    }*/
    //ctx.fillStyle = "white";
    //ctx.font = "bold 20px sans-serif";
    //ctx.fillText("unum="+SaktiivinenUnitti+" x="+unittix+" y="+unittiy+" lp"+Sunitit[SaktiivinenUnitti].lp,0,20);
    //ctx.fillText("pelaaja="+pelaaja+" unitin om="+Sunitit[SaktiivinenUnitti].omistaja,0,40);
}


/* tahan tulee serverin kutsu rutiini */


async function SmikaPalaMaasto_L(ux,uy) {
    
    
    var   targetUrl = 'http://localhost:3000/SmikaPalaMaasto/'+ux+'/'+uy;
    
    let response1 = await fetch(targetUrl);
    let json1= await response1.json();
    console.log("Smikapalamaasto_l palautus="+json1[0].ret)

    //console.log("awaitilla json1="+json1)  ;
    //console.log("awaitilla stringi="+json1[0].ret)  ;
    return(json1[0].ret);
}
  
  
  
  
  
  
  
  
  
  
  




//

async function SmikaPalaKuva_L(ux,uy) {
    
    //alert("Smikapalakuva_L ux="+ux+"uy="+uy);
    // serverilla
    var pala3="jotain";
    var   targetUrl = 'http://localhost:3000/SmikaPalaKuva/'+ux+'/'+uy+'/'+pelaajan_code;

        console.log("Mennaan fetchiin Smikapalakuva")
  
    // TASSA EI OIKEASTI JAA ODOTTAMAAN !!!
  try {
    let response1 = await fetch(targetUrl);
    console.log("tultiin fetchista Smikapalakuva");
    let json1= await response1.json();  
    console.log("Smikapalakuva_l palautus="+json1[0].ret);
    return(json1[0].ret);
} catch(err){ 
      alert("ERROR TULI FETCHISSSA Smikapalakuva ux="+ux+"uy"+uy);
  }
  
  
}
    








async function SmikaPalaUnitti_L(ux,uy) {
    
    // serverilla
    var pala3="jotain";
    var   targetUrl = 'http://localhost:3000/SmikaPalaUnitti/'+ux+'/'+uy;

  let response1 = await fetch(targetUrl);
  let json1= await response1.json();

  console.log("Smikapalaunitti_l palautus="+json1[0].ret)
    return(json1[0].ret);  
    
    
    

}











function palaNimiGraffaksi(pal) {
    if(pal=="maa") {
        pal=maa_kuva;

    } else if(pal=="vesi") {
        pal=vesi_kuva;
    } else if(pal=="tankkiwhite") {
        pal=tankki_white_kuva;

    } else if(pal=="tankkired") {
        pal=tankki_red_kuva;

    }  else if(pal=="laivawhite") {
        pal=laiva_white_kuva;

    } else if(pal=="laivared") {
        pal=laiva_red_kuva;

    } else if(pal=="transuwhite") {
        pal=transu_white_kuva;

    }else if(pal=="transured") {
        pal=transu_red_kuva;

    } else if(pal=="tyhja") {
        pal=tyhja_kuva;
    }

    //console.log("palan kuva ="+pal);
    return pal

}




async function Stee_nako_L() {
   // serverilla

   /*
   async function getUserAsync(name) 
   {
     let response = await fetch(`https://api.github.com/users/${name}`);
     let data = await response.json()
     return data;
   }
   
   getUserAsync('yourUsernameHere')
     .then(data => console.log(data)); */



   var   targetUrl = 'http://localhost:3000/Steenako'
      
   //alert("mennaan nako rutiiniin serverille");
   let response1 = await fetch(targetUrl);
   joku = await response1.json();
   // alert("tultiinn nako rutiinistaserverilta"+response1);
   return(1);
}

async function SseuraavaUnitti_L() {
    // serverilla
    var   targetUrl = 'http://localhost:3000/SseuraavaUnitti/'+pelaajan_code;
    let response1 = await fetch(targetUrl);
    let json1= await response1.json();

  //  return([{"x":unittix, "y":unittiy, "koodi": koodi, "lp":lp, "tyyppi":tyyppi, "omistaja":omistaja}]);
    unittix=json1[0].x;
    unittiy=json1[0].y;
    unitin_koodi=json1[0].koodi;
    unitin_omistaja=json1[0].omistaja;
    unitin_tyyppi=json1[0].tyyppi;
    unitin_lp=json1[0].lp;

    console.log("Seuravaa unitti palautti x="+unittix+"y="+unittiy);
    console.log("koodi="+unitin_koodi+" omistaja="+unitin_omistaja+" tyyppi="+unitin_tyyppi+" lp="+unitin_lp);
    
    //alert("Seuravaa unitti palautti x="+unittix+"y="+unittiy+"koodi="+unitin_koodi+" omistaja="+unitin_omistaja+" tyyppi="+unitin_tyyppi+" lp="+unitin_lp);

}

async function SkasitteleLiike_L(t,x,y) {
    // serverilla
    if(t=="UP"){
       t2=8;
    } else if(t=="DOWN") {
        t2=2;
    } else if(t=="LEFT") {
        t2=4;
    } else if(t=="RIGHT") {
        t2=6;
    } else if(t=="DOWNRIGHT") {
        t2=3;
    } else if(t=="DOWNLEFT") {
        t2=1;
    } else if(t=="UPRIGHT") {
        t2=9;
    } else if(t=="UPLEFT") {
        t2=7;
    } else if(t=="SPACE") {
        t2=32;
    } else {
        //console.log("ERROR Skasitteleliike_L");

    }
    
     // serverilla
    // console.log("Liikkeelle x="+x+" y="+y);
     var   targetUrl = 'http://localhost:3000/SkasitteleLiike/'+t2+'/'+x+'/'+y+'/'+pelaajan_code;
     let response1 = await fetch(targetUrl);
     let json1= await response1.json();
    re=1;
     //console.log("Luettu serverilta palautus ="+re);

    //ret=SkasitteleLiike(t2,x,y);
    return(re);
}






function SalustaPelaajat() {
    sp[0]=new pelaajaluokka("or","or","1234","white");
    sp[1]=new pelaajaluokka("ar","ar","5678","red");
    sp[2]=new pelaajaluokka("kari","beba","0987","yellow");
    pm=2;
}

function mika_tunnus(eka, toka){
    loyty=false;
    for(let w=0;w<=pm;w++) {
        if(sp[w].tunnus==eka && sp[w].salasana==toka) {
            // Loytyi
            
            loyty=true;
            pelaajan_code=sp[w].koodi;
        }
    }

    
}

async function SunittiSisalta(ux,uy) {
    
    // serverilla
    var pala3="jotain";
    var   targetUrl = 'http://localhost:3000/SunittiSisalta/'+ux+'/'+uy;

  let response1 = await fetch(targetUrl);
  let json1= await response1.json();

  console.log("SUnittisisalta palautti="+json1[0].ret)
    return(json1[0].ret);  
    
    
    

}

