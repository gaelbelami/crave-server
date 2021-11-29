import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Admin } from "./entities/admin.entity";



@Injectable()
export class AdminService {
    constructor(@InjectRepository(Admin) private readonly adminRespository: Repository<Admin>){}
}