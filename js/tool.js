//给一个元素添加指定的class属性值
// 参数：
//  obj 要添加的class属性的元素
//  cn 要添加的class值


function addClass(obj,cn){

    //先检查有没有
    if(!hasClass(obj,cn)){

        obj.className +=" "+cn;
    }
    
}
//判断一个元素中是否含有class属性值
//有true 无false
function hasClass(obj,cn){
    var reg =new RegExp("\\b"+cn+"\\b");

    return reg.test(obj.className);
}

//删除一个元素中指定的class属性
function removeClass(obj,cn){
    //创建一个正则表达式
    var reg =new RegExp("\\b"+cn+"\\b");

    //删除class
    obj.className =obj.className.replace(reg,"");
}

//切换一个类 有就删 没有就加
function toggleClass(obj,cn){
    //判断有没有
    if(hasClass(obj,cn)){
        removeClass(obj,cn);
    }else{
        addClass(obj,cn);
    }
}

//
function getStyle(obj,name){

    if(window.getComputedStyle){
        //正常浏览器的样子，具有getComputedStyle（）方法
        return getComputedStyle(obj,null)[name];
    }else{
        //IE的方式，没有getComputedStyle（）方法
        return obj.currentStyle[name];
    }
}
/**
 * 可执行简单动画的函数
 * 参数：
 *      obj 对象
 *      attr 要执行动画的样式 如：left top width height
 *      target 执行动画的目标位置
 *      speed 移动的速度（正数向右 负数向左）
 *      callback 回调函数 执行动画完毕后执行
 */
function move(obj, atter, target, speed, callback){
    //关闭上一个定时器
    clearInterval(obj,timer);
    //获取元素目前的位置
    var current = parseInt(getStyle(obj,atter));

    //判断速度正负
    if(current > target){
        //此时速度为负值
        speed = -speed;
    }

    //开启一个定时器，用来执行动画效果
    //向执行动画的对象中添加一个timer属性，用来保存他自己的定时器的标识
    obj.timer = setInterval(function(){

        //获取原来的left值
        var oldValue = parseInt(getStyle(obj,atter));

        //在旧的基础上增加
        var newValue = oldValue + speed;

        //判断newValue小于target左移  大于右移
        if((speed < 0 && newValue < target) || (speed > 0 && newValue > target)){
            newValue = target;
        }

        //设置新值
        obj.style[atter] = newValue + "px";

        //当元素移动到0px时停止动画
        if(newValue === target){
            //达到目标，关闭定时器
            clearInterval(obj.timer);

            //动画执行完毕 调用回调函数
            callback && callback();

        }


    },30);
}