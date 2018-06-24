function getData(){
    var dataArray = [];
    imageArray = [];
    var restRef = firebase.database().ref('restaurant')
    restRef.orderByValue().once('value',function(snapshot){
      snapshot.forEach(function(data){
          //console.log(data.key);
          dataArray.push(data.val());
          restRef.child(data.key).child("extraImage").orderByValue().once('value',function(snapshot1){
                //console.log(snapshot1.val());
                imageArray.push(snapshot1.val());
                window.localStorage.setItem("images",JSON.stringify(imageArray));
            });
      //console.log(JSON.stringify(imageArray));
    }); 
      //console.log(JSON.stringify(dataArray));
      window.localStorage.setItem("snapshot",JSON.stringify(dataArray));
    }); 
  }
  $("#searchRest").change(function restSearch() {
    var data = JSON.parse(window.localStorage.getItem("snapshot"));
    var imageUrlArray = JSON.parse(window.localStorage.getItem("images"));
    //console.log(imageUrlArray);
    nameArray = [];
    cityArray = [];
    areaArray = [];
    extraImageArray = [];
    openInfoArray = [];
    ratingArray = [];
    restaurantTypeArray = [];
    stagEntryArray = [];
    streetArray = [];
    distanceArray = [];
    costArray = [];
    costArrayhigh = [];
    $('#restCards').empty();
    var ck_misctext = /^[A-Za-z0-9 ]+$/;
    var error = false;
    var searText = document.forms["searchRest"]["searchText"].value; 
    var stagEntry = document.forms["searchRest"]["stagEntryBox"].checked;
    var openNow = document.forms["searchRest"]["openNowBox"].checked;
    var sort = document.getElementById("sort");
    var sortBy =  sort.options[sort.selectedIndex].innerHTML;
    console.log(sortBy);
    if(!ck_misctext.test(searText) && searText != ""){
            document.forms["searchRest"]["searchText"].style.borderColor = 'red';
            $("<span>Invalid Search Text</span>").addClass('error').insertAfter("#searchText");
            error = true;
    }
    if (error) {
      return false
    }
    var count = Object.keys(data).length;
    console.log(count);
    var flag = 0;
    //console.log(data[0])
    
    for(var i=0;i<count;i++){
      for(key in data[i]){
        data[i][key] = data[i][key].toString();
        // console.log(data[i]);
        if(data[i][key].indexOf(searText)!=-1) {
           //console.log(data[i].name);
    //       cityArray.push(data.city);
    //       areaArray.push(data.area);
    //       openInfoArray.push(data.openInfo);
    //         
    //       
    //       stagEntryArray.push(data.stagEntry);
    //       streetArray.push(data.street);
    //       //distanceArray.push()
    //       //costArray.push()
    //       //costArrayhigh.push()
    //       imageUrlArray.push(data[i].imageUri);
    flag = 1;
      }
      else if(stagEntry && (data[i].stagEntry == "yes" || data[i].stagEntry == "Yes"))
        flag = 1;
      else if(openNow && data[i].openInfo == "open now" )
        flag = 1;
    } 
      if(stagEntry && (data[i].stagEntry != "yes" || data[i].stagEntry != "Yes"))
            flag = 0;
      if(openNow && data[i].openInfo != "open now" )
            flag = 0;
      if (flag == 1) {
        nameArray.push(data[i].name);
        for(key in imageUrlArray[i])
          extraImageArray.push(imageUrlArray[i][key]);
        ratingArray.push(data[i].ratting);
        restaurantTypeArray.push(data[i]["restaurant type"]);
        //console.log(data[i]);
      }
      flag = 0;
    }
    //console.log(extraImageArray);
    switch(sortBy) {
      
      case "Rating":
      {   
          var temp = null;
          console.log("R");
          for(var i=0;i<ratingArray.length;i++){
            for(var j=0;j<ratingArray.length-i-1;j++){
                if(ratingArray[j] < ratingArray[j+1]){
                  temp = nameArray[j];
                  nameArray[j] = nameArray[j+1];
                  nameArray[j+1] = temp;
                  temp = extraImageArray[j];
                  extraImageArray[j] = extraImageArray[j+1];
                  extraImageArray[j+1] = temp;
                  temp = ratingArray[j];
                  ratingArray[j] = ratingArray[j+1];
                  ratingArray[j+1] = temp;
                  temp = restaurantTypeArray[j];
                  restaurantTypeArray[j] = restaurantTypeArray[j+1];
                  restaurantTypeArray[j+1] = temp;
                }
            }
          }
          break;
      }
      case "Cost-High to Low":
      { 
        var temp = null;
        console.log("CHL");
        for(var i=0;i<restaurantTypeArray.length;i++){
          if(restaurantTypeArray[i]=="cheap")
          costArrayhigh.push(0);
          if(restaurantTypeArray[i]=="moderate")
          costArrayhigh.push(1);
          if(restaurantTypeArray[i]=="costly")
          costArrayhigh.push(2);
        }
        //console.log(costArrayhigh.length);
        for(var i=0;i<costArrayhigh.length;i++){
          for(var j=0;j<costArrayhigh.length-i-1;j++){
              if(costArrayhigh[j] < costArrayhigh[j+1]){
                temp = nameArray[j];
                nameArray[j] = nameArray[j+1];
                nameArray[j+1] = temp;
                temp = extraImageArray[j];
                extraImageArray[j] = extraImageArray[j+1];
                extraImageArray[j+1] = temp;
                temp = ratingArray[j];
                ratingArray[j] = ratingArray[j+1];
                ratingArray[j+1] = temp;
                temp = restaurantTypeArray[j];
                restaurantTypeArray[j] = restaurantTypeArray[j+1];
                restaurantTypeArray[j+1] = temp;
                temp = costArrayhigh[j];
                costArrayhigh[j] = costArrayhigh[j+1];
                costArrayhigh[j+1] = temp;
              }
          }
        }
        break;
      }
      case "Cost-Low to High":
      {
        var temp = null;
        console.log("CLH");
        for(var i=0;i<restaurantTypeArray.length;i++){
          if(restaurantTypeArray[i]=="cheap")
          costArray.push(0);
          if(restaurantTypeArray[i]=="moderate")
          costArray.push(1);
          if(restaurantTypeArray[i]=="costly")
          costArray.push(2);
        }
        //console.log(costArray);
        for(var i=0;i<costArray.length;i++){
          for(var j=0;j<costArray.length-i-1;j++){
              if(costArray[j] > costArray[j+1]){  
                temp = nameArray[j];
                nameArray[j] = nameArray[j+1];
                nameArray[j+1] = temp;
                temp = extraImageArray[j];
                extraImageArray[j] = extraImageArray[j+1];
                extraImageArray[j+1] = temp;
                temp = ratingArray[j];
                ratingArray[j] = ratingArray[j+1];
                ratingArray[j+1] = temp;
                temp = restaurantTypeArray[j];
                restaurantTypeArray[j] = restaurantTypeArray[j+1];
                restaurantTypeArray[j+1] = temp;
                temp = costArray[j];
                costArray[j] = costArray[j+1];
                costArray[j+1] = temp;
              }
          }
        }
        break;
      }
      default:
    }
  //console.log(nameArray);
  //console.log(document.forms["searchRest"]["stagEntryBox"].checked);
  
    var bodyDiv = $('#restCards');
    if (nameArray.length!=0){
      for(var i=0;i<nameArray.length;i++){
        
        bodyDiv.append(`
        <div class="card">              
        <img class="card-img-top" src = '${extraImageArray[i]}' alt="Card image cap" height="300" > 
        <div class="card-body">
          <h5 class="card-title">${nameArray[i]}</h5>
          <p class="card-text">${ratingArray[i]}</p>
          <p class="card-text">${restaurantTypeArray[i]}</p>
        </div>
        <button type="button" onclick = "knowMore(event,'${nameArray[i]}','${extraImageArray[i]}')" class="btn btn-primary" data-toggle="modal" data-target="#myModal">
        Know More
        </button>
        `);
        bodyDiv.append(`<br />`);
      }
    }
  });

 function knowMore(evt,name,imageURL){
  var data = JSON.parse(window.localStorage.getItem("snapshot"));
  //console.log(name);
  var modal = $('#myModal');
  modal.append(`
  <div  class="modal-dialog modal-lg" >
  <div class="modal-content">
  <div class="modal-header">
      <h4 class="modal-title">${name}</h4>
      <button type="button" class="close" data-dismiss="modal">&times;</button>
  </div>
  <div class="modal-body">
<div id="model" class="carousel slide" data-ride="carousel">
<ul class="carousel-indicators">
<li data-target="#model" data-slide-to="0" class="active"></li>
</ul>
<div class="carousel-inner">
<div class="carousel-item active">
  <img class="d-block w-100" src="${imageURL}" alt="Res 1" height="500">
  </div>
   </div>
      <a class="carousel-control-prev" href="#model" data-slide="prev">
          <span class="carousel-control-prev-icon"></span>
 	    </a>
 	    <a class="carousel-control-next" href="#model" data-slide="next">
 		     <span class="carousel-control-next-icon"></span>
      </a>
  </div>
<div class="container-fluid">
    <div>
      <h5 class="modal-title">${name}</h5>
    </div><br>
    <div  class= "col-md-6 mr-auto row">   <h6>Rating  : </h6>
        <span class="fa fa-star checked" style="color: orange;"></span>
        <span class="fa fa-star checked"  style="color: orange;"></span>
        <span class="fa fa-star checked"style="color: orange;"></span>
        <span class="fa fa-star"></span>
        <span class="fa fa-star"></span>
    </div><br>
    <div>
        <h6>Adress Of the restraunts.</h6>
    </div><br>
    <div class="row">
      <div class="col-md-6 mr-auto"><h6>Location</h6></div>
      <div class="col-md-6 ml-auto"><h6>Distance</h6></div>
  </div><br>
  <div class="row">
      <div class="col-md-6 mr-auto"><h6>Open Info : </h6></div>
      <div class="col-md-6 ml-auto"><h6>Stag Entry : </h6></div>
  </div><br>
  <div >
        <h6><strong>Timings</strong></h6>  
    </div>
    <div class="row">
            <div class="col-md-6 mr-auto"><h6>Monday : </h6></div>
            <div class="col-md-6 ml-auto"><h6>Tusday : </h6></div>
        </div>
        <div class="row">
            <div class="col-md-6 mr-auto"><h6>Wednesday : </h6></div>
            <div class="col-md-6 ml-auto"><h6>Thursday : </h6></div>
        </div>
        <div class="row">
            <div class="col-md-6 mr-auto"><h6>Friday : </h6></div>
            <div class="col-md-6 ml-auto"><h6>Saturday : </h6></div>
        </div>

</div>
<div class="modal-footer">
      <button type="button" class="btn btn-danger" id="close" data-dismiss="modal">Close</button>
    </div>
  </div>
  </div>  
  </div>
</div>
  `);
  
  $('#myModal').on('hidden.bs.modal', function () {
    $('#myModal').empty();
});

  //var carousel
 }


//  <!-- Modal Header -->
//         

        

//         <!-- Modal body -->
//         <div class="modal-body">
// 		<div id="model" class="carousel slide" data-ride="carousel">

//   <!-- Indicators -->
//   <ul class="carousel-indicators">
//     <li data-target="#model" data-slide-to="0" class="active"></li>
//     <li data-target="#model" data-slide-to="1"></li>
//     <li data-target="#model" data-slide-to="2"></li>
//   </ul>

//   <!-- The slideshow -->
//   <div class="carousel-inner">
//     <div class="carousel-item active">
//       <img src="" alt="Res 1">
//     </div>
//     <div class="carousel-item">
//       <img src="" alt="Res 2">
//     </div>
//     <div class="carousel-item">
//       <img src="" alt="Res 3">
//     </div>
//   </div>

//   <!-- Left and right controls -->
//   <a class="carousel-control-prev" href="#model" data-slide="prev">
//     <span class="carousel-control-prev-icon"></span>
// 	</a>
// 	<a class="carousel-control-next" href="#model" data-slide="next">
// 		<span class="carousel-control-next-icon"></span>
// 	</a>

// 	</div>	
			
//         </div>
        
//         <!-- Modal footer -->
//         <div class="modal-footer">
//           <button type="button" class="btn btn-danger" data-dismiss="modal">Close</button>
//         </div>