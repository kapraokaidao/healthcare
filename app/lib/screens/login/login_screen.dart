import 'package:flutter/material.dart';
import 'package:healthcare_app/screens/login/components/body.dart';
import 'package:healthcare_app/size_config.dart';

class LoginScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    SizeConfig().init(context);
    return Scaffold(
      body: Body(),
    );
  }
}
