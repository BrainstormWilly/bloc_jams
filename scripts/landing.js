var i, points = document.getElementsByClassName('point');


var animatePoints = function() {

    var revealFirstPoint = function() {
        points[0].style.opacity = 1;
        points[0].style.transform = "scaleX(1) translateY(0)";
        points[0].style.msTransform = "scaleX(1) translateY(0)";
        points[0].style.WebkitTransform = "scaleX(1) translateY(0)";
     };

     var revealSecondPoint = function() {
         points[1].style.opacity = 1;
         points[1].style.transform = "scaleX(1) translateY(0)";
         points[1].style.msTransform = "scaleX(1) translateY(0)";
         points[1].style.WebkitTransform = "scaleX(1) translateY(0)";
     };

     var revealThirdPoint = function() {
         points[2].style.opacity = 1;
         points[2].style.transform = "scaleX(1) translateY(0)";
         points[2].style.msTransform = "scaleX(1) translateY(0)";
         points[2].style.WebkitTransform = "scaleX(1) translateY(0)";
     };

     revealFirstPoint();
     revealSecondPoint();
     revealThirdPoint();

};

var revealPoint = function(i){
    setTimeout(function delayRevealPoint(){
        var icon = points[i].querySelector(".point-icon");
        var title = points[i].querySelector(".point-title");
        var desc = points[i].querySelector(".point-description");
        icon.style.opacity = 1;
        icon.style.transform = "scaleX(1) scaleY(1)";
        title.style.opacity = 1;
        title.style.transform = "scaleX(1) scaleY(1)";
        desc.style.opacity = 1;
    },i*250);
}

for(i=0; i<points.length; i++){
    revealPoint(i);
}