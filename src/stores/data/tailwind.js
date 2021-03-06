import {getContext} from 'svelte'
import { writable, derived, get } from 'svelte/store';
import _ from 'lodash'
import storeLib from '../../libraries/store.js'
import axios from 'axios'
import {processStyles} from '../../utils'

import { styles as siteStyles } from './draft'
import {styles as pageStyles} from '../app/activePage'

const store = writable(storeLib.get('tailwind'))

export const loadingTailwind = writable(false)

export default {
  subscribe: store.subscribe,
  setInitial: async () => {
    const tw = storeLib.get('tailwind')
    if (typeof tw === 'string') {
      store.set(tw)
    } 
    await hydrateTailwind()
  },
  reload: async () => {
    await hydrateTailwind()
  },
  swapInConfig: _.debounce(async (tempConfig, callback) => {
    const tw = await getTailwindStyles(tempConfig)
    callback()
    setLocalStorage(tw)
  }, 1000),
  swapOutConfig: () => {
    setLocalStorage(get(store))
  },
  saveSwappedInConfig: () => {
    const tw = storeLib.get('tailwind')
    store.set(tw)
  }
}

let tailwindRetrievalAttempts = 0
async function hydrateTailwind() {
  loadingTailwind.set(true)
  const config = getCombinedTailwindConfig(get(pageStyles).tailwind, get(siteStyles).tailwind)
  
  // This is my hacky attempt (works tho) to disregard invalid tailwind styles
  // when hydrateTailwind() gets called repeatedly (as it does when the app loads)
  tailwindRetrievalAttempts++
  const currentAttempt = tailwindRetrievalAttempts
  const tw = await getTailwindStyles(config)
  if (currentAttempt === tailwindRetrievalAttempts) {
    loadingTailwind.set(false)
    store.set(tw)
    setLocalStorage(tw)
  } 
}

async function getTailwindStyles(tailwindConfig) {
  const tw = await processStyles('','',{
    tailwindConfig: JSON.stringify(tailwindConfig), 
    includeBase: true,
    includeTailwind: true,
    purge: false
  })
  return tw
}

function setLocalStorage(tw) {
  if (tw) {
    storeLib.set('tailwind', tw)  
  }
}


// HELPERS
export function getCombinedTailwindConfig(pageTW, siteTW) {
  let siteTailwindObject
  let pageTailwindObject
  try {
    siteTailwindObject = new Function(`return ${siteTW}`)() // convert string object to literal object
    pageTailwindObject = new Function(`return ${pageTW}`)()
    return _.merge(siteTailwindObject, pageTailwindObject)
  } catch(e) {
    console.error(e)
    return {}
  }
}