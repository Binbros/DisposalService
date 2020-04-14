import yup from 'yup';


const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/


export default class UserSchema {
    static signup() {
        return yup.object().shape({
            email: yup.string().email(),
            firstname: yup.string().trim().required()
                .min(2, 'First name is too short'),
            lastName: yup.string().trim().required()
                .min(2, 'Last name is too short'),
            password: yup.string().required()
                .min(6, 'Password must be atleast 6 digit'),
            PhoneNumber: yup.string().matches(phoneRegExp, 'Phone number is not valid')
        })
    }

    static login() {
        return yup.object().shape({
            email: yup.string().email(),
            password: yup.string().required()
                .min(6, 'Password must be atleast 6 digit'),
        })
    }
}