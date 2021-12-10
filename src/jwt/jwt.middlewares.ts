import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { AdminService } from 'src/admin/admin.service';
import { UserService } from 'src/users/users.service';
import { JwtService } from './jwt.service';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly adminService: AdminService,
  ) {}
  async use(req: Request, res: Response, next: NextFunction) {
    if ('x-jwt' in req.headers) {
      const token = req.headers['x-jwt'];
      try {
        const decoded = this.jwtService.verify(token.toString());
        if (typeof decoded === 'object' && decoded.hasOwnProperty('id')) {
          const user = await this.userService.findUserById(decoded['id']);
          req['user'] = user;
        }
      } catch (error) {}
    }

    if('x-jwt'in req.headers ) {
      const token = req.headers['x-jwt'];
      try {
        const decoded = this.jwtService.verify(token.toString());
        if(typeof decoded === 'object' && decoded.hasOwnProperty('id')){
          const admin = await this.adminService.findById(decoded['id']);
          req['admin'] = admin;
        }
      } catch (error) {
        
      }
    }
    next();
  }
}
