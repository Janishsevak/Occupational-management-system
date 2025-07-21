import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';

function OCL() {
  const origin = localStorage.getItem('origin')
const [formData, setFormData] = useState({
    date: '',
    workmenName: '',
    contractorName: '',
    age: '',
    bpLevel: '',
    height: '',
    weight: '',
    hygiene: '',
    remark: '',
    
  });
  const fetchdata = ()=>{
    const token = localStorage.getItem('token');
        const origin = localStorage.getItem('origin');
         axios.get('http://localhost:8000/api/v1/oclmedical/getoclmedicalentries',{
            headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`,
                    "x-origin": origin
                }
        })
          .then(res => {
            const sortedData = res.data.entries.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 10);
            setdata1(sortedData);})
          .catch(error => console.error('Error fetching data:', error));        
         
  }
  useEffect(() => {
      fetchdata();
      },[])
  
  const navigate = useNavigate();
  const [data1,setdata1] = useState([])
  const [activeIndex, setActiveIndex] = useState(null);
 
  
  const submitHandler = async (e) => {
    e.preventDefault();
     let dateValue = formData.date;
     if (/^\d{2}-\d{2}-\d{4}$/.test(dateValue)) {
    // If format is DD-MM-YYYY, convert to YYYY-MM-DD
      const [day, month, year] = dateValue.split('-');
      dateValue = `${year}-${month}-${day}`;}
    const data = {
       date: dateValue,
       workmenName: formData.workmenName,
       contractorName: formData.contractorName,
       age: formData.age ? Number(formData.age) : null,
       bpLevel: formData.bpLevel,
       height: formData.height ? Number(formData.height) : null,
       weight: formData.weight ? Number(formData.weight) : null,
       hygiene: formData.hygiene,
       remark: formData.remark,
       
    };
    if (
    !data.date ||
    !data.workmenName ||
    !data.contractorName ||
    !data.age ||
    !data.bpLevel ||
    !data.height ||
    !data.weight 

  ) {
    toast.error('All fields are required');
    return;
  }
    setdata1([...data1, data]);
    console.log(data1);
    try {
      const response = await axios.post('http://localhost:8000/api/v1/oclmedical/oclmedicalentry',data, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.status === 201) {
        console.log('Form submitted successfully');
        toast.success('Form submitted successfully');
        setdata1([...data1, data]);
        setFormData({
          date: '',
          workmenName: '',
          contractorName: '',
          age: '',
          bpLevel: '',
          height: '',
          weight: '',
          hygiene: '',
          remark: '',
          
        });
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
    
  }
  const resetHandler = () => {
    setFormData({
      date: '',
      workmenName: '',
      contractorName: '',
      age: '',
      bpLevel: '',
      height: '',
      weight: '',
      hygiene: '',
      remark: '',
    });
    setActiveIndex(null);
  }

  const deleteHandler = () => {
    if (activeIndex !== null) {
      const confirmDelete = window.confirm("Are you sure to delete this entry?");
      if (!confirmDelete) {
        return;
      }
      const idToDelete = data1[activeIndex]?.id || data1[activeIndex]?._id;
      if (!idToDelete) {
        alert("Could not find record id.");
        return;
    }
    axios
      .delete(
        `http://localhost:8000/api/v1/oclmedical/deleteoclmedicalentry/${idToDelete}`,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "x-origin": origin,
          },
        }
      )
      .then(() => {
        toast.success("Data deleted successfully");
        setActiveIndex(null);
        resetHandler();
        fetchdata(); // Always fetch fresh data after delete
      })
      .catch((error) => {
        console.error("Error deleting data:", error);
        toast.error("Error deleting data");
      });
  } else {
    alert("Please select an entry to delete.");
  }
  }
  
  const updateHandler = () => {
    if (activeIndex !== null) {
      const confirmUpdate = window.confirm("Are you sure to update this entry?");
      if (!confirmUpdate) {
        return;
      }
      const updatedData = data1.map((item, index) => 
        index === activeIndex ? formData : item
      );
      setdata1(updatedData);
      resetHandler();
    } else {
      alert("Please select an entry to update.");
    }
  }

  return (
    <div className='h-full w-full'>
      <div className='flex w-full'>
        <button type='button'
        onClick={()=>{
          navigate('/main')
        }} className='bg-gray-300 text-black px-6 mt-1 border-b-3 rounded-lg hover:bg-gray-400 hover:cursor-pointer'>Back</button>
        <h1 className='font-bold text-3xl text-center border-b-3 p-2 w-[90%]'>Contractor Workman Medical</h1>
        <button type='button' 
        onClick={()=>{
          navigate('/OclReport')  
        }}className='bg-green-300 text-black px-8 mt-1 border-b-3 rounded-lg hover:bg-gray-400 hover:cursor-pointer'>Report</button>
      </div>
      <div className='flex h-full'>
         <div className='relative border border-gray-300 rounded-lg w-[40%] h-[100%] mt-1 ml-2 bg-white shadow overflow-y-scroll p-4'>   
          <form onSubmit={(e) => {
            submitHandler(e);
          }}>
            <div>
              <h2 className='text-md font-semibold text-center p-1'>Contractor Workman Medical Form</h2>
            </div>
            <div className='flex gap-2 p-2 items-center'>
              <label className='text-lg font-semibold w-40'>Date</label>
              <input required type="date" 
              value={formData.date} onChange={(e)=>{
                setFormData({ ...formData, date: e.target.value });
              }} className='border border-gray-300 rounded-lg w-50 p-2 mt-1' />
            </div>
            <div className='flex gap-2 p-2 items-center'>
              <label className='text-lg font-semibold w-40'>Workmen Name</label>
              <input required type="text"
              value={formData.workmenName} onChange={(e)=>{
                setFormData({ ...formData, workmenName : e.target.value });}}
                 className='border border-gray-300 rounded-lg w-50 p-2 mt-1' placeholder='Enter Workmen Name' />
            </div>
            <div className='flex gap-2 p-2 items-center'>
              <label className='text-lg font-semibold w-40'>Contractor Name</label>
              <input required type="text" 
              value={formData.contractorName} onChange={(e)=>{
                setFormData({ ...formData, contractorName : e.target.value });}}
                className='border border-gray-300 rounded-lg w-50 p-2 mt-1' placeholder='Enter Contractor Name' />
            </div>
            <div className='flex gap-2 p-2 items-center'>
              <label className='text-lg font-semibold w-40'>Age</label>
              <input required type="number" 
              value={formData.age} onChange={(e)=>{
                setFormData({ ...formData, age : e.target.value });}}
                className='border border-gray-300 rounded-lg w-50 p-2 mt-1' placeholder='Enter Age' />
            </div>
            <div className='flex gap-2 p-2 items-center'>
              <label className='text-lg font-semibold w-40'>B.P Level(mmHg)</label>
              <input required type="text" 
              value={formData.bpLevel} onChange={(e)=>{
                setFormData({ ...formData, bpLevel : e.target.value });}}
                className='border border-gray-300 rounded-lg w-50 p-2 mt-1' placeholder='Enter B.P level' />
            </div>
            <div className='flex gap-2 p-2 items-center'>
              <label className='text-lg font-semibold w-40'>Height(cm)</label>
              <input required type="number" 
              value={formData.height} onChange={(e)=>{
                setFormData({ ...formData, height : e.target.value });}}
                className='border border-gray-300 rounded-lg w-50 p-2 mt-1' placeholder='Enter Height' />
            </div>
            <div className='flex gap-2 p-2 items-center'>
              <label className='text-lg font-semibold w-40'>Weight(kg)</label>
              <input required type="number" 
              value={formData.weight} onChange={(e)=>{
                setFormData({ ...formData, weight : e.target.value });}}
                className='border border-gray-300 rounded-lg w-50 p-2 mt-1' placeholder='Enter Weight' />
            </div>
            <div className='flex gap-2 p-2 items-center'>
              <label className='text-lg font-semibold w-40'>Hygine</label>
              <input type="text" 
              value={formData.hygiene} onChange={(e)=>{
                setFormData({ ...formData, hygiene : e.target.value });}}
                className='border border-gray-300 rounded-lg w-50 p-2 mt-1' placeholder='Enter Hygine details' />
            </div>
            <div className='flex gap-2 p-2 items-center'>
              <label className='text-lg font-semibold w-40'>Remark</label>
              <input type="text" 
              value={formData.remark} onChange={(e)=>{
                setFormData({ ...formData,remark : e.target.value });}}
                className='border border-gray-300 rounded-lg w-50 p-2 mt-1' placeholder='Enter Remark if any' />
            </div>
      
            <div className='flex gap-3 p-2 items-center'>
              <button type='submit'  className='bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 hover:cursor-pointer'>Submit</button>
              <button type='reset' 
              onClick={resetHandler}className='bg-blue-300 text-black px-4 py-2 rounded-lg hover:bg-gray-400 hover:cursor-pointer'>Reset</button>
              <button type='button'
              onClick={deleteHandler} className='bg-red-300 text-black px-4 py-2 rounded-lg hover:bg-gray-600 hover:cursor-pointer'>Delete</button>
              <button type='submit' 
              onClick={updateHandler}className='bg-green-300 text-black px-4 py-2 rounded-lg hover:bg-gray-400 hover:cursor-pointer'>Update</button> 
            </div>      

              
        </form>
        </div>
        <div className='w-full'>
          
          <table className='w-full border-collapse border border-gray-300'/>
            <thead className='bg-gray-200 sticky top-0'>
              <tr>
                <th className='border border-gray-300 p-2 w-30'>Date</th>
                <th className='border border-gray-300 p-2 w-30'>Workmen Name</th>
                <th className='border border-gray-300 p-2 w-30'>Contractor Name</th>
                <th className='border border-gray-300 p-2 w-30'>Age</th>
                <th className='border border-gray-300 p-2 w-30 '>B.P Level</th>
                <th className='border border-gray-300 p-2 w-30'>Height</th>
                <th className='border border-gray-300 p-2 w-30 '>Weight</th>
                <th className='border border-gray-300 p-2 w-30'>Hygine</th>
                <th className='border border-gray-300 p-2 w-30 '>Remark</th>
                
              </tr>
            </thead>
            <tbody>
              {data1.map((data, index) => (
              <tr key={index} onClick={() => {
                setFormData({
                  date: data.date,
                  workmenName: data.workmenName,
                  contractorName: data.contractorName,
                  age: data.age,
                  bpLevel: data.bpLevel,
                  height: data.height,
                  weight: data.weight,
                  hygiene: data.hygiene,
                  remark: data.remark,
  
                });
                setActiveIndex(index);}}
                className={activeIndex === index ? 'bg-gray-300' : ''}>
                <td className='border border-gray-300 text-center p-2'>{data.date ? new Date(data.date).toLocaleDateString('en-GB') : ''}</td>
                <td className='border border-gray-300 text-center p-2'>{data.workmenName}</td>
                <td className='border border-gray-300 text-center p-2'>{data.contractorName}</td>
                <td className='border border-gray-300 text-center p-2'>{data.age}</td>
                <td className='border border-gray-300 text-center p-2'>{data.bpLevel}</td>
                <td className='border border-gray-300 text-center p-2'>{data.height}</td>
                <td className='border border-gray-300 text-center p-2'>{data.weight}</td>
                <td className='border border-gray-300 text-center p-2'>{data.hygiene}</td>
                <td className='border border-gray-300 text-center p-2'>{data.remark}</td>
              </tr>))}
            </tbody>
        </div>   
      </div>
  
    
   </div>
  )
}

export default OCL
