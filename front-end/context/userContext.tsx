import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useRouter } from "next/router";
import apiRequest from "../components/ApiRequest";

type UserContextType = {
  isLoggedIn: boolean;
  login: (userInfo:UserLogin) => void;
  logout: () => void;
  listUser: User[];
  errorMessage: string | null;
  createUser: (user:UserForPost) => void;
  userLogged: User;
  moneyAmount:{ moneyType: string; money: number }[];
  reloadUser: () => void;

};
type User = {
  id: number;
  username: string;
  password:string;
  email?: string;
  age?: number;
};


type UserForPost = {
  username: string;
  password:string;
  email?: string;
  age?: number;
}

type UserLogin = {
  username: string,
  password: string
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const userUrl = "http://localhost:8080/users"

export function UserProvider({ children }: { children: ReactNode }) {
  const [userLogged,setUserLogged] = useState(null);
  const [moneyAmount,setMoneyAmount] = useState(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [listUser,setListUser] = useState([])
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [reload,setReload] = useState(false)


  const reloadUser = () => {
    setReload(!reload)
  }

  const router = useRouter();

  //login

  const login =  async (loginInfo:UserLogin) => {
    const url = `${userUrl}/getByName/${loginInfo.username}`
    const getOptions = { method: "GET" };
    
    try {
      const result: User = await apiRequest(url, getOptions);
      if(loginInfo.password === result.password){
        setUserLogged(result)
        router.push("/welcome");
      }else{
        setErrorMessage("wrong password")
      }
    } catch (error:any) {
      setErrorMessage("User not found")
      
    }

    setIsLoggedIn(true)
  };

  const logout = () => {
    setIsLoggedIn(false);
    router.push("/");
  };



  //Get User amount 
  useEffect(() => {
    const getMoney = async () => {
      if (userLogged) {
        const url = `${userUrl}/getTotalMoney/${userLogged.id}`;
        const getOptions = { method: "GET" };

        try {
          const result = await apiRequest(url, getOptions);

          
          const grouped: { moneyType: string; money: number }[] = Object.entries(result.totals).map(
            ([moneyType, money]) => ({
              moneyType,
              money: money as number
            })
          );

          setMoneyAmount(grouped);  
          setErrorMessage(null);

        } catch (err: any) {
          setErrorMessage(err.message);
        }
      }
    };
    getMoney();
  }, [reload, userLogged]);


  //Get all Users
  useEffect(() => {
  const getUsers = async () => {
    const url = `${userUrl}/getAll`; 
    const getOptions = { method: "GET" };

    try {
      const result: User[] = await apiRequest(url, getOptions);
      setListUser(result);
      setErrorMessage(null); 
    } catch (err: any) {
      setErrorMessage(err.message); 
    }
  };

  getUsers(); 
  }, [reload]);



  ///Create user

  const createUser = async (user:UserForPost) => {
    const url = "http://localhost:8080/users/post"; 
    const postOptions = { 
      method: "POST" ,
      headers: {
        'Content-Type':'application/json'
      },
      body: JSON.stringify(user)};

    try {
      const result: User = await apiRequest(url,postOptions)
      setErrorMessage(null);
      setReload(!reload)
    } catch (error: any) {
      setErrorMessage(error.message);
    }
  }


 


  return (
    <UserContext.Provider value={{ isLoggedIn, login, logout ,listUser,errorMessage,createUser,userLogged,moneyAmount,reloadUser}}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
