import 'package:flutter/material.dart';
import 'package:healthcare_app/screens/register/components/body.dart';
import 'package:healthcare_app/size_config.dart';

class RegisterScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    SizeConfig().init(context);
    return Scaffold(
      body: Body(),
    );
  }
}
