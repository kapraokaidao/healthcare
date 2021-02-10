import 'package:flutter/material.dart';
import 'package:healthcare_app/components/my_bottom_nav_bar.dart';
import 'package:healthcare_app/constants.dart';
import 'package:healthcare_app/screens/transfer/components/body.dart';
import 'package:healthcare_app/size_config.dart';

class TransferScreen extends StatelessWidget {
  final dynamic redeemRequest;
  final Function setPolling;

  static Route route(redeemRequest, setPolling) {
    return MaterialPageRoute(
        builder: (_) => TransferScreen(redeemRequest, setPolling));
  }

  TransferScreen(this.redeemRequest, this.setPolling);

  @override
  Widget build(BuildContext context) {
    SizeConfig().init(context);
    return Scaffold(
      appBar: buildAppBar(),
      body:
          Body(redeemRequest: this.redeemRequest, setPolling: this.setPolling),
    );
  }

  AppBar buildAppBar() {
    return AppBar(
      backgroundColor: kPrimaryColor,
      leading: BackButton(color: Colors.white),
      // On Android it's false by default
      centerTitle: true,
      title: Text("ใช้สิทธิ"),
    );
  }
}
