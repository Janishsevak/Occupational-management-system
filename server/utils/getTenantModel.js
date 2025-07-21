// // import mongoose from "mongoose";
// // import InjurySchema from "../models/injury.model.js";
// // import dailyMedicalSchema from "../models/dailymedical.js";
// // import oclMedicalSchema from "../models/oclmedical.js";

// const connection = {};

// export function getInjuryModel(origin){
//     if(!connection[origin]){
//       connection[origin] = mongoose.createConnection(`mongodb+srv://jenishsevak7:cMfKvcEnHWQqjtTy@ohc.k3d9z7u.mongodb.net/ohc_${origin}?retryWrites=true&w=majority`,
     
//       );
//     }

//     return connection[origin].models.Injury || connection[origin].model("Injury",InjurySchema)
// }
// export function getdailymedicalModel(origin){
//     if(!connection[origin]){
//       connection[origin] = mongoose.createConnection(`mongodb+srv://jenishsevak7:cMfKvcEnHWQqjtTy@ohc.k3d9z7u.mongodb.net/ohc_${origin}?retryWrites=true&w=majority`,
     
//       );
//     }

//     return connection[origin].models.daily || connection[origin].model("Daily",dailyMedicalSchema)
// }
// export function getoclmedicalModel(origin){
//     if(!connection[origin]){
//       connection[origin] = mongoose.createConnection(`mongodb+srv://jenishsevak7:cMfKvcEnHWQqjtTy@ohc.k3d9z7u.mongodb.net/ohc_${origin}?retryWrites=true&w=majority`,
     
//       );
//     }

//     return connection[origin].models.ocl || connection[origin].model("ocl",oclMedicalSchema)
// }