/**
 * Created by Administrator on 2017/2/17 0017.
 */
require("./toolBar.css");
var toolBar=require("./toolBar.html");
var editBar=require("./editBar.html");
module.exports={
    init:init
};
function init(dom,scene,windows){
    var wrap=$(dom).find(".qtopo-toolBar");
    if(wrap.length==0){
        wrap=$("<div class='qtopo-toolBar'></div>");
        $(dom).append(wrap);
    }
    toolBar=$(toolBar);
    editBar=$(editBar);
    wrap.append(toolBar);
    wrap.append(editBar);
    wrap.find("[data-toggle*='tooltip']").tooltip();//开启提示框
    //切换模式和子菜单栏显示位置
    wrap.find("[name=topo_mode]").click(function (e) {
        var mode=$(this).find("input").val();
        scene.setMode(mode);
        if (mode == "normal") {
            var left = toolBar.find(".mode-edit").offset().left + 17 - editBar.width() / 2;
            var top = toolBar.offset().top + toolBar.height() + 2;
            editBar.css({'left': left, 'top': top});
            editBar.show();
        } else {
            editBar.hide();
        }
    });
    //居中展示
    toolBar.find("button[name=center]").click(function(){
        scene.goCenter();
    });
    //还原正常比例
    toolBar.find("button[name=common]").click(function(){
        scene.resize(1);
    });
    //鼠标缩放
    toolBar.find("button[name=zoom_checkbox]").click(function(){
        scene.toggleZoom();
    });
    //鹰眼
    toolBar.find("button[name=eagle_eye]").click(function(){
        scene.toggleEagleEye();
    });
    //导出png
    toolBar.find("button[name=export_image]").click(function(){
        scene.getPicture();
    });
    //自动布局
    editBar.find("button[name=auto_layout]").click(function(){
        windows.windows.autoLayout.open();
    });
    var addMode=addSearchMode(toolBar.find("select[name=search_mode]"),toolBar.find("button[name=search]"),toolBar.find("input[name=search_value]"),toolBar.find(".clear-input"));
    addMode({
        type:"node",
        name:"节点",
        search:function(val){
            var node=scene.find(val,"node");
            if(node.length>0){
                scene.moveToNode(node[0]);
            }
        }
    });
    return addMode;
}
function toggleClick(botton, aClass, bClass) {
    botton.click(function () {
        if (!botton._isClick) {
            botton.find('span').removeClass(aClass).addClass(bClass);
            botton._isClick = true;
        } else {
            botton.find('span').removeClass(bClass).addClass(aClass);
            botton._isClick = false;
        }
    });
}
function addSearchMode(selectWin,searchBtn,input,clear){
    selectWin.mode={};
    clear.hide();
    clear.click(function(){
        input.val("");
        clear.hide();
    });
    input.keydown(function(e){
        if(e.keyCode==13){
            doSearch();
        }
        clear.show();
    });
    searchBtn.click(function(){
        doSearch();
    });
    function doSearch(){
        if(selectWin.val()){
            var doSearch=selectWin.mode[selectWin.val()];
            if($.isFunction(doSearch)){
                doSearch(input.val());
            }
        }
    }
    return function(config){
        selectWin.mode[config.type]=config.search;
        selectWin.append("<option value='"+config.type+"'>"+config.name||config.type+"</option>");
    }
}