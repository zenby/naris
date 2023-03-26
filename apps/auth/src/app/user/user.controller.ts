import {
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  Logger,
  Param,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import {
  ApiFoundResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { HttpJsonResult, HttpJsonStatus } from '@soer/sr-common-interfaces';
import { responseErrorSchema } from '../auth/doc/response-error.schema';
import { responseSchema } from '../auth/doc/response.schema';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles-guard';
import { BackendValidationPipe } from '../common/pipes/backend-validation.pipe';
import { UserEntity, UserRole } from './user.entity';
import { UserService } from './user.service';

@UseGuards(RolesGuard)
@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  private logger = new Logger(UserController.name);
  private internalErrorMessage = 'Something went wrong. Try it later';

  @Roles(UserRole.ADMIN)
  @UsePipes(BackendValidationPipe)
  @ApiOperation({
    summary: 'get users from db',
    description: 'Requesting user should be an Admin. Returns list os users from database',
  })
  @ApiFoundResponse({ schema: responseSchema })
  @ApiNotFoundResponse({ schema: responseSchema })
  @ApiUnauthorizedResponse({ description: 'Should be an admin.' })
  @Get('users')
  async getUsers(): Promise<HttpJsonResult<UserEntity | string>> {
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

  @Roles(UserRole.ADMIN)
  @UsePipes(BackendValidationPipe)
  @ApiOperation({
    summary: 'delete user from db',
    description: "Requires the user's id whitch will be deleted. Returns status of the operation",
  })
  @ApiOkResponse({ schema: responseSchema })
  @ApiNotFoundResponse({ schema: responseErrorSchema('User with id ${id} not found') })
  @ApiUnauthorizedResponse({ description: 'Should be an admin.' })
  @Delete('user/:id')
  async deleteUser(@Param('id') id: number): Promise<HttpJsonResult<string>> {
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
