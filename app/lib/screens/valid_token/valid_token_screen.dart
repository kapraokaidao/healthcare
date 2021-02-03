import 'package:flutter/material.dart';
import 'package:healthcare_app/components/my_bottom_nav_bar.dart';
import 'package:healthcare_app/constants.dart';
import 'package:healthcare_app/screens/valid_token/components/body.dart';
import 'package:healthcare_app/size_config.dart';

class ValidTokenScreen extends StatelessWidget {
  static Route route() {
    return MaterialPageRoute(builder: (_) => ValidTokenScreen());
  }

  @override
  Widget build(BuildContext context) {
    SizeConfig().init(context);
    return Scaffold(
      appBar: buildAppBar(),
      body: Body(),
      bottomNavigationBar: MyBottomNavBar(),
    );
  }

  AppBar buildAppBar() {
    return AppBar(
      backgroundColor: kPrimaryColor,
      leading: SizedBox(),
      // On Android it's false by default
      centerTitle: true,
      title: Text("รับสิทธิการรักษาสุขภาพ"),
    );
  }
}
