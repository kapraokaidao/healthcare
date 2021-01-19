import 'package:flutter/material.dart';
import 'package:healthcare_app/size_config.dart';

import 'info.dart';

class Body extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      child: Column(
        children: <Widget>[
          Info(
            image: "assets/images/pic.png",
          ),
          Container(
            child: Text('Firstname'),
          )
        ],
      ),
    );
  }
}
