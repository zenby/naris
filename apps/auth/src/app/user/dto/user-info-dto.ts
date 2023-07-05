import { UserEntity } from '../user.entity';

export type UserInfoDto = Pick<UserEntity, 'firstName' | 'lastName'>;
