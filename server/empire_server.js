const express = require('express');
const app = express();
 
app.use(express.json());
 










app.get('/Steenako', (req, res) => {
     //a = JSON.stringify(games);
     //console.log("lähetä stringi="+a);
     //console.log("lähetä json="+games);
     //
     //console.log("Nako kutsuttu");
     Stee_nako();
     joku = [{"joku": "jotain"}];
     
     a = JSON.stringify(joku);
     res.send(a);
});
 


app.get('/SseuraavaUnitti', (req, res) => {
    
    //console.log("lähetä stringi="+a);
    //console.log("lähetä json="+games);
    //
   // console.log("SseuraavaUnitti kutsuttu");
    olio=SseuraavaUnitti();

          

    a = JSON.stringify(olio);
    //console.log("palautetaan stringi="+a);
    //console.log("lähetä json="+siirto_olio);
    
    res.send(a);
    //console.log("lähetä stringi="+a);
    //res.send("SseuraavaUnitti kutsuttu");
});




app.get('/SkasitteleLiike/:id1/:id2/:id3', (req, res) => {

    
    ekaluku =parseInt(req.params.id1);
    tokaluku= parseInt(req.params.id2);
    kolmasluku= parseInt(req.params.id3);
    
    //console.log("id1="+ekaluku+" id2="+tokaluku+" id3="+kolmasluku);
    
    var t="JOKU";

     // lasketaan liikepiste
     if(ekaluku==8){
        t="UP"
    } else if(ekaluku==2) {
        t="DOWN"
    } else if(ekaluku==4) {
        t="LEFT"
    } else if(ekaluku==6) {
        t="RIGHT"
    } else if(ekaluku==3) {
        t="DOWNRIGHT"
    } else if(ekaluku==1) {
        t="DOWNLEFT"
    } else if(ekaluku==9) {
        t="UPRIGHT"
    } else if(ekaluku==7) {
        t="UPLEFT"
    }
    console.log("id1="+ekaluku+" tapahtuma"+t+" id2="+tokaluku+" id3="+kolmasluku);

    intti=SkasitteleLiike(t,tokaluku,kolmasluku);
    
    palautus_olio= [{"tieto1": 10,
                     "tieto2": 12}];
                     
                     

    a = JSON.stringify(palautus_olio);
    console.log("palautetaan stringi="+a);
    console.log("lähetä json="+palautus_olio);
    
    res.send(a);
});
 

app.get('/SmikaPalaMaasto/:id1/:id2', (req, res) => {

    
    ekaluku =parseInt(req.params.id1);
    tokaluku= parseInt(req.params.id2);
        
    //console.log("id1="+ekaluku+" id2="+tokaluku+" id3="+kolmasluku);
    
   // console.log("id1="+ekaluku+" tapahtuma"+" id2="+tokaluku);

    palanimi=SmikaPalaMaasto(ekaluku,tokaluku);
    
    siirto_olio = [{ 
        "ret": palanimi,
    }];

    console.log("SmikaPalaMaasto palautettavan palan nimi "+palanimi);
    a = JSON.stringify(siirto_olio);
    //console.log("palautetaan stringi="+palanimi);
    //console.log("lähetä stringi="+a);
    
    res.send(a);
});
 
app.get('/SmikaPalaKuva/:id1/:id2', (req, res) => {

    
    ekaluku =parseInt(req.params.id1);
    tokaluku= parseInt(req.params.id2);
        
    //console.log("id1="+ekaluku+" id2="+tokaluku+" id3="+kolmasluku);
    
   // console.log("id1="+ekaluku+" id2="+tokaluku);

    palanimi=SmikaPalaKuva(ekaluku,tokaluku);
    
    siirto_olio = [{ 
        "ret": palanimi,
    }];
    
    console.log("SmikaPalaKuva palautettavan palan nimi "+palanimi);
    a = JSON.stringify(siirto_olio);
    
    
    res.send(a);
});
 



app.get('/SmikaPalaUnitti/:id1/:id2', (req, res) => {

    
    ekaluku =parseInt(req.params.id1);
    tokaluku= parseInt(req.params.id2);
        
    //console.log("id1="+ekaluku+" id2="+tokaluku+" id3="+kolmasluku);
    
   // console.log("id1="+ekaluku+" id2="+tokaluku);

    palanimi=SmikaPalaUnitti(ekaluku,tokaluku);
    

    console.log("SmikaPalaUnitti palautettavan palan nimi "+palanimi);
    siirto_olio = [{ 
        "ret": palanimi,
    }];
    

    a = JSON.stringify(siirto_olio);
    //console.log("palautetaan stringi="+palanimi);
    //console.log("lähetä json="+siirto_olio);
    
    res.send(a);
});
















//aktiivisen pelaajan väri
// TAMA PITÄNEE SIIRTÄÄ PARAMETREIHIN

pelaaja="white";

/*
    serverin paan juttuja
*/
let Skarttaxkoko=900;
let Skarttaykoko=900;
let pelaajienmaara=100;

spelaajat= [];
let Smkartta = [];
let Smkarttapelaaja = [];

// liikuteltavan unitin indeksi
//let SaktiivinenUnitti=0;

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
        if (this.tyyppi=="tankki" && nimi=="maa") {
            // paasee
            return(true);
        }      
        if (this.tyyppi=="laiva" && nimi=="vesi") {
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

class pelaajaluokka {
    constructor (tunnus, salasana, koodi) {
        this.tunnus=tunnus;
        this.salasana=salasana;
        this.koodi=koodi;

    }

}

/* Alustuksia */
SalustaKartta();
SalustakarttaPelaaja();

SalustaPelaajat();
Salustaunitit();


/* SERVERI TÄÄLLÄ */
              
/*
    Nämä ovat periaateessa serverilla olevia ja tarvittavia tietoja
*/




// paivittaa glob muuttujiin seuraavan yksikon tiedot
// PELAAJA MUUTTUJA KÄYTÖSSÄ

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
       
                
        unittix=Sunitit[seuraavaunitti].x;
        unittiy=Sunitit[seuraavaunitti].y;
        console.log("seuraavunitti="+seuraavaunitti+" x="+unittix+"y="+unittiy);
        return([{"x":unittix, "y":unittiy}]);
        
        
        //SaktiivinenUnitti=seuraavaunitti;


        //unittivari=SnextUnitColor(seuraavaunitti);
        //unittityyppi=SnextUnitType(seuraavaunitti);
      //  unittikuva=SnextUnitKuva(seuraavaunitti);

        
    } else {
        // Ei löydy enää unitteja siirrettäväksi
        console.log("rundi loppu");
    }

}

// TIETYLLÄ TAPAA PELAAJATIETO KÄYTÖSSÄ KOSKA SMKARTTAPELAAJA ALUSTETTU SEN MUKAAN
function SmikaPalaKuva(x, y) {
    pala=Smkarttapelaaja[x][y];
    
    return(pala);
}


function SmikaPalaMaasto(x, y) {
    //console.log("Mikapala maasto x="+x+ " y="+y);
    return(Smkartta[x][y]);
}

function SmikaPalaUnitti(x, y) {
    
    i=SonkoUnitti(x,y);
    if(i==-1) {
        console.log("tanne ei pitas paasta kun haetaan vilkkuvan unitin numeroa");
        i=0; /// HÄTÄ KORJAUS KORJAA JOS EI VILKU
    }
    
    return(Sunitit[i].kuva);
}


// PELAAJA TIETO KÄYTÖSSÄ

function SkasitteleLiike(tapahtuma,x,y){
    // pitaa analysoida liikkeen jälkeinen tapahtuma

    unittinum=SonkoUnitti(x,y);
    if(unittinum==-1) {
        console.log("SKasittele liike ei loyytnyt unittia");
        // korjaus etei kaadu debuggauksessa
        unittinum=1;
    }

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
        kohdey=Sunitit[unittinum].y+1;
    } else if(tapahtuma=="UPRIGHT") {
        kohdex=Sunitit[unittinum].x+1;
        kohdey=Sunitit[unittinum].y-1;
    } else if(tapahtuma=="UPLEFT") {
        kohdex=Sunitit[unittinum].x-1;
        kohdey=Sunitit[unittinum].y-1;
    }
   
    //console.log("kohdex="+kohdex+" kohdey="+kohdey+" unittinum="+unittinum);

    
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
   
    console.log(tulostapahtuma+" tulos "+tulos);

    // pitaa tehda liike serverin puolella

    if(tulostapahtuma=="PAASEE_EI_UNIT") {
        Sunitit[unittinum].x=kohdex;
        Sunitit[unittinum].y=kohdey;
        Sunitit[unittinum].lp--;
        console.log("Serverin liikkeen oikea teko unittinum"+unittinum+"kohdex="+kohdex+"kohdey"+kohdey);
    } else if(tulostapahtuma=="PAASEE_VIH_UNIT" ) {
       
        a=Math.floor(Math.random() * (10 - 1 + 1));
        if(a>=5) {
            // hyokkaaja voitti
            console.log("voitit tulos"+tulos);
            Sunitit[unittinum].x=kohdex;
            Sunitit[unittinum].y=kohdey;
            Sunitit[unittinum].lp--;
            
            StuhoaUnitti(tulos);
            
        } else {
            // puolustaja voitti
            console.log("hävisit tulos"+tulos);
            Smkarttapelaaja[Sunitit[unittinum].x][Sunitit[unittinum].y]=Smkartta[Sunitit[unittinum].x][Sunitit[unittinum].y];
            StuhoaUnitti(unittinum);
        }



    } else if(tulostapahtuma=="PAASEE_OMA_UNIT" || tulostapahtuma=="EI_PAASE_OMA_UNIT") {
        // on oma unitti... paasee tai ei
        //katsotaan meneekö kyytiin
        if(Sunitit[tulos].sisaan_tyyppi!="tyhja") {
            // on transu tyyppi
            console.log("kohde on transu");
            if(Sunitit[tulos].sisaan_tyyppi == Sunitit[unittinum].tyyppi) {
                // on oikea tyyppi
                console.log("on oikea tyyppi");
                if(Sunitit[tulos].tilaa>0){
                    // nyt menisi siaan
                    console.log("menisi sisaan");
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



// tehdaan nakemisrutiini kaikille pelaajan uniteille
// vahan hullua kutsua joka piirtokerralla tosin
function Stee_nako() {
    
    console.log("Ollaan serverin nakotekorutiinissa");
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
                            //if(Sunitit[w].omistaja=="white") {
                              //  if(Sunitit[w].tyyppi=="tankki") {
                                //    Smkarttapelaaja[j][k]=tankki_white_kuva;    
                                //} else if(Sunitit[w].tyyppi=="laiva" ) {
                                    //Smkarttapelaaja[j][k]=laiva_white_kuva;
                                    Smkarttapelaaja[j][k]=Sunitit[w].kuva;
                                    
                                //}
                            //} else if(Sunitit[w].omistaja=="RED") {
                              //  if(Sunitit[w].tyyppi=="tankki") {
                                //    Smkarttapelaaja[j][k]=tankki_red_kuva;    
                                //} else if(Sunitit[w].tyyppi=="laiva" ) {
                                  //  Smkarttapelaaja[j][k]=laiva_red_kuva;
                                //}
                            //} else if(Sunitit[w].omistaja=="YELLOW") {
                                //if(Sunitit[w].tyyppi=="tankki") {
                                  //  Smkarttapelaaja[j][k]=tankki_yellow_kuva;    
                                //} else if(Sunitit[w].tyyppi=="laiva" ) {
                                    //Smkarttapelaaja[j][k]=laiva_yellow_kuva;
                                //}
                          //  }
                        }
                    }
                }
            }   
        } 
    }
    console.log("poistutaan serverin nakotekorutiinissa");
}

function SonkoUnitti(x,y)
{
    onko_unittia=false;
    for(let i=0;i<=SunittienMaara;i++){
        if(Sunitit[i].x==x && Sunitit[i].y==y && Sunitit[i].missasisalla==-1) {
            turva_i=i;
            onko_unittia=true;
            //console.log("löyty unitti");
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

function SalustaPelaajat() {
    spelaajat[0]=new pelaajaluokka("or","peppu","1234");
    spelaajat[1]=new pelaajaluokka("ar","perse","5678");
    spelaajat[2]=new pelaajaluokka("kari","beba","0987");
    pelaajienmaara=2;
}

function SalustaKartta() {
    console.log("Kartta alustettu");
    for(let i=0;i<Skarttaxkoko;i++) {
        for(let j=0;j<Skarttaykoko;j++) {
             Smkartta[i][j]="maa";
        }    
    }
    Smkartta[10][10]="vesi";
    Smkartta[10][11]="vesi";
    Smkartta[10][12]="vesi";
    Smkartta[11][10]="vesi";
    Smkartta[11][11]="vesi";
    Smkartta[11][12]="vesi";
}

function SalustakarttaPelaaja() {
    console.log("Pelaajan kartta alustettu");
    for(let i=0;i<Skarttaxkoko;i++) {
        for(let j=0;j<Skarttaykoko;j++) {
             Smkarttapelaaja[i][j]="tyhja";
        }    
    }
}


function Salustaunitit() {
    // PERIAATTEESSA TUO 'tankkiwhite' yms. on turha kun saisi pääteltyä kahdesta edellisestä
    console.log("Unitit alustettu");
    
    Sunitit[0]=new Sunitti(9,10,5,"tankki","white", "tankkiwhite", "tyhja",0,-1);
    Sunitit[1]=new Sunitti(9,11,6,"tankki","white", "tankkiwhite","tyhja",0,-1);
    Sunitit[2]=new Sunitti(8,10,6,"tankki","RED", "tankkired","tyhja",0,-1);
    Sunitit[3]=new Sunitti(11,10,6,"laiva","white", "laivawhite","tyhja",0,-1);
    Sunitit[4]=new Sunitti(10,10,6,"laiva","white", "transuwhite","tankki",3,-1);
    SunittienMaara=4;
}


app.get('/SmikaPelaajaTunnus/:id1/:id2', (req, res) => {

    
    eka =req.params.id1;
    toka= req.params.id2;
        
    console.log("id1="+eka+" id2="+toka);
    loyty=false;
   // console.log("id1="+ekaluku+" id2="+tokaluku);

    //palanimi=SmikaPalaKuva(ekaluku,tokaluku);
    
    for(let w=0;w<=pelaajienmaara;w++) {
        if(spelaajat[w].tunnus==eka && spelaajat[w].salasana==toka) {
            // Loytyi
            siirto_olio = [{ 
                "ret": spelaajat[w].koodi,
            }];        
            loyty=true;
        }
    }

    if(loyty==false) {
        siirto_olio = [{ 
            "ret": "666",
        }];        

    }
    

    a = JSON.stringify(siirto_olio);
    console.log("Pelaaja tunnus rend palautus="+a);    
    
    res.send(a);
});




const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));



