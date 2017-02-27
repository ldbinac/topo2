/**
 * Created by qiyc on 2017/2/7.
 */
var Element=require("../Element.js");
module.exports =Link;
function Link(jtopo) {
    if(jtopo){
        Element.call(this,jtopo);
    }else{
        console.error("create Link without jtopo",this);
    }
    this.path={
        start:this.jtopo.nodeA.qtopo,
        end:this.jtopo.nodeZ.qtopo
    };
    if(this.path.start.links&& $.isArray(this.path.start.links.out)){
        if(this.path.start.links.out.indexOf(this)<0){
            this.path.start.links.out.push(this);
        }
    }
    if(this.path.end.links&& $.isArray(this.path.end.links.in)){
        if(this.path.end.links.in.indexOf(this)<0){
            this.path.end.links.in.push(this);
        }
    }
}
QTopo.util.inherits(Link,Element);
Link.prototype.getType=function(){
    return QTopo.constant.LINK;
};
Link.prototype.setColor = function (color) {
    if (color) {
        this.jtopo.strokeColor = QTopo.util.transHex(color.toLowerCase());
    }
    this.attr.color=this.jtopo.strokeColor;
};
Link.prototype.setNumber = function (number) {
    if ($.isNumeric(number)) {
        if(number > 1){
            this.jtopo.text = '(+' + number + ')';
        }else {
            this.jtopo.text = '';
        }
        this.attr.number=number;
    }
};
Link.prototype.setWidth=function(width){
    if($.isNumeric(width)){
        this.jtopo.lineWidth = width; // 线宽
    }
    this.attr.width=this.jtopo.lineWidth;
};
Link.prototype.setArrow = function(arrow){
    if(arrow){
        this.jtopo.arrowsRadius = $.isNumeric(arrow.size)?arrow.size:0;
        this.jtopo.arrowsOffset = $.isNumeric(arrow.offset)?arrow.offset:0;
    }
    if(!this.attr.arrow){
        this.attr.arrow={};
    }
    this.attr.arrow.start=typeof arrow.start=="boolean"?arrow.start:arrow.start=="true";
    this.attr.arrow.end=typeof arrow.end=="boolean"?arrow.end:arrow.end=="true";
    this.attr.arrow.size=this.jtopo.arrowsRadius;
    this.attr.arrow.offset=this.jtopo.arrowsOffset;
};
Link.prototype.setGap=function(gap){
    if(gap){
        this.jtopo.bundleGap = $.isNumeric(gap)?gap:0; // 线条之间的间隔
    }
    this.attr.gap=this.jtopo.bundleGap;
};
Link.prototype.setDashed=function(dashedPattern){
    if($.isNumeric(dashedPattern)&&dashedPattern>0){
        this.jtopo.dashedPattern=dashedPattern;
    }else{
        this.jtopo.dashedPattern=null;
    }
    this.attr.dashed=this.jtopo.dashedPattern;
};
