const cvs = document.getElementById("empire");
const ctx = cvs.getContext("2d");

/*
    Globaaleja muuttujia clientin päässä
*/
let ruutux=7;           //ruudun ylakulman kohta glovbaalissa koordinaatistossa
let ruutuy=7;        
let ruutuxkoko=10;      //tulosettavan ruudun koko
let ruutuykoko=10;
let blokkikoko=32;      //yhden blokin koko pikseleina

// nama sisältää "vilkkuvan" unitin tiedot
let unittix=9;   //globaalissa koordinaatistossa
let unittiy=10;   //globaalissa koordinaatistossa


/* 
    Client puolen alustus
*/

let vilkku=false;       //kaytetaan unitin vilkuttamiseen


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





// haetaan seuraan pelaajan unitin tiedot glob muuttujiin
SseuraavaUnitti_L();
tarkastaOnkoRuudulla();
Stee_nako_L();
drawKokonaan();      // kutsutaan piirtoa heti alkuun


// vilkkumis synicn kutsuminen
let game = setInterval(drawVilkku,500);

// nappaipen aiheuttama toiminta
document.addEventListener("keydown",direction);



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
    }

    //alert("key="+key+"viesti="+viesti);

    if(viesti=="QUIT") {
        // exitti
        alert("Pitäs quitata");
    }
    if(viesti=="LEFT" || viesti=="RIGHT" || viesti=="DOWN" || viesti=="UP" || viesti=="DOWNRIGHT" || viesti=="DOWNLEFT"|| viesti=="UPRIGHT"|| viesti=="UPLEFT") {
        // liike
        
        t=await SkasitteleLiike_L(viesti,unittix,unittiy);
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
        await SseuraavaUnitti_L();
        
        tarkastaOnkoRuudulla();
        drawKokonaan();
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
        tPala=palaNimiGraffaksi(pala);
        ctx.drawImage(tPala,(unittix-ruutux)*blokkikoko,(unittiy-ruutuy)*blokkikoko); 
        
        
        vilkku=true;
    } else {
        // nakyy-> eli maan vuoro 
        // tassa pitas hakea oikea maastopala jos olisikin vesi
        //console.log("unittix"+unittix+"unitty"+unittiy+"vilkkuuko true");
        pala=await SmikaPalaMaasto_L(unittix,unittiy);
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
            pala=await SmikaPalaKuva_L(ruutux+i,ruutuy+j);
            //ctx.drawImage(tyhja_kuva,i*blokkikoko,j*blokkikoko);
            //console.log("pala drawrutiinissa ="+pala);
            //console.log("palan nimi draws="+pala);
            tPala=palaNimiGraffaksi(pala);
            //console.log("graffa paladraws="+tPala);
            //console.log("tpala draw rutiinissa="+tPala);
           
            ctx.drawImage(tPala,i*blokkikoko,j*blokkikoko);
        }
    }       
    
    // piirretaan lopuksi unitti
    if(vilkku==false) {
        // ei nay eli laitetaan
        // tassa pitas hakea oikea maastopala jos olisikin vesi
      console.log("unittix"+unittix+"unitty"+unittiy+"vilkkuuko false");
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
    
    console.log("ux="+ux+"uy="+uy);
    var   targetUrl = 'http://localhost:3000/SmikaPalaMaasto/'+ux+'/'+uy;
    
    let response1 = await fetch(targetUrl);
    let json1= await response1.json();


    //console.log("awaitilla json1="+json1)  ;
    //console.log("awaitilla stringi="+json1[0].ret)  ;
    return(json1[0].ret);
}
  
  
  
  
  
  
  
  
  
  
  




//

async function SmikaPalaKuva_L(ux,uy) {
    
    // serverilla
    var pala3="jotain";
    var   targetUrl = 'http://localhost:3000/SmikaPalaKuva/'+ux+'/'+uy;

  let response1 = await fetch(targetUrl);
  let json1= await response1.json();



    return(json1[0].ret);
}
    








async function SmikaPalaUnitti_L(ux,uy) {
    
    // serverilla
    var pala3="jotain";
    var   targetUrl = 'http://localhost:3000/SmikaPalaUnitti/'+ux+'/'+uy;

  let response1 = await fetch(targetUrl);
  let json1= await response1.json();


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
   var   targetUrl = 'http://localhost:3000/Steenako'
      
   let response1 = await fetch(targetUrl);
   //let json1= await response1.json();
 
}

async function SseuraavaUnitti_L() {
    // serverilla
    var   targetUrl = 'http://localhost:3000/SseuraavaUnitti'
    let response1 = await fetch(targetUrl);
    let json1= await response1.json();

    unittix=json1[0].x;
    unittiy=json1[0].y;
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
    } else {
        //console.log("ERROR Skasitteleliike_L");

    }
    
     // serverilla
     
     var   targetUrl = 'http://localhost:3000/SkasitteleLiike/'+t2+'/'+x+'/'+y;
     let response1 = await fetch(targetUrl);
     let json1= await response1.json();
    re=1;
     //console.log("Luettu serverilta palautus ="+re);

    //ret=SkasitteleLiike(t2,x,y);
    return(re);
}



