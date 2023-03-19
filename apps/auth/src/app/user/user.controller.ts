import { Controller, Delete, Get, InternalServerErrorException, Logger, Param, UseGuards } from '@nestjs/common';
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

  @Roles('admin')
  @Get('users')
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

  @Roles('admin')
  @Delete('user/:id')
  async deleteUser(@Param('id') id: number) {
    console.log(id);
    try {
      const result = await this.userService.deleteUser(id);
      if (result instanceof Error) {
        return { status: HttpJsonStatus.Error, items: [result.message] };
      }

      return { status: HttpJsonStatus.Ok, items: [] };
    } catch (e) {
      this.logger.error(e);

      throw new InternalServerErrorException(this.internalErrorMessage);
    }
  }
}
