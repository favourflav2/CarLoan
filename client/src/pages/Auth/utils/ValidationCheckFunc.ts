

export function validationCheck(text: string) {
    const containsUppercase = (ch: string) => /[A-Z]/.test(ch);
    const containsLowercase = (ch: string) => /[a-z]/.test(ch);
    const containsSpecialChar = (ch: string) => /[`!@#$%^&*()_\-+=\[\]{};':"\\|,.<>\/?~ ]/.test(ch);

    let countOfUpperCase = 0,
      countOfLowerCase = 0,
      countOfNumbers = 0,
      countOfSpecialChar = 0;

    for (let i = 0; i < text.length; i++) {
      let ch = text.charAt(i);

      // checking if we have a number
      if (!isNaN(+ch)) countOfNumbers++;
      else if (containsUppercase(ch)) countOfUpperCase++;
      else if (containsLowercase(ch)) countOfLowerCase++;
      else if (containsSpecialChar(ch)) countOfSpecialChar++;
    }

    let obj = {
      upperCase: true,
      lowerCase: true,
      specialCh: true,
      totalNumber: true,
      maxLength: true,
      minLength:true
    };

    if (countOfUpperCase < 1) {
      obj = {
        ...obj,
        upperCase:false,
      }
      }
      if (countOfLowerCase < 1) {
        obj = {
            ...obj,
            lowerCase:false,
          }
      }
      if (countOfNumbers < 1) {
        obj = {
            ...obj,
            totalNumber:false,
          }
      }
      if (countOfSpecialChar < 1) {
        obj = {
            ...obj,
            specialCh:false,
          }
      }
      if(text.length > 20){
        obj = {
            ...obj,
            maxLength:false,
          }
      }

      if(text.length < 8){
        obj = {
            ...obj,
            minLength:false,
          }
      }

      return obj
  }