import { Controller, Get, Post } from "@nestjs/common";

@Controller("/user")
export class UserController {

    @Post()
    async createUser () {
        return "sucess"
    }

    @Get()
    async getUser () {
        return {status: "sucess", message: "ae   caraio part 2"}
    }
}