import { HttpException, HttpStatus } from '@nestjs/common';

export class WrongCurrentPasswordException extends HttpException {
    constructor() {
        super('Current password is wrong', HttpStatus.FORBIDDEN); // 403
    }
}
