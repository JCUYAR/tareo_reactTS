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
  loading: boolean;
  login: (auth: AuthData) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: any) => {

  const [auth, setAuth] = useState<AuthData | null>(null);
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("auth");

    if (stored) {
      const parsed = JSON.parse(stored);
      setAuth(parsed);
      fetchUser(parsed.id).finally(() => {
        setLoading(false);
      });
    } else {
      setLoading(false);
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
    setLoading(true);

    localStorage.setItem("auth", JSON.stringify(data));
    setAuth(data);

    await fetchUser(data.id);

    setLoading(false);
  };

  const logout = () => {
    localStorage.removeItem("auth");
    setAuth(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ auth, user, loading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext)!;