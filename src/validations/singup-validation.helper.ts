
import { HttpException, HttpStatus } from '@nestjs/common';
import * as EmailValidator from 'email-validator';
import * as bcrypt from 'bcrypt';
import ErrorMessage from '../common/error-message';


export function validateEmail(email: string): boolean {
  return EmailValidator.validate(email);
}

export function validatePassword(password: string): boolean {
  const passwordRegex = /^(?=.*\d)(?=.*[A-Z]).{6,}$/;
  return passwordRegex.test(password);
}

export const validateSignInInput = (email: string, password: string): void => {
  if (!email || !password) {
    throw new HttpException(ErrorMessage.FILL_ALL_DATA, HttpStatus.BAD_REQUEST);
  }
}

export const validatePasswordMatch = async (enteredPassword: string, storedPassword: string): Promise<void> => {
  const passwordMatch = await bcrypt.compare(enteredPassword, storedPassword);
  if (!passwordMatch) {
    throw new HttpException('Incorrect password', HttpStatus.BAD_REQUEST);
  }
};