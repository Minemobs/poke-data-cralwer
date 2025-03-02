import { Ability, RegionAbility } from "./type.js"
import { getUrlDoc } from "./util.js"

async function getZHAbilityList() {
  const document = await getUrlDoc("https://wiki.52poke.com/zh-hant/%E7%89%B9%E6%80%A7%E5%88%97%E8%A1%A8")
  const trimNo = (no: string) => no.endsWith("*") ? no.slice(0, -1) : no
  return Array.from(document.querySelectorAll(".fulltable tbody tr")).reduce((list, dom) => {
    const rows = Array.from(dom.querySelectorAll("td"))
    if(!rows.length) {
      return list
    }

    const [no, name,,, desc] = rows
    let numno = +trimNo(no.textContent as string)
    if(numno >= 308) {
      numno--
    }

    list[numno] = {
      no: numno,
      name: name.textContent as string,
      desc: desc.textContent as string
    }

    return list
  }, {} as Record<number, Ability>)
}

async function getFRAbilityList() {
  const document = await getUrlDoc("https://www.pokepedia.fr/Liste_des_talents");
  const table = document.querySelector(".tableaustandard tbody");
  
  if(!table) {
    return {};
  }

  return Array.from(table.children).reduce((list, dom) => {
    const rows = Array.from(dom.querySelectorAll("td"))
    if (!rows.length) {
      return list
    }

    const [_game, no, name, _englishName, desc] = rows

    if (!+(no.textContent as string)) {
      return list
    }

    list[+(no.textContent as string)] = {
      no: +(no.textContent as string),
      name: name.textContent as string,
      desc: desc.textContent as string
    }
    return list
  }, {} as Record<number, Ability>)
}

async function getENAbilityList() {
  const document = await getUrlDoc("https://bulbapedia.bulbagarden.net/wiki/Ability")
  const table = Array.from(document.querySelectorAll("h2 + table.roundy")).at(-1)

  if (!table) {
    return {}
  }

  return Array.from(table.querySelectorAll("tbody tr")).reduce((list, dom) => {
    const rows = Array.from(dom.querySelectorAll("td"))
    if (!rows.length) {
      return list
    }

    const [no, name, desc] = rows

    if (!+(no.textContent as string)) {
      return list
    }

    list[+(no.textContent as string)] = {
      no: +(no.textContent as string),
      name: name.textContent as string,
      desc: desc.textContent as string
    }
    return list
  }, {} as Record<number, Ability>)
}

async function getJPAbilityList() {
  const document = await getUrlDoc("http://wiki.ポケモン.com/wiki/%E3%81%A8%E3%81%8F%E3%81%9B%E3%81%84%E4%B8%80%E8%A6%A7")
  return Array.from(document.querySelectorAll("table.bluetable.sortable tbody tr")).reduce((list, dom) => {
    const rows = Array.from(dom.querySelectorAll("td"))
    if (!rows.length) {
      return list
    }

    const [no, name, desc] = rows
    list[+(no.textContent as string)] = {
      no: +(no.textContent as string),
      name: name.textContent as string,
      desc: desc.textContent as string
    }

    return list
  }, {} as Record<number, Ability>)
}

export async function getAbilityMap(): Promise<Record<string, RegionAbility>> {
  const zh = await getZHAbilityList()
  const en = await getENAbilityList()
  const jp = await getJPAbilityList()
  const fr = await getFRAbilityList()

  return Object.keys(zh).reduce((obj, _no) => {
    const no = +_no
    obj[en[no].name] = {
      no,
      name: {
        zh: zh[no]?.name || "",
        en: en[no]?.name || "",
        jp: jp[no]?.name || "",
        fr: fr[no]?.name || "",
      },
      desc: {
        zh: zh[no]?.desc || "",
        en: en[no]?.desc || "",
        jp: jp[no]?.desc || "",
        fr: fr[no]?.desc || "",
      }
    }

    return obj
  }, {} as Record<string, RegionAbility>)
}

export function getAbilityFileOutput(ability: Record<string, RegionAbility>): Record<number, RegionAbility> {
  return Object.values(ability).reduce((obj, a) => {
    obj[a.no] = a
    return obj
  }, {} as Record<number, RegionAbility>)
}
