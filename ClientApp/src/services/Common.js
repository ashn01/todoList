import { toast } from 'react-toastify';

/*
 * showToast(content:string, type:string)
 * showing toast with string
 */
export const showToast = (content, type) => {
    switch (type) {
        case 'error':
            toast.error(content, {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: true,
                newestOnTop: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true
            })
            break;
        default:
            toast(content, {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: true,
                newestOnTop: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true
            })
    }
}

/*
 * validate(str:string)
 * Validate check if only spaces are entered
 */
export const validate = (str) => {
    var pattern = /.*[^ ].*/
    return pattern.test(str)
}