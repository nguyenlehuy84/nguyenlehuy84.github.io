var maskRolex = new fabric.Canvas('maskRolex');
var rolex = new fabric.Canvas('rolex');
var maskRolexDuplicate = new fabric.Canvas('maskRolexDuplicate');
var contextMask = maskRolex.getContext('2d'); 
var contextRolex = rolex.getContext('2d'); 
var rolexImage;

function disableEdit(oImg){
  oImg.lockMovementX = true;
  oImg.lockMovementY = true;
  oImg.lockRotation = true;
  oImg.lockScalingX = true;
  oImg.lockScalingY = true;
  oImg.hasBorders = false;    
  oImg.hasControls = false;   
}


fabric.Image.fromURL('297.png', function(oImg) {
  oImg.width = 1448;
  oImg.height = 1024;
  disableEdit(oImg);  
  rolexImage = oImg;         
  rolex.add(oImg);  
});
fabric.Image.fromURL('295_m.png', function(oImg) {
  disableEdit(oImg); 
  maskRolex.add(oImg);   
});
maskRolex.hoverCursor = 'default';

maskRolex.on('mouse:move', function(event) {  
  handlerMoveEvent(event.e); 
});
function handlerMoveEvent(e){
  var colorHover = getHoverColer(e);
  if (colorHover > 0) {
    maskRolex.hoverCursor = 'pointer';
    var browerElements = elements.getElement();    
    for (var i = 0; i < browerElements.length; i++) {
        if (colorHover === browerElements[i].vert){         
          $("#Element").html(browerElements[i].name);          
        }
    }    
  }
  else{
    maskRolex.hoverCursor = 'default';       
    $("#Element").html("");     
  }
}
if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) { 
    //maskRolex.isGrabMode = true;    
    maskRolex.on('touch:gesture',function(event){    
    var lPinchScale = event.self.scale; 
    var scaleDiff = (lPinchScale -1)/5 + 1;
    contextMask.scale(scaleDiff,scaleDiff);
    //alert("con cho");
    // maskRolex.setZoom(maskRolex.viewport.zoom*scaleDiff);   
    // maskRolexDuplicate.setZoom(maskRolexDuplicate.viewport.zoom*scaleDiff);    
    // rolex.setZoom(rolex.viewport.zoom*scaleDiff); 

  });
   
   // Hammer(zoom).on( 'pinch', function(){
   //    alert("pinch");
   // });

  maskRolex.on('touch:drag', function(event) {       
      // rolex.viewport.position.x = event.e.pageX;
      // rolex.viewport.position.y = event.e.pageY;
      // rolex.renderAll();
      // maskRolexDuplicate.viewport.position.x = event.e.pageX;
      // maskRolexDuplicate.viewport.position.y = event.e.pageY;
      // maskRolexDuplicate.renderAll();
      // maskRole.viewport.position.x = event.e.pageX;
      // maskRolex.viewport.position.y = event.e.pageY;
      // maskRolex.renderAll();
      handlerClickEvent(event.e);   
      handlerMoveEvent(event.e);    
  });  
}
else{
  maskRolex.on('mouse:down', function(event){
    handlerClickEvent(event.e); 
  });   
}
function handlerClickEvent(e){
  var contextRolexDuplicate =  maskRolexDuplicate.getContext('2d');         
   var colorHover = getHoverColer(e);
   if (colorHover > 0) { 
     var imageAfterProccess = proccessImageData(colorHover);
     contextRolexDuplicate.putImageData(imageAfterProccess,0,0);     
   }  
   else
   {
    contextRolexDuplicate.clearRect(0, 0, maskRolexDuplicate.width, maskRolexDuplicate.height);
   }     
}
function getHoverColer(e){
  imageData = contextMask.getImageData(e.pageX,e.pageY, 1,1);
  return imageData.data[0] + imageData.data[1] + imageData.data[2] ; 
}

function proccessImageData(color){
   var dataToProccess = contextMask.getImageData(0,0,1448,1024).data;
   var imageDataToChange = contextMask.getImageData(0,0,1448,1024);
   var dataToChange = imageDataToChange.data;
   for (var i = 0; i < dataToProccess.length; i+=4) {
      var colorImage = dataToProccess[i] + dataToProccess[i+1] + dataToProccess[i+2];
      if (color === colorImage){
        dataToChange[i] = 0; // Red
        dataToChange[i+1] = 255; // Green
        dataToChange[i+2] = 0; //Blue
        dataToChange[i+3] = 50; // alpha
      }
      else{
        dataToChange[i+3] = 0; //Set alpha = 0;
      }
   }         
   return imageDataToChange;
}