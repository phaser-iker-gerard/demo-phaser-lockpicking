# Demo Phaser Lockpicking

## Introducció

Aquest projecte és una demo web 2D desenvolupada amb Phaser.io v3. El joc consisteix a controlar una bola dins d’un pis senzill, explorar l’espai i obrir portes bloquejades mitjançant un minijoc de ganzúes.

El treball s’ha desenvolupat com a projecte en equip utilitzant GitHub, issues i publicació web a BAS i GitHub Pages.

## Descripció del disseny del joc

La demo representa l’interior d’un pis amb una estètica minimalista. El jugador controla una bola que es mou per diferents zones delimitades per parets.

Les portes tenen dos estats visuals:

- Vermell: porta tancada.
- Verd: porta oberta.

Per avançar, el jugador s’ha d’apropar a una porta tancada i interactuar-hi. Quan ho fa, s’obre un minijoc de lockpicking inspirat en sistemes de ganzúes de jocs com Starfield o Skyrim.

## Parts més rellevants de la implementació

El projecte utilitza Phaser.io v3 carregat mitjançant CDN.

El codi està dividit en tres escenes principals:

### MenuScene

Gestiona el menú principal del joc. Mostra el títol, les instruccions bàsiques i permet començar la partida amb la tecla ENTER.

### GameScene

Gestiona la partida principal. Inclou el jugador, el moviment, les parets, la porta, les col·lisions, la pausa i la detecció d’interacció amb la porta.

### LockpickingScene

Gestiona el minijoc de ganzúes. El jugador ha de seleccionar una posició correcta entre cinc opcions. Si encerta, la porta es desbloqueja i passa de vermella a verda.

## Manual d’usuari

- ENTER: començar la partida.
- WASD o fletxes: moure el jugador.
- E: interactuar amb una porta tancada.
- Fletxa esquerra/dreta: moure la ganzúa dins del minijoc.
- ENTER: intentar obrir la porta.
- ESC: pausar el joc o sortir del minijoc.

## Conclusions i problemes trobats

Durant el desenvolupament s’ha treballat la integració de Phaser v3 en una web publicada a BAS, la divisió del joc en escenes i la connexió entre una mecànica principal d’exploració i una mecànica secundària de lockpicking.

Un dels principals reptes ha estat organitzar el projecte perquè cada membre del grup pugui treballar en una part diferent utilitzant GitHub i issues sense trepitjar el codi de l’altre.# demo-phaser-lockpicking
## Enllaços del projecte

- Repositori GitHub: https://github.com/phaser-iker-gerard/demo-phaser-lockpicking
- GitHub Pages: https://phaser-iker-gerard.github.io/demo-phaser-lockpicking/
- BAS: https://bas.udg.edu/~u6105302/demo-phaser-lockpicking/
