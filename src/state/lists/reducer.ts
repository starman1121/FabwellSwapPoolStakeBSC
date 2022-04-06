import { DEFAULT_ACTIVE_LIST_URLS } from './../../constants/lists'
import { createReducer } from '@reduxjs/toolkit'
import { getVersionUpgrade, VersionUpgrade } from '@uniswap/token-lists'
import { TokenList } from '@uniswap/token-lists/dist/types'
import { DEFAULT_LIST_OF_LISTS } from '../../constants/lists'
import { updateVersion } from '../global/actions'
import { acceptListUpdate, addList, fetchTokenList, removeList, enableList, disableList } from './actions'

export interface ListsState {
  readonly byUrl: {
    readonly [url: string]: {
      readonly current: TokenList | null
      readonly pendingUpdate: TokenList | null
      readonly loadingRequestId: string | null
      readonly error: string | null
    }
  }
  // this contains the default list of lists from the last time the updateVersion was called, i.e. the app was reloaded
  readonly lastInitializedDefaultListOfLists?: string[]

  // currently active lists
  readonly activeListUrls: string[] | undefined
}

type ListState = ListsState['byUrl'][string]

const NEW_LIST_STATE: ListState = {
  error: null,
  current: null,
  loadingRequestId: null,
  pendingUpdate: null
}

type Mutable<T> = { -readonly [P in keyof T]: T[P] extends ReadonlyArray<infer U> ? U[] : T[P] }

const initialState: ListsState = {
  lastInitializedDefaultListOfLists: DEFAULT_LIST_OF_LISTS,
  byUrl: {
    ...DEFAULT_LIST_OF_LISTS.reduce<Mutable<ListsState['byUrl']>>((memo, listUrl) => {
      memo[listUrl] = NEW_LIST_STATE
      return memo
    }, {})
  },
  activeListUrls: DEFAULT_ACTIVE_LIST_URLS
}

export default createReducer(initialState, builder =>
  builder
    .addCase(fetchTokenList.pending, (state, { payload: { requestId, url } }) => {
      // console.log('debug here fetchTokenList')
      state.byUrl[url] = {
        current: null,
        pendingUpdate: null,
        ...state.byUrl[url],
        loadingRequestId: requestId,
        error: null
      }
    })
    .addCase(fetchTokenList.fulfilled, (state, { payload: { requestId, tokenList, url } }) => {
      // console.log('debug here fetchTokenList')
      const current = state.byUrl[url]?.current
      const loadingRequestId = state.byUrl[url]?.loadingRequestId

      // no-op if update does nothing
      if (current) {
        const upgradeType = getVersionUpgrade(current.version, tokenList.version)

        if (upgradeType === VersionUpgrade.NONE) return
        if (loadingRequestId === null || loadingRequestId === requestId) {
          state.byUrl[url] = {
            ...state.byUrl[url],
            loadingRequestId: null,
            error: null,
            current: current,
            pendingUpdate: tokenList
          }
        }
      } else {
        // activate if on default active
        if (DEFAULT_ACTIVE_LIST_URLS.includes(url)) {
          state.activeListUrls?.push(url)
          // console.log('debug here')
        }

        state.byUrl[url] = {
          ...state.byUrl[url],
          loadingRequestId: null,
          error: null,
          current: tokenList,
          pendingUpdate: null
        }
      }
    })
    .addCase(fetchTokenList.rejected, (state, { payload: { url, requestId, errorMessage } }) => {
      // console.log('debug here fetchTokenList')
      if (state.byUrl[url]?.loadingRequestId !== requestId) {
        // no-op since it's not the latest request
        return
      }

      state.byUrl[url] = {
        ...state.byUrl[url],
        loadingRequestId: null,
        error: errorMessage,
        current: null,
        pendingUpdate: null
      }
    })
    .addCase(addList, (state, { payload: url }) => {
      // console.log('debug here addList')
      if (!state.byUrl[url]) {
        state.byUrl[url] = NEW_LIST_STATE
      }
    })
    .addCase(removeList, (state, { payload: url }) => {
      // console.log('debug here removeList')
      if (state.byUrl[url]) {
        delete state.byUrl[url]
      }
      // remove list from active urls if needed
      if (state.activeListUrls && state.activeListUrls.includes(url)) {
        state.activeListUrls = state.activeListUrls.filter(u => u !== url)
        // console.log('debug here')
      }
    })
    .addCase(enableList, (state, { payload: url }) => {
      // console.log('debug here enableList')
      if (!state.byUrl[url]) {
        state.byUrl[url] = NEW_LIST_STATE
      }

      if (state.activeListUrls && !state.activeListUrls.includes(url)) {
        state.activeListUrls.push(url)
        // console.log('debug here')
      }

      if (!state.activeListUrls) {
        state.activeListUrls = [url]
        // console.log('debug here')
      }
    })
    .addCase(disableList, (state, { payload: url }) => {
      // console.log('debug here disableList')
      if (state.activeListUrls && state.activeListUrls.includes(url)) {
        state.activeListUrls = state.activeListUrls.filter(u => u !== url)
        // console.log('debug here')
      }
    })
    .addCase(acceptListUpdate, (state, { payload: url }) => {
      // console.log('debug here acceptListUpdate')
      if (!state.byUrl[url]?.pendingUpdate) {
        throw new Error('accept list update called without pending update')
      }
      state.byUrl[url] = {
        ...state.byUrl[url],
        pendingUpdate: null,
        current: state.byUrl[url].pendingUpdate
      }
    })
    .addCase(updateVersion, state => {
      // console.log('debug here updateVersion')
      // console.log('debug here stage 1', state)
      // state loaded from localStorage, but new lists have never been initialized
      if (!state.lastInitializedDefaultListOfLists) {
        state.byUrl = initialState.byUrl
        state.activeListUrls = initialState.activeListUrls
        // console.log('debug here')
      } else if (state.lastInitializedDefaultListOfLists) {
        // console.log('debug here 1')
        const lastInitializedSet = state.lastInitializedDefaultListOfLists.reduce<Set<string>>(
          (s, l) => s.add(l),
          new Set()
        )
        const newListOfListsSet = DEFAULT_LIST_OF_LISTS.reduce<Set<string>>((s, l) => s.add(l), new Set())

        DEFAULT_LIST_OF_LISTS.forEach(listUrl => {
          if (!lastInitializedSet.has(listUrl)) {
            state.byUrl[listUrl] = NEW_LIST_STATE
          }
        })

        state.lastInitializedDefaultListOfLists.forEach(listUrl => {
          if (!newListOfListsSet.has(listUrl)) {
            delete state.byUrl[listUrl]
          }
        })
      }

      state.lastInitializedDefaultListOfLists = DEFAULT_LIST_OF_LISTS


      // const COMPOUND_LIST_A = 'https://raw.githubusercontent.com/compound-finance/token-list/master/compound.tokenlist.json'
      // const COINGECKO_LIST_A = 'https://tokens.coingecko.com/uniswap/all.json'
      // const LIQUID_LIST_A = "https://github.com/DejanA1/udex/blob/master/src/constants/tokenLists/token-list.json"

      // const DEFAULT_ACTIVE_LIST_URLS_A: string[] = [COINGECKO_LIST_A, LIQUID_LIST_A]

      // if no active lists, activate defaults
      if (!state.activeListUrls) {
        state.activeListUrls = DEFAULT_ACTIVE_LIST_URLS
        // console.log('debug here 3')

        // for each list on default list, initialize if needed
        DEFAULT_ACTIVE_LIST_URLS.map((listUrl: string) => {
          if (!state.byUrl[listUrl]) {
            state.byUrl[listUrl] = NEW_LIST_STATE
          }
          return true
        })
      }
      // state.activeListUrls = DEFAULT_ACTIVE_LIST_URLS_A
      // console.log('debug here stage 2', state.activeListUrls)
    })
)
