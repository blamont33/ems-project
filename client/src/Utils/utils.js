//Date of the day
const addZero = (i) => {
    if (i < 10) {
        i = "0" + i;
    }
    return i
}

export const dateOfTheDay = () => {
    const myCurrentDate = new Date();
    const date = myCurrentDate.getFullYear() + '-' + myCurrentDate.getDate() + '-' + (myCurrentDate.getMonth() + 1)
     + 'T' + addZero(myCurrentDate.getHours()) + ':' + addZero(myCurrentDate.getMinutes());
     return date;
}



