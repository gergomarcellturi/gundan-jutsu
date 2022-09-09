import {Rank} from "./enum/Rank";
import {Restriction} from "./enum/Restriction";
import {JutsuType} from "./JutsuType";
import {JutsuInfo} from "./JutsuInfo";
import {JutsuFunctionality} from "./enum/JutsuFunctionality";

export class Jutsu {
    id: string;
    huName: string;
    jpName: string;
    kanji: string;
    chakra: number;
    rank: Rank;
    description: string;
    images: string[];
    restrictions: Restriction[];
    type: JutsuType;
    jutsuRequirement: Jutsu[];
    users: string[];
    info: JutsuInfo[];
    functionality?: JutsuFunctionality;
}
