1. ADMIN - tabele - kategorija se nije videla kada je napravljena
2. ADMIN - tabele - zabrani brisanje stavki koje imaju podstavke

DEPLOY STEPS FRONTEND
1. ANGULAR - npm run prod
2. WIN SCP - transfer files (DIST/electro-vision -> electrovision/angular)

DEPLOY STEPS BACKEND
1. WIN SCP - transfer files (electrovision-backend/express -> electrovision/express)
2. PUTTY - MVPS load - Login as: root / 4rfj KZC qgg hHzt
3. CONSOLE 
    - cd electrovision
    - forever list
    - forever stop 0
    - sudo   forever   start   --minUptime 1000   --spinSleepTime 1000   server.js 

TODO                                                    
                                             
* PROIZVODI
- Izaberi brend (izbriši)
- Napraviti opciju da kada se uđe u određenu potkategoriju (DVR,NVR) mogu da se odaberu određeni filteri / filteri mogu biti sa padajućim menijem i bilo bi dobro da mogu da se čekiraju.
  Npr: kao ovo što si napravio brendove do sada. Samo da može da se čekiraju. Neka stoje ispod 1.SVE KATEGORIJE 2.VIDEO NADZOR. 3.DVR/NVR
-Filtere napravi da mogu da pravim za svaku potkategoriju i njih dodeljujem proizvodima kada ih pravim. Npr. DVR UREĐAJI (imaju filtere : BREND: (HIKVISION,FARADAY,DAHUA,DVC) ; KANALI (4 KANALNI,8 KANALNI,16 KANALNI,32 KANALNI) ; REZOLUCIJA (DO 2MEGAPIXELA , OD2 DO 5 MEGAPIXEA , DO 8 MEGAPIXELA)
-Kada pravim proizvod ja mu dodeljujem filter (kada ga smestim u potkategoriju recimo dvr uredjaji , ispod mu stavim i filtere hikvision,4kanalni,do 2megapixela)

KOD FINALNOG PROIZVODA (IZGLED) 
-Omogućiti da mogu da boldiram i stavljam neki deo texta crvenim slovima recimo da naglasim nešto
-Napraviti opciju da imam dve cene akcijska i stara cena recimo i da piše ispod akcijske cene vazi od 01.09 do 10.09 recimo a kada unsem akcijsku da glavna cena bude precrtana
Omogućiti da se stave dve manje slike dodatne ispod glavne slike koja može da se zumira. Ali da to ne bude obavezno već opcija samo za proizvode koji imaju više slika
-Uz dodaj u korpu da stoji kao sto si prepravio u korpi opcija + - 1 (pa da može i tu recimo neko da stavi odmah 3 komada , da ne ispravlja tek u korpi

-Glavna slicica neka bude u pravcu sa nazivom paralelno po horizontali a iznad slike neka stoji vraćanje nazad na kategoriju i potkategoriju.
-Kao što si stavio opciju kada uđeš u polje gde je opis da na skrol ide gore dole. tako napravi i za slične proizvode ispod da mogu skrolovanjem kada se uđe u tu oblast da se pomera levo desno na skrol.
 

*CENOVNIK
-Uz svaku oblast cenovnika staviti sličicu koja može da se povuče i sa kategorija (čisto malo estetski da ulepšamo)

*GALERIJA
-Udaljiti plavu liniju i slike od menija gde su kategorije simetrično kao na levoj strani
ispod galerija slika staviti ikonicu youtube i napisati text u nastavku posetite naš kanal na youtube klikom na ikonicu i text da šalje na youtube kanal.
-Izmenjaj svuda youtube kanal sa elektronike jeremic na electrovision kanal sam napravio
i instagram profil promeni na electrovision.rs tako je sad na instagramu

*KORPA
-Korpa u desnom uglu ako može da ima mali crveni kružić gde će da stoji broj proizvoda koji je ubačen u korpu.
ostale korpe ne trebaju da imaju taj kružić
-Kada je neko u korpi i klikne na proizvod omogući da može ponovo da ga pošalje na link tog proizvoda.

*KONTAKT
-Umesto brojeva staviti ikonice
-Izbrisati kupujem prodajem
-Ispod svih podataka postaviti opciju ime i prezime prazno polje, telefon prazno polje mail adresa prazno polje i ispod veće polje posaljit poruku


KOMPLETI*** u redu gde su početna proizvodi o nama .. itd da stoji posle proizvoda
I KOMPLETI koji će izgledati isto kao što izgledaju proizvodi IMAĆE (VIDEO NADZOR) ALARMNI SISTEMI (MOTORI ZA KAPIJE I  RAMPE) (INTERFONI I KONTROLA PRISTUPA)
Kad se klikne na neku od tih kategorija odmah izlaze proizvodi (bez potkategorija) to će biti gotove kompletne ponude 
NPR. video nadzor 4 kamere komplet / video nadzor 8 kamera komplet itd