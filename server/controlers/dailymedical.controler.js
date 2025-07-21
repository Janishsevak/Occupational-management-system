import xlsx from 'xlsx';
// import DailyMedical from '../models/dailymedical.js';
// import { getdailymedicalModel } from '../utils/getTenantModel.js';
import { getDbByOrigin } from '../models/dbconnection.js';
import { defineDailyMedicalModel } from '../models/dailymedical.js';

export const dailymedicalentry = async (req,res) =>{
    const origin = req.headers["x-origin"];
    console.log("Received origin in controller:", origin);

    if (!origin) {
      return res.status(400).json({ message: "Missing origin in headers" });
    }
    const db = getDbByOrigin(origin);
    const DailyMedical = defineDailyMedicalModel(db);
    const { date , Name, Department, age, category, Designation, purpose, Treatment } = req.body

    if(!date || !Name || !Department || !age || !category || !Designation ||!purpose || !Treatment )
        return res.status(400).json({message:"All fields are required",success:false})

    try {
        await DailyMedical.create({
            date,
            Name,
            Department,
            age,
            category,
            Designation,
            purpose,
            Treatment
        });
        return res.status(201).json({message:"Dailymedical entry created",success:true})
    } catch (error) {
        console.log(error)
    }
}

export const getdailymedicalentry = async (req,res)=>{
    const origin = req.user.origin;
    const db = getDbByOrigin(origin);
    const DailyMedical = defineDailyMedicalModel(db);
    try {
        const entries = await DailyMedical.findAll({ order: [['date', 'DESC']] });
        return res.status(200).json({entries, success: true})
    } catch (error) {
        console.log(error)
        return res.status(500).json({message:"Internal server error",success:false})
    }
}

export const updatedailymedicalentry = async(req,res)=>{
    const origin = req.headers["x-origin"];
    const db = getDbByOrigin(origin);
    const DailyMedical = defineDailyMedicalModel(db);
    const {id} = req.params
    const { date , Name, Department, age, category, Designation, purpose, Treatment } = req.body

    if(!date || !Name || !Department || !age || !category || !Designation ||!purpose || !Treatment )
        return res.status(400).json({message:"All fields are required",success:false})

    try {
        const [updated] = await DailyMedical.update(
            { date, Name, Department, age, category, Designation, purpose, Treatment },
            { where: { id } }
         ); 
        if(!updated){
            return res.status(404).json({ message: 'Entry not found', success: false });
        }
        const updatedEntry = await DailyMedical.findByPk(id);
        return res.status(200).json({ message: 'OCL Medical entry updated successfully', entry: updatedEntry, success: true });

    } catch (error) {
       console.error('Error updating daily Medical entry:', error);
        res.status(500).json({ message: 'Internal server error' }); 
    }

}

export const deletedailyMedicalEntry = async (req,res)=>{
    const origin = req.headers["x-origin"];
    const db = getDbByOrigin(origin);
    const DailyMedical = defineDailyMedicalModel(db);
    const { id } = req.params
    if (!id){
        return res.status(400).json({ message: 'Entry ID is required' });
    }
    try {
        const deleteentry = await DailyMedical.destroy({ where: { id } });
        if(!deleteentry){
            return res.status(404).json({ message: 'Entry not found', success: false });
        }
        return res.status(200).json({ message: 'Daily Medical entry deleted successfully', success: true });

    } catch (error) {
        console.error('Error deleting Daily Medical entry:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const uploadexceldata = async (req,res) =>{
    const origin = req.headers["x-origin"];
    const db = getDbByOrigin(origin);
    const DailyMedical = defineDailyMedicalModel(db);
    try {
        if(!req.file){
            return res.status(400).json({ message: 'No file uploaded', success: false });
        }
        const workbook = xlsx.read(req.file.buffer, {type:'buffer'});
        const sheetName = workbook.SheetNames[0]
        const jsondata = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
        if (jsondata.length === 0) {
            return res.status(400).json({ message: 'No data found in the file', success: false });
        }
        const formattedData = jsondata.map(row => ({
            ...row,
            date: row.date ? new Date(row.date.split('/').reverse().join('-')) : null, // "DD/MM/YYYY" to Date
            age: row.age ? Number(row.age) : null,
        }));
        console.log('Raw Excel data:', jsondata);
        console.log('Formatted data:', formattedData);
        const inserted = await DailyMedical.bulkCreate(formattedData);
        return res.status(201).json({ message: 'Data uploaded successfully', data: inserted, success: true });

    } catch (error) {
         console.error('Error uploading data:', error);
         res.status(500).json({ message: 'Internal server error', success: false });
    }
}