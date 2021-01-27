import 'package:flutter/material.dart';
import 'package:healthcare_app/app.dart';
import 'package:healthcare_app/repositories/index.dart';

void main() {
  runApp(MyApp(
    authenticationRepository: AuthenticationRepository(),
    userRepository: UserRepository(),
  ));
}
