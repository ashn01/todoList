import axios from 'axios'
import authenticationService from './services/Authentication';

export const LOGIN = `https://todolistweb.azurewebsites.net/account/authenticate`
export const REGISTER = `https://todolistweb.azurewebsites.net/account/register`
export const VERIFYTOKEN = `https://todolistweb.azurewebsites.net/account/validate`

export const ADDCATEGORY = `https://todolistweb.azurewebsites.net/api/category/add`
export const GETCATEGORY = `https://todolistweb.azurewebsites.net/api/category/getById`
export const MODIFYCATEGORY = `https://todolistweb.azurewebsites.net/api/category/editById`
export const DELETECATEGORY = `https://todolistweb.azurewebsites.net/api/category/deleteById`

export const ADDTODO = `https://todolistweb.azurewebsites.net/api/todo/add`
export const GETTODO = `https://todolistweb.azurewebsites.net/api/todo/getById`
export const MODIFYTODO = `https://todolistweb.azurewebsites.net/api/todo/editById`
export const DELETETODO = `https://todolistweb.azurewebsites.net/api/todo/deleteById`


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
    return await axios.get(route,{params:{id:p}})
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