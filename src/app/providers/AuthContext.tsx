import {
  createContext,
  useContext,
  useEffect,
  useState
} from "react";
import { getUserDataById } from "../../infraestructure/api/authService";


interface AuthData {
  token: string;
  id: number;
}

interface UserData {
  id: number;
  username: string;
  name: string;
  lName: string;
  role: string;
}

interface AuthContextType {
  auth: AuthData | null;
  user: UserData | null;
  login: (auth: AuthData) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: any) => {

  const [auth, setAuth] = useState<AuthData | null>(null);
  const [user, setUser] = useState<UserData | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("auth");

    if (stored) {
      const parsed = JSON.parse(stored);
      setAuth(parsed);
      fetchUser(parsed.id);
    }
  }, []);

  const fetchUser = async (id: number) => {
    try {
      const response = await getUserDataById(id);
      setUser(response.data[0]);
    } catch {
      logout();
    }
  };

  const login = async (data: AuthData) => {

    localStorage.setItem("auth", JSON.stringify(data));
    setAuth(data);

    await fetchUser(data.id);
  };

  const logout = () => {
    console.log("el pepe")
    localStorage.removeItem("auth");
    setAuth(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ auth, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext)!;