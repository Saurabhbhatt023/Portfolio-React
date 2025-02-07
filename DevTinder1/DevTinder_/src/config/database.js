
 const mongoose = require("mongoose");

  const connectDb = async ()=> {


       await mongoose.connect(
        
"mongodb+srv://saurabhbhatt1211:8aMeDjuWoXHJl1kS@cluster023.k38ng.mongodb.net/devtinder"

        
       );
   }
   module.exports  = connectDb;
