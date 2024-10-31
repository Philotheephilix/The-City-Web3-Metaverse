import React, { useEffect, useState } from 'react';
import { LogInWithAnonAadhaar, useAnonAadhaar } from '@anon-aadhaar/react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'
import { API_URL } from '@/constants';

type FieldKey =
  | 'revealAgeAbove18'
  | 'revealGender'
  | 'revealPinCode'
  | 'revealState';

type FieldsType = {
  [key in FieldKey]: boolean;
};

const fields: FieldsType = {
  revealAgeAbove18: true,
  revealGender: true,
  revealPinCode: false,
  revealState: true,
};

const getFieldsToReveal = (): FieldKey[] => {
  const revealedFields: FieldKey[] = [];
  for (const key in fields) {
    if (fields[key as FieldKey]) {
      revealedFields.push(key as FieldKey);
    }
  }
  console.log(revealedFields)
  return revealedFields;
};

const Login: React.FC = () => {
  const [anonAadhaar] = useAnonAadhaar();
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState('');
  const navigate = useNavigate();
  const fieldsToReveal = getFieldsToReveal();

  useEffect(() => {
    if (anonAadhaar.status === "logged-in") {
      localStorage.setItem('username', username);
      console.log(anonAadhaar)
      const newUser={
        username:username,
        anonid:anonAadhaar.anonAadhaarProofs,
        role:'citizen'
      }
      axios.post(`${API_URL}/users`,newUser)
      navigate('/'); 
      
    } else {
      setLoading(false);
    }
  }, [anonAadhaar.status, username, navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className='login flex'>
      <div className='bg-gray-900' style={{height:"100vh",width:"50vw",display:"flex",justifyContent:"center",alignItems:"center",flexDirection:"column"}}>
        <div style={{display:"flex",justifyContent:"center",alignItems:"center",flexDirection:"column"}}>
          <div style={{color:"#fff",fontSize:"21px",fontWeight:"500"}}>Step into the Web3 Metaverse: Where your imagination builds the future!</div>
          <div style={{color:"#fff",fontSize:"19px",fontWeight:"300"}}>With great decentralization comes great innovation</div>
        </div>
      </div>
      <div className='login--component bg-gray-800 gap-6' style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", width: "50vw" }}>
        <input 
          type="text" 
          name='login--username' 
          placeholder='Enter Username ' 
          className='h-[6vh] border p-2 shadow-lg rounded-lg'
          value={username}
          onChange={(e) => setUsername(e.target.value)} 
        />
        <div className='login--anon'>
          <LogInWithAnonAadhaar
            nullifierSeed={123}
            fieldsToReveal={fieldsToReveal}
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
