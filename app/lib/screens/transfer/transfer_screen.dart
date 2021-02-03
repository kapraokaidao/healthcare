import 'package:flutter/material.dart';
import 'package:healthcare_app/components/my_bottom_nav_bar.dart';
import 'package:healthcare_app/constants.dart';
import 'package:healthcare_app/screens/transfer/components/body.dart';
import 'package:healthcare_app/size_config.dart';

class TransferScreen extends StatelessWidget {
  final dynamic redeemRequest;

  static Route route(redeemRequest) {
    return MaterialPageRoute(builder: (_) => TransferScreen(redeemRequest));
  }

  TransferScreen(this.redeemRequest);

  @override
  Widget build(BuildContext context) {
    SizeConfig().init(context);
    return Scaffold(
      appBar: buildAppBar(),
      body: Body(redeemRequest: this.redeemRequest),
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
