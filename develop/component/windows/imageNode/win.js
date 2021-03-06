var temp=require("./win.html");
var util=require("../util.js");
module.exports={
    init:main
};
/*
 * 初始化图片节点的属性操作窗口
 * @param dom  topo对象包裹外壳
 * @param scene topo对象图层
 * @param tools 需要支持的一般窗口组件
 * @returns {*|jQuery|HTMLElement} 返回初始化后的窗口对象,包含open和close函数
 */
function main(dom, scene, tools){
    var win=$(temp);
    var imageSelect=tools.imageSelect;
    //注册窗口打开和关闭事件
    initEvent(dom,win,scene);
    //基本窗口属性初始化
    util.initBase(dom,win);
    //劫持表单
    util.initFormSubmit(win.find("form"),function(data){
        doWithForm(win,scene,data);
        win.close();
    });
    //绑定图片选择框
    win.find(".image-select-group button").click(function(){
        imageSelect.open()
            .then(function(data){
            setImageBtn(win,data);
        });
    });
    //绑定样式选择窗口
    win.find("button.style-open").click(function(){
        tools.styleSelect
            .open(openStyle(win,scene))
            .then(function(data){
                doWithStyle(win,scene,data);
            });
    });
    return win;
}
function initEvent(dom,win,scene){
    win.on("window.open",function(e){
        var todo=win.data("todo");
        if(todo){
            switch (todo.type){
                case "create":
                    win.find(".panel-title").html("创建图片节点");
                    createWindow(win,todo.position,scene);
                    break;
                case "edit":
                    win.find(".panel-title").html("修改图片节点");
                    editWindow(win,todo.target,scene);
                    break;
                default:
                    QTopo.util.error("invalid type of imageNodeWindow,open function need to config like { type:'create' or 'edit'}");
            }
        }else{
            win.find(".panel-title").html("图片节点非正常打开");
            QTopo.util.error("invalid open imageNodeWindow");
        }
    });
}
function createWindow(win,position,scene){
    if(!position){
        QTopo.util.error("invalid open imageNodeWindow,need set position to create");
    }
    var DEFAULT=scene.getDefault(QTopo.constant.node.IMAGE);
    util.setFormInput(win.find("form"),{
        name:DEFAULT.name,
        image:DEFAULT.image
    });
    setImageBtn(win,DEFAULT.image);
}
function editWindow(win,target,scene){
    if(!target){
        QTopo.util.error("invalid open imageNodeWindow,need set target to edit");
    }
    var attr=target.attr;
    util.setFormInput(win.find("form"),{
        name:attr.name,
        image:attr.image
    });
    setImageBtn(win,attr.image);
}
function doWithStyle(win,scene,data){
    var todo=win.data("todo");
    var style=getStyle(data);
    switch (todo.type){
        case'edit':
            todo.target.set(style);
            break;
        case 'create':
            scene.setDefault(QTopo.constant.node.IMAGE,style);
            break;
    }
}
function doWithForm(win, scene, data){
    var todo=win.data('todo');
    if(todo){
        switch (todo.type){
            case "create":
                scene.createNode({
                    type:QTopo.constant.node.IMAGE,
                    position:todo.position,
                    name:data.name,
                    image:data.image
                });
                break;
            case "edit":
                if(todo.target&&todo.target.getUseType()==QTopo.constant.node.IMAGE){
                    todo.target.set({
                        name:data.name,
                        image:data.image
                    });
                }
                break;
        }
    }
}
function openStyle(win,scene){
    var todo=win.data('todo');
    var DEFAULT=scene.getDefault(QTopo.constant.node.IMAGE);
    var style="";
    switch (todo.type){
        case'edit':
            style=setStyle(todo.target.attr);
            break;
        case 'create':
            style=setStyle(DEFAULT);
            break;
    }
    return style;
}
function setStyle(attr){
    return {
        namePosition:attr.namePosition,
        width:attr.size[0],
        height:attr.size[1],
        fontColor:attr.font.color,
        fontSize:attr.font.size,
        borderColor:attr.border.color,
        borderWidth:attr.border.width,
        borderRadius:attr.border.radius
    };
}
function getStyle(data){
    if(data){
        return {
            namePosition:data.namePosition,
            size:[data.width,data.height],
            font:{
                color:data.fontColor,
                size:data.fontSize
            },
            border:{
                color:data.borderColor,
                width:data.borderWidth,
                radius:data.borderRadius
            }
        };
    }
    return {};
}
function setImageBtn(win,image){
    win.find(".image-select-group input").attr("title",image).val(image);
    win.find(".image-select-group img").attr("src",image);
}