import {Jutsu} from "../Jutsu";
import {Rank} from "../enum/Rank";
import {JutsuFunctionality} from "../enum/JutsuFunctionality";

export const jutsuList: Jutsu[] = [
    {
        id: '29252155-82df-4ef9-bb7d-0609f51bb626',
        chakra: 100,
        description: 'A kawarimi alapvető chakrairányítási művelete: chakra testen kívüli önálló irányítása + chakra testen kívüli irányításával való mozgatás\n' +
            'A technika létrehozása két chakrairányítási Alapművelet kombinációjával jön létre. A Chakra testen kívüli önálló irányítása (Bunshin no Jutsu alapművelete) valamint a Chakra testen kívüli irányításával való mozgatás (Kugutsu no Jutsu alapművelete) A technikához szükség van egy, a használóval nagyjából egy méretű és súlyú tárgyra, valamint egy kis chakrafelhasználásra. Az alkalmazáskor a használó keres egy, a méretével és súlyával megegyező tárgyat ami lehet akár egy farönk, vagy egy zsák - vagy bármely más dolog - és a tárgyba koncentrálja a chakráját. Amint teljesen átjárta vele, kiterjeszti azt a tárgy felületére, majd chakrája segítségével a tárgy körül létrehoz egy chakramásolatot önmagáról, csakúgy, mint a Bunshin no Jutsunál. Ezután, a chakrája segítségével képes lesz irányítani azt.\n' +
            'Ezzel az eljárással egy olyan klónt hoz létre a használó, ami lényegesen több ideig marad fent mint a sima Bunshin, valamint a klón súllyal és testtel is rendelkezik, így a használóval helyet cserélve (és "teleportálva" egyik helyről a másikra, hanem a használó elbújik a klón átveszi a helyét) remekül használatos megtévesztés gyanánt. Azonban, az így létrehozott másolat addig tartja meg formáját, amíg fizikai vagy chakrahatás nem éri, ekkor pedig a chakramassza szétoszlásával csak a tárgy vagy lény marad a helyszínen. Élőlények -állatok és emberek- esetén a technika csak addig marad fenn, amíg a lény hagyja, azaz nem mozdul meg, így élőlényekkel legtöbbször nem, vagy csak egy pillanatnyi vészhelyzet megoldására alkalmazható.',
        huName: 'Testhelyettesítő Technika',
        jpName: 'Kawarimi no Jutsu',
        jutsuRequirement: [
            {huName: 'Fácán Vadászat', jpName: 'Kijigari'} as Jutsu,
            {huName: 'Erőszakos Rémszél Csapás', jpName: 'Juuha Reppushou'} as Jutsu,
        ],
        images: [
            'https://vignette1.wikia.nocookie.net/naruto/images/e/eb/Body_Replacement.PNG/revision/latest/scale-to-width-down/320?cb=20150504131249',
            'https://i.stack.imgur.com/kEe8Q.jpg'
        ],
        kanji: '忍',
        rank: Rank.E,
        restrictions: [],
        type: {parentType: {name: 'Ninjutsu', parentType: null, secondaryColor: '', primaryColor: ''},
            primaryColor: '#968468',
            secondaryColor: '#968468',
            name: 'Akadémista Ninjutsu'},
        users: [],
        info: [
            {
                name: 'Figyelmeztetés',
                color: '#EF5F5F',
                order: 0,
                text: 'A Kawarimi no Jutsu NEM egy téridő technika, tehát NEM lehet vele téren és időn át kicserélni magad semmivel! Magyarázat lejjebb.'
            }
        ],
        functionality: JutsuFunctionality.UTILITY,
    },


    {
        id: '5e4a3967-5615-4b83-a24b-fc9d8fe4d2d9',
        chakra: 400,
        description: 'A technika során a használó egy méretesebb repülő fácánt hoz létre lángokból, mely aztán a célpont felé repül és akadályozza a mozgásban, vagy épp a használó akarata szerint megtámadja azt. A fácán igen magas hővel rendelkezik, így csúnya égési sérüléseket képes okozni a célpontnak, és mivel fizikailag úgy viselkedik, mint egy fácán, a csapkodó szárnyai végett könnyen meghátrálásra kényszeríthetjük ellenfelünk, vagy csak egyszerűen csak beleirányítjuk az ellenfélbe, mely nyomán a fácán belrobban. Bár kibír néhány csapást, a technika nem arra lett kitalálva, hogy sokáig bírja a támadásokat.',
        huName: 'Fácán Vadászat',
        jpName: 'Kijigari',
        jutsuRequirement: [],
        images: [
            'https://i33.servimg.com/u/f33/18/17/45/35/kijiga10.jpg'
        ],
        kanji: '火',
        rank: Rank.B,
        restrictions: [],
        type: {parentType: {name: 'Ninjutsu', parentType: null, secondaryColor: '', primaryColor: ''},
            primaryColor: '#a10a02',
            secondaryColor: '#EF5F5F',
            name: 'Akadémista Ninjutsu'},
        users: [],
        info: [],
        functionality: JutsuFunctionality.OFFENSIVE,
    },


    {
        id: '17c69735-bd01-4668-a0a7-6322a11f86fa',
        chakra: 500,
        description: 'A használó szél chakra segítségével egy karom formájú széllökést hoz létre, amely a technika létrehozására felhasznált chakrától válik láthatóvá. A jutsu képes sziklákat rombolni.',
        huName: 'Erőszakos Rémszél Csapás',
        jpName: 'Juuha Reppushou ',
        jutsuRequirement: [],
        images: [
            'https://i.servimg.com/u/f33/18/17/45/35/juuha_11.jpg'
        ],
        kanji: '風',
        rank: Rank.A,
        restrictions: [],
        type: {parentType:
                {name: 'Ninjutsu', parentType: null, secondaryColor: '', primaryColor: ''},
            primaryColor: '#048c10',
            secondaryColor: '#68f274',
            name: 'Akadémista Ninjutsu'},
        users: [],
        info: [],
        functionality: JutsuFunctionality.DEFENSIVE
    },

    {
        id: 'e129b9bb-716e-41c9-9cef-5a2ab493725a',
        chakra: 900,
        description: 'A Naruton használt Négy pecsét ellentéte: ez a pecsét nem a testbe zárt chakrát engedi kivonni, és átalakulni/felhasználni a használó akarata szerint: A technika a használó testébe, avagy abba a testbe, amire a pecsétet készítette, zár mindent, ami a pecsét környezetében van (a pecsét hatósugara a készítéséhez felhasznált chakra mennyiségtől függ).\n' +
            'A pecsét elkészítése: rajzolat készítése a hordozóra, majd a pecsétbe foglalt chakra pecsétbe áramoltatása, végül a pecsét lezárása - ezt a használó megteheti úgy, hogy a feloldást csak maga indíthatja el, de a megpecsételtnek is meghagyhatja ezt a lehetőséget.',
        huName: 'Fordított Négy Pecsét',
        jpName: 'Ura Shishou Fuuinjutsu ',
        jutsuRequirement: [],
        images: [
            'https://images2.imgbox.com/6b/a8/aamYiwx0_o.png'
        ],
        kanji: '封',
        rank: Rank.S,
        restrictions: [],
        type: {parentType: {name: 'Ninjutsu', parentType: null, secondaryColor: '', primaryColor: ''},
            primaryColor: '#26272e',
            secondaryColor: '#313a7d',
            name: 'Akadémista Ninjutsu'},
        users: [],
        info: [],
    },


    {
        id: '1efbaf13-b26d-45b9-a847-c6ac1c30a9b0',
        chakra: 120,
        description: 'Ez egy egyszerűnek nevezhető Kenjutsu, mivel nem túl erős. A lényege, hogy mikor két kard összecsap, nagy fény keletkezik az összeakadás helyén, így kicsit gyengíti az ellenfél látását, míg a Ninja szemébe nem megy a fény. Nem olyan nehéz elsajátítani, mint a többi Kenjutsut. És nem is kerül annyi chakrába.',
        huName: 'Napfény',
        jpName: 'Hikage ',
        jutsuRequirement: [],
        images: [],
        kanji: '剣',
        rank: Rank.D,
        restrictions: [],
        type: {parentType: {name: 'Ninjutsu', parentType: null, secondaryColor: '', primaryColor: ''},
            primaryColor: '#312a4a',
            secondaryColor: '#ccc5e6',
            name: 'Akadémista Ninjutsu'},
        users: [],
        info: [],
    }
];
