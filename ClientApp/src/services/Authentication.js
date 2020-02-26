import { BehaviorSubject } from 'rxjs';
import {postServerWithData, LOGIN} from '../APIROUTE'

const currentUserSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('currentUser')));

const authenticationService = {
    login,
    logout,
    currentUser: currentUserSubject.asObservable(),
    get currentUserValue () { return currentUserSubject.value }
};

function login(email, password) {
    return new Promise((resolve,reject)=>{
    postServerWithData(LOGIN, 
        {
            email:email,
            password:password
        }).then(res=>{
                localStorage.setItem('currentUser', JSON.stringify(res.data));
                currentUserSubject.next(res.data);
                resolve();
        }).catch(err=>{
            console.log("failed "+err)
            reject();
        })
    })
}

function logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    currentUserSubject.next(null);
}

export default authenticationService