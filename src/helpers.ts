import { useState } from "react";

export type ParamsType<T extends (...args: any) => any> = T extends (...args: Array<infer R>) => any ? R : any
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
export type TkeyofT<T> = { [K in keyof T]: T[K] };

export const objectKeys = <T>(obj: T & {}) => {
  const keys = []

  for (const key in obj) if (obj.hasOwnProperty(key)) {
    keys.push(key)
  }

  return keys
}

export const objectEntries = <T>(obj: T) => Object.entries(obj) as Array<[Extract<keyof T, string>, T[keyof T]]>

export function useForceUpdate() {
  const [value, set] = useState(true); //boolean state
  return () => set(!value); // toggle the state to force render
}

export function memoize<T, S>(oldCb: () => S, arr: T[]) {
  let oldVal = oldCb()
  let oldArr = arr

  return <C>(newArr: T[], newCb?: () => C) => {
    const someIsDifferent = oldArr.some((v, i) => newArr[i] !== v)
    const callback = newCb || oldCb

    if (someIsDifferent) {
      oldArr = newArr
      return oldVal = callback() as S
    }

    return oldVal
  }
}