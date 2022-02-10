import { toast } from 'react-toastify';
import { Icons } from './Icons';

export const SuccessToast = (message) => {
    toast.success(message, {
        icon: Icons.check,
        autoClose: 5000,
        hideProgressBar: true
    });
}

export const WarningToast = (message => {
    toast.warn(message, {
        icon: Icons.warning,
        autoClose: 5000,
        hideProgressBar: true
    })
})