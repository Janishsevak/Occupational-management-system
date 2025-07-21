
import { createContext, useContext, useState } from 'react';

const OCLMedicalContext = createContext();
export const OCLMedicalProvider = ({ children }) => {
  const [data1,setdata1] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  return (
    <OCLMedicalContext.Provider value={{ data1,setdata1, loading, setLoading, error, setError }}>
      {children}
    </OCLMedicalContext.Provider>
  );
};
export { OCLMedicalContext };