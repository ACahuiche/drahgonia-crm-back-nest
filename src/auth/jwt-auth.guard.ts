import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { Request } from "express";
import * as jwt from 'jsonwebtoken'; 
import { ConfigService } from "@nestjs/config";

@Injectable()
export class JwtAuthGuard implements CanActivate {

    constructor(private configService: ConfigService) {}

    canActivate(context: ExecutionContext): boolean  {
        const request = context.switchToHttp().getRequest<Request>();
        const token = this.extractTokenFromHeader(request);

        if(!token) {
            throw new UnauthorizedException('Token no provided');
        }

        try {
            const decoded = jwt.verify(token, this.configService.get<string>('SECRET_KEY'));
            return true;
        }
        catch(error) {
            throw new UnauthorizedException('Token no valid');
        }

    }

    private extractTokenFromHeader(request: Request): string | null {
        const authHeader = request.headers.authorization;
        if(authHeader && authHeader.startsWith('Bearer ')) {
            return authHeader.split(' ')[1];
        }

        return null;
    }
}