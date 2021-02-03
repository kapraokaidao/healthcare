import 'package:flutter/material.dart';
import 'package:healthcare_app/components/my_bottom_nav_bar.dart';
import 'package:healthcare_app/constants.dart';
import 'package:healthcare_app/screens/history/components/body.dart';
import 'package:healthcare_app/size_config.dart';

class HistoryScreen extends StatelessWidget {
  static Route route() {
    return MaterialPageRoute(builder: (_) => HistoryScreen());
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
      toolbarHeight: 150,
      backgroundColor: Color.fromARGB(255, 193, 102, 102),
      leading: SizedBox(),
      // On Android it's false by default
      centerTitle: true,
      title: Text("History"),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(
          bottom: Radius.circular(150),
        ),
      ),
    );
  }
}
