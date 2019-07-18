import React, { ComponentType, Component, useState } from "react";

export type ParamsType<T extends (...args: unknown[]) => unknown> = T extends (...args: Array<infer R>) =>
  unknown
  ? R
  : unknown

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
export type TkeyofT<T> = { [K in keyof T]: T[K] };

export const objectKeys = <T, _>(obj: T & {}) => {
  const keys = []

  for (const key in obj) if (obj.hasOwnProperty(key)) {
    keys.push(key)
  }

  return keys
}

export const objectEntries = <T, _>(obj: T) => Object.entries(obj) as Array<[Extract<keyof T, string>, T[keyof T]]>

export const useForceUpdate = () => {
  const [value, set] = useState(true); //boolean state

  return () => { set(!value) }; // toggle the state to force render
}

export const memoize = <T, S>(oldCb: () => S, arr: T[]) => {
  let oldVal = oldCb()
  let oldArr = arr

  return (newArr: T[], newCb?: typeof oldCb) => {
    const someIsDifferent = oldArr.some((v, i) => !Object.is(newArr[i], v))
    const callback = typeof newCb !== 'undefined' ? newCb : oldCb

    if (someIsDifferent) {
      oldArr = newArr

      return oldVal = callback()
    }

    return oldVal
  }
}

export const loadable = <P, P2>(
  options: {
    loading: ComponentType<P2>;
    loaded(): Promise<ComponentType<P>>;
  },
): ComponentType<P> | ComponentType<P2> => {

  const { loaded, loading } = options

  class NewComponent extends Component<P | P2> {
    public state = {
      element: loading as ComponentType<P2 | P>,
    }

    public async componentDidMount() {
      if (!Object.is(this.state.element, loading)) return

      const element = await loaded()

      this.setState({ element })
    }

    public render() {
      const Element = this.state.element

      return <Element {...this.props} />
    }
  }

  return NewComponent as ComponentType<P> | ComponentType<P>
}

