export const register = async (username,password,role,email) => {
    try{
        const response = await fetch('https://localhost:3001/auth/register', {
            method:'POST',
            headers:{
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({username,password,role,email}),

        });
        if(response.ok){
            return await response.text();
        }
        else{
            const err=await response.json();
            throw new Error(err.message || 'Failed to register');
        }
    }catch(error){
        console.error("Registration err: ",error);
        throw error;
    }
};

export const login = async (username,password) => {
    try{
        const response = await fetch('https://localhost:3001/auth/login', {
            method:'POST',
            headers:{
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({username,password}),

        });

        if(response.ok){
            const data = await response.json();
            localStorage.setItem('token',data.token);
            return { token: data.token, role: data.role };
        }else{
            const err=await response.text();
            throw new Error(err.message || 'Failed to login');

        }
    }catch(error){
        console.error('Login Error',error);
        throw error;
    }
};

export const logout = () => {
    localStorage.removeItem('token');
};

export const getAuthToken = () => localStorage.getItem('token');

export const forgotPassword = async (email) => {
    try {
      const response = await fetch('https://localhost:3001/reset/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
  
      if (response.ok) {
        return await response.json(); // sau orice altceva care este potrivit
      } else {
        const err = await response.json();
        throw new Error(err.message || 'Failed to send password reset email');
      }
    } catch (error) {
      console.error("Forgot Password Error:", error);
      throw error;
    }
  };
  