var userName = '';
var passWord = '';
var fullName = '';
var sessionId = '';
const routes = [
    { path: 'home', endPoint: '/view/home' },
    { path: 'login', endPoint: '/view/login' },
    { path: 'play', endPoint: '/view/play' },
    { path: 'error', endPoint: '/view/error' },
    { path: '/play/:sessionId', endPoint: '/login'},
    { path: '/', endPoint: '/home' }
];
var values = [];
$(function(){
    const path = window.location.pathname;
    init(path);
    $('.modal').modal();    
});
window.onpopstate = function(){
    loadRoute(window.location.pathname);
}
function getSession() {
    return sessionId;
}
function setSession(id) {
    sessionId = id;
}
function init(path) {
    if(path.length == 1 && path.indexOf("/")==0)
        navigateTo('home');
    else if(isDirectSessionUrl(path)){
        setSession(getSessionFromPath(path));
        navigateTo('login');
    }
    else
        loadRoute(path);
}
function isDirectSessionUrl(path){
    return path.indexOf('/play/')>=0;
}
function getSessionFromPath(path) {
    return path.replace("/play/", "");
}
function cancel(){
    console.log('cancel');
}
