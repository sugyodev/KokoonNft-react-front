
const formValidation = (fieldName, value) => {
    let emailValid = false;
    let passwordValid = false;
    switch (fieldName) {
        case 'email':
            emailValid = value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
            return (emailValid !== null)
        case 'password':
            passwordValid = value.length >= 6;
            return passwordValid
        default:
            break;
    }
}

export default formValidation