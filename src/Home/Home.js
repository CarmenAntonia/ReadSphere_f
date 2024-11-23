import { useEffect } from "react";

export default function Home () {
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

   useEffect (() => {
      fetch( `${backendUrl}/token`, {
          method: 'GET',
          credentials: 'include',
      })
      .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.text(); 
    })
    .then(token => {
        if(token !== '') {
          sessionStorage.clear();
          sessionStorage.setItem('token', token); 
        }
    })
      .catch(error => {
          console.error('Error:', error);
      });
},[backendUrl]);

  return (
    <div>
      <h1>Home</h1>
    </div>
  );
}
