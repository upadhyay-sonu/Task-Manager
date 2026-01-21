import { JwtPayload, RegisterRequest, LoginRequest } from "../types";
export declare class AuthService {
    register(data: RegisterRequest): Promise<{
        userId: string;
        email: string;
        name: string;
        accessToken: string;
    }>;
    login(data: LoginRequest): Promise<{
        userId: string;
        email: string;
        name: string;
        accessToken: string;
    }>;
    createRefreshToken(userId: string): Promise<string>;
    refreshAccessToken(refreshToken: string): Promise<string>;
    logout(refreshToken: string): Promise<void>;
    private generateAccessToken;
    verifyAccessToken(token: string): Promise<JwtPayload>;
}
export declare const authService: AuthService;
//# sourceMappingURL=auth.service.d.ts.map