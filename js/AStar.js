function AStar(start_x,start_y,end_x,end_y) {
    var openList = [],
        closeList = [],
        result = [],
        result_index;
    
    var end_offx = end_x - (end_y - (end_y & 1) ) / 2;
    var end_offz = end_y;
    var end_offy = -end_offx - end_offz;

    var start_offx = start_x - (start_y - (start_y & 1) ) / 2;
    var start_offz = start_y;
    var start_offy = -start_offx - start_offz;


    openList.push({
        x: start_x,
        y: start_y,
        G: 0
    });

    while (!(result_index = existList({
            x: end_x,
            y: end_y
        }, openList))) 
    {
        var currentPoint = openList.pop();
        closeList.push(currentPoint);

        var sourroundPoint = getSurroundPoint(currentPoint);

        sourroundPoint.map(function(item,index ) {
            if (item.x >= 0 &&
                item.x < 81 &&
                item.y >= 0 &&
                item.y < 81 &&
                
                !existList(item, closeList)) {

                var g = currentPoint.G + 1;

                if (!existList(item, openList)) {
                    var offx = item.x - (item.y - (item.y & 1) ) / 2;
                    var offz = item.y;
                    var offy = -offx - offz;


                    item['H'] = (Math.abs(end_offx - offx) + Math.abs(end_offy - offy) + Math.abs(end_offz - offz))/2;
                    item['G'] = g;
                    item['F'] = item.G + item.H;
                    item['parent'] = currentPoint;
                    openList.push(item);
                }
            }
        });
        if (openList.length === 0) {
            alert('没有可用路径');
            break;
        }
        openList.sort(sortF);
        openList.sort(sortG);
    };

    if (result_index) {
        var currentObj = openList[result_index];
        while (currentObj.x !== start_x || currentObj.y != start_y) 
        {
            result.unshift({
                x: currentObj.x,
                y: currentObj.y,
                //F: currentObj.F,
                //H: currentObj.H,
                //G: currentObj.G,
                //Thisparent :currentObj.parent
            });
            currentObj = currentObj.parent;
        };
    }

    function sortF(a, b) {
        return b.F - a.F;
    }
    function sortG(a, b){
        return b.G - a.G;
    }
    
    function getSurroundPoint(currentPoint) {
        var x = currentPoint.x,
            y = currentPoint.y;
            /*
            周围格子有两种情况？
            其一：奇数行
              {-1,0} {-1,+1}
            {0,-1} x,y {0,+1}
              {+1,0} {+1,+1}
            其二：偶数行
              {-1,-1} {-1,0}
            {0.-1} x,y {0,+1}
              {+1,-1} {+1,0}

            （I cost two day finish for that！！！）
            */
        if(x%2 == 1)
        {
            return [
                { x: x - 1, y: y },
                { x: x - 1, y: y + 1 },
                { x: x, y: y - 1 },
                { x: x, y: y + 1 },
                { x: x + 1, y: y },
                { x: x + 1, y: y + 1 },];
        }
        else
        {
            return [
                { x: x - 1, y: y - 1 },
                { x: x - 1, y: y },
                { x: x, y: y - 1 },
                { x: x, y: y + 1 },
                { x: x + 1, y: y - 1 },
                { x: x + 1, y: y },];
        }
        
    }
    
    function existList(point, list) {
        for (var i in list) {
            if (point.x == list[i].x && point.y == list[i].y) {
                return i;
            }
        }
        return false;
    }

    return result;

}export{AStar};

//用F值对数组排序
