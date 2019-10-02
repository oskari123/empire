const cvs = document.getElementById("empire");
const ctx = cvs.getContext("2d");

/*
    Globaaleja muuttujia clientin päässä
*/
let ruutux=4;           //ruudun ylakulman kohta glovbaalissa koordinaatistossa
let ruutuy=3;        
let ruutuxkoko=30;      //tulosettavan ruudun koko
let ruutuykoko=30;
let blokkikoko=32;      //yhden blokin koko pikseleina

// nama sisältää "vilkkuvan" unitin tiedot
let unittix=10;   //globaalissa koordinaatistossa
let unittiy=11;   //globaalissa koordinaatistossa


/* 
    Client puolen alustus
*/

let vilkku=false;       //kaytetaan unitin vilkuttamiseen

// load images


const maa_kuva = new Image;
maa_kuva.src = "C:/javakoe/empire/server/maa.jpg";

const vesi_kuva = new Image();
vesi_kuva.src = "C:/javakoe/empire/server/vesi.jpg";

const tyhja_kuva = new Image();
tyhja_kuva.src = "C:/javakoe/empire/server/tyhja.jpg";

const tankki_white_kuva = new Image();
tankki_white_kuva.src = "C:/javakoe/empire/server/tankki_white.jpg";

const tankki_red_kuva = new Image();
tankki_red_kuva.src = "C:/javakoe/empire/server/tankki_red.jpg";

const tankki_yellow_kuva = new Image();
tankki_yellow_kuva.src = "C:/javakoe/empire/server/tankki_yellow.jpg";

const laiva_white_kuva = new Image();
laiva_white_kuva.src = "C:/javakoe/empire/server/laiva_white.jpg";

const laiva_red_kuva = new Image();
laiva_red_kuva.src = "C:/javakoe/empire/server/laiva_red.jpg";

const laiva_yellow_kuva = new Image();
laiva_yellow_kuva.src = "C:/javakoe/empire/server/laiva_yellow.jpg";

const transu_white_kuva = new Image();
transu_white_kuva.src = "C:/javakoe/empire/server/transu_white.jpg";

const transu_red_kuva = new Image();
transu_red_kuva.src = "C:/javakoe/empire/server/transu_red.jpg";

const transu_yellow_kuva = new Image();
transu_yellow_kuva.src = "C:/javakoe/empire/server/transu_yellow.jpg";




/*

class Smpala {
        
    constructor (kuva, "maa") 
    {
        //this.kuva=kuva;
        this.nimi=nimi;
    }
}

*/



/* 
    alun asetus
*/
SalustaKartta_L();
SalustakarttaPelaaja_L();

Salustaunitit_L();
// haetaan seuraan pelaajan unitin tiedot glob muuttujiin
SseuraavaUnitti_L();
tarkastaOnkoRuudulla();

draw();      // kutsutaan piirtoa heti alkuun


// vilkkumis synicn kutsuminen
let game = setInterval(draw,500);

// nappaipen aiheuttama toiminta
document.addEventListener("keydown",direction);



function direction(event){
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
        
        t=SkasitteleLiike_L(viesti,unittix,unittiy);
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
        SseuraavaUnitti_L();
        
        tarkastaOnkoRuudulla();

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
function draw(){
    // Piirretaan maasto
    let tulostettavaPala = new Image();
    
    Stee_nako_L();

    for( let i = 0; i < ruutuxkoko ; i++){
        for( let j = 0; j < ruutuykoko ; j++){ 
            tulostettavaPala=SmikaPalaKuva_L(ruutux+i,ruutuy+j);
            ctx.drawImage(tulostettavaPala,i*blokkikoko,j*blokkikoko);
        }
    }       
    
    // piirretaan lopuksi unitti
    if(vilkku==false) {
        // ei nay eli laitetaan
        // tassa pitas hakea oikea maastopala jos olisikin vesi
        tulostettavaPala=SmikaPalaUnitti_L(unittix,unittiy);
        ctx.drawImage(tulostettavaPala,(unittix-ruutux)*blokkikoko,(unittiy-ruutuy)*blokkikoko); 
        
        //ctx.drawImage(unittikuva,(unittix-ruutux)*blokkikoko,(unittiy-ruutuy)*blokkikoko); 
        vilkku=true;
    } else {
        // nakyy-> eli maan vuoro 
        // tassa pitas hakea oikea maastopala jos olisikin vesi
        tulostettavaPala=SmikaPalaMaasto_L(unittix,unittiy);
        ctx.drawImage(tulostettavaPala,(unittix-ruutux)*blokkikoko,(unittiy-ruutuy)*blokkikoko); 
        vilkku=false;
    }
    //ctx.fillStyle = "white";
    //ctx.font = "bold 20px sans-serif";
    //ctx.fillText("unum="+SaktiivinenUnitti+" x="+unittix+" y="+unittiy+" lp"+Sunitit[SaktiivinenUnitti].lp,0,20);
    //ctx.fillText("pelaaja="+pelaaja+" unitin om="+Sunitit[SaktiivinenUnitti].omistaja,0,40);
}





/* tahan tulee serverin kutsu rutiini */


function SseuraavaUnitti_L() {
    SseuraavaUnitti();
}

function SmikaPalaMaasto_L(ux,uy) {
    pal=SmikaPalaMaasto(ux,uy);
    if(pal=="maa") {
        pal=maa_kuva;

    } else if(pal="vesi") {
        pal=vesi_kuva;
    }

    return(pal);
}

function SmikaPalaKuva_L(ux,uy) {
    pal=SmikaPalaKuva(ux,uy);
/*    if(pal=="maa") {
        pal=maa_kuva;

    } else if(pal="vesi") {
        pal=vesi_kuva;
    } else if(pal)


*/

    return(pal);
}


function SmikaPalaUnitti_L(ux,uy) {
    pal=SmikaPalaUnitti(ux,uy);
    return(pal);
}


function Stee_nako_L() {
    Stee_nako();
}

function SseuraavaUnitti_L() {
    SseuraavaUnitti();
}

function SkasitteleLiike_L(t,x,y) {
    ret=SkasitteleLiike(t,x,y);
    return(ret);
}

function SalustaKartta_L() {
    SalustaKartta();
    
}

function SalustakarttaPelaaja_L() {
    SalustakarttaPelaaja();
}

function Salustaunitit_L() {
    Salustaunitit();
}





