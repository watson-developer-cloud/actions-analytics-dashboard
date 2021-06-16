export function getCookie(name) {
    var v = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
    return v ? v[2] : null;
}

export function setCookie(name, value) {
    var d = new Date;
    d.setTime(d.getTime() + 24*60*60*1000*60); // lasts 60 days
    document.cookie = name + "=" + value + ";path=/;expires=" + d.toGMTString();
}