import 'package:flutter/material.dart';
import 'package:healthcare_app/screens/start/components/body.dart';
import 'package:healthcare_app/size_config.dart';

class StartScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    SizeConfig().init(context);
    return Scaffold(
      body: Body(),
    );
  }
}
