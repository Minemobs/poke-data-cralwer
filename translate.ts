import { SupportLang  } from "./type.js"

export function t(str: string, lang: SupportLang): string {
  switch(lang) {
    case SupportLang.JP: return jp(str)
    case SupportLang.ZH: return zh(str)
  }

  return str
}

function zh(str: string): string {
  switch(str) {
    case "Alola": return "阿羅拉"
    case "Galar": return "伽勒爾"
    case "Paldea": return "帕底亞"
    case "Hisui": return "洗翠"
    case "Blaze Breed": return "火熾種"
    case "Aqua Breed": return "水瀾種"
  }

  return str
}

function jp(str: string): string {
  switch (str) {
    case "Alola": return "アローラ"
    case "Galar": return "ガラル"
    case "Paldea": return "パルデア"
    case "Hisui": return "ヒスイ"
    case "Blaze Breed": return "ブレイズしゅ"
    case "Aqua Breed": return "ウォーターしゅ"
  }

  return str
}