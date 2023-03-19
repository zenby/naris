import { Controller, Get, InternalServerErrorException, Logger, SetMetadata, UseGuards } from '@nestjs/common';
import { HttpJsonStatus } from '@soer/sr-common-interfaces';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles-guard';
import { UserService } from './user.service';

@UseGuards(RolesGuard)
@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  logger = new Logger(UserController.name);
  internalErrorMessage = 'Something went wrong. Try it later';

  @Get('users')
  @Roles('admin')
  async getUsers() {
    try {
      const users = await this.userService.getUsers();
      if (users instanceof Error) {
        return { status: HttpJsonStatus.Error, items: [users.message] };
      }

      return { status: HttpJsonStatus.Ok, items: users };
    } catch (e) {
      this.logger.error(e);

      throw new InternalServerErrorException(this.internalErrorMessage);
    }
  }
}
