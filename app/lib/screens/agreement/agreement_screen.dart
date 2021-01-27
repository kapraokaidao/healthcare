import 'package:flutter/material.dart';
import 'package:healthcare_app/screens/agreement/components/body.dart';
import 'package:healthcare_app/size_config.dart';

class AgreementScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    SizeConfig().init(context);
    return Scaffold(
      body: Body(),
    );
  }
}
