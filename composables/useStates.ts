import {useState} from "#app";
import {Jutsu} from "~/components/model/Jutsu";
import {JutsuStyle} from "~/components/model/JutsuStyle";

export const useJutsuList = () => useState<Jutsu[]>('jutsuList', () => ([]));
export const useJutsuStyleList = () => useState<JutsuStyle[]>('jutsuStyleList', () => ([]));
