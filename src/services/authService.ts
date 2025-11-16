import api from "./api";

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

const TOKEN_KEY = "token";
const USER_KEY = "user";

/**
 * Lưu thông tin authentication vào localStorage
 */
const saveAuthData = (token: string, user: User): void => {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

/**
 * Xóa thông tin authentication khỏi localStorage
 */
const clearAuthData = (): void => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

export const authService = {
  /**
   * Lấy token từ localStorage
   */
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },

  /**
   * Lấy user từ localStorage
   */
  getUser(): User | null {
    const userStr = localStorage.getItem(USER_KEY);
    if (!userStr) return null;
    try {
      return JSON.parse(userStr) as User;
    } catch {
      return null;
    }
  },

  /**
   * Kiểm tra user đã đăng nhập chưa
   */
  isAuthenticated(): boolean {
    return !!this.getToken() && !!this.getUser();
  },

  /**
   * Đăng nhập - gọi API và lưu vào localStorage
   */
  async login(email: string, password: string): Promise<User> {
    const response = await api.post<AuthResponse>("/accounts/login", {
      email,
      password,
    });
    saveAuthData(response.data.token, response.data.user);
    return response.data.user;
  },

  /**
   * Đăng ký - chỉ tạo tài khoản, không tự động đăng nhập
   */
  async register(email: string, password: string, name: string): Promise<void> {
    await api.post("/accounts/register", {
      email,
      password,
      name,
    });
  },

  /**
   * Đăng ký và tự động đăng nhập
   */
  async registerAndLogin(
    email: string,
    password: string,
    name: string
  ): Promise<User> {
    await this.register(email, password, name);
    return await this.login(email, password);
  },

  /**
   * Đăng xuất - gọi API và xóa localStorage
   */
  async logout(): Promise<void> {
    try {
      await api.post("/accounts/logout");
    } catch (error) {
      console.error("Logout API error:", error);
    } finally {
      clearAuthData();
    }
  },

  /**
   * Lấy thông tin user hiện tại từ server
   */
  async getCurrentUser(): Promise<User> {
    const response = await api.get<User>("/accounts/me");
    return response.data;
  },
};
