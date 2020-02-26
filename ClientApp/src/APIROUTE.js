import axios from 'axios'
import authenticationService from './services/Authentication';

export const LOGIN = `${process.env.REACT_APP_API_URL}/account/authenticate`
export const REGISTER = `${process.env.REACT_APP_API_URL}/account/register`

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
    return await axios.get(route, {header:token})
}

export async function getServerWithParamsWithAuth(route, p)
{
    let token = await getToken()
    return await axios.get(route,{params:{id:p}}, {header:token})
}

export async function postServerWithAuth(route, data) {
    let token = await getToken()
    return await axios.post(route,data, {header:token})
}

export async function postServerWithDataAndAuth(route, data)
{
    let token = await getToken()
    return await axios.post(route,data, {header:token})
}