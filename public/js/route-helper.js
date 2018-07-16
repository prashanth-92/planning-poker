function loadRoute(path) {
    $.get(getHTMLForPath(path), function (data) {
        $("#placeholder").html(data);
    });
}
function getHTMLForPath(path) {
    const route = routes.find((route) => {
        return path.indexOf(route.path) >= 0;
    });
    return route.endPoint;
}
function navigateTo(path){
    history.pushState(null, null, '/'+path);
    loadRoute(path);
}