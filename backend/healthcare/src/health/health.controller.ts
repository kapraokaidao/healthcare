import { Body, Controller, Get, Put } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { UserRole } from "src/constant/enum/user.enum";
import { Roles } from "src/decorators/roles.decorator";
import { UserId } from "src/decorators/user-id.decorator";
import { HealthDto, UpdateHealthDto } from "./health.dto";
import { HealthService } from "./health.service";

@ApiBearerAuth()
@Controller("health")
@ApiTags("Health")
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get("/")
  @Roles(UserRole.Patient)
  async get(@UserId() userId: number): Promise<HealthDto> {
    return this.healthService.view(userId);
  }

  @Put("/")
  @Roles(UserRole.Patient)
  async update(
    @UserId() userId: number,
    @Body() updateHealthDto: UpdateHealthDto
  ): Promise<HealthDto> {
    return this.healthService.update(userId, updateHealthDto);
  }
}
