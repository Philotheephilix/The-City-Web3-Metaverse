import React, { useEffect, useState } from 'react';
import { LogInWithAnonAadhaar, useAnonAadhaar } from '@anon-aadhaar/react';
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();
  const fieldsToReveal = getFieldsToReveal();

  useEffect(() => {
    if (anonAadhaar.status === "logged-in") {
      console.log(anonAadhaar)
      navigate('/'); 
    } else {
      setLoading(false);
    }
  }, [anonAadhaar.status, navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className='login flex'>
      <div style={{backgroundColor:"#D7C5A8",height:"100vh",width:"50vw",display:"flex",justifyContent:"center",alignItems:"center",flexDirection:"column"}}>
        {/* <img src={logo} alt="" style={{
          height:"50vh",width:"25vw"
        }}/> */} 
        <div style={{display:"flex",justifyContent:"center",alignItems:"center",flexDirection:"column"}}>
          <div style={{color:"#73114B",fontSize:"18px",fontWeight:"500"}}>Log in to start mastering new skills and earn rewards</div>
            <div style={{color:"#73114B",fontSize:"15px",fontWeight:"100"}}>Join the Community now </div>
          </div>
        </div>
      <div className='login--component gap-6  ' style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", width: "50vw" }}>
        <input type="text" name='login--username' placeholder='Enter Username ' className='h-[6vh] border  p-2 shadow-lg rounded-lg'/>
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
