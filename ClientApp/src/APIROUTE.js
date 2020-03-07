import axios from 'axios'
import authenticationService from './services/Authentication';

export const LOGIN = `${process.env.REACT_APP_API_URL}/account/authenticate`
export const REGISTER = `${process.env.REACT_APP_API_URL}/account/register`
export const VERIFYTOKEN = `${process.env.REACT_APP_API_URL}/account/validate`
export const CONFIRMEMAIL = `${process.env.REACT_APP_API_URL}/account/confirmEmail`

export const ADDCATEGORY = `${process.env.REACT_APP_API_URL}/api/category/add`
export const GETCATEGORY = `${process.env.REACT_APP_API_URL}/api/category/getById`
export const MODIFYCATEGORY = `${process.env.REACT_APP_API_URL}/api/category/editById`
export const DELETECATEGORY = `${process.env.REACT_APP_API_URL}/api/category/deleteById`

export const ADDTODO = `${process.env.REACT_APP_API_URL}/api/todo/add`
export const GETTODO = `${process.env.REACT_APP_API_URL}/api/todo/getById`
export const MODIFYTODO = `${process.env.REACT_APP_API_URL}/api/todo/editById`
export const DELETETODO = `${process.env.REACT_APP_API_URL}/api/todo/deleteById`


function getToken()
{
    const currentUser = authenticationService.currentUserValue;
    if (currentUser && currentUser.token) {
        return { Authorization: `Bearer ${currentUser.token}` };
    } else {
        return {};
    }
}

export async function getServer(route) {
    return await axios.get(route)
}

export async function getServerWithParams(route, p)
{
    return await axios.get(route,{p})
}

export async function postServer(route) {
    return await axios.post(route)
}

export async function postServerWithData(route, data)
{
    return await axios.post(route,data)
}

export async function getServerWithAuth(route) {
    let token = await getToken()
    return await axios.get(route, {headers:token})
}

export async function getServerWithParamsWithAuth(route, p)
{
    let token = await getToken()
    return await axios.get(route,{params:{id:p}}, {headers:token})
}

export async function postServerWithAuth(route, data) {
    let token = await getToken()
    return await axios.post(route,data, {headers:token})
}

export async function postServerWithDataAndAuth(route, data)
{
    let token = await getToken()
    return await axios.post(route,data, {headers:token})
}