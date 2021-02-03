import 'package:flutter/material.dart';
import 'package:healthcare_app/components/my_bottom_nav_bar.dart';
import 'package:healthcare_app/constants.dart';
import 'package:healthcare_app/screens/redeem/components/body.dart';
import 'package:healthcare_app/size_config.dart';

class RedeemScreen extends StatelessWidget {
  final dynamic serviceId;
  RedeemScreen(this.serviceId);

  static Route route(serviceId) {
    return MaterialPageRoute(builder: (_) => RedeemScreen(serviceId));
  }

  @override
  Widget build(BuildContext context) {
    SizeConfig().init(context);
    return Scaffold(
      appBar: buildAppBar(),
      body: Body(serviceId),
      bottomNavigationBar: MyBottomNavBar(),
    );
  }

  AppBar buildAppBar() {
    return AppBar(
      backgroundColor: kPrimaryColor,
      leading: SizedBox(),
      // On Android it's false by default
      centerTitle: true,
      title: Text("สิทธิการรักษาของฉัน"),
    );
  }
}
