/**
 * @template T
 * @param { T } obj
 */
const objectKeys = (obj) => {
    const keys = []

    for (const key in obj) if (obj.hasOwnProperty(key)) {
        keys.push(key)
    }

    return keys
}