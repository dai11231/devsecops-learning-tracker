import { AuthService } from './auth.service';
import type { Response } from 'express';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    login(req: any, res: Response): unknown;
    logout(res: Response): unknown;
    getProfile(req: any): any;
}
