/** Useful for datetime input elements.
 * 
 * 
 */

/** Get a datetime string useful for setting a datetime input element 
 * eg: 2023-03-21T09:55*/
export function DatetimeString(year: number, month:number, day:number, hours:number, minutes:number) {
    let s = ""
    s += year
    let m : string | number = month
    if(m < 10) {
        m = "-0" + m
    } else {
        m =  "-" + m
    }
    s += m + "-"
    if(day < 10) {
        s += "0"
    }
    s += day + "T"
    if(hours < 10) {
          s += "0" + hours + ":"
    } else {
        s += hours + ":"
    }
    if(minutes < 10){
        s += "0" + minutes
    } else {
        s += minutes

    }
    return s
}
/** Get a datetime string useful for setting a datetime input element equal to current time 
 * 
 * eg: 2023-03-21T09:55
*/
export function DatetimeNowString() {
    let d = new Date();
    return DatetimeString(d.getFullYear(), d.getMonth() + 1, d.getDate() + 1, d.getHours(), d.getMinutes());
}
/** Get a datetime string useful for setting a datetime input element equal to first moment (12:00 am) of current day
 * eg: 2023-03-21T09:55 */
export function DatetimeTodayStartString() {
    let d = new Date();
    return DatetimeString(d.getFullYear(), d.getMonth() + 1, d.getDate() + 1, 0, 0);

}

export function DatetimeOffsetString(year=0, month=0, day=0, hours=0, minutes=0) {
    let d = new Date();
    return DatetimeString(d.getFullYear() + year, d.getMonth() + 1 + month, d.getDate() + day, d.getHours() + hours, d.getMinutes() + minutes)
}