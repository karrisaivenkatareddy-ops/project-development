exports.dashboard=(req,res)=>{

    res.json({

        success:true,

        totalCameras:10,

        totalDetections:150,

        todayDetections:25

    });

}