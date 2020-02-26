import axios from 'axios'

export const LOGIN = `${process.env.REACT_APP_API_URL}/account/authenticate`

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