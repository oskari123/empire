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
let unittivari="WHITE"; //naytettavan unitin väri
let unittityyppi="TANKKI";  //naytettavan unitin tyyppi (kuva)
let unittikuva= new Image();

//aktiivisen pelaajan väri
pelaaja="WHITE";


/*
    serverin paan juttuja
*/
let Skarttaxkoko=900;
let Skarttaykoko=900;

let Smkartta = [];
let Smkarttapelaaja = [];

// liikuteltavan unitin indeksi
let SaktiivinenUnitti=0;

for(let i=0;i<Skarttaxkoko;i++) {
    Smkartta [i] = [];
    Smkarttapelaaja [i] = [];
}



class Sunitti  { 
    constructor (x, y, lp, tyyppi, omistaja, kuva, sisaan_tyyppi, tilaa,missasisalla) 
    {
        this.x=x;
        this.y=y;
        this.lp=lp;
        this.tyyppi=tyyppi;
        this.omistaja=omistaja;
        this.kuva=kuva;
        this.sisaan_tyyppi=sisaan_tyyppi;
        this.tilaa=tilaa;
        this.missasisalla=missasisalla;
    }

    paaseeko(nimi) {
        if (this.tyyppi=="TANKKI" && nimi==maa_kuva) {
            // paasee
            return(true);
        }      
        if (this.tyyppi=="LAIVA" && nimi==vesi_kuva) {
            // paasee
            return(true);
        }      
        return(false);
    }
}
Sunitit= [];

class Smpala {
        
    constructor (kuva, nimi) 
    {
        this.kuva=kuva;
        this.nimi=nimi;
    }
}

class tapahtumaX {
    constructor (voittajai, haviajai, voittajahp) 
    {
        this.voittajai=voittajai;
        this.haviajai=haviajai;
        this.voittajahp=voittajahp;
    }
}

/* 
    Client puolen alustus
*/

let vilkku=false;       //kaytetaan unitin vilkuttamiseen

// load images

const maa_kuva = new Image();
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










/* 
    alun asetus
*/
SalustaKartta();
SalustakarttaPelaaja();

Salustaunitit();
// haetaan seuraan pelaajan unitin tiedot glob muuttujiin
SseuraavaUnitti();
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
        
        t=SkasitteleLiike(viesti, SaktiivinenUnitti);

        // tässä ilmoitetaan tapahtuma tulos
        // 1. pääsee  ei unittia -> liiku
        // 2. paase , oma -> meneeko sisaan vai onko liikkumisesto
        // 3. paasee , vihollinen -> hyokkays
        // 4. ei pääse ei unittia
        // 5. ei pääse , oma unitti -> meneeko sisään 
        // 6.  ei pääse ,  viholline -> sivuyokkays

     
/*
        if(tapahtuma=="PAASEE_EI_UNIT") {
            //alert("PAASEE_EI_UNIT");
        
        
        } else {
            if(tapahtuma=="PAASEE_OMA_UNIT") {
                alert("PAASEE_OMA_UNIT");
            } else {
                if(tapahtuma=="PAASEE_VIH_UNIT") {
                    alert("PAASEE_VIH_UNIT");
                } else {
                    if(tapahtuma=="EI_PAASE_EI_UNIT") {
                        alert("EI_PAASE_EI_UNIT");
                    } else {
                        if(tapahtuma=="EI_PAASE_OMA_UNIT") {
                            alert("EI_PAASE_OMA_UNIT");
                        } else {
                            if(tapahtuma=="EI_PAASE_VIH_UNIT") {
                                alert("EI_PAASE_VIH_UNIT");
                            } else {
                                alert("tanne ei saa päästa");
                            }
                        }
                    }
                }
            }
        }*/
   
        /*  Painalluksen jälkeen ja toimintojen jälkeen
            haetaan seuraava unitti joka on vuorossa (voi olla sama)
        */
        SseuraavaUnitti();
        
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
    
    Stee_nako();

    for( let i = 0; i < ruutuxkoko ; i++){
        for( let j = 0; j < ruutuykoko ; j++){ 
            tulostettavaPala=SmikaPalaKuva(ruutux+i,ruutuy+j);
            ctx.drawImage(tulostettavaPala,i*blokkikoko,j*blokkikoko);
        }
    }       
    
    // piirretaan lopuksi unitti
    if(vilkku==false) {
        // ei nay eli laitetaan
        // tassa pitas hakea oikea maastopala jos olisikin vesi
        ctx.drawImage(unittikuva,(unittix-ruutux)*blokkikoko,(unittiy-ruutuy)*blokkikoko); 
        vilkku=true;
    } else {
        // nakyy-> eli maan vuoro 
        // tassa pitas hakea oikea maastopala jos olisikin vesi
        tulostettavaPala=SmikaPalaMaasto(unittix,unittiy);
        ctx.drawImage(tulostettavaPala,(unittix-ruutux)*blokkikoko,(unittiy-ruutuy)*blokkikoko); 
        vilkku=false;
    }
    ctx.fillStyle = "white";
    ctx.font = "bold 20px sans-serif";
    ctx.fillText("unum="+SaktiivinenUnitti+" x="+unittix+" y="+unittiy+" lp"+Sunitit[SaktiivinenUnitti].lp,0,20);
    ctx.fillText("pelaaja="+pelaaja+" unitin om="+Sunitit[SaktiivinenUnitti].omistaja,0,40);
}







/* SERVERI TÄÄLLÄ */
              
/*
    Nämä ovat periaateessa serverilla olevia ja tarvittavia tietoja
*/




// paivittaa glob muuttujiin seuraavan yksikon tiedot
function SseuraavaUnitti() {
    let onko_unittia=false;
    for(let i=SunittienMaara;i>=0;i--){
        if(Sunitit[i].omistaja==pelaaja && Sunitit[i].lp>0) {
            seuraavaunitti=i;
            onko_unittia=true;
        } 
    }

    
    if(onko_unittia==true) {
        
        /*
            TÄSSÄ ON EPÄMÄÄRÄINEN TIEDONSIIRTO SERVERILTA CLIENTIN GLOBAALEIHIN MUUTTUJIIN
        */
        unittix=SnextUnitX(seuraavaunitti);
        unittiy=SnextUnitY(seuraavaunitti);
        unittivari=SnextUnitColor(seuraavaunitti);
        unittityyppi=SnextUnitType(seuraavaunitti);
        unittikuva=SnextUnitKuva(seuraavaunitti);

        SaktiivinenUnitti=seuraavaunitti;
    } else {
        // Ei löydy enää unitteja siirrettäväksi
        alert("rundi loppu");
    }

}


function SmikaPalaKuva(x, y) {
    
       
    pala=Smkarttapelaaja[x][y];
    
    return(pala);
}


function SmikaPalaMaasto(x, y) {
    return(Smkartta[x][y]);
}


function SkasitteleLiike(tapahtuma, unittinum){
    // pitaa analysoida liikkeen jälkeinen tapahtuma

    //katso onko nappulaa
    //katso pääseekö
    let kohdex, kohdey;
    // vaihtoehdot
    // 1. pääsee  ei unittia -> liiku
    // 2. paase , oma -> meneeko sisaan vai onko liikkumisesto
    // 3. paasee , vihollinen -> hyokkays
    // 4. ei pääse ei unittia
    // 5. ei pääse , oma unitti -> meneeko sisään 
    // 6.  ei pääse ,  viholline -> sivuyokkays

    // eli KUUSI eri eventtitapahtumaan liikkeen jalkeen

    // lasketaan liikepiste
    if(tapahtuma=="UP"){
        kohdey=Sunitit[unittinum].y-1;
        kohdex=Sunitit[unittinum].x;
    } else if(tapahtuma=="DOWN") {
        kohdex=Sunitit[unittinum].x;
        kohdey=Sunitit[unittinum].y+1;
    } else if(tapahtuma=="LEFT") {
        kohdey=Sunitit[unittinum].y;
        kohdex=Sunitit[unittinum].x-1;
    } else if(tapahtuma=="RIGHT") {
        kohdey=Sunitit[unittinum].y;
        kohdex=Sunitit[unittinum].x+1;
    }else if(tapahtuma=="DOWNRIGHT") {
        kohdex=Sunitit[unittinum].x+1;
        kohdey=Sunitit[unittinum].y+1;
    } else if(tapahtuma=="DOWNLEFT") {
        kohdex=Sunitit[unittinum].x-1;
        kohdey=Sunitit[unittinumi].y+1;
    } else if(tapahtuma=="UPRIGHT") {
        kohdex=Sunitit[unittinum].x+1;
        kohdey=Sunitit[unittinum].y-1;
    } else if(tapahtuma=="UPLEFT") {
        kohdex=Sunitit[unittinum].x-1;
        kohdey=Sunitit[unittinum].y-1;
    }
   
    //alert("kohdex="+kohdex+" kohdey="+kohdey+" unittinum="+unittinum);

    
    if((Sunitit[unittinum].paaseeko(Smkartta[kohdex][kohdey]))==true)
    {
        // Paasee ruutuun
        tulos=SonkoUnitti(kohdex,kohdey)        ;
        if(tulos==-1) {
            // paasee EI UNITTIA
            tulostapahtuma="PAASEE_EI_UNIT";  
        } else {
            // unitti
            if(Sunitit[tulos].omistaja==pelaaja) {
                // Oma unitti
                tulostapahtuma="PAASEE_OMA_UNIT"
            } else {
                // vihollisen
                tulostapahtuma="PAASEE_VIH_UNIT"
                
               
            }


        }
    } else {
       // ei paase ruutuun
       tulos=SonkoUnitti(kohdex,kohdey)        ;
       if(tulos==-1) {
           // EI PAASE EI UNITTIA EI UNITTIA
           tulostapahtuma="EI_PAASE_EI_UNIT";  
       } else {
           // unitti
           if(Sunitit[tulos].omistaja==pelaaja) {
               // Oma unitti
               tulostapahtuma="EI_PAASE_OMA_UNIT";  
           } else {
               // vihollisen
               tulostapahtuma="EI_PAASE_VIH_UNIT";  
           }


       }
      
    }
   
    alert(tulostapahtuma+" tulos "+tulos);

    // pitaa tehda liike serverin puolella

    if(tulostapahtuma=="PAASEE_EI_UNIT") {
        Sunitit[unittinum].x=kohdex;
        Sunitit[unittinum].y=kohdey;
        Sunitit[unittinum].lp--;
    } else if(tulostapahtuma=="PAASEE_VIH_UNIT" ) {
       
        a=Math.floor(Math.random() * (10 - 1 + 1));
        if(a>=5) {
            // hyokkaaja voitti
            alert("voitit tulos"+tulos);
            Sunitit[unittinum].x=kohdex;
            Sunitit[unittinum].y=kohdey;
            Sunitit[unittinum].lp--;
            
            StuhoaUnitti(tulos);
            
        } else {
            // puolustaja voitti
            alert("hävisit tulos"+tulos);
            Smkarttapelaaja[Sunitit[unittinum].x][Sunitit[unittinum].y]=Smkartta[Sunitit[unittinum].x][Sunitit[unittinum].y];
            StuhoaUnitti(unittinum);
        }



    } else if(tulostapahtuma=="PAASEE_OMA_UNIT" || tulostapahtuma=="EI_PAASE_OMA_UNIT") {
        // on oma unitti... paasee tai ei
        //katsotaan meneekö kyytiin
        if(Sunitit[tulos].sisaan_tyyppi!="tyhja") {
            // on transu tyyppi
            alert("kohde on transu");
            if(Sunitit[tulos].sisaan_tyyppi == Sunitit[unittinum].tyyppi) {
                // on oikea tyyppi
                alert("on oikea tyyppi");
                if(Sunitit[tulos].tilaa>0){
                    // nyt menisi siaan
                    alert("menisi sisaan");
                    Sunitit[tulos].tilaa--;
                    Sunitit[unittinum].missasisalla=tulos;
                    Sunitit[unittinum].lp=0;
                   // Sunitit[unittinum].x=-1;
                   // Sunitit[unittinum].y=-1;
                    Smkarttapelaaja[Sunitit[unittinum].x][Sunitit[unittinum].y]=Smkartta[Sunitit[unittinum].x][Sunitit[unittinum].y];        
                }
            }
        }



    }
    t = new tapahtumaX(1,1,2);
    return(t);
 
}

function StuhoaUnitti(i) {
    Sunitit[i].x=0;
    Sunitit[i].y=0;
    Sunitit[i].lp=0;
    Sunitit[i].tyyppi=0;
    Sunitit[i].omistaja=0;
    Sunitit[i].kuva=0;

}

function SnextUnitX(seuraavaunitti) {
    
    
    return(Sunitit[seuraavaunitti].x);
}

function SnextUnitY(seuraavaunitti) {
    return(Sunitit[seuraavaunitti].y);
}

function SnextUnitColor(seuraavaunitti) {
    return(Sunitit[seuraavaunitti].omistaja);
}

function SnextUnitType(seuraavaunitti) {
    return(Sunitit[seuraavaunitti].tyyppi);
}

function SnextUnitKuva(seuraavaunitti) {
    return(Sunitit[seuraavaunitti].kuva);
}


// tehdaan nakemisrutiini kaikille pelaajan uniteille
// vahan hullua kutsua joka piirtokerralla tosin
function Stee_nako() {
    
    for(let i=0;i<=SunittienMaara; i++) {
        if(Sunitit[i].omistaja==pelaaja) {
            // on pelaajan unitti  
            let xx,yy;

            xx=Sunitit[i].x;
            yy=Sunitit[i].y;

            // skannataan ymparisto
            for(let j=xx-1;j<=xx+1;j++) {
                for(let k=yy-1;k<=yy+1;k++) {
                    Smkarttapelaaja[j][k]=Smkartta[j][k];
                    
                    
                    for(let w=0;w<=SunittienMaara;w++) {
                        if(Sunitit[w].x==j && Sunitit[w].y==k && Sunitit[w].missasisalla==-1) {
                            // on unitti samassa
                            //if(Sunitit[w].omistaja=="WHITE") {
                              //  if(Sunitit[w].tyyppi=="TANKKI") {
                                //    Smkarttapelaaja[j][k]=tankki_white_kuva;    
                                //} else if(Sunitit[w].tyyppi=="LAIVA" ) {
                                    //Smkarttapelaaja[j][k]=laiva_white_kuva;
                                    Smkarttapelaaja[j][k]=Sunitit[w].kuva;
                                    
                                //}
                            //} else if(Sunitit[w].omistaja=="RED") {
                              //  if(Sunitit[w].tyyppi=="TANKKI") {
                                //    Smkarttapelaaja[j][k]=tankki_red_kuva;    
                                //} else if(Sunitit[w].tyyppi=="LAIVA" ) {
                                  //  Smkarttapelaaja[j][k]=laiva_red_kuva;
                                //}
                            //} else if(Sunitit[w].omistaja=="YELLOW") {
                                //if(Sunitit[w].tyyppi=="TANKKI") {
                                  //  Smkarttapelaaja[j][k]=tankki_yellow_kuva;    
                                //} else if(Sunitit[w].tyyppi=="LAIVA" ) {
                                    //Smkarttapelaaja[j][k]=laiva_yellow_kuva;
                                //}
                          //  }
                        }
                    }
                }
            }   
        } 
    }
}

function SonkoUnitti(x,y)
{
    onko_unittia=false;
    for(let i=0;i<=SunittienMaara;i++){
        if(Sunitit[i].x==x && Sunitit[i].y==y && Sunitit[i].missasisalla==-1) {
            turva_i=i;
            onko_unittia=true;
            //alert("löyty unitti");
        } 
    }
    if(onko_unittia==true) {
        return(turva_i);

    } else {
        return(-1);
    }
}


//
//  Alustuksia Serverin pää
//
function SalustaKartta() {
    for(let i=0;i<Skarttaxkoko;i++) {
        for(let j=0;j<Skarttaykoko;j++) {
             Smkartta[i][j]=maa_kuva;
        }    
    }
    Smkartta[10][10]=vesi_kuva;
    Smkartta[10][11]=vesi_kuva;
    Smkartta[10][12]=vesi_kuva;
    Smkartta[11][10]=vesi_kuva;
    Smkartta[11][11]=vesi_kuva;
    Smkartta[11][12]=vesi_kuva;
}

function SalustakarttaPelaaja() {
    for(let i=0;i<Skarttaxkoko;i++) {
        for(let j=0;j<Skarttaykoko;j++) {
             Smkarttapelaaja[i][j]=tyhja_kuva;
        }    
    }
}


function Salustaunitit() {
    Sunitit[0]=new Sunitti(9,10,5,"TANKKI","WHITE", tankki_white_kuva, "tyhja",0,-1);
    Sunitit[1]=new Sunitti(9,11,6,"TANKKI","WHITE", tankki_white_kuva,"tyhja",0,-1);
    Sunitit[2]=new Sunitti(8,10,6,"TANKKI","RED", tankki_red_kuva,"tyhja",0,-1);
    Sunitit[3]=new Sunitti(11,10,6,"LAIVA","WHITE", laiva_white_kuva,"tyhja",0,-1);
    Sunitit[4]=new Sunitti(10,10,6,"LAIVA","WHITE", transu_white_kuva,"TANKKI",3,-1);
    SunittienMaara=4;
}






