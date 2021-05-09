function outputUpdate(vol) {	
    console.log(vol)
    document.querySelector('#volume').value = vol;


    $.post("/getYear", {'year': vol}, function(data){
        // console.log(data);

        getBorough()
        getpcpData()
        getLine()
        getMap()
        getScatterPlotData()
        
    });

}

