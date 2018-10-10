import {FETCH_ARTICLES, FETCH_ARTICLES_SUCCESS, FETCH_ARTICLES_ERROR, UPDATE_LOCATION} from './ActionTypes'
import {getShouldFetchArticles, getArticles} from './../selectors/articles'

const TOPSTORIES_API_URL = 'https://api.nytimes.com/svc/topstories/v2/home.json?api-key=bbe802a5b2964706b25d' +
        'd51e74934353'

const startAction = (type) => ({type})
const successAction = (type, json) => ({
    type,
    payload: json,
    meta: {
        receivedAt: Date.now()
    }
})
const errorAction = (type, error) => ({
    type,
    payload: error,
    error: true,
    meta: {
        receivedAt: Date.now()
    }
})

const fetchArticles = () => (dispatch, getState, fetchMethod) => {
    dispatch(startAction(FETCH_ARTICLES))
    return fetchMethod(TOPSTORIES_API_URL).then((json) => dispatch(successAction(FETCH_ARTICLES_SUCCESS, json))).catch((error) => dispatch(errorAction(FETCH_ARTICLES_ERROR, error)))
}

export const fetchArticlesIfNeeded = () => (dispatch, getState) => {
    const state = getState()
    return getShouldFetchArticles(state)
        ? dispatch(fetchArticles())
        : Promise.resolve(getArticles(state))
}

export const fetchInitialState = () => (dispatch) => Promise.all([dispatch(fetchArticlesIfNeeded())])

export const updateLocation = (newURL) => (dispatch, getState) => {
    const {location} = getState()
    if (newURL === location.url) {
        return
    }
    dispatch({
        type: UPDATE_LOCATION,
        payload: {
            url: newURL
        } // todo: parse url
    })
}
