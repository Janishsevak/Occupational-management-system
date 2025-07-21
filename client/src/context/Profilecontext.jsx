import { Children, createContext, useState } from 'react';

const Profilecontext = createContext();
export const ProfilecontextProvider = ({children}) =>{
const[userprofile,setuserprofile] = useState("");
const [error, setError] = useState(null);

return(
  <Profilecontext.Provider value={{userprofile,setuserprofile,error,setError}}>
    {children}
  </Profilecontext.Provider>
);
};

export {Profilecontext};