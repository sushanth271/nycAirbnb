function getLocalities(){
    $.post("/Localities",{'borough':'year'}, function(data){
        // console.log("DATA FOR Localities:")
        // console.log(data)
    });
};

getLocalities()