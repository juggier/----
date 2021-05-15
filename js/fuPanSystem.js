// 复盘
window.onload = function(){


    // 上传地图的按钮
    var onloadButton = document.querySelector(".onloadButton");
    onloadButton.onclick = function(){
        
        var container = document.getElementById("container");
       
        toggleClass(container,"container-collapsed");
    };
    // 加上collapsed 就折叠 没有就展开

    // 点击切换显示
    // 左侧菜单兵力编成的按钮
    var mStrength =document.querySelector(".mStrength");

    mStrength.onclick = function(){
        // alert("hello");
        // var left_bar =Document.querySelector(".left-bar");

        // var parentDiv = this.parentNode;
        toggleClass(this.parentNode,"left-collapsed");
    };

    //右边的菜单的按钮
    var rightButton =document.querySelector(".right-menu");

    // for(var i=0;i<rightButton.length;i++){
    //     rightButton[i].onclick = function(){
            
    //         toggleClass(this.parentNode,"right-collapsed")
    //     }
    // }
    rightButton.onclick = function(){
        toggleClass(this.parentNode,"right-collapsed");
    };
    //右边里面的菜单  还没实现的了没设计好
    var scoreButton = document.querySelector("score-button");
    scoreButton.onclick = function(){
        var scorePannal = document.querySelector(".pannal");
        toggleClass(scorePannal,"pannal-collapsed");
    };





}