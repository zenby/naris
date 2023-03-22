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
import { UserEntity } from './user.entity';
import { UserService } from './user.service';

@UseGuards(RolesGuard)
@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  private logger = new Logger(UserController.name);
  private internalErrorMessage = 'Something went wrong. Try it later';

  @Roles('admin')
  @UsePipes(BackendValidationPipe)
  @ApiOperation({
    summary: 'Login',
    description: "Requires body { login, password }. Returns HTTP_ONLY cookie['refresh_token']",
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

  @Roles('admin')
  @UsePipes(BackendValidationPipe)
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
