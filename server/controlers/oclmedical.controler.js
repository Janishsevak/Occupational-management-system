import xlsx from 'xlsx';
import { defineOclMedicalModel } from '../models/oclmedical.js';
import { getDbByOrigin } from '../models/dbconnection.js';
// import { getOclMedicalModel } from '../models/mysqlModelFactory.js';
// import { getoclmedicalModel } from '../utils/getTenantModel.js';

export const oclmedicalentry = async (req, res) => {
    const origin = req.user.origin || req.headers["x-origin"];
    if (!origin) {
        return res.status(400).json({ message: 'Missing origin in headers' });
    }
    const db = getDbByOrigin(origin);
    const OclMedical = defineOclMedicalModel(db);
    const { date , workmenName, contractorName, age, bpLevel, height, weight, hygiene, remark } = req.body;
    if (!date || !workmenName || !contractorName || !age || !bpLevel || !height || !weight ) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    try {
        await OclMedical.create({
            date,
            workmenName,
            contractorName,
            age,
            bpLevel,
            height,
            weight,
            hygiene: hygiene || null, // Default to null if not provided
            remark: remark || null, // Default to null if not provided
            
        });
        return res.status(201).json({ message: 'OCL Medical entry created successfully', success: true });
    } catch (error) {
        console.error('Error creating OCL Medical entry:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const getOclMedicalEntries = async (req, res) => {
    const origin = req.user.origin || req.headers["x-origin"];
    if (!origin) {
        return res.status(400).json({ message: 'Missing origin in headers' });
    }
    const db = getDbByOrigin(origin);
    const OclMedical = defineOclMedicalModel(db);
    try {
        const entries = await OclMedical.findAll({ order: [['createdAt', 'DESC']]});
        return res.status(200).json({ entries, success: true });
    } catch (error) {
        console.error('Error fetching OCL Medical entries:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
export const deleteOclMedicalEntry = async (req, res) => {                              
    const origin = req.user.origin || req.headers["x-origin"];
    if (!origin) {
        return res.status(400).json({ message: 'Missing origin in headers' });
    }
    const db = getDbByOrigin(origin);
    const OclMedical = defineOclMedicalModel(db);
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ message: 'Entry ID is required' });
    }
    try {
        const entry = await OclMedical.destroy({where: { id }});
        if (!entry) {
            return res.status(404).json({ message: 'Entry not found', success: false });
        }
        return res.status(200).json({ message: 'OCL Medical entry deleted successfully', success: true });
    } catch (error) {
        console.error('Error deleting OCL Medical entry:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const updateOclMedicalEntry = async (req, res) => {
    const origin = req.user.origin || req.headers["x-origin"];
    if (!origin) {
        return res.status(400).json({ message: 'Missing origin in headers' });
    }
    const db = getDbByOrigin(origin);
    const OclMedical = defineOclMedicalModel(db);
    const { id } = req.params;
    const { date, workmenName, contractorName, age, bpLevel, height, weight, hygiene, remark, time } = req.body;

    if (!id || !date || !workmenName || !contractorName || !age || !bpLevel || !height || !weight || !time) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const updatedEntry = await OclMedical.update({
            date,
            workmenName,
            contractorName,
            age,
            bpLevel,
            height,
            weight,
            hygiene: hygiene || null,
            remark: remark || null,
            time
        }, { where: { id }});

        if (!updatedEntry) {
            return res.status(404).json({ message: 'Entry not found', success: false });
        }

        return res.status(200).json({ message: 'OCL Medical entry updated successfully', entry: updatedEntry, success: true });
    } catch (error) {
        console.error('Error updating OCL Medical entry:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const uploadexceldata = async (req, res) => {
    const origin = req.user.origin || req.headers["x-origin"];
    if (!origin) {
        return res.status(400).json({ message: 'Missing origin in headers' });
    }
    const db = getDbByOrigin(origin);
    const OclMedical = defineOclMedicalModel(db);
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded', success: false });
        }
        const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const jsondata = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
        if (jsondata.length === 0) {
            return res.status(400).json({ message: 'No data found in the file', success: false });
        }

        // Convert fields to correct types
        const formattedData = jsondata.map(row => ({
            ...row,
            date: row.date ? new Date(row.date.split('/').reverse().join('-')) : null, // "DD/MM/YYYY" to Date
            age: row.age ? Number(row.age) : null,
            height: row.height ? Number(row.height) : null,
            weight: row.weight ? Number(row.weight) : null,
        }));
        console.log('Raw Excel data:', jsondata);
        console.log('Formatted data:', formattedData);
        const inserted = await OclMedical.bulkCreate(formattedData);
        return res.status(201).json({ message: 'Data uploaded successfully', data: inserted, success: true });

    } catch (error) {
        console.error('Error uploading data:', error);
        res.status(500).json({ message: 'Internal server error', success: false });
    }
};