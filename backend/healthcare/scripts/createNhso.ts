import { NestFactory } from "@nestjs/core";
import * as readline from "readline";
import * as chalk from "chalk";

import { AppModule } from "../src/app.module";
import { UserService } from "../src/user/user.service";
import { Connection } from "typeorm";
import { getConnectionToken } from "@nestjs/typeorm";
import { User } from "../src/entities/user.entity";
import { UserRole } from "../src/constant/enum/user.enum";

const getUserDto = async () => {
  const rl = readline.createInterface({ input: process.stdin });
  process.stdout.write("First Name: ");
  const firstname = (await rl[Symbol.asyncIterator]().next()).value;
  process.stdout.write("Last Name: ");
  const lastname = (await rl[Symbol.asyncIterator]().next()).value;
  process.stdout.write("Username: ");
  const username = (await rl[Symbol.asyncIterator]().next()).value;
  process.stdout.write("Password: ");
  const password = (await rl[Symbol.asyncIterator]().next()).value;
  rl.close();
  return { firstname, lastname, username, password };
};

const run = async () => {
  console.log(chalk.greenBright("Initializing modules... (please wait)"));
  const app = await NestFactory.createApplicationContext(AppModule, { logger: false });
  const userService = app.get(UserService);
  const db = app.get<Connection>(getConnectionToken());
  const userRepository = db.getRepository<User>(User);
  const userDto = await getUserDto();
  const existedUser = await userService.findByUsername(userDto.username);
  if (existedUser) {
    throw new Error("Username already existed");
  }
  console.log(chalk.greenBright("Create account..."));
  const user = userRepository.create({ ...userDto, role: UserRole.NHSO });
  await userService.create(user);
  console.log(chalk.greenBright("NHSO account created"));
};

run()
  .then(() => {
    process.exit(0);
  })
  .catch((e) => {
    console.log(chalk.red(e));
    process.exit(1);
  });
