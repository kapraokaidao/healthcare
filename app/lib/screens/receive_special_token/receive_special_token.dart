import 'package:flutter/material.dart';
import 'package:healthcare_app/components/my_bottom_nav_bar.dart';
import 'package:healthcare_app/constants.dart';
import 'package:healthcare_app/screens/receive_special_token/components/body.dart';
import 'package:healthcare_app/size_config.dart';

class ReceiveSpecialToken extends StatelessWidget {
  final dynamic specialTokenRequest;
  final Function setPolling;

  static Route route(specialTokenRequest, setPolling) {
    return MaterialPageRoute(
        builder: (_) => ReceiveSpecialToken(specialTokenRequest, setPolling));
  }

  ReceiveSpecialToken(this.specialTokenRequest, this.setPolling);

  @override
  Widget build(BuildContext context) {
    SizeConfig().init(context);
    return Scaffold(
      appBar: buildAppBar(),
      body: Body(
          specialTokenRequest: this.specialTokenRequest,
          setPolling: this.setPolling),
      bottomNavigationBar: MyBottomNavBar(),
    );
  }

  AppBar buildAppBar() {
    return AppBar(
      backgroundColor: kPrimaryColor,
      leading: SizedBox(),
      // On Android it's false by default
      centerTitle: true,
      title: Text("ใช้สิทธิ"),
    );
  }
}
