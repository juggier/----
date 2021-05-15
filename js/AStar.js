function search_Road(start_x, start_y, start_z, end_x, end_y, end_z) {
    var openlist = [];
    var closelist = [];
    var result = [];
    var result_index;
    openlist.push({
        X: start_x,
        y: start_y,
        z: start_z,
        G: 0
    });

    do {
        var currentpoint = openlist.pop();
        //pop方法删除数组最后一位 且 返回被删除的值
        closelist.push(currentpoint);
        var surroundpoint = surround_point(currentpoint);
        //寻找该点周围的点，存入临时对象
        for (var i in surroundpoint) {
            var item = surroundpoint[i];
            if (item.x >= 0 &&
                item.y >= 0 &&
                item.x < MAP.row &&
                item.y < MAP.col &&
                !exist_list(item, closelist)
            ) {
                var g = currentpoint.G + 1; //父对象g+当前g,六角格临近格之间g相同
                if (!exist_list(item, openlist)) //若不在开启列表中
                {
                    item['H'] = Math.abs(end_x - item.x) + Math.abs(end_y - item.y) + Math.abs(end_z - item.z)
                    item['G'] = g;
                    item['F'] = item.H + item.G
                    item['parent'] = currentpoint;
                    openlist.push(item);
                } else {
                    var index = exist_list(item, openlist);
                    if (g < openlist[index].G) {
                        openlist[index].parent = currentpoint;
                        openlist[index].G = g;
                        openlist[index].F = g + openlist[index].H;
                    }
                }
            }
        }
        if (openlist.length == 0) {
            break;
        } //若开启列表空了，则说明没路了
        openlist.sort(sortF);
    }
    while (!(result_index = exist_list({ x: end_x, y: end_y }, openlist)));

    if (!result_index) {
        result = [];
    } else {
        var currentobj = openlist[result_index]
        do {
            result.unshift({
                x: currentobj.x,
                y: currentobj.y
            });
            currentobj = currentobj.parent;
        }
        while (currentobj.x != start_x.x || currentobj.y != start_y);
        return result;
    }

    function sortF(a, b) {
        return b.f - a.f;
    } //f值排序

    function surround_point(currentpoint) {
        var x = currentpoint.x;
        var y = currentpoint.y;
        return [{ x: x - 1, y: y - 1 },
            { x: x - 1, y: y },
            { x: x, y: y - 1 },
            { x: x, y: y + 1 },
            { x: x + 1, y: y - 1 },
            { x: x + 1, y: y },
        ];
    } //获得周围点坐标

    function exist_list(point, list) { //判断点是否在列表里面
        for (var i in list) {
            if (point.x == list[i].x && point.y == list[i].y) {
                return i;
            }
        }
        return false;
    }


}