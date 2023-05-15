import { Module } from '@nestjs/common';
import { UserTestRepository } from './user.test.repository';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserEntity } from '../user.entity';
import { UserService } from '../user.service';

export { UserTestRepository } from './user.test.repository';
export * from './test.users';

@Module({
  imports: [],
  providers: [
    UserService,
    UserTestRepository,
    { provide: getRepositoryToken(UserEntity), useClass: UserTestRepository },
  ],
  exports: [UserTestRepository, UserService],
})
export class UserTestModule {
  constructor(private readonly userrepo: UserTestRepository) {}
}
