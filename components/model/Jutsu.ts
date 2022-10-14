import {Rank} from "./enum/Rank";
import {Restriction} from "./enum/Restriction";
import {JutsuStyle} from "./JutsuStyle";
import {JutsuFunctionality} from "./enum/JutsuFunctionality";

export class Jutsu {
    uid?: string;
    huName?: string;
    jpName?: string;
    chakra?: number;
    tjp?: number | null;
    rank?: Rank;
    description?: string;
    image?: string | null;
    restriction?: Restriction | null;
    style?: JutsuStyle;
    jutsuRequirements?: Jutsu[] | null;
    users?: string[] | null;
    info?: string | null;
    functionality?: JutsuFunctionality | null;
}
