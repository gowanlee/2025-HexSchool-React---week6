const emailPattern = /^\S+@\S+$/i;
const phonePattern = /^(09\d{8}|0[2-8]\d{7,8})$/;

export const emailValidation = {
    required: '請輸入 Email',
    pattern: {
        value: emailPattern,
        message: "Email 格式不正確",
    }
}

export const passwordValidation = {
    required: '請輸入 密碼',
    minLength: {
        value: 6,
        message: "密碼長度至少需 6 碼",
    }
}

export const nameValidation = {
    required: '請輸入姓名',
    minLength: {
        value: 2,
        message: '請輸入完整姓名'
    }                      
}

export const telValidation = {
    required: '請輸入電話',
    pattern: {
        value: phonePattern,
        message: '電話號碼格式錯誤'
    },
    minLength: {
        value: 8,
        message: '電話號碼長度錯誤'
    }
}

export const addressValidation = {
    required: '請輸入地址'
}
