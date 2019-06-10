var socket = io.connect();
const userElement = `
<li class="collection-item avatar">
    <img class="circle responsive-img" id="$$userName-img" src="<$image-src-url$>"></img>
    <span class="title"><b>$$fullName</b></span>
    <p>$$userName</p>
    <i class="material-icons secondary-content done"  id="$$userName-done" style="display:none;">done</i>
    <span id="$$userName-score" class="badge collection-item secondary-content" style="display:none;"><b>$$score</b></span>
</li>
`;
socket.on('connect', function () {
});
socket.on('notify-users', function (data) {
    console.log('notify');
    console.log(data);
    //Add newly joined user to user list
    if ($('#users li').length != 0)
        $("#users").append(userElement.replace("$$fullName", data.fullName)
            .replace("$$userName", data.userName)
            .replace("$$userName", data.userName)
            .replace("$$userName", data.userName)
            .replace("$$userName", data.userName))
            //.replace("$$userName", data.userName));
    $("#" + userName + "-img").addClass('active-user');
});
socket.on('session-users', function (data) {
    console.log('session-users');
    console.log(data);
    //First time populate all users in the room
    if ($('#users li').length == 0) {
        data.forEach(function (item) {
            $("#users").append(userElement.replace("$$fullName", item.fullName)
                .replace("$$userName", item.userName)
                .replace("$$userName", item.userName)
                .replace("$$userName", item.userName)
                .replace("$$userName", item.userName))
               // .replace("$$userName", item.userName));
        });
    }
    $("#" + userName + "-img").addClass('active-user');
});
socket.on('play-complete', function (data) {
    console.log("play-complete");
    console.log(data);
    //Show tick marks for people who have voted
    //Dont show tick mark for the current user. Actual score is shown
    if (data != userName) {
        $("#" + data + "-done").show();
    }
});
socket.on('reveal-all', function (data) {
    console.log("reveal-all");
    console.log(data);
    //Hide tick marks
    $(".done").hide();
    //Populate actual scores and show
    data.forEach((item) => {
        $("#" + item.userName + "-score").html('<b>' + item.score + '</b>');
        $("#" + item.userName + "-score").show();
    });
});
socket.on('change-story', function (data) {
    storyID = data.id;
    storyDesc = data.desc;
    $("#storyIDView").html(data.id);
    $("#storyDescView").html(data.desc);
});
socket.on('reset-scores', function (data) {
    data.forEach((item) => {
        $("#" + item.userName + "-score").html("<b>$$score</b>");
        $("#" + item.userName + "-score").hide();
        $("#" + item.userName + "-done").hide();
    });
});
socket.on('change-card-values', function (data) {
    values = data;
    resetCards(data);
});
