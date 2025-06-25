import axios from "axios";

class AuthApi {

  async register(user) {
    try {
       const url = `${process.env.REACT_APP_URL}api/auth/register`
       console.log("Register AuthApi URL", url);
      const response = await axios.post(
        `${process.env.REACT_APP_URL}api/auth/register`, 
        user
      );
      console.log("Register AuthApi Response", response);
      return response;
    } catch (error) {
      console.error("Error registering user:", error);
      throw error;
    }
  }

 

 async login(data) {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_URL}api/auth/login`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
  
      console.log("Login AuthApi response", response);
  
      if (response.status === 200) {
        localStorage.setItem("jwt", response.data.jwt);
        localStorage.setItem("userId", response.data.user.id);
        return response.data;
      } else {
        return { error: "Invalid response from server" };
      }
    } catch (error) {
      console.error("Login error:", error);
      return error.response?.data || { error: "Network error or no response" };
    }
  };
  

async githubLogin() {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_URL}api/auth/github`
    );
    return response.data;
  } catch (error) {
    console.error("GitHub login error:", error);
    throw error;
  }
}

// async githubCallback(code, state) {
//   try {
//     const response = await axios.get(
//       `${process.env.REACT_APP_URL}api/auth/exchange/${code}`,
//       {
//         headers: {
//           "Content-Type": "application/json",
//         },
//       }
//     );
//     return response;
//   } catch (error) {
//     console.error("GitHub callback error:", error);
//     throw error;
//   }
// }


    async githubCallback(code, state) {
        try {
           const response =  await axios.get(
                `${process.env.REACT_APP_URL}api/auth/exchange/${code}`,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    // Add state as query parameter if needed
                    params: state ? { state } : {}
                }
            );
            return response;
        } catch (error) {
            console.error("GitHub callback error:", error);
            throw error;
        }
    }
}

export const authApi = new AuthApi();

// import axios from "axios";

// class AuthApi {

//   async register(user) {
//     try {
//       const response = await axios.post(
//         `${process.env.REACT_APP_URL}api/auth/register`,
//         user
//       );
//       console.log("Register AuthApi Response", response);
//       return response;
//     } catch (error) {
//       console.error("Error registering user:", error);
//       throw error;
//     }
//   }

 

//  async login(data) {
//     try {
//       const response = await axios.post(
//         `${process.env.REACT_APP_URL}api/auth/login`,
//         data,
//         {
//           headers: {
//             "Content-Type": "application/json",
//           },
//         }
//       );
  
//       console.log("Login AuthApi response", response);
  
//       if (response.status === 200) {
//         localStorage.setItem("accessToken", response.data.token);
//         localStorage.setItem("userId", response.data.user.id);
//         return response.data;
//       } else {
//         return { error: "Invalid response from server" };
//       }
//     } catch (error) {
//       console.error("Login error:", error);
//       return error.response?.data || { error: "Network error or no response" };
//     }
//   };
  

// async githubLogin() {
//   try {
//     const response = await axios.get(
//       `${process.env.REACT_APP_URL}api/auth/github`
//     );
//     return response.data;
//   } catch (error) {
//     console.error("GitHub login error:", error);
//     throw error;
//   }
// }

// async githubCallback(code, state) {
//   try {
//     const response = await axios.get(
//       `${process.env.REACT_APP_URL}api/auth/exchange/${code}`,
//       {
//         headers: {
//           "Content-Type": "application/json",
//         },
//       }
//     );
//     return response;
//   } catch (error) {
//     console.error("GitHub callback error:", error);
//     throw error;
//   }
// }

// }

// export const authApi = new AuthApi();


