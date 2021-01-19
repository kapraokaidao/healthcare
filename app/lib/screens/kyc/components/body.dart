import 'package:flutter/material.dart';

class Body extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Container(
        padding: EdgeInsets.all(40),
        child: Center(
            child: Container(
          child: Text('Please wait 2-3 days for confirm account.'),
        )));
  }
}
